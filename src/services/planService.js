import { authService } from './authService';
import { apiPathFromAuthBase } from '../utils/apiUrl';

const API_URL = apiPathFromAuthBase(import.meta.env.VITE_API_URL, 'plans');
const TOKEN_KEY = 'fl-token';

const getAuthHeaders = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

async function handlePlanResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    authService.logout();
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  if (response.status === 403 && data.code === 'SUBSCRIPTION_REQUIRED') {
    throw Object.assign(
      new Error(data.message || 'An active subscription is required.'),
      { code: 'SUBSCRIPTION_REQUIRED' }
    );
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data;
}

export const planService = {
  getAllPlans: async () => {
    const response = await fetch(API_URL, {
      headers: getAuthHeaders()
    });
    return handlePlanResponse(response);
  },

  getPlan: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: getAuthHeaders()
    });

    if (response.status === 404) {
      await response.json().catch(() => ({}));
      return null;
    }

    try {
      return await handlePlanResponse(response);
    } catch (e) {
      if (e.code === 'SUBSCRIPTION_REQUIRED') throw e;
      throw e;
    }
  },

  createPlan: async (planData) => {
    const payload = {
      id: planData.id,
      name: planData.name,
      data: planData
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    return handlePlanResponse(response);
  },

  updatePlan: async (id, planData) => {
    const payload = {
      name: planData.name,
      data: planData
    };

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    return handlePlanResponse(response);
  },

  deletePlan: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    return handlePlanResponse(response);
  }
};
