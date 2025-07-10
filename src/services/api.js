
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';


const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Products API
export const productsAPI = {
  getAll: () => api.get('/products'),
  getBySlug: (slug) => api.get(`/products/${slug}`),
  search: (query, sortBy = 'newest') => api.get(`/products/search?q=${query}&sort=${sortBy}`),
  getFeatured: () => api.get('/products/featured'),
  getNew: () => api.get('/products/new'),
  getOnSale: () => api.get('/products/on-sale')
};

// Cart API
export const cartAPI = {
  add: (productId, quantity) => api.post('/cart', { productId, quantity }),
  update: (id, quantity) => api.put(`/cart/${id}`, { quantity }),
  remove: (id) => api.delete(`/cart/${id}`),
  get: () => api.get('/cart')
};

// Orders API
export const ordersAPI = {
  create: (orderData) => api.post('/orders', orderData),
  get: (orderId) => api.get(`/orders/${orderId}`)
};

// Newsletter API
export const newsletterAPI = {
  subscribe: (email) => api.post('/subscribe', { email })
};

// Coupons API
export const couponsAPI = {
  validate: (code) => api.post('/validate-coupon', { code })
};

export default api;
