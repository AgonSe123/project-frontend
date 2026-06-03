import { apiRequest } from './client';

function asArray(data) {
  return data ?? [];
}

export const retailersApi = {
  list: async () => asArray(await apiRequest('/retailers')),

  getById: (retailerId) => apiRequest(`/retailers/${retailerId}`),

  save: (retailer) =>
    apiRequest('/retailers', {
      method: 'PUT',
      body: JSON.stringify(retailer),
    }),

  delete: (retailerId) =>
    apiRequest(`/retailers/${retailerId}`, { method: 'DELETE' }),
};
