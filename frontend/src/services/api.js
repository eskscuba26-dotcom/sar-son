import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Production API
export const productionApi = {
  getAll: () => axios.get(`${API}/production`),
  create: (data) => axios.post(`${API}/production`, data),
  update: (id, data) => axios.put(`${API}/production/${id}`, data),
  delete: (id) => axios.delete(`${API}/production/${id}`),
};

// Stock API
export const stockApi = {
  getAll: () => axios.get(`${API}/stock`),
  getStats: () => axios.get(`${API}/stock/stats`),
};

// Cut Product API
export const cutProductApi = {
  getAll: () => axios.get(`${API}/cut-products`),
  create: (data) => axios.post(`${API}/cut-products`, data),
  update: (id, data) => axios.put(`${API}/cut-products/${id}`, data),
  delete: (id) => axios.delete(`${API}/cut-products/${id}`),
};

// Shipment API
export const shipmentApi = {
  getAll: () => axios.get(`${API}/shipments`),
  create: (data) => axios.post(`${API}/shipments`, data),
  update: (id, data) => axios.put(`${API}/shipments/${id}`, data),
  delete: (id) => axios.delete(`${API}/shipments/${id}`),
};

// Material API
export const materialApi = {
  getAll: () => axios.get(`${API}/materials`),
  create: (data) => axios.post(`${API}/materials`, data),
  update: (id, data) => axios.put(`${API}/materials/${id}`, data),
};

// User API
export const userApi = {
  getAll: () => axios.get(`${API}/users`),
  create: (data) => axios.post(`${API}/users`, data),
  update: (id, data) => axios.put(`${API}/users/${id}`, data),
  delete: (id) => axios.delete(`${API}/users/${id}`),
};

// Exchange Rate API
export const exchangeRateApi = {
  get: () => axios.get(`${API}/exchange-rates`),
  update: (data) => axios.put(`${API}/exchange-rates`, data),
};

// Default export with all APIs
export const api = {
  production: productionApi,
  stock: stockApi,
  cutProduct: cutProductApi,
  shipment: shipmentApi,
  material: materialApi,
  user: userApi,
  exchangeRate: exchangeRateApi,
};