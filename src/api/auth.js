import { apiRequest } from './client';

export const authApi = {
  login: (data) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  register: (data) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () => apiRequest('/auth/logout', { method: 'POST' }),

  verifyEmail: (token) =>
    apiRequest(`/auth/verify-email?token=${encodeURIComponent(token)}`, {
      method: 'POST',
    }),

  forgotPassword: (email) =>
    apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token, password) =>
    apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),

  me: () => apiRequest('/auth/me'),
};
