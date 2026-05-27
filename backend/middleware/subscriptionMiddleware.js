const billingService = require('../services/billingService');

/**
 * Requires an active paid cycle (user_entitlements.status = active, not expired).
 * Used for floor plan CRUD, editor, and viewer — not for /api/billing/*.
 */
async function requireActiveSubscription(req, res, next) {
  try {
    const entitlement = await billingService.getEntitlement(req.user.id);
    if (!entitlement.active) {
      return res.status(403).json({
        message:
          'An active subscription is required for 2D plans, 3D view, and AI. Choose a plan under Billing.',
        code: 'SUBSCRIPTION_REQUIRED',
      });
    }
    req.entitlement = entitlement;
    next();
  } catch (err) {
    console.error('Subscription check failed:', err);
    return res.status(500).json({ message: 'Unable to verify subscription' });
  }
}

module.exports = requireActiveSubscription;
