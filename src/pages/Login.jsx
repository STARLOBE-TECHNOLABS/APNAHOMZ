import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import {
  billingPathWithCheckout,
  getPendingCheckoutPlan,
  parseMarketingCheckout,
  persistMarketingCheckout,
} from '@/utils/marketingCheckout';
import { useEffect, useState } from 'react';
import { BiHide, BiShow } from 'react-icons/bi';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const notify = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const { plan, source } = parseMarketingCheckout(searchParams.toString());
    if (plan || source) {
      persistMarketingCheckout({ plan, source });
    }
  }, [searchParams]);

  const resolveAfterLogin = () => {
    if (searchParams.get('claim')) {
      return '/plans/all';
    }
    const { plan, source, checkout } = parseMarketingCheckout(searchParams.toString());
    const pendingPlan = checkout || plan || getPendingCheckoutPlan();
    if (pendingPlan) {
      return billingPathWithCheckout(pendingPlan, source || undefined);
    }
    return location.state?.from?.pathname || '/plans/all';
  };

  const claimToken = searchParams.get('claim');

  const validateInput = () => {
    if (!username.trim()) {
      notify({ content: 'Username is required', type: 'warning' });
      return false;
    }
    if (!password) {
      notify({ content: 'Password is required', type: 'warning' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;

    setLoading(true);
    try {
      const result = await login(username, password, claimToken || undefined);
      if (result.success) {
        if (claimToken && result.entitlement?.active) {
          notify({ content: 'Purchase linked! Your plan is active.', type: 'success' });
        } else {
          notify({ content: 'Successfully logged in', type: 'success' });
        }
        navigate(resolveAfterLogin(), { replace: true });
      } else {
        notify({ content: result.error || 'Login failed', type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#142725] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/blueprint-grid.png')]" />
        <img
          src="/landing/screen3.png"
          alt="Floor Plan Editor"
          className="relative z-10 max-w-[90%] shadow-2xl rounded-lg transform rotate-2 hover:rotate-0 transition-transform duration-500"
        />
        <div className="absolute bottom-10 text-white text-center z-10 px-8">
          <h2 className="text-3xl font-bold mb-2">Design Your Dream Space</h2>
          <p className="text-blue-100">
            Professional floor planning tools right in your browser.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center lg:text-left">
            <div className="flex justify-center lg:justify-start items-center mb-6">
              <img
                src="/landing/logo_dark.png"
                alt="APNAHOMZ"
                className="h-20 w-auto object-contain"
              />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please sign in to your account
            </p>
          </div>

          <div className="mt-8">
            <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <div className="mt-1">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full rounded-lg border border-gray-300 px-3 py-2 pr-12 shadow-sm placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 transition-colors hover:text-gray-600"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <BiHide size={20} />
                      ) : (
                        <BiShow size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <Link
                      to="/forgot-password"
                      className="font-medium text-black"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-[#142725] hover:bg-[#203f3c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#142725] transition-all transform hover:-translate-y-0.5 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Signing in...
                      </span>
                    ) : (
                      "Sign in"
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      New to APNAHOMZ?
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    to="/register"
                    className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#142725] transition-colors"
                  >
                    Create an account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
