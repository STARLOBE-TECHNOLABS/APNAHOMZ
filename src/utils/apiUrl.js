/**
 * Normalize VITE_API_URL for production builds.
 * Common mistake: "apnahomz.vercel.app/api/auth" without https:// → ERR_NAME_NOT_RESOLVED / Failed to fetch.
 */
export function normalizeApiAuthUrl(raw) {
  const fallback = 'http://localhost:5000/api/auth';
  let url = (raw || fallback).trim();
  if (!url) url = fallback;

  // Add protocol if missing (hostname-only env vars)
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url.replace(/^\/+/, '')}`;
  }

  // Remove trailing slash
  url = url.replace(/\/+$/, '');

  return url;
}

/** e.g. auth base → /api/plans or /api/ai */
export function apiPathFromAuthBase(authBaseUrl, segment) {
  const base = normalizeApiAuthUrl(authBaseUrl);
  if (base.endsWith('/api/auth')) {
    return base.replace(/\/api\/auth$/, `/api/${segment}`);
  }
  // Custom path: append segment under /api
  return `${base.replace(/\/auth$/, '')}/${segment}`.replace(/\/api\/auth/, `/api/${segment}`);
}
