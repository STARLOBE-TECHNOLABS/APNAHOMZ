/**
 * Shared helpers for subscription E2E tests (staging/local only).
 * Uses API + direct DB for payment simulation, credit consumption, recharge,
 * 30-day expiry checks, and renewal checks.
 */
const crypto = require('crypto');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { getPlan, SUBSCRIPTION_PLANS } = require('../../config/subscriptionPlans');

const API_BASE = (process.env.BILLING_E2E_API_URL || process.env.API_BASE_URL || 'http://localhost:5000')
  .replace(/\/+$/, '');

const PLAN_EXPECTATIONS = {
  essential: {
    renderLimit: 5,
    allowedStyleIds: ['modern', 'minimalist', 'scandinavian'],
    lockedStyleId: 'luxury',
    furnitureSourcing: false,
  },
  signature: {
    renderLimit: 10,
    allowedStyleIds: ['modern', 'minimalist', 'scandinavian', 'luxury', 'contemporary'],
    lockedStyleId: 'bohemian',
    furnitureSourcing: true,
  },
  prestige: {
    renderLimit: 15,
    allowedStyleIds: [
      'modern', 'minimalist', 'scandinavian', 'luxury', 'contemporary',
      'industrial', 'traditional', 'bohemian',
    ],
    lockedStyleId: null,
    furnitureSourcing: true,
  },
};

let passCount = 0;
let failCount = 0;
let dbInstance = null;
let billingServiceInstance = null;

function getDb() {
  if (!dbInstance) {
    dbInstance = require('../../database/db');
  }
  return dbInstance;
}

function getBillingService() {
  if (!billingServiceInstance) {
    billingServiceInstance = require('../../services/billingService');
  }
  return billingServiceInstance;
}

function assert(condition, message) {
  if (condition) {
    passCount += 1;
    console.log(`  OK: ${message}`);
    return true;
  }
  failCount += 1;
  console.error(`  FAIL: ${message}`);
  return false;
}

async function api(pathname, { method = 'GET', token, body } = {}) {
  const headers = { Accept: 'application/json' };
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${pathname}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  return { status: response.status, data };
}

