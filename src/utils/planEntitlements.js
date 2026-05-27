export const PLAN_TIER_ORDER = ['essential', 'signature', 'prestige'];

export const STYLE_LABELS = {
  modern: 'Modern',
  luxury: 'Luxury',
  minimalist: 'Minimalist',
  scandinavian: 'Scandinavian',
  industrial: 'Industrial',
  contemporary: 'Contemporary',
  traditional: 'Traditional',
  bohemian: 'Bohemian',
};

export const ALL_STYLE_IDS = Object.keys(STYLE_LABELS);

export function styleLabel(styleId) {
  return STYLE_LABELS[styleId] || styleId;
}

/** Lowest tier plan (from catalog) that includes this style. */
export function getMinimumPlanForStyle(styleId, plans = []) {
  for (const code of PLAN_TIER_ORDER) {
    const plan = plans.find((p) => p.code === code);
    if (plan?.allowedStyleIds?.includes(styleId)) return plan;
  }
  return null;
}

/** Next tier above current plan code, if any. */
export function getNextPlanTier(currentPlanCode, plans = []) {
  const idx = PLAN_TIER_ORDER.indexOf(currentPlanCode);
  if (idx < 0 || idx >= PLAN_TIER_ORDER.length - 1) return null;
  const nextCode = PLAN_TIER_ORDER[idx + 1];
  return plans.find((p) => p.code === nextCode) || null;
}

export function splitStylesByEntitlement(allowedStyleIds = []) {
  const allowed = ALL_STYLE_IDS.filter((id) => allowedStyleIds.includes(id));
  const locked = ALL_STYLE_IDS.filter((id) => !allowedStyleIds.includes(id));
  return { allowed, locked };
}

export function buildPlanFeatureUsage(entitlement) {
  if (!entitlement?.active || !entitlement.plan) {
    return null;
  }

  const plan = entitlement.plan;
  const allowedStyleIds = entitlement.allowedStyleIds || plan.allowedStyleIds || [];
  const { allowed, locked } = splitStylesByEntitlement(allowedStyleIds);

  return {
    planName: plan.name,
    planCode: entitlement.planCode,
    cycleEndAt: entitlement.cycleEndAt,
    renders: {
      used: entitlement.renderUsed ?? 0,
      limit: entitlement.renderLimit ?? 0,
      remaining: entitlement.renderRemaining ?? 0,
    },
    styles: {
      label: plan.styleLimitLabel,
      allowed,
      locked,
      allowedCount: allowed.length,
      totalCount: ALL_STYLE_IDS.length,
    },
    threeDView: {
      included: true,
      label: plan.threeDViewsLabel || 'Free 3D View',
    },
    furnitureSourcing: {
      included: Boolean(plan.furnitureSourcing),
    },
    humanDesignHelp: {
      included: Boolean(plan.humanDesignHelp),
    },
    idealPropertyType: plan.idealPropertyType,
  };
}
