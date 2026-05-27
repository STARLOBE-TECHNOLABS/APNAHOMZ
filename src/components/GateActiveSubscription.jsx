import { Navigate, useLocation } from 'react-router-dom';
import { useBilling } from '@/hooks/useBilling';

/** Same rules as RequireActivePlan but for standalone routes (editor / viewer). */
export default function GateActiveSubscription({ children }) {
  const location = useLocation();
  const { entitlement, loading, error } = useBilling({ autoLoad: true });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">
        Checking your subscription…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </div>
      </div>
    );
  }

  if (!entitlement?.active) {
    return (
      <Navigate
        to="/plans/billing"
        replace
        state={{ from: location.pathname, subscriptionRequired: true }}
      />
    );
  }

  return children;
}
