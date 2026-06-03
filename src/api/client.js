const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

export const ACCESS_TOKEN_KEY = 'auth_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

const PUBLIC_AUTH_PATHS = ['/auth/login', '/auth/signup', '/auth/refresh'];

function isPublicAuthPath(path) {
  return PUBLIC_AUTH_PATHS.some((prefix) => path.startsWith(prefix));
}

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
    ...(options.headers ?? {}),
  };

  const hasBody = options.body != null && options.body !== '';

  if (hasBody && !headers['Content-Type'] && !headers['content-type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token && !isPublicAuthPath(path)) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (
    response.status === 401 &&
    !retried &&
    !isPublicAuthPath(path)
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
      if (body && typeof body === 'object' && body.message) {
        message = body.message;
      }
    } catch {
      if (response.status === 400) {
        message = 'Bad request. The server could not process this request.';
      }
    }
    if (response.status === 401 && path.startsWith('/auth/login')) {
      message = 'Invalid email or password.';
    }
    throw new ApiClientError(message, response.status);
  }

  if (response.status === 204) {
    return undefined;
  }

  return parseJsonBody(response);
}
