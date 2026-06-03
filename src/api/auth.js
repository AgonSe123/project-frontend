import { apiRequest } from './client';

export const authApi = {
  login: (data) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  refresh: (refreshToken) =>
    apiRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    }),

  me: () => apiRequest('/auth/me'),
};
