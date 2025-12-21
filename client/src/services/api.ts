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

export const getFullImageUrl = (path: string | undefined | null) => {
  if (!path || typeof path !== 'string' || path.trim() === '') {
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'; // Sleek fallback
  }

  const sPath = path.trim();

  // 1. If it's a Cloudinary or External URL (Fix for the past bug included just in case)
  const cloudinaryMatch = sPath.match(/(https?:\/\/res\.cloudinary\.com\/[^\s]+)/);
  if (cloudinaryMatch) return cloudinaryMatch[0];

  if (sPath.startsWith('http') && !sPath.includes('localhost') && !sPath.includes('127.0.0.1')) {
    return sPath;
  }

  // 2. Local uploads or relative paths
  let cleanPath = sPath.replace(/^https?:\/\/localhost(:\d+)?/, '')
    .replace(/^https?:\/\/127\.0\.0\.1(:\d+)?/, '');

  if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;

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
