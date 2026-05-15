// const BASE_URL = 'https://alhady-five.vercel.app';
const BASE_URL = 'http://localhost:5000';
const API_URL = `${BASE_URL}/api`;

export function getImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path}`;
}


export function getToken() {
  const token = localStorage.getItem('alhady_admin_token');
  if (!token || token === 'undefined' || token === 'null') return null;
  return token;
}

export async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (data.success && data.data && data.data.token) {
    localStorage.setItem('alhady_admin_token', data.data.token);
  }
  return data;
}

export function logout() {
  localStorage.removeItem('alhady_admin_token');
  window.location.reload();
}

async function fetchWithAuth(url, options = {}) {
  const token = getToken();
  const headers = { ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${url}`, { ...options, headers });

  if (response.status === 401) {
    logout();
    throw new Error('Unauthorized');
  }

  return response.json();
}

export const api = {
  get: (url) => fetchWithAuth(url, { method: 'GET' }),

  post: (url, body) => fetchWithAuth(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }),

  put: (url, body) => fetchWithAuth(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }),

  patch: (url, body) => fetchWithAuth(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }),

  delete: (url) => fetchWithAuth(url, { method: 'DELETE' }),

  // Image Upload (returns WebP URL from the backend)
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    // Note: fetch handles Content-Type automatically for FormData
    return fetchWithAuth('/upload', {
      method: 'POST',
      body: formData
    });
  }
};
