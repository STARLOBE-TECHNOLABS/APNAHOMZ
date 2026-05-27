/**
 * Normalize VITE_API_URL for production builds.
 * Common mistake: "apnahomz.vercel.app/api/auth" without https:// → ERR_NAME_NOT_RESOLVED / Failed to fetch.
 *
 * Vite inlines import.meta.env.VITE_API_URL at **build** time only.
 * Env vars on Vercel do not change a static bundle already uploaded to Hostinger — rebuild with .env.production
 * or set VITE_API_URL in the environment that runs `npm run build`.
 */
const PRODUCTION_AUTH_BASE = 'https://api.apnahomz.com/api/auth';

export function normalizeApiAuthUrl(raw) {
  const trimmed = typeof raw === 'string' ? raw.trim() : '';
  const isBrowser = typeof window !== 'undefined';
  const hostname = isBrowser ? window.location.hostname : '';

  // Live frontend on Hostinger but bundle was built without VITE_API_URL → avoid localhost in production
  if (
    import.meta.env.PROD &&
    isBrowser &&
    hostname === 'design.apnahomz.com' &&
    (!trimmed || /localhost|127\.0\.0\.1/i.test(trimmed))
  ) {
    return PRODUCTION_AUTH_BASE;
  }

  const fallback = 'http://localhost:5000/api/auth';
  let url = (trimmed || fallback).trim();
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
