import axios from 'axios';
import { store } from '../store/store';
import { logout } from '../store/slices/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getBaseURL = () => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  return url.replace(/\/api\/?$/, '');
};

export const getFullImageUrl = (path: string) => {
  if (!path || typeof path !== 'string') {
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500';
  }

  const sPath = path.trim();

  // 1. Aggressive Cloudinary Extraction: If "https://res.cloudinary.com" exists anywhere in the string,
  // extract everything from that point onwards. This fixes the "http://localhost:5001https://..." bug.
  const cloudinaryIndex = sPath.indexOf('https://res.cloudinary.com');
  if (cloudinaryIndex !== -1) {
    return sPath.substring(cloudinaryIndex);
  }

  // 2. Already a full URL (but not pointing to local dev servers)
  if (sPath.startsWith('http') && !sPath.includes('localhost') && !sPath.includes('127.0.0.1')) {
    return sPath;
  }

  // 3. Clean up local prefixes (if it was an absolute local URL pointing to an image)
  let cleanPath = sPath.replace(/^https?:\/\/localhost(:\d+)?/, '')
    .replace(/^https?:\/\/127\.0\.0\.1(:\d+)?/, '');

  if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
  cleanPath = cleanPath.replace(/^\/api\//, '/');

  const base = getBaseURL();
  return `${base}${cleanPath}`.replace(/([^:]\/)\/+/g, "$1");
};

// Response interceptor to handle 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default api;
