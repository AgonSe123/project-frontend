import { apiRequest } from './client';

export const usersApi = {
  getById: (userId) => apiRequest(`/users/${userId}`),

  save: (user) =>
    apiRequest('/users', {
      method: 'PUT',
      body: JSON.stringify(user),
    }),

  delete: (userId) =>
    apiRequest(`/users/${userId}`, { method: 'DELETE' }),
};
