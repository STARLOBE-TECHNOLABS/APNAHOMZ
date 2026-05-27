const crypto = require('crypto');
const Razorpay = require('razorpay');
const db = require('../database/db');
const {
  PLAN_DURATION_DAYS,
  getPlan,
  listPlans,
  toPublicPlan,
} = require('../config/subscriptionPlans');

let schemaReady = false;
let razorpayInstance = null;

function requireRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    const error = new Error('Razorpay is not configured');
    error.status = 503;
    throw error;
  }

  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  return razorpayInstance;
}

function hmacSha256(message, secret) {
  return crypto.createHmac('sha256', secret).update(message).digest('hex');
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a || ''), 'utf8');
  const right = Buffer.from(String(b || ''), 'utf8');
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function addDaysSql(days) {
  return `DATE_ADD(NOW(), INTERVAL ${Number(days)} DAY)`;
}

async function expireEntitlementIfNeeded(userId) {
  await db.query(
    `
      UPDATE user_entitlements
      SET status = 'expired',
          render_reserved = 0
      WHERE user_id = ?
        AND status = 'active'
        AND cycle_end_at <= NOW()
    `,
    [userId]
  );
}

async function ensureBillingTables() {
  if (schemaReady) return;

  await db.query(`
    CREATE TABLE IF NOT EXISTS subscription_purchases (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      plan_code VARCHAR(32) NOT NULL,
      razorpay_order_id VARCHAR(128) NOT NULL UNIQUE,
      razorpay_payment_id VARCHAR(128) UNIQUE,
      razorpay_signature VARCHAR(255),
      amount_paise INT NOT NULL,
      currency VARCHAR(8) NOT NULL DEFAULT 'INR',
      status VARCHAR(32) NOT NULL DEFAULT 'created',
      failure_reason TEXT,
      raw_payload LONGTEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_subscription_purchases_user_id (user_id),
      INDEX idx_subscription_purchases_status (status),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS user_entitlements (
      user_id INT PRIMARY KEY,
      plan_code VARCHAR(32) NOT NULL,
      status VARCHAR(32) NOT NULL,
      render_limit INT NOT NULL,
      render_used INT NOT NULL DEFAULT 0,
      render_reserved INT NOT NULL DEFAULT 0,
      cycle_start_at DATETIME NOT NULL,
      cycle_end_at DATETIME NOT NULL,
      activated_payment_id VARCHAR(128) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_user_entitlements_status (status),
      INDEX idx_user_entitlements_cycle_end (cycle_end_at),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS ai_render_jobs (
      id VARCHAR(64) PRIMARY KEY,
      user_id INT NOT NULL,
      plan_code VARCHAR(32) NOT NULL,
      credits_reserved INT NOT NULL,
      credits_consumed INT NOT NULL DEFAULT 0,
      status VARCHAR(32) NOT NULL,
      style_id VARCHAR(64),
      endpoint VARCHAR(128),
      failure_reason TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_ai_render_jobs_user_status (user_id, status),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS credit_ledger (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      job_id VARCHAR(64),
      payment_id VARCHAR(128),
      plan_code VARCHAR(32),
      action VARCHAR(32) NOT NULL,
      credits_delta INT NOT NULL,
      balance_after INT,
      idempotency_key VARCHAR(191) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_credit_ledger_user_id (user_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS payment_webhook_events (
      event_id VARCHAR(191) PRIMARY KEY,
      event_name VARCHAR(128) NOT NULL,
      payload LONGTEXT,
      processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  schemaReady = true;
}

function formatEntitlement(row) {
  if (!row) {
    return {
      active: false,
      planCode: null,
      plan: null,
      renderLimit: 0,
      renderUsed: 0,
      renderReserved: 0,
      renderRemaining: 0,
      cycleStartAt: null,
      cycleEndAt: null,
      allowedStyleIds: [],
    };
  }

  const plan = getPlan(row.plan_code);
  const now = Date.now();
  const endsAt = row.cycle_end_at ? new Date(row.cycle_end_at).getTime() : 0;
  const active = Boolean(plan) && row.status === 'active' && endsAt > now;
  const renderLimit = Number(row.render_limit || 0);
  const renderUsed = Number(row.render_used || 0);
  const renderReserved = Number(row.render_reserved || 0);

  return {
    active,
    planCode: row.plan_code,
    plan: plan ? toPublicPlan(plan) : null,
    renderLimit,
    renderUsed,
    renderReserved,
    renderRemaining: active ? Math.max(0, renderLimit - renderUsed - renderReserved) : 0,
    cycleStartAt: row.cycle_start_at,
    cycleEndAt: row.cycle_end_at,
    allowedStyleIds: active && plan ? plan.allowedStyleIds : [],
  };
}

async function getEntitlement(userId) {
  await ensureBillingTables();
  await expireEntitlementIfNeeded(userId);

  const [rows] = await db.query(
    `SELECT * FROM user_entitlements WHERE user_id = ? LIMIT 1`,
    [userId]
  );

  return formatEntitlement(rows[0]);
}

async function createOrder(userId, planCode) {
  await ensureBillingTables();
  const plan = getPlan(planCode);
  if (!plan) {
    const error = new Error('Invalid plan');
    error.status = 400;
    throw error;
  }

  const razorpay = requireRazorpay();
  const amountPaise = plan.price * 100;
  const receipt = `fl_${userId}_${plan.code}_${Date.now()}`.slice(0, 40);

  const order = await razorpay.orders.create({
    amount: amountPaise,
    currency: plan.currency,
    receipt,
    notes: {
      user_id: String(userId),
      plan_code: plan.code,
    },
  });

  await db.query(
    `
      INSERT INTO subscription_purchases
        (user_id, plan_code, razorpay_order_id, amount_paise, currency, status, raw_payload)
      VALUES (?, ?, ?, ?, ?, 'created', ?)
    `,
    [userId, plan.code, order.id, amountPaise, plan.currency, JSON.stringify(order)]
  );

  return {
    keyId: process.env.RAZORPAY_KEY_ID,
    orderId: order.id,
    amount: amountPaise,
    currency: plan.currency,
    plan: toPublicPlan(plan),
  };
}

async function activatePurchase({
  userId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature = null,
  rawPayload = null,
}) {
  await ensureBillingTables();
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [purchaseRows] = await connection.query(
      `SELECT * FROM subscription_purchases WHERE razorpay_order_id = ? FOR UPDATE`,
      [razorpayOrderId]
    );
    const purchase = purchaseRows[0];

    if (!purchase) {
      const error = new Error('Payment order not found');
      error.status = 404;
      throw error;
    }

    if (Number(purchase.user_id) !== Number(userId)) {
      const error = new Error('Payment order does not belong to this user');
      error.status = 403;
      throw error;
    }

    const plan = getPlan(purchase.plan_code);
    if (!plan || Number(purchase.amount_paise) !== plan.price * 100) {
      const error = new Error('Payment order does not match a valid plan');
      error.status = 409;
      throw error;
    }

    if (purchase.status === 'paid') {
      await connection.commit();
      return getEntitlement(userId);
    }

    if (purchase.razorpay_payment_id && purchase.razorpay_payment_id !== razorpayPaymentId) {
      const error = new Error('Payment id mismatch for this order');
      error.status = 409;
      throw error;
    }

    await connection.query(
      `
        UPDATE subscription_purchases
        SET status = 'paid',
            razorpay_payment_id = ?,
            razorpay_signature = COALESCE(?, razorpay_signature),
            raw_payload = COALESCE(?, raw_payload)
        WHERE razorpay_order_id = ?
      `,
      [
        razorpayPaymentId,
        razorpaySignature,
        rawPayload ? JSON.stringify(rawPayload) : null,
        razorpayOrderId,
      ]
    );

    await connection.query(
      `
        INSERT INTO user_entitlements
          (user_id, plan_code, status, render_limit, render_used, render_reserved,
           cycle_start_at, cycle_end_at, activated_payment_id)
        VALUES (?, ?, 'active', ?, 0, 0, NOW(), ${addDaysSql(PLAN_DURATION_DAYS)}, ?)
        ON DUPLICATE KEY UPDATE
          plan_code = VALUES(plan_code),
          status = 'active',
          render_limit = VALUES(render_limit),
          render_used = 0,
          render_reserved = 0,
          cycle_start_at = NOW(),
          cycle_end_at = ${addDaysSql(PLAN_DURATION_DAYS)},
          activated_payment_id = VALUES(activated_payment_id)
      `,
      [userId, plan.code, plan.renderLimit, razorpayPaymentId]
    );

    await connection.query(
      `
        INSERT IGNORE INTO credit_ledger
          (user_id, payment_id, plan_code, action, credits_delta, balance_after, idempotency_key)
        VALUES (?, ?, ?, 'grant', ?, ?, ?)
      `,
      [
        userId,
        razorpayPaymentId,
        plan.code,
        plan.renderLimit,
        plan.renderLimit,
        `grant:${razorpayPaymentId}`,
      ]
    );

    await connection.commit();
    return getEntitlement(userId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function verifyPayment(userId, payload) {
  const {
    razorpay_order_id: razorpayOrderId,
    razorpay_payment_id: razorpayPaymentId,
    razorpay_signature: razorpaySignature,
  } = payload || {};

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    const error = new Error('Missing Razorpay verification fields');
    error.status = 400;
    throw error;
  }

  if (!process.env.RAZORPAY_KEY_SECRET) {
    const error = new Error('Razorpay is not configured');
    error.status = 503;
    throw error;
  }

  const expected = hmacSha256(
    `${razorpayOrderId}|${razorpayPaymentId}`,
    process.env.RAZORPAY_KEY_SECRET
  );

  if (!safeEqual(expected, razorpaySignature)) {
    const error = new Error('Payment signature verification failed');
    error.status = 400;
    throw error;
  }

  return activatePurchase({
    userId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    rawPayload: payload,
  });
}

async function handleWebhook({ rawBody, signature, eventId }) {
  await ensureBillingTables();

  if (!rawBody) {
    const error = new Error('Webhook raw body is required');
    error.status = 400;
    throw error;
  }

  if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
    const error = new Error('Razorpay webhook secret is not configured');
    error.status = 503;
    throw error;
  }

  const expected = hmacSha256(rawBody, process.env.RAZORPAY_WEBHOOK_SECRET);
  if (!safeEqual(expected, signature)) {
    const error = new Error('Invalid webhook signature');
    error.status = 400;
    throw error;
  }

  const payload = JSON.parse(rawBody.toString('utf8'));
  const webhookEventId = eventId || payload.event || crypto.randomUUID();

  const [insertResult] = await db.query(
    `
      INSERT IGNORE INTO payment_webhook_events (event_id, event_name, payload)
      VALUES (?, ?, ?)
    `,
    [webhookEventId, payload.event || 'unknown', JSON.stringify(payload)]
  );

  if (insertResult.affectedRows === 0) {
    return { duplicate: true };
  }

  const payment = payload.payload?.payment?.entity;
  if (!payment || !['payment.captured', 'order.paid'].includes(payload.event)) {
    return { ignored: true };
  }

  const orderId = payment.order_id;
  const paymentId = payment.id;
  if (!orderId || !paymentId) {
    return { ignored: true };
  }

  const [purchaseRows] = await db.query(
    `SELECT user_id FROM subscription_purchases WHERE razorpay_order_id = ? LIMIT 1`,
    [orderId]
  );

  if (!purchaseRows[0]) {
    return { ignored: true };
  }

  await activatePurchase({
    userId: purchaseRows[0].user_id,
    razorpayOrderId: orderId,
    razorpayPaymentId: paymentId,
    rawPayload: payload,
  });

  return { processed: true };
}

async function listPaymentHistory(userId) {
  await ensureBillingTables();
  const [rows] = await db.query(
    `
      SELECT
        id,
        plan_code,
        razorpay_order_id,
        razorpay_payment_id,
        amount_paise,
        currency,
        status,
        failure_reason,
        created_at,
        updated_at
      FROM subscription_purchases
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 50
    `,
    [userId]
  );

  return rows.map((row) => {
    const plan = getPlan(row.plan_code);
    return {
      id: row.id,
      planCode: row.plan_code,
      planName: plan ? plan.name : row.plan_code,
      razorpayOrderId: row.razorpay_order_id,
      razorpayPaymentId: row.razorpay_payment_id,
      amountPaise: Number(row.amount_paise || 0),
      amount: Number(row.amount_paise || 0) / 100,
      currency: row.currency,
      status: row.status,
      failureReason: row.failure_reason,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  });
}

function getStyleId(req) {
  return (
    req.body?.styleId ||
    req.body?.style ||
    req.body?.planData?.styleId ||
    'modern'
  );
}

async function reserveRenderCredits({ userId, styleId, endpoint, count = 1 }) {
  await ensureBillingTables();
  const reserveCount = Math.max(1, Number(count) || 1);
  const connection = await db.getConnection();
  const jobId = crypto.randomUUID();
  let transactionFinished = false;

  try {
    await connection.beginTransaction();
    const [rows] = await connection.query(
      `SELECT * FROM user_entitlements WHERE user_id = ? FOR UPDATE`,
      [userId]
    );
    const entitlement = rows[0];

    if (!entitlement || entitlement.status !== 'active') {
      const error = new Error('An active plan is required to generate AI renders');
      error.status = 402;
      throw error;
    }

    if (new Date(entitlement.cycle_end_at).getTime() <= Date.now()) {
      await connection.query(
        `
          UPDATE user_entitlements
          SET status = 'expired',
              render_reserved = 0
          WHERE user_id = ?
        `,
        [userId]
      );
      await connection.commit();
      transactionFinished = true;

      const error = new Error('Your subscription has expired. Please renew your plan to generate AI renders');
      error.status = 402;
      throw error;
    }

    const plan = getPlan(entitlement.plan_code);
    if (!plan) {
      const error = new Error('Plan is invalid');
      error.status = 402;
      throw error;
    }

    if (!plan.allowedStyleIds.includes(styleId)) {
      const error = new Error('This style is not available on your current plan');
      error.status = 403;
      error.allowedStyleIds = plan.allowedStyleIds;
      throw error;
    }

    const used = Number(entitlement.render_used || 0);
    const reserved = Number(entitlement.render_reserved || 0);
    const limit = Number(entitlement.render_limit || 0);
    const available = limit - used - reserved;

    if (available < reserveCount) {
      const error = new Error('You do not have enough AI render credits remaining');
      error.status = 402;
      error.renderRemaining = Math.max(0, available);
      throw error;
    }

    await connection.query(
      `
        UPDATE user_entitlements
        SET render_reserved = render_reserved + ?
        WHERE user_id = ?
      `,
      [reserveCount, userId]
    );

    await connection.query(
      `
        INSERT INTO ai_render_jobs
          (id, user_id, plan_code, credits_reserved, status, style_id, endpoint)
        VALUES (?, ?, ?, ?, 'reserved', ?, ?)
      `,
      [jobId, userId, plan.code, reserveCount, styleId, endpoint]
    );

    await connection.query(
      `
        INSERT INTO credit_ledger
          (user_id, job_id, plan_code, action, credits_delta, balance_after, idempotency_key)
        VALUES (?, ?, ?, 'reserve', ?, ?, ?)
      `,
      [userId, jobId, plan.code, -reserveCount, available - reserveCount, `reserve:${jobId}`]
    );

    await connection.commit();
    transactionFinished = true;
    return { jobId, reserved: reserveCount };
  } catch (error) {
    if (!transactionFinished) {
      await connection.rollback();
    }
    throw error;
  } finally {
    connection.release();
  }
}

async function finishRenderJob({ jobId, userId, successCount = 1, failureReason = null }) {
  if (!jobId) return;
  await ensureBillingTables();
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    const [jobRows] = await connection.query(
      `SELECT * FROM ai_render_jobs WHERE id = ? AND user_id = ? FOR UPDATE`,
      [jobId, userId]
    );
    const job = jobRows[0];
    if (!job || job.status !== 'reserved') {
      await connection.commit();
      return;
    }

    const reserved = Number(job.credits_reserved || 0);
    const consumed = Math.max(0, Math.min(reserved, Number(successCount) || 0));
    const released = reserved - consumed;
    const status = consumed > 0 ? (released > 0 ? 'partial' : 'succeeded') : 'failed';

    await connection.query(
      `
        UPDATE user_entitlements
        SET render_reserved = GREATEST(0, render_reserved - ?),
            render_used = render_used + ?
        WHERE user_id = ?
      `,
      [reserved, consumed, userId]
    );

    await connection.query(
      `
        UPDATE ai_render_jobs
        SET status = ?, credits_consumed = ?, failure_reason = ?
        WHERE id = ?
      `,
      [status, consumed, failureReason, jobId]
    );

    const [entitlementRows] = await connection.query(
      `SELECT render_limit, render_used, render_reserved FROM user_entitlements WHERE user_id = ?`,
      [userId]
    );
    const entitlement = entitlementRows[0];
    const balanceAfter = entitlement
      ? Number(entitlement.render_limit) - Number(entitlement.render_used) - Number(entitlement.render_reserved)
      : null;

    if (consumed > 0) {
      await connection.query(
        `
          INSERT IGNORE INTO credit_ledger
            (user_id, job_id, plan_code, action, credits_delta, balance_after, idempotency_key)
          VALUES (?, ?, ?, 'consume', ?, ?, ?)
        `,
        [userId, jobId, job.plan_code, -consumed, balanceAfter, `consume:${jobId}`]
      );
    }

    if (released > 0) {
      await connection.query(
        `
          INSERT IGNORE INTO credit_ledger
            (user_id, job_id, plan_code, action, credits_delta, balance_after, idempotency_key)
          VALUES (?, ?, ?, 'release', ?, ?, ?)
        `,
        [userId, jobId, job.plan_code, released, balanceAfter, `release:${jobId}`]
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function listPublicPlans() {
  return listPlans().map(toPublicPlan);
}

module.exports = {
  ensureBillingTables,
  listPublicPlans,
  getEntitlement,
  createOrder,
  verifyPayment,
  handleWebhook,
  listPaymentHistory,
  reserveRenderCredits,
  finishRenderJob,
  getStyleId,
};
