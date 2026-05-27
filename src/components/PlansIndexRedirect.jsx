import { Navigate } from 'react-router-dom';
import { useBilling } from '@/hooks/useBilling';

/** /plans → billing (no plan) or all plans (active subscription). */
export default function PlansIndexRedirect() {
  const { entitlement, loading } = useBilling({ autoLoad: true });

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-500">
        Loading…
      </div>
    );
  }

  if (entitlement?.active) {
    return <Navigate to="/plans/all" replace />;
  }
  return <Navigate to="/plans/billing" replace />;
}
