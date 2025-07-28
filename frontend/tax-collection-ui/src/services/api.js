


// src/services/api.js - CENTRALIZED API SERVICE

const API_BASE_URL = 'https://local-market-tax-system-7fuw.onrender.com/api/';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add authentication token if available
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log(`📡 API Call: ${endpoint}`, config);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    console.log(`📦 API Response: ${endpoint}`, { status: response.status, data });

    if (!response.ok) {
      throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
    }

    return { success: true, data, status: response.status };
    
  } catch (error) {
    console.error(`❌ API Error: ${endpoint}`, error);
    return { success: false, error: error.message, data: null };
  }
};

// Authentication API
export const authAPI = {
  // Login user
  login: async (credentials) => {
    return await apiCall('login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Register user
  register: async (userData) => {
    return await apiCall('register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Test debug endpoint
  debug: async () => {
    return await apiCall('debug/');
  },

  // Logout (clear local storage)
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    window.location.href = '/login';
  },
};

// Data API
export const dataAPI = {
  // Get tax history
  getTaxHistory: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `tax-history/?${queryParams}` : 'tax-history/';
    return await apiCall(endpoint);
  },

  // Get dashboard data
  getDashboard: async (type = 'vendor') => {
    const endpoint = type === 'admin' ? 'admin-dashboard/' : 'vendor-dashboard/';
    return await apiCall(endpoint);
  },
};

// Utility functions
export const apiUtils = {
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },

  // Get current user info
  getCurrentUser: () => {
    return {
      username: localStorage.getItem('username'),
      role: localStorage.getItem('user_role'),
      id: localStorage.getItem('user_id'),
    };
  },

  // Test API connection
  testConnection: async () => {
    try {
      const result = await authAPI.debug();
      console.log('🔍 API Connection Test:', result);
      return result.success;
    } catch (error) {
      console.error('❌ API Connection Failed:', error);
      return false;
    }
  },
  
};

export const submitFeedback = async (subject, message) => {
  console.log('🔍 submitFeedback called');
  try {
    const response = await fetch(`${API_BASE_URL}/feedback/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        subject,
        message
      }),
    });

    console.log('📨 Feedback response status:', response.status);
    const data = await response.json();
    console.log('📦 Feedback response data:', data);

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Failed to submit feedback');
    }

    return {
      success: true,
      message: data.message || 'Feedback submitted successfully'
    };
  } catch (error) {
    console.error('❌ Feedback submission error:', error);
    return {
      success: false,
      message: error.message || 'Failed to submit feedback'
    };
  }
};

export default { authAPI, dataAPI, apiUtils };