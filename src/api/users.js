import { apiRequest } from './client';

/** Admin user lookups — registration uses POST /auth/signup instead. */
export const usersApi = {
  getById: (userId) => apiRequest(`/users/${userId}`),

  delete: (userId) =>
    apiRequest(`/users/${userId}`, { method: 'DELETE' }),
};
