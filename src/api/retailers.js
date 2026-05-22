import { apiRequest } from './client';

export const retailersApi = {
  list: () => apiRequest('/retailers'),

  getById: (retailerId) => apiRequest(`/retailers/${retailerId}`),

  create: (retailer) =>
    apiRequest('/retailers', {
      method: 'POST',
      body: JSON.stringify(retailer),
    }),

  update: (retailerId, retailer) =>
    apiRequest(`/retailers/${retailerId}`, {
      method: 'PUT',
      body: JSON.stringify(retailer),
    }),

  delete: (retailerId) =>
    apiRequest(`/retailers/${retailerId}`, { method: 'DELETE' }),
};
