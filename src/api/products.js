import { apiRequest } from './client';

function asArray(data) {
  return data ?? [];
}

export const productsApi = {
  list: async () => asArray(await apiRequest('/products')),

  getCategories: async () => asArray(await apiRequest('/products/categories')),

  getById: (productId) => apiRequest(`/products/${productId}`),

  save: (product) =>
    apiRequest('/products', {
      method: 'PUT',
      body: JSON.stringify(product),
    }),

  delete: (productId) =>
    apiRequest(`/products/${productId}`, { method: 'DELETE' }),

  savePricing: (productId, pricing) =>
    apiRequest(`/products/${productId}/pricing`, {
      method: 'PUT',
      body: JSON.stringify(pricing),
    }),

  deletePricing: (productId, pricingId) =>
    apiRequest(`/products/${productId}/pricing/${pricingId}`, {
      method: 'DELETE',
    }),
};
