import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useBilling } from '@/hooks/useBilling';

/**
 * Nested under /plans — allows Billing without subscription; blocks All / Editor / Docs until active plan.
 */
export default function RequireActivePlan() {
  const location = useLocation();
  const { entitlement, loading, error } = useBilling({ autoLoad: true });

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-slate-500">
        Checking your subscription…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        {error}{' '}
        <a href="/plans/billing" className="font-semibold underline">
          Open Billing
        </a>
      </div>
    );
  }

  if (!entitlement?.active) {
    return (
      <Navigate
        to="/plans/billing"
        replace
        state={{
          from: location.pathname,
          subscriptionRequired: true,
        }}
      />
    );
  }

  return <Outlet />;
}
