import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

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
