import axios from 'axios';
import { getToken } from "./AuthService"

export const submitFeedback = async (subject, message) => {
  try {
    const res = await axios.post(
      "/api/feedback/",
      { subject, message },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Feedback submit error:", err);
    return { success: false, message: err.response?.data || "Error submitting feedback" };
  }
};



axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = "X-CSRFToken";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://local-market-tax-system-7fuw.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => { 
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized - token may be expired');
      // You can trigger a logout or token refresh here
    }
    return Promise.reject(error);
  }
);

// API functions
export const registerUser = (userData) => api.post('/register/', userData);
export const loginUser = (credentials) => api.post('/login/', credentials);
export const getProtectedData = () => api.get('/protected-route/');

// frontend/tax-collection-ui/src/services/api.js

const API_BASE_URL = 'https://local-market-tax-system-7fuw.onrender.com/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || data.error || 'Something went wrong');
  }
  
  return data;
};

// Tax History API
export const getTaxHistory = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add filters if provided
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.start_date) queryParams.append('start_date', filters.start_date);
    if (filters.end_date) queryParams.append('end_date', filters.end_date);
    
    const url = `${API_BASE_URL}/tax-history/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await handleResponse(response);
    return {
      success: true,
      data: data.data || [],
      count: data.count || 0
    };
  } catch (error) {
    console.error('Tax history fetch error:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch tax history',
      data: []
    };
  }
};

// Submit Feedback API
// export const submitFeedback = async (subject, message) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/feedback/`, {
//       method: 'POST',
//       headers: getAuthHeaders(),
//       body: JSON.stringify({
//         subject,
//         message
//       }),
//     });

//     const data = await handleResponse(response);
//     return {
//       success: true,
//       message: data.message || 'Feedback submitted successfully'
//     };
//   } catch (error) {
//     console.error('Feedback submission error:', error);
//     return {
//       success: false,
//       message: error.message || 'Failed to submit feedback'
//     };
//   }
// };

// Login API
// export const loginUser = async (username, password) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/login/`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         username,
//         password
//       }),
//     });

//     const data = await handleResponse(response);
    
//     // Store tokens in localStorage
//     if (data.access) {
//       localStorage.setItem('access_token', data.access);
//       localStorage.setItem('refresh_token', data.refresh);
//       localStorage.setItem('user_role', data.role);
//       localStorage.setItem('username', data.username);
//     }
    
//     return {
//       success: true,
//       data
//     };
//   } catch (error) {
//     console.error('Login error:', error);
//     return {
//       success: false,
//       message: error.message || 'Login failed'
//     };
//   }
// };

// Register API
// export const registerUser = async (userData) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/signup/`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(userData),
//     });

//     const data = await handleResponse(response);
//     return {
//       success: true,
//       data
//     };
//   } catch (error) {
//     console.error('Registration error:', error);
//     return {
//       success: false,
//       message: error.message || 'Registration failed'
//     };
//   }
// };

// Create M-Pesa Payment Transaction
export const createMpesaPayment = async (transactionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/create-mpesa-payment/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(transactionData),
    });

    const data = await handleResponse(response);
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Create M-Pesa payment error:', error);
    return {
      success: false,
      message: error.message || 'Failed to create payment transaction'
    };
  }
};

// Get User Profile
export const getUserProfile = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await handleResponse(response);
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Get user profile error:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch user profile'
    };
  }
};

// Refresh Token
export const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh
      }),
    });

    const data = await handleResponse(response);
    
    if (data.access) {
      localStorage.setItem('access_token', data.access);
    }
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    // Clear tokens if refresh fails
    logoutUser();
    return {
      success: false,
      message: error.message || 'Token refresh failed'
    };
  }
};

// Logout function
export const logoutUser = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_role');
  localStorage.removeItem('username');
  window.location.href = '/login';
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};

// Get user role
export const getUserRole = () => {
  return localStorage.getItem('user_role');
};

// Get username
export const getUsername = () => {
  return localStorage.getItem('username');
};

export default api;
