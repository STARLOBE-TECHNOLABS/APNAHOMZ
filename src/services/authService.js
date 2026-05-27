import { normalizeApiAuthUrl } from '../utils/apiUrl';

const API_URL = normalizeApiAuthUrl(import.meta.env.VITE_API_URL);
const TOKEN_KEY = 'fl-token';
const CURRENT_USER_KEY = 'fl-current-user';
const REQUEST_TIMEOUT_MS = 25000;

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Check that the API is reachable.');
    }
    if (error.message === 'Failed to fetch') {
      throw new Error('Cannot reach the API. Confirm VITE_API_URL and upload the latest build.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const authService = {
  login: async (username, password, claimToken) => {
    try {
      const response = await fetchWithTimeout(`${API_URL}/login`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ username, password, claimToken: claimToken || undefined }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));

      return data;
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await fetchWithTimeout(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password,
          phone: userData.phone,
          claimToken: userData.claimToken || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));

      return data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  forgotPassword: async (email) => {
    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send reset link');
      return data;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to reset password');
      return data;
    } catch (error) {
      throw error;
    }
  }
};
