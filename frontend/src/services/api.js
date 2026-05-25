import axios from 'axios';

// Main Backend API
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// AI Service API
export const aiApi = axios.create({
  baseURL: process.env.REACT_APP_AI_SERVICE_URL || 'http://localhost:5001/api',
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('eqhire_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If we get a 401, clear auth and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem('eqhire_token');
      sessionStorage.removeItem('eqhire_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
