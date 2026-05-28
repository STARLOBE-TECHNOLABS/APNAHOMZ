import { Navigate } from 'react-router-dom';

/** /plans always opens the authenticated dashboard first. */
export default function PlansIndexRedirect() {
  return <Navigate to="/plans/all" replace />;
}
