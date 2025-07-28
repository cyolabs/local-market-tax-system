import axios from 'axios';
import { getToken } from "./AuthService";

// Single configuration for API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://local-market-tax-system-7fuw.onrender.com';

console.log('API Base URL:', API_BASE_URL);

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = "X-CSRFToken";

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000, // Increased timeout for better reliability
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use((config) => { 
  const token = localStorage.getItem('access_token') || getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', config.method?.toUpperCase(), config.url);
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.config?.url, error.message);
    if (error.response?.status === 401) {
      console.warn('Unauthorized - token may be expired');
      // Handle token refresh or logout
    }
    return Promise.reject(error);
  }
);

// Helper functions
const getAuthToken = () => {
  return localStorage.getItem('access_token') || getToken();
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || data.error || data.detail || 'Something went wrong');
  }
  
  return data;
};

// =============================================================================
// TAX HISTORY API - Fixed and improved
// =============================================================================
export const getTaxHistory = async (filters = {}) => {
  try {
    console.log('getTaxHistory called with filters:', filters);
    
    const queryParams = new URLSearchParams();
    
    // Add filters if provided
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.start_date) queryParams.append('start_date', filters.start_date);
    if (filters.end_date) queryParams.append('end_date', filters.end_date);
    
    const queryString = queryParams.toString();
    const endpoint = `/tax-history/${queryString ? '?' + queryString : ''}`;
    
    console.log('Fetching tax history from:', `${API_BASE_URL}/api${endpoint}`);
    
    // Try using axios first (more reliable)
    try {
      const response = await api.get(`/tax-history/${queryString ? '?' + queryString : ''}`);
      console.log('Tax history axios response:', response.data);
      
      return {
        success: true,
        data: response.data.results || response.data.data || response.data || [],
        count: response.data.count || 0
      };
    } catch (axiosError) {
      console.warn('Axios failed, trying fetch:', axiosError.message);
      
      // Fallback to fetch
      const url = `${API_BASE_URL}/api/tax-history/${queryString ? '?' + queryString : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await handleResponse(response);
      return {
        success: true,
        data: data.results || data.data || data || [],
        count: data.count || 0
      };
    }
  } catch (error) {
    console.error('Tax history fetch error:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch tax history',
      data: []
    };
  }
};

// =============================================================================
// FEEDBACK API
// =============================================================================
export const submitFeedback = async (subject, message) => {
  try {
    console.log('Submitting feedback:', { subject, message });
    
    // Try axios first
    try {
      const response = await api.post('/feedback/', { subject, message });
      return {
        success: true,
        message: response.data.message || 'Feedback submitted successfully'
      };
    } catch (axiosError) {
      console.warn('Axios feedback failed, trying fetch:', axiosError.message);
      
      // Fallback to fetch
      const response = await fetch(`${API_BASE_URL}/api/feedback/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ subject, message }),
      });

      const data = await handleResponse(response);
      return {
        success: true,
        message: data.message || 'Feedback submitted successfully'
      };
    }
  } catch (error) {
    console.error("Feedback submit error:", error);
    return { 
      success: false, 
      message: error.response?.data?.message || error.message || "Error submitting feedback" 
    };
  }
};

// =============================================================================
// M-PESA PAYMENT APIs
// =============================================================================
export const createMpesaPayment = async (transactionData) => {
  try {
    console.log('Creating M-Pesa payment:', transactionData);
    
    const response = await api.post('/create-mpesa-payment/', transactionData);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Create M-Pesa payment error:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to create payment transaction'
    };
  }
};

// =============================================================================
// USER PROFILE APIs
// =============================================================================
export const getUserProfile = async () => {
  try {
    const response = await api.get('/profile/');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Get user profile error:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch user profile'
    };
  }
};

// =============================================================================
// AUTHENTICATION APIs
// =============================================================================
export const registerUser = (userData) => api.post('/register/', userData);
export const loginUser = (credentials) => api.post('/login/', credentials);
export const getProtectedData = () => api.get('/protected-route/');

export const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) {
      throw new Error('No refresh token available');
    }

    const response = await api.post('/token/refresh/', { refresh });
    
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
    }
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    logoutUser();
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Token refresh failed'
    };
  }
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================
export const logoutUser = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_role');
  localStorage.removeItem('username');
  window.location.href = '/login';
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};

export const getUserRole = () => {
  return localStorage.getItem('user_role');
};

export const getUsername = () => {
  return localStorage.getItem('username');
};

// =============================================================================
// API HEALTH CHECK - for debugging
// =============================================================================
export const testApiConnectivity = async () => {
  console.log('Testing API connectivity...');
  console.log('Base URL:', API_BASE_URL);
  console.log('Full API URL:', `${API_BASE_URL}/api`);
  
  try {
    // Test basic connectivity - try multiple endpoints
    const endpoints = [
      '/health/',
      '/tax-history/',
      '/'
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Testing endpoint: ${endpoint}`);
        const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
          method: 'GET',
          headers: getAuthHeaders(),
        });
        
        console.log(`Endpoint ${endpoint} - Status:`, response.status);
        
        if (response.ok || response.status === 401) { // 401 means endpoint exists but needs auth
          return { 
            success: true, 
            message: `API is reachable via ${endpoint}`,
            endpoint: endpoint,
            status: response.status
          };
        }
      } catch (endpointError) {
        console.log(`Endpoint ${endpoint} failed:`, endpointError.message);
        continue;
      }
    }
    
    throw new Error('All endpoints failed');
  } catch (error) {
    console.error('API connectivity test failed:', error);
    return { 
      success: false, 
      message: `API connectivity failed: ${error.message}`,
      url: `${API_BASE_URL}/api`
    };
  }
};

export default api;