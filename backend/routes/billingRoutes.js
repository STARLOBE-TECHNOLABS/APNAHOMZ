const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const billingService = require('../services/billingService');

const router = express.Router();

function sendError(res, error) {
  const status = error.status || 500;
  if (status >= 500) {
    console.error('Billing error:', error);
  }

  res.status(status).json({
    message: error.message || 'Billing request failed',
    allowedStyleIds: error.allowedStyleIds,
    renderRemaining: error.renderRemaining,
  });
}

router.get('/plans', async (req, res) => {
  try {
    const plans = await billingService.listPublicPlans();
    res.json({ plans });
  } catch (error) {
    sendError(res, error);
  }
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const entitlement = await billingService.getEntitlement(req.user.id);
    res.json({ entitlement });
  } catch (error) {
    sendError(res, error);
  }
});

router.get('/history', authenticateToken, async (req, res) => {
  try {
    const history = await billingService.listPaymentHistory(req.user.id);
    res.json({ history });
  } catch (error) {
    sendError(res, error);
  }
});

router.post('/orders', authenticateToken, async (req, res) => {
  try {
    const order = await billingService.createOrder(req.user.id, req.body?.planCode);
    res.status(201).json(order);
  } catch (error) {
    sendError(res, error);
  }
});

router.post('/guest/orders', async (req, res) => {
  try {
    const order = await billingService.createGuestOrder(req.body?.planCode, req.body?.source);
    res.status(201).json(order);
  } catch (error) {
    sendError(res, error);
  }
});

router.post('/guest/verify', async (req, res) => {
  try {
    const result = await billingService.verifyGuestPayment(req.body);
    res.json(result);
  } catch (error) {
    sendError(res, error);
  }
});

router.post('/claim', authenticateToken, async (req, res) => {
  try {
    const entitlement = await billingService.claimGuestPurchase(
      req.user.id,
      req.body?.claimToken
    );
    res.json({ entitlement });
  } catch (error) {
    sendError(res, error);
  }
});

router.post('/verify', authenticateToken, async (req, res) => {
  try {
    const entitlement = await billingService.verifyPayment(req.user.id, req.body);
    res.json({ entitlement });
  } catch (error) {
    sendError(res, error);
  }
});

router.post(
  '/razorpay/webhook',
  async (req, res) => {
    try {
      const result = await billingService.handleWebhook({
        rawBody: req.rawBody,
        signature: req.headers['x-razorpay-signature'],
        eventId: req.headers['x-razorpay-event-id'],
      });

      res.json({ ok: true, ...result });
    } catch (error) {
      sendError(res, error);
    }
  }
);

module.exports = router;