function uniqueSuffix() {
  return `${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
}

async function simulateWordPressPaidPurchase(planCode) {
  const billingService = getBillingService();
  const db = getDb();
  await billingService.ensureBillingTables();
  const plan = getPlan(planCode);
  if (!plan) throw new Error(`Unknown plan: ${planCode}`);

  const claimToken = crypto.randomBytes(24).toString('hex');
  const orderId = `e2e_order_${planCode}_${uniqueSuffix()}`;
  const paymentId = `e2e_pay_${planCode}_${uniqueSuffix()}`;

  await db.query(
    `
      INSERT INTO subscription_purchases
        (user_id, plan_code, razorpay_order_id, razorpay_payment_id,
         amount_paise, currency, status, claim_token, source, raw_payload)
      VALUES (NULL, ?, ?, ?, ?, ?, 'paid', ?, 'wordpress-e2e', ?)
    `,
    [
      plan.code,
      orderId,
      paymentId,
      plan.price * 100,
      plan.currency,
      claimToken,
      JSON.stringify({ e2e: true, planCode }),
    ]
  );

  return { claimToken, planCode: plan.code, orderId, paymentId };
}

async function registerWithClaim(planCode, claimToken) {
  const suffix = uniqueSuffix();
  const payload = {
    username: `e2e_${planCode}_${suffix}`,
    email: `e2e_${planCode}_${suffix}@apnahomz.test`,
    password: 'TestPass123!',
    phone: '9876543210',
    claimToken,
  };

  const { status, data } = await api('/api/auth/register', {
    method: 'POST',
    body: payload,
  });

  if (status !== 201) {
    throw new Error(data.message || `Register failed (${status})`);
  }

  return {
    token: data.token,
    user: data.user,
    entitlement: data.entitlement,
    username: payload.username,
  };
}

async function getEntitlementViaApi(token) {
  const { status, data } = await api('/api/billing/me', { token });
  if (status !== 200) throw new Error(data.message || `billing/me failed (${status})`);
  return data.entitlement;
}

async function getPaymentHistory(token) {
  const { status, data } = await api('/api/billing/history', { token });
  if (status !== 200) throw new Error(data.message || `billing/history failed (${status})`);
  return data.history || [];
}

async function testFloorPlanAccess(token, shouldAllow) {
  const { status, data } = await api('/api/plans', { token });
  if (shouldAllow) {
    return assert(status === 200, `GET /api/plans allowed (got ${status})`);
  }
  return assert(
    status === 403 && data.code === 'SUBSCRIPTION_REQUIRED',
    'GET /api/plans blocked when inactive (403 SUBSCRIPTION_REQUIRED)'
  );
}

async function forceExpireEntitlement(userId) {
  const db = getDb();
  await db.query(
    `
      UPDATE user_entitlements
      SET cycle_end_at = DATE_SUB(NOW(), INTERVAL 1 DAY)
      WHERE user_id = ?
    `,
    [userId]
  );
}

async function cleanupTestUser(userId) {
  if (!userId) return;
  const db = getDb();
  try {
    await db.query('DELETE FROM users WHERE id = ?', [userId]);
  } catch (error) {
    console.warn(`  cleanup user ${userId}: ${error.message}`);
  }
}

function assertEntitlement(entitlement, planCode) {
  const expected = PLAN_EXPECTATIONS[planCode];
  const plan = getPlan(planCode);

  assert(entitlement?.active === true, `${planCode}: entitlement is active`);
  assert(entitlement?.planCode === planCode, `${planCode}: planCode matches`);
  assert(
    entitlement?.renderLimit === expected.renderLimit,
    `${planCode}: render limit ${expected.renderLimit} (got ${entitlement?.renderLimit})`
  );
  assert(entitlement?.renderUsed === 0, `${planCode}: renderUsed starts at 0`);
  assert(
    entitlement?.renderRemaining === expected.renderLimit,
    `${planCode}: renderRemaining = ${expected.renderLimit}`
  );
  assert(Boolean(entitlement?.cycleEndAt), `${planCode}: cycleEndAt is set`);

  for (const styleId of expected.allowedStyleIds) {
    assert(
      entitlement?.allowedStyleIds?.includes(styleId),
      `${planCode}: style "${styleId}" included`
    );
  }

  if (expected.lockedStyleId) {
    assert(
      !entitlement?.allowedStyleIds?.includes(expected.lockedStyleId),
      `${planCode}: style "${expected.lockedStyleId}" correctly excluded`
    );
  }

  assert(
    entitlement?.plan?.furnitureSourcing === expected.furnitureSourcing,
    `${planCode}: furnitureSourcing = ${expected.furnitureSourcing}`
  );
  assert(
    entitlement?.plan?.name === plan.name,
    `${planCode}: public plan name "${plan.name}"`
  );
}

async function consumeAllCreditsAndVerify({ token, userId, planCode }) {
  const billingService = getBillingService();
  const expected = PLAN_EXPECTATIONS[planCode];
  const styleId = expected.allowedStyleIds[0];

  console.log(`  [5/8] Consume all ${expected.renderLimit} AI credits`);
  for (let i = 0; i < expected.renderLimit; i += 1) {
    const reservation = await billingService.reserveRenderCredits({
      userId,
      styleId,
      endpoint: `e2e-${planCode}`,
      count: 1,
    });

    await billingService.finishRenderJob({
      jobId: reservation.jobId,
      userId,
      successCount: 1,
      failureReason: null,
    });
  }

  const afterUsage = await getEntitlementViaApi(token);
  assert(
    afterUsage?.renderUsed === expected.renderLimit,
    `${planCode}: renderUsed updates to ${expected.renderLimit} after consumption`
  );
  assert(
    afterUsage?.renderRemaining === 0,
    `${planCode}: renderRemaining reaches 0 after consumption`
  );

  let blocked = false;
  try {
    await billingService.reserveRenderCredits({
      userId,
      styleId,
      endpoint: `e2e-${planCode}-over-limit`,
      count: 1,
    });
  } catch (error) {
    blocked =
      error.message === 'You do not have enough AI render credits remaining' &&
      error.renderRemaining === 0;
  }

  assert(blocked, `${planCode}: extra AI render is blocked once credits finish`);
}

async function runPlanE2E(planCode) {
  console.log(`\n=== Plan: ${planCode.toUpperCase()} ===`);
  let userId = null;

  try {
    console.log('  [1/8] Simulate WordPress payment (paid guest purchase in DB)');
    const { claimToken } = await simulateWordPressPaidPurchase(planCode);
    assert(Boolean(claimToken), `${planCode}: claim token created`);

    console.log('  [2/8] Register + claim purchase');
    const { token, user, entitlement } = await registerWithClaim(planCode, claimToken);
    userId = user.id;
    assert(Boolean(token), `${planCode}: JWT issued after register+claim`);

    console.log('  [3/8] Verify entitlement limits and styles');
    assertEntitlement(entitlement, planCode);

    console.log('  [4/8] Verify API access and payment history');
    const liveEntitlement = await getEntitlementViaApi(token);
    assert(liveEntitlement?.active === true, `${planCode}: /api/billing/me shows active`);
    await testFloorPlanAccess(token, true);

    const history = await getPaymentHistory(token);
    assert(history.length >= 1, `${planCode}: payment history has at least 1 row`);
    assert(
      history.some((row) => row.planCode === planCode && row.status === 'paid'),
      `${planCode}: payment history contains paid ${planCode} row`
    );

    await consumeAllCreditsAndVerify({ token, userId, planCode });

    console.log('  [6/8] Buy the plan again before expiry and verify credits refresh');
    const recharge = await simulateWordPressPaidPurchase(planCode);
    const rechargeResponse = await api('/api/billing/claim', {
      method: 'POST',
      token,
      body: { claimToken: recharge.claimToken },
    });
    assert(
      rechargeResponse.status === 200,
      `${planCode}: recharge claim succeeds (${rechargeResponse.status})`
    );
    assertEntitlement(rechargeResponse.data.entitlement, planCode);

    const refreshedHistory = await getPaymentHistory(token);
    assert(
      refreshedHistory.filter((row) => row.planCode === planCode && row.status === 'paid').length >= 2,
      `${planCode}: payment history contains repeated paid purchases after recharge`
    );

    console.log('  [7/8] Force expiry (simulate day 31)');
    await forceExpireEntitlement(userId);
    const expiredEntitlement = await getEntitlementViaApi(token);
    assert(expiredEntitlement?.active === false, `${planCode}: entitlement inactive after expiry date passed`);
    await testFloorPlanAccess(token, true);

    console.log('  [8/8] Re-activate with new purchase after expiry');
    const renewal = await simulateWordPressPaidPurchase(planCode);
    const { status, data } = await api('/api/billing/claim', {
      method: 'POST',
      token,
      body: { claimToken: renewal.claimToken },
    });
    assert(status === 200, `${planCode}: renewal claim succeeds (${status})`);
    assert(data.entitlement?.active === true, `${planCode}: active again after renewal`);
    assert(
      data.entitlement?.renderLimit === PLAN_EXPECTATIONS[planCode].renderLimit,
      `${planCode}: render limit restored after renewal`
    );
    assert(
      data.entitlement?.renderUsed === 0 &&
      data.entitlement?.renderRemaining === PLAN_EXPECTATIONS[planCode].renderLimit,
      `${planCode}: credits fully refreshed after renewal`
    );
    await testFloorPlanAccess(token, true);

    console.log(`  -> ${planCode} E2E complete`);
  } finally {
    await cleanupTestUser(userId);
  }
}

async function verifyPublicPlansApi() {
  console.log('\n=== Public plans API ===');
  const { status, data } = await api('/api/billing/plans');
  assert(status === 200, 'GET /api/billing/plans returns 200');
  const codes = (data.plans || []).map((p) => p.code).sort();
  assert(
    codes.join(',') === 'essential,prestige,signature',
    `All 3 plans listed (${codes.join(', ')})`
  );

  for (const code of Object.keys(SUBSCRIPTION_PLANS)) {
    const plan = data.plans.find((p) => p.code === code);
    assert(plan?.price === SUBSCRIPTION_PLANS[code].price, `${code}: price matches config`);
    assert(plan?.renderLimit === SUBSCRIPTION_PLANS[code].renderLimit, `${code}: renderLimit in API`);
  }
}

function assertSafeTarget() {
  const host = API_BASE.toLowerCase();
  if (host.includes('apnahomz.com') && process.env.ALLOW_PRODUCTION_E2E !== '1') {
    console.error(
      '\nRefusing to run against production API without ALLOW_PRODUCTION_E2E=1\n' +
        'Use BILLING_E2E_API_URL=http://localhost:5000 for local/staging tests.\n'
    );
    process.exit(1);
  }
}

function printSummary() {
  console.log('\n========================================');
  console.log(`PASSED: ${passCount}`);
  console.log(`FAILED: ${failCount}`);
  console.log('========================================');
  if (failCount > 0) process.exit(1);
}

module.exports = {
  API_BASE,
  PLAN_EXPECTATIONS,
  assert,
  api,
  assertSafeTarget,
  printSummary,
  passCount: () => passCount,
  failCount: () => failCount,
  runPlanE2E,
  verifyPublicPlansApi,
  simulateWordPressPaidPurchase,
  registerWithClaim,
  getEntitlementViaApi,
  forceExpireEntitlement,
  cleanupTestUser,
  consumeAllCreditsAndVerify,
};
