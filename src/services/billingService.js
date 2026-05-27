import { authService } from './authService';
import { apiPathFromAuthBase } from '../utils/apiUrl';

const API_URL = apiPathFromAuthBase(import.meta.env.VITE_API_URL, 'billing');
const TOKEN_KEY = 'fl-token';

const getAuthHeaders = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleAuthError = (response) => {
  if (response.status === 401 || response.status === 403) {
    authService.logout();
    window.location.href = '/login';
    throw new Error('Session expired');
  }
};

async function readJson(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    handleAuthError(response);
    throw new Error(data.message || 'Billing request failed');
  }
  return data;
}

export const billingService = {
  getPlans: async () => {
    const response = await fetch(`${API_URL}/plans`);
    const data = await readJson(response);
    return data.plans || [];
  },

  getMyEntitlement: async () => {
    const response = await fetch(`${API_URL}/me`, {
      headers: getAuthHeaders(),
    });
    const data = await readJson(response);
    return data.entitlement;
  },

  getPaymentHistory: async () => {
    const response = await fetch(`${API_URL}/history`, {
      headers: getAuthHeaders(),
    });
    const data = await readJson(response);
    return data.history || [];
  },

  createOrder: async (planCode) => {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ planCode }),
    });
    return await readJson(response);
  },

  verifyPayment: async (paymentResponse) => {
    const response = await fetch(`${API_URL}/verify`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(paymentResponse),
    });
    const data = await readJson(response);
    return data.entitlement;
  },
};
