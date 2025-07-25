import axios from 'axios';

const API_URL = 'https://local-market-tax-system-7fuw.onrender.com/api/';

export const register = async (userData) => {
    return await axios.post(API_URL + 'register/', userData);
};

export const login = async (credentials) => {
    return await axios.post(API_URL + 'login/', credentials);
};

export const storeTokens = (data) => {
    localStorage.setItem('access', data.access);
    localStorage.setItem('refresh', data.refresh);
};

export function getToken() {
  return localStorage.getItem("access");
}
