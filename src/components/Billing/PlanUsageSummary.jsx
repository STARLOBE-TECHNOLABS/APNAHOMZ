import { Link } from 'react-router-dom';
import { BiCheck, BiLock, BiX } from 'react-icons/bi';
import { buildPlanFeatureUsage, styleLabel } from '@/utils/planEntitlements';

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const IncludedBadge = ({ included, yes = 'Included', no = 'Not included' }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
      included ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
    }`}
  >
    {included ? <BiCheck size={14} /> : <BiX size={14} />}
    {included ? yes : no}
  </span>
);

const PlanUsageSummary = ({ entitlement }) => {
  const usage = buildPlanFeatureUsage(entitlement);

  if (!usage) return null;

  const renderPercent =
    usage.renders.limit > 0
      ? Math.min(100, Math.round((usage.renders.used / usage.renders.limit) * 100))
      : 0;

  return (
    <div className="mt-5 border-t border-slate-200 pt-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Your plan includes
        </div>
        <div className="text-xs text-slate-500">Valid until {formatDate(usage.cycleEndAt)}</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* AI renders */}
        <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4">
          <div className="text-sm font-semibold text-slate-700">AI render credits</div>
          <div className="mt-2 flex items-end justify-between gap-3">
            <div className="text-2xl font-black text-[#142725]">
              {usage.renders.used}/{usage.renders.limit}
            </div>
            <div className="text-sm font-medium text-slate-600">
              {usage.renders.remaining} remaining
            </div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-[#B38F4B]"
              style={{ width: `${renderPercent}%` }}
            />
          </div>
        </div>

        {/* 3D view */}
        <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4">
          <div className="text-sm font-semibold text-slate-700">3D view</div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="text-sm text-slate-600">{usage.threeDView.label}</div>
            <IncludedBadge included={usage.threeDView.included} />
          </div>
        </div>

        {/* Interior styles — full width */}
        <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 md:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="text-sm font-semibold text-slate-700">Interior styles access</div>
              <div className="mt-1 text-xs text-slate-500">{usage.styles.label}</div>
            </div>
            <div className="text-sm font-semibold text-[#142725]">
              {usage.styles.allowedCount} of {usage.styles.totalCount} unlocked
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {usage.styles.allowed.map((id) => (
              <span
                key={id}
                className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800"
              >
                <BiCheck size={12} />
                {styleLabel(id)}
              </span>
            ))}
            {usage.styles.locked.map((id) => (
              <span
                key={id}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-400"
              >
                <BiLock size={12} />
                {styleLabel(id)}
              </span>
            ))}
          </div>

          {usage.styles.locked.length > 0 && (
            <p className="mt-3 text-xs text-slate-500">
              Locked styles need a higher plan.{' '}
              <Link to="/plans/billing" className="font-semibold text-[#B38F4B] underline">
                Compare plans on Billing
              </Link>
            </p>
          )}
        </div>

        {/* Extra plan perks */}
        <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4">
          <div className="text-sm font-semibold text-slate-700">Furniture sourcing assistance</div>
          <div className="mt-2">
            <IncludedBadge included={usage.furnitureSourcing.included} />
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4">
          <div className="text-sm font-semibold text-slate-700">Human design help</div>
          <div className="mt-2">
            <IncludedBadge included={usage.humanDesignHelp.included} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanUsageSummary;
