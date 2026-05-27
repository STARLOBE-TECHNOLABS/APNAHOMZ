import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { BiLock, BiX } from 'react-icons/bi';
import { getMinimumPlanForStyle, styleLabel } from '@/utils/planEntitlements';

/**
 * Lightweight notice when a style is locked on the user's current plan.
 * Redirects to Billing instead of opening the full checkout modal.
 */
const StyleUpgradeNotice = ({
  isOpen,
  onClose,
  styleId,
  entitlement,
  plans = [],
}) => {
  if (!isOpen || !styleId) return null;

  const currentPlanName = entitlement?.plan?.name || 'your current plan';
  const requiredPlan = getMinimumPlanForStyle(styleId, plans);
  const styleName = styleLabel(styleId);

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <BiLock size={22} />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <BiX size={22} />
          </button>
        </div>

        <h3 className="mt-4 text-xl font-bold text-slate-950">{styleName} style is not on your plan</h3>

        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          You&apos;re on the <span className="font-semibold text-slate-900">{currentPlanName}</span>{' '}
          plan. To use <span className="font-semibold text-slate-900">{styleName}</span> in AI Enhance,
          {requiredPlan ? (
            <>
              {' '}
              upgrade to <span className="font-semibold text-[#142725]">{requiredPlan.name}</span>
              {requiredPlan.code === 'prestige' ? '' : ' or higher'}.
            </>
          ) : (
            ' upgrade to a higher plan.'
          )}
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Keep current styles
          </button>
          <Link
            to="/plans/billing"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-xl bg-[#142725] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1a3332]"
          >
            View plans &amp; upgrade
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default StyleUpgradeNotice;
