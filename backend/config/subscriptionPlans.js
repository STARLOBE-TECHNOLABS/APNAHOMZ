const PLAN_DURATION_DAYS = 30;

const STYLE_SETS = {
  standard: ['modern', 'minimalist', 'scandinavian'],
  premium: ['modern', 'minimalist', 'scandinavian', 'luxury', 'contemporary'],
  all: [
    'modern',
    'minimalist',
    'scandinavian',
    'luxury',
    'contemporary',
    'industrial',
    'traditional',
    'bohemian',
  ],
};

const SUBSCRIPTION_PLANS = {
  essential: {
    code: 'essential',
    name: 'Essential',
    badge: null,
    tagline: 'Quick room inspirations',
    bestFor: 'Quick room inspirations',
    originalPrice: 999,
    price: 499,
    currency: 'INR',
    renderLimit: 5,
    threeDViewsLabel: 'Free 3D View',
    styleLimitLabel: '3 Standard Styles',
    furnitureSourcing: false,
    humanDesignHelp: false,
    idealPropertyType: 'Single Rooms',
    allowedStyleIds: STYLE_SETS.standard,
  },
  signature: {
    code: 'signature',
    name: 'Signature',
    badge: 'Most Popular',
    tagline: 'Complete room makeovers',
    bestFor: 'Complete room makeovers',
    originalPrice: 1499,
    price: 799,
    currency: 'INR',
    renderLimit: 10,
    threeDViewsLabel: 'Free 3D View',
    styleLimitLabel: '5 Premium Styles',
    furnitureSourcing: true,
    humanDesignHelp: false,
    idealPropertyType: 'Apartments & Homes',
    allowedStyleIds: STYLE_SETS.premium,
  },
  prestige: {
    code: 'prestige',
    name: 'Prestige',
    badge: null,
    tagline: 'Premium homes, cafes & luxury interiors',
    bestFor: 'Premium homes, cafes & luxury interiors',
    originalPrice: 1999,
    price: 999,
    currency: 'INR',
    renderLimit: 15,
    threeDViewsLabel: 'Free 3D View',
    styleLimitLabel: 'All Premium Styles',
    furnitureSourcing: true,
    humanDesignHelp: true,
    idealPropertyType: 'Villas, Cafes & Commercial Spaces',
    allowedStyleIds: STYLE_SETS.all,
  },
};

function getPlan(planCode) {
  return SUBSCRIPTION_PLANS[String(planCode || '').toLowerCase()] || null;
}

function listPlans() {
  return Object.values(SUBSCRIPTION_PLANS);
}

function toPublicPlan(plan) {
  return {
    code: plan.code,
    name: plan.name,
    badge: plan.badge,
    tagline: plan.tagline,
    bestFor: plan.bestFor,
    originalPrice: plan.originalPrice,
    price: plan.price,
    amountPaise: plan.price * 100,
    currency: plan.currency,
    renderLimit: plan.renderLimit,
    renderLimitLabel: `Up to ${plan.renderLimit} Renders`,
    threeDViewsLabel: plan.threeDViewsLabel,
    styleLimitLabel: plan.styleLimitLabel,
    furnitureSourcing: plan.furnitureSourcing,
    humanDesignHelp: plan.humanDesignHelp,
    idealPropertyType: plan.idealPropertyType,
    allowedStyleIds: plan.allowedStyleIds,
    durationDays: PLAN_DURATION_DAYS,
    packageValidityLabel: `${PLAN_DURATION_DAYS} Days`,
    features: [
      plan.bestFor,
      `Up to ${plan.renderLimit} Renders`,
      plan.threeDViewsLabel,
      plan.styleLimitLabel,
      plan.furnitureSourcing ? 'Furniture Sourcing Assistance' : null,
      plan.humanDesignHelp ? 'Human Design Help' : null,
      plan.idealPropertyType,
      `${PLAN_DURATION_DAYS} Days Validity`,
    ].filter(Boolean),
  };
}

module.exports = {
  PLAN_DURATION_DAYS,
  SUBSCRIPTION_PLANS,
  getPlan,
  listPlans,
  toPublicPlan,
};
