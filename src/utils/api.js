import axios from 'axios';

const BASE_URL = 'https://alhady-five.vercel.app';
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

// Cache for API responses
const apiCache = new Map();
const pendingRequests = new Map();

/**
 * Enhanced GET method with built-in caching
 * @param {string} url - The endpoint URL
 * @param {object} config - Axios config + custom cache options
 * @param {boolean} config.useCache - Whether to use cache (default: true)
 * @param {boolean} config.forceRefresh - Whether to bypass cache and fetch fresh data
 * @returns {Promise} - Resolves with the API response
 */
api.getWithCache = async (url, config = {}) => {
  const { useCache = true, forceRefresh = false, ...axiosConfig } = config;

  // Only cache GET requests
  if (!useCache) {
    return api.get(url, axiosConfig);
  }

  if (!forceRefresh) {
    // If we have a cached response, return it
    if (apiCache.has(url)) {
      return apiCache.get(url);
    }

    // If there's already a request in flight for this URL, return the pending promise
    if (pendingRequests.has(url)) {
      return pendingRequests.get(url);
    }
  }

  // Create new request promise
  const requestPromise = api.get(url, axiosConfig)
    .then((response) => {
      // Store successful response in cache
      apiCache.set(url, response);
      pendingRequests.delete(url);
      return response;
    })
    .catch((error) => {
      // Remove from pending on error so it can be retried
      pendingRequests.delete(url);
      throw error;
    });

  // Track the pending request
  pendingRequests.set(url, requestPromise);
  return requestPromise;
};

/**
 * Clear the API cache
 * @param {string} url - Optional specific URL to clear. If omitted, clears entire cache.
 */
api.clearCache = (url) => {
  if (url) {
    apiCache.delete(url);
  } else {
    apiCache.clear();
  }
};

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
