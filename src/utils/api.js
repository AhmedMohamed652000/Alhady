import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'production' 
  ? window.location.origin 
  : 'http://localhost:5000';
const API_URL = `${BASE_URL}/api`;

const CLOUDINARY_BASE = 'https://res.cloudinary.com/dj6ezvnt0';

export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  // If it's a local image path from the public folder, return as is
  if (path.startsWith('/img/') || path.startsWith('img/')) {
    return path.startsWith('/') ? path : '/' + path;
  }
  // Relative path — serve via Cloudinary
  return `${CLOUDINARY_BASE}${path.startsWith('/') ? path : '/' + path}`;
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('alhady_admin_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('alhady_admin_token');
      // Optional: redirect to login or show session expired message
    }
    return Promise.reject(error);
  }
);

export default api;
