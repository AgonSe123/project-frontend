const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

export const ACCESS_TOKEN_KEY = 'auth_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

export class ApiClientError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
  }
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setTokens(accessToken, refreshToken) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    throw new ApiClientError('Unauthorized.', 401);
  }

  const response = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    throw new ApiClientError('Unauthorized.', response.status);
  }

  const data = await response.json();
  setTokens(data.access_token, data.refresh_token);
  return data.access_token;
}

async function parseJsonBody(response) {
  const text = await response.text();
  if (!text || text === 'null') {
    return null;
  }
  return JSON.parse(text);
}

export async function apiRequest(path, options = {}, retried = false) {
  const token = getAccessToken();
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

  if (
    response.status === 401 &&
    !retried &&
    !path.startsWith('/auth/login') &&
    !path.startsWith('/auth/refresh')
  ) {
    try {
      await refreshAccessToken();
      return apiRequest(path, options, true);
    } catch {
      clearTokens();
    }
  }

  if (!response.ok) {
    let message = response.statusText;
    try {
      const body = await parseJsonBody(response);
      message = body?.message ?? message;
    } catch {
      /* use status text */
    }
    throw new ApiClientError(message, response.status);
  }

  if (response.status === 204) {
    return undefined;
  }

  return parseJsonBody(response);
}
