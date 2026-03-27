import { authService } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth';
const API_URL = API_BASE_URL.replace('/auth', '/ai');
const TOKEN_KEY = 'fl-token';

export const aiService = {
  /**
   * Legacy method - kept for backward compatibility
   */
  generateRealisticRender: async ({ planSummary, style, initialImage }) => {
    const token = localStorage.getItem(TOKEN_KEY);

    const response = await fetch(`${API_URL}/realistic-render`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        planSummary,
        style,
        initialImage
      })
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        authService.logout();
        window.location.href = '/login';
        throw new Error('Session expired');
      }
      throw new Error(data.message || 'Failed to generate realistic render');
    }

    return data;
  },

  /**
   * NEW: Generate interior render with RunPod AI
   * Uses structured prompts for generating photorealistic interiors
   */
  generateInteriorRender: async ({
    colorImage,      // Base 3D render (required)
    depthImage,      // Depth map (optional)
    segmentationImage, // Segmentation map (optional)
    planData,        // Floor plan data for room detection
    style = 'modern', // Interior style
    roomType = 'auto', // Specific room focus or 'auto'
    styleId = 'modern', // Style identifier
    width = 1024,    // Image width
    height = 1024,   // Image height
    steps = 30,      // Inference steps
    guidance = 3.5,  // Guidance scale
    controlnetType = 'depth', // 'depth', 'mlsd', or 'canny'
    selectedArea = null,      // Optional selected room area
    viewType = 'insider',     // 'insider' or 'perspective'
  }) => {
    const token = localStorage.getItem(TOKEN_KEY);

    const response = await fetch(`${API_URL}/enhance-interior`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        colorImage,
        depthImage,
        segmentationImage,
        planData,
        style,
        roomType,
        styleId,
        width,
        height,
        steps,
        guidance,
        controlnetType,
        selectedArea,   // Bug 8 fix: was missing from request body
        viewType,
      })
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        authService.logout();
        window.location.href = '/login';
        throw new Error('Session expired');
      }
      throw new Error(data.message || data.error || 'Failed to generate interior render');
    }

    return data;
  },

  /**
   * NEW: Generate multiple variations of interior
   */
  generateInteriorVariations: async ({
    colorImage,
    planData,
    style = 'modern',
    roomType = 'auto',
    count = 3,
  }) => {
    const token = localStorage.getItem(TOKEN_KEY);

    const response = await fetch(`${API_URL}/enhance-interior-variations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        colorImage,
        planData,
        style,
        roomType,
        count,
      })
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        authService.logout();
        window.location.href = '/login';
        throw new Error('Session expired');
      }
      throw new Error(data.message || data.error || 'Failed to generate variations');
    }

    return data;
  },

  /**
   * NEW: Get available interior styles
   */
  getAvailableStyles: async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    const response = await fetch(`${API_URL}/interior-styles`, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        authService.logout();
        window.location.href = '/login';
        throw new Error('Session expired');
      }
      throw new Error(data.message || 'Failed to fetch styles');
    }

    return data.styles || [];
  },

  /**
   * NEW: Check if AI service is available
   */
  checkAvailability: async () => {
    try {
      const response = await fetch(`${API_URL}/health`, {
        method: 'GET',
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  /**
   * NEW: Generate interior from text-only description (no image required)
   * Uses floor plan structure data
   */
  generateInteriorFromText: async ({
    planData,        // Floor plan data with walls, rooms, dimensions
    style = 'modern',
    roomType = 'auto',
    width = 1024,
    height = 1024,
    steps = 30,
    guidance = 3.5,
  }) => {
    const token = localStorage.getItem(TOKEN_KEY);

    const response = await fetch(`${API_URL}/generate-from-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        planData,
        style,
        roomType,
        width,
        height,
        steps,
        guidance,
      })
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        authService.logout();
        window.location.href = '/login';
        throw new Error('Session expired');
      }
      throw new Error(data.message || data.error || 'Failed to generate interior from text');
    }

    return data;
  },

  /**
   * NEW: Get floor plan structure analysis
   */
  getFloorPlanStructure: async (planData) => {
    const token = localStorage.getItem(TOKEN_KEY);

    const response = await fetch(`${API_URL}/analyze-structure`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ planData })
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        authService.logout();
        window.location.href = '/login';
        throw new Error('Session expired');
      }
      throw new Error(data.message || 'Failed to analyze floor plan structure');
    }

    return data.structure;
  },

  /**
   * NEW: Generate interior renders for ALL rooms at once
   * Returns array of renders - one per room
   */
  generateAllRoomRenders: async ({
    planData,
    style = 'modern',
    width = 1024,
    height = 1024,
    steps = 30,
    guidance = 3.5,
  }) => {
    const token = localStorage.getItem(TOKEN_KEY);

    const response = await fetch(`${API_URL}/generate-all-rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        planData,
        style,
        width,
        height,
        steps,
        guidance,
      })
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        authService.logout();
        window.location.href = '/login';
        throw new Error('Session expired');
      }
      throw new Error(data.message || data.error || 'Failed to generate all room renders');
    }

    return data;
  },
};
