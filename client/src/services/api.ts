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
  if (!path || typeof path !== 'string') {
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500';
  }

  const sPath = path.trim();

  // 1. Aggressive Extraction: Look for ANY valid web URL (Cloudinary, Unsplash, etc.)
  // This fixes the "http://localhost:5001https://..." type bugs in existing data
  const webUrlMatch = sPath.match(/(https?:\/\/[^\s]+)/);
  if (webUrlMatch) {
    const url = webUrlMatch[0];
    // If it's a real external URL (not localhost), use it directly
    if (!url.includes('localhost') && !url.includes('127.0.0.1')) {
      return url;
    }
  }

  // 2. Local Cleanup: If it's a local path or a broken local URL
  let cleanPath = sPath.replace(/^https?:\/\/localhost(:\d+)?/, '')
    .replace(/^https?:\/\/127\.0\.0\.1(:\d+)?/, '');

  // Ensure it starts with / and clean up common path prefix errors
  if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
  cleanPath = cleanPath.replace(/^\/api\//, '/');
  cleanPath = cleanPath.replace(/^\/uploads\//, '/uploads/'); // Ensure single slash

  const base = getBaseURL();

  // Final URL construction
  const finalUrl = `${base}${cleanPath}`.replace(/([^:]\/)\/+/g, "$1");

  return finalUrl;
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
