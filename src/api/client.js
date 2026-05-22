const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

export class ApiClientError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
  }
}

function getAuthToken() {
  return localStorage.getItem('auth_token');
}

export async function apiRequest(path, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers ?? {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const body = await response.json();
      message = body.message ?? message;
    } catch {
      /* use status text */
    }
    throw new ApiClientError(message, response.status);
  }

  if (response.status === 204) {
    return undefined;
  }

  return response.json();
}
