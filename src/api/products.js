import { apiRequest } from './client';

export const productsApi = {
  list: (params) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.category) query.set('category', params.category);
    const qs = query.toString();
    return apiRequest(`/products${qs ? `?${qs}` : ''}`);
  },

  getById: (productId) => apiRequest(`/products/${productId}`),

  getPrices: (productId) => apiRequest(`/products/${productId}/prices`),

  create: (product) =>
    apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    }),

  update: (productId, product) =>
    apiRequest(`/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    }),

  delete: (productId) =>
    apiRequest(`/products/${productId}`, { method: 'DELETE' }),
};
