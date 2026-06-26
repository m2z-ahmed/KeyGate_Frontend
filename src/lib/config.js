export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://lethem-backend.onrender.com').replace(/\/+$/, '');
export const proxyEndpoint = (path = '/') => `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
