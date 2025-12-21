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
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'; // Default fallback
  }

  const sPath = path.trim();

  // If it's already a full external URL (like Cloudinary), return it as is
  if (sPath.startsWith('http') && !sPath.includes('localhost') && !sPath.includes('127.0.0.1')) {
    return sPath;
  }

  // Clean up legacy paths that might have local URLs hardcoded from previous bugs
  let cleanPath = sPath.replace(/^https?:\/\/localhost(:\d+)?/, '')
    .replace(/^https?:\/\/127\.0\.0\.1(:\d+)?/, '');

  // Ensure it starts with / and doesn't have duplicate /api
  if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
  cleanPath = cleanPath.replace(/^\/api\//, '/');

  const base = getBaseURL();
  let finalUrl = `${base}${cleanPath}`.replace(/([^:]\/)\/+/g, "$1"); // Resolve double slashes except after protocol

  // Final safety: If the URL ended up containing another http protocol (nested URL bug), extract the correct one
  if (finalUrl.includes('http', 8)) { // Search after the first 'http://'
    const nestedMatch = finalUrl.match(/https?:\/\/[^/]+\.cloudinary\.com\/.*/);
    if (nestedMatch) return nestedMatch[0];
  }

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
