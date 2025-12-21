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
  return (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace('/api', '');
};

export const getFullImageUrl = (path: string) => {
  if (!path) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'; // Fallback

  // If it's already a full external URL (like Cloudinary), return it
  if (path.startsWith('http') && !path.includes('localhost')) return path;

  // Clean up legacy paths that might have localhost hardcoded from previous bugs
  const cleanPath = path.replace('http://localhost:5001', '');

  // Return the path with the current backend URL prepended
  return `${getBaseURL()}${cleanPath}`;
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
