import { useEffect, useRef } from 'react';
import { BiRefresh } from 'react-icons/bi';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import PlanCards from '../components/Billing/PlanCards';
import PlanUsageSummary from '../components/Billing/PlanUsageSummary';
import { useBilling } from '../hooks/useBilling';
import { useNotification } from '@/context/NotificationContext';
import {
  clearMarketingCheckout,
  getCheckoutSource,
  isValidPlanCode,
  parseMarketingCheckout,
  persistMarketingCheckout,
  resolvePostPaymentPath,
} from '@/utils/marketingCheckout';

const formatPrice = (amount, currency = 'INR') => {
  if (currency === 'INR') {
    return `\u20b9${Number(amount || 0).toLocaleString('en-IN')}`;
  }
  return `${currency} ${Number(amount || 0).toLocaleString('en-IN')}`;
};

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const Billing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const notify = useNotification();
  const subscriptionHint = location.state?.subscriptionRequired;
  const autoCheckoutStarted = useRef(false);

  const {
    plans,
    entitlement,
    history,
    loading,
    checkoutLoading,
    error,
    refresh,
    startCheckout,
  } = useBilling();

  const checkoutPlan = searchParams.get('checkout');
  const checkoutSource = searchParams.get('source') || getCheckoutSource();

  useEffect(() => {
    const { source } = parseMarketingCheckout(searchParams.toString());
    if (source) persistMarketingCheckout({ source });
  }, [searchParams]);

  useEffect(() => {
    if (loading || autoCheckoutStarted.current) return;
    if (!checkoutPlan || !isValidPlanCode(checkoutPlan)) return;
    if (!plans.some((p) => p.code === checkoutPlan)) return;

    autoCheckoutStarted.current = true;

    startCheckout(checkoutPlan)
      .then(() => {
        setSearchParams({}, { replace: true });
        clearMarketingCheckout();
        notify({
          content: 'Payment successful! Your plan is active — start designing.',
          type: 'success',
        });
        navigate(resolvePostPaymentPath(checkoutSource), { replace: true });
      })
      .catch(() => {
        autoCheckoutStarted.current = false;
      });
  }, [
    checkoutPlan,
    checkoutSource,
    loading,
    navigate,
    notify,
    plans,
    setSearchParams,
    startCheckout,
  ]);

  return (
    <div>
      <div className="mt-2 flex items-start justify-between gap-4">
        <div>
          <div className="text-2xl font-semibold text-slate-950">Billing</div>
          <div className="mt-1 text-sm text-slate-500">
            Manage your 30-day AI render package, credits, and payment history.
          </div>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <BiRefresh /> Refresh
        </button>
      </div>

      {subscriptionHint && (
        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Choose a plan below to unlock the 2D editor, 3D view, documentation, and AI features included in your package.
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <div className="text-sm font-semibold uppercase tracking-wide text-slate-400">Current plan</div>
          <div className="mt-1 text-2xl font-black text-slate-950">
            {entitlement?.active ? entitlement.plan?.name : 'No active plan'}
          </div>
          <div className="mt-1 text-sm text-slate-500">
            {entitlement?.active
              ? `Your 30-day package is active until ${formatDate(entitlement.cycleEndAt)}.`
              : 'Buy a package to unlock 2D, 3D, AI rendering, and plan features below.'}
          </div>
        </div>

        {entitlement?.active && <PlanUsageSummary entitlement={entitlement} />}
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="rounded-lg bg-slate-200 px-4 py-3 text-sm text-slate-500">Loading plans...</div>
        ) : (
          <PlanCards
            plans={plans}
            entitlement={entitlement}
            checkoutLoading={checkoutLoading}
            onSelectPlan={startCheckout}
          />
        )}
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="text-lg font-bold text-slate-950">Payment history</div>
          <div className="mt-1 text-sm text-slate-500">Latest Razorpay orders for this account.</div>
        </div>

        {history.length === 0 ? (
          <div className="px-5 py-6 text-sm text-slate-500">No payments yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Plan</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Payment ID</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-5 py-3 font-semibold text-slate-900">{payment.planName}</td>
                    <td className="px-5 py-3 text-slate-700">{formatPrice(payment.amount, payment.currency)}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-bold uppercase ${payment.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {payment.razorpayPaymentId || payment.razorpayOrderId}
                    </td>
                    <td className="px-5 py-3 text-slate-500">{formatDate(payment.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Billing;
