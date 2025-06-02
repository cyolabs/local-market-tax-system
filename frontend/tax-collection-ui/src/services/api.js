import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: Response interceptor to catch token issues
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

export default api;
