const API_URL = 'http://localhost:5000/api/plans';
const TOKEN_KEY = 'fl-token';

const getAuthHeaders = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const planService = {
  getAllPlans: async () => {
    const response = await fetch(API_URL, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch plans');
    }
    
    return await response.json();
  },

  getPlan: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch plan');
    }
    
    return await response.json();
  },

  createPlan: async (planData) => {
    // Structure payload for backend
    // The backend expects { id, name, data } where data contains the full plan object
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
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create plan');
    }
    
    return await response.json();
  },

  updatePlan: async (id, planData) => {
    // Structure payload for backend
    const payload = {
      name: planData.name,
      data: planData
    };

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update plan');
    }
    
    return await response.json();
  },

  deletePlan: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete plan');
    }
    
    return await response.json();
  }
};
