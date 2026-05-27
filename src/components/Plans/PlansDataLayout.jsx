import { Outlet } from 'react-router-dom';
import usePlans from '@/hooks/usePlans';

/** Provides plan list context to All / Favorite / Trash only (not Billing). */
export default function PlansDataLayout() {
  const value = usePlans();
  return <Outlet context={value} />;
}
