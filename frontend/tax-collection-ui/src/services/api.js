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
  baseURL: process.env.REACT_APP_API_URL ||  'https://local-market-tax-system-7fuw.onrender.com',
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

export default api;
