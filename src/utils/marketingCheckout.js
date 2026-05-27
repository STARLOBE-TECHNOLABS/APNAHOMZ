/** Pending plan purchase from apnahomz.com / WordPress marketing site. */
export const CHECKOUT_PLAN_KEY = 'apnahomz_pending_plan';
export const CHECKOUT_SOURCE_KEY = 'apnahomz_checkout_source';

const VALID_PLANS = new Set(['essential', 'signature', 'prestige']);

export function isValidPlanCode(planCode) {
  return VALID_PLANS.has(String(planCode || '').toLowerCase());
}

export function parseMarketingCheckout(search) {
  const params = new URLSearchParams(search);
  const plan = params.get('plan')?.toLowerCase() || null;
  const checkout = params.get('checkout')?.toLowerCase() || null;
  const source = params.get('source') || null;
  return {
    plan: isValidPlanCode(plan) ? plan : null,
    checkout: isValidPlanCode(checkout) ? checkout : null,
    source,
  };
}

export function persistMarketingCheckout({ plan, source } = {}) {
  if (plan && isValidPlanCode(plan)) {
    sessionStorage.setItem(CHECKOUT_PLAN_KEY, plan);
  }
  if (source) {
    sessionStorage.setItem(CHECKOUT_SOURCE_KEY, source);
  }
}

export function getPendingCheckoutPlan() {
  const plan = sessionStorage.getItem(CHECKOUT_PLAN_KEY);
  return isValidPlanCode(plan) ? plan : null;
}

export function getCheckoutSource() {
  return sessionStorage.getItem(CHECKOUT_SOURCE_KEY);
}

export function clearMarketingCheckout() {
  sessionStorage.removeItem(CHECKOUT_PLAN_KEY);
  sessionStorage.removeItem(CHECKOUT_SOURCE_KEY);
}

export function billingPathWithCheckout(planCode, source) {
  const params = new URLSearchParams();
  if (planCode && isValidPlanCode(planCode)) params.set('checkout', planCode);
  if (source) params.set('source', source);
  const query = params.toString();
  return query ? `/plans/billing?${query}` : '/plans/billing';
}

export function resolvePostPaymentPath(source) {
  if (source === 'wordpress' || getCheckoutSource() === 'wordpress') {
    return '/plans/all';
  }
  return '/plans/all';
}
