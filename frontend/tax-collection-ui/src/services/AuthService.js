// frontend/tax-collection-ui/src/services/AuthService.js
import axios from 'axios';

const API_URL = 'https://local-market-tax-system-7fuw.onrender.com/api/';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Add request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); // Use consistent key
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('🔐 Request config:', config);
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error);
    
    // Handle network errors
    if (!error.response) {
      console.error('❌ Network error - server may be down');
      throw new Error('Network error: Unable to connect to server');
    }
    
    // Handle auth errors
    if (error.response.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export const register = async (userData) => {
  try {
    console.log('📤 Registering user:', userData);
    
    // Use the endpoint that matches your URLs
    const response = await apiClient.post('signup/', userData);
    
    console.log('✅ Registration successful:', response.data);
    return response;
    
  } catch (error) {
    console.error('❌ Registration error:', error);
    
    if (error.response) {
      // Server responded with error
      throw new Error(error.response.data.message || 'Registration failed');
    } else if (error.request) {
      // Network error
      throw new Error('Network error: Unable to connect to server');
    } else {
      // Other error
      throw new Error(error.message || 'Registration failed');
    }
  }
};

export const login = async (credentials) => {
  try {
    console.log('📤 Logging in user:', { username: credentials.username });
    
    const response = await apiClient.post('login/', credentials);
    
    console.log('✅ Login successful:', response.data);
    
    // Store tokens with consistent keys
    if (response.data.access) {
      storeTokens(response.data);
    }
    
    return response;
    
  } catch (error) {
    console.error('❌ Login error:', error);
    
    if (error.response) {
      // Server responded with error
      const message = error.response.data.error || 
                     error.response.data.message || 
                     'Login failed';
      throw new Error(message);
    } else if (error.request) {
      // Network error
      throw new Error('Network error: Unable to connect to server');
    } else {
      // Other error
      throw new Error(error.message || 'Login failed');
    }
  }
};

export const storeTokens = (data) => {
  // Use consistent keys that match AuthContext
  localStorage.setItem('access_token', data.access);  // Changed from 'access'
  localStorage.setItem('refresh_token', data.refresh); // Added for completeness
  localStorage.setItem('username', data.username);
  localStorage.setItem('user_role', data.role);
  
  console.log('💾 Stored tokens and user data');
};

export const getToken = () => {
  return localStorage.getItem('access_token'); // Use consistent key
};

export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('username');
  localStorage.removeItem('user_role');
  console.log('🗑️ Cleared all tokens');
};

// Test connection function
export const testConnection = async () => {
  try {
    console.log('🔍 Testing API connection...');
    const response = await apiClient.get('debug/');
    console.log('✅ API connection test successful:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ API connection test failed:', error);
    return { 
      success: false, 
      error: error.message,
      details: error.response?.data 
    };
  }
};