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

  // 1. If the path CONTAINS a full cloudinary/external URL anywhere (fix for the localhost prefix bug)
  const cloudinaryMatch = sPath.match(/https?:\/\/[^/]*cloudinary\.com\/[^\s]*/);
  if (cloudinaryMatch) return cloudinaryMatch[0];

  const externalMatch = sPath.match(/https?:\/\/[\w.-]+(?:\.[\w.-]+)+[/\w .-]*\/?/);
  if (externalMatch && !externalMatch[0].includes('localhost') && !externalMatch[0].includes('127.0.0.1')) {
    return externalMatch[0];
  }

  // 2. Clear out local prefixes
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
