import { BiCheck, BiLoaderAlt, BiStar, BiX } from 'react-icons/bi';

const formatPrice = (price) => `\u20b9${Number(price || 0).toLocaleString('en-IN')}`;

const PLAN_COLORS = {
  essential: {
    accent: '#3F653D',
    button: 'border-[#3F653D] bg-white text-[#3F653D] hover:bg-[#F3F8F1]',
    soft: 'bg-[#EDF4E9]',
  },
  signature: {
    accent: '#C47A00',
    button: 'border-[#D58B00] bg-[#D58B00] text-white hover:bg-[#B87500]',
    soft: 'bg-[#FFF2D8]',
  },
  prestige: {
    accent: '#082F67',
    button: 'border-[#082F67] bg-[#082F67] text-white hover:bg-[#0B3C7E]',
    soft: 'bg-[#EAF1FB]',
  },
};

const BooleanValue = ({ value }) => (
  <span className="inline-flex items-center justify-center gap-1 font-medium">
    {value ? (
      <>
        <BiCheck className="text-emerald-600" size={20} />
        Included
      </>
    ) : (
      <>
        <BiX className="text-red-500" size={20} />
        Not Included
      </>
    )}
  </span>
);

const PlanCards = ({
  plans,
  entitlement,
  checkoutLoading,
  onSelectPlan,
  compact = false,
}) => {
  const rows = [
    { label: 'Best For', getValue: (plan) => plan.bestFor },
    { label: 'AI Render Limit', getValue: (plan) => plan.renderLimitLabel },
    { label: 'Free 3D Views', getValue: (plan) => plan.threeDViewsLabel },
    { label: 'Interior Styles Access', getValue: (plan) => plan.styleLimitLabel },
    { label: 'Furniture Sourcing Assistance', getValue: (plan) => <BooleanValue value={plan.furnitureSourcing} /> },
    { label: 'Human Design Help', getValue: (plan) => <BooleanValue value={plan.humanDesignHelp} /> },
    { label: 'Ideal Property Type', getValue: (plan) => plan.idealPropertyType },
    { label: 'Package Validity', getValue: (plan) => plan.packageValidityLabel },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {!compact && (
        <div className="border-b border-slate-200 px-5 py-5 text-center">
          <div className="text-xs font-bold uppercase tracking-[0.35em] text-[#C47A00]">
            Choose the perfect plan for your space
          </div>
          <div className="mt-2 text-3xl font-black text-slate-950">
            Simple Plans. Stunning Spaces.
          </div>
          <div className="mt-2 text-sm text-slate-500">
            AI-powered renders, 3D views and expert design support.
          </div>
        </div>
      )}

      <div className={`grid ${compact ? 'lg:grid-cols-3' : 'lg:grid-cols-[1.05fr_repeat(3,1fr)]'}`}>
        {!compact && (
          <div className="hidden border-r border-slate-200 bg-slate-50 lg:block">
            <div className="flex h-[196px] items-end px-5 pb-7 text-lg font-black uppercase tracking-wide text-slate-950">
              Features
            </div>
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex min-h-[54px] items-center border-t border-slate-200 px-5 text-sm font-medium text-slate-700"
              >
                {row.label}
              </div>
            ))}
            <div className="h-[132px] border-t border-slate-200" />
          </div>
        )}

        {plans.map((plan) => {
          const isCurrent = entitlement?.active && entitlement.planCode === plan.code;
          const isLoading = checkoutLoading === plan.code;
          const colors = PLAN_COLORS[plan.code] || PLAN_COLORS.essential;
          const isSignature = plan.code === 'signature';

          return (
            <div
              key={plan.code}
              className={`relative border-slate-200 ${compact ? 'border-b lg:border-b-0 lg:border-r last:border-r-0' : 'border-b lg:border-b-0 lg:border-r last:border-r-0'} ${isSignature ? 'bg-[#FFF9EF]' : 'bg-white'}`}
            >
              {plan.badge && (
                <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 rounded-md bg-[#D58B00] px-5 py-2 text-xs font-black uppercase tracking-wide text-white shadow-sm">
                  <span className="inline-flex items-center gap-1">
                    <BiStar size={14} />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className={`flex flex-col items-center justify-end px-5 pb-6 pt-7 text-center ${compact ? 'min-h-[172px]' : 'min-h-[196px]'}`}>
                <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${colors.soft}`}>
                  <span className="text-2xl font-black" style={{ color: colors.accent }}>
                    {plan.name.charAt(0)}
                  </span>
                </div>
                <div className="text-2xl font-black uppercase tracking-wide" style={{ color: colors.accent }}>
                  {plan.name}
                </div>
                <div className="mt-1 min-h-[40px] text-sm text-slate-600">
                  {plan.tagline}
                </div>
                {isCurrent && (
                  <div className="mt-3 rounded-full bg-[#142725] px-3 py-1 text-xs font-semibold text-white">
                    Active
                  </div>
                )}
              </div>

              <div className={compact ? '' : 'lg:hidden'}>
                {rows.map((row) => (
                  <div
                    key={row.label}
                    className="grid min-h-[54px] grid-cols-[1fr_1.2fr] items-center gap-3 border-t border-slate-200 px-5 py-3 text-sm"
                  >
                    <div className="font-semibold text-slate-500">{row.label}</div>
                    <div className="text-right font-medium text-slate-900">{row.getValue(plan)}</div>
                  </div>
                ))}
              </div>

              <div className={compact ? 'hidden' : 'hidden lg:block'}>
                {rows.map((row) => (
                  <div
                    key={row.label}
                    className="flex min-h-[54px] items-center justify-center border-t border-slate-200 px-4 text-center text-sm font-medium text-slate-900"
                  >
                    {row.getValue(plan)}
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 px-5 py-5 text-center">
                <div className="text-lg font-bold text-slate-400 line-through">
                  {formatPrice(plan.originalPrice)}
                </div>
                <div className="text-4xl font-black" style={{ color: colors.accent }}>
                  {formatPrice(plan.price)}
                </div>
                <button
                  type="button"
                  onClick={() => onSelectPlan(plan.code)}
                  disabled={Boolean(checkoutLoading)}
                  className={`mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-md border px-4 text-sm font-black uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${colors.button}`}
                >
                  {isLoading && <BiLoaderAlt className="animate-spin" size={18} />}
                  {isCurrent ? 'Renew or Replace' : `Choose ${plan.name}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlanCards;
