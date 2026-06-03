import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { authApi } from '@/api/auth';
import {
  ApiClientError,
  clearTokens,
  getAccessToken,
  setTokens,
} from '@/api/client';
import { emailFromAccessToken } from '@/api/jwt';

const AuthContext = createContext(null);

const USER_KEY = 'auth_user';

function persistUser(user) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

function clearSession() {
  clearTokens();
  localStorage.removeItem(USER_KEY);
}

function loadStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function fallbackUser(accessToken, storedUser) {
  const email = emailFromAccessToken(accessToken);
  if (!email) return null;
  if (storedUser?.email === email && storedUser?.id) {
    return storedUser;
  }
  return { email, role: 'USER' };
}

async function fetchCurrentUser(accessToken, { allowFallback = false } = {}) {
  try {
    const profile = await authApi.me();
    if (profile) {
      persistUser(profile);
      return profile;
    }
  } catch (err) {
    if (
      allowFallback &&
      err instanceof ApiClientError &&
      (err.status === 401 || err.status === 404)
    ) {
      return fallbackUser(accessToken, loadStoredUser());
    }
    throw err;
  }

  return allowFallback ? fallbackUser(accessToken, loadStoredUser()) : null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const profile = await fetchCurrentUser(token);
      setUser(profile);
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 401) {
        clearSession();
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (data) => {
    clearSession();
    const res = await authApi.login(data);
    if (!res?.access_token) {
      throw new ApiClientError('Login failed: no access token returned.', 401);
    }
    setTokens(res.access_token, res.refresh_token);
    const profile = await fetchCurrentUser(res.access_token, { allowFallback: true });
    setUser(profile);
    return profile;
  }, []);

  const register = useCallback(async ({ email, password }) => {
    clearSession();
    const created = await authApi.signup({ email, password });
    persistUser(created);
    const res = await authApi.login({ email, password });
    if (!res?.access_token) {
      throw new ApiClientError('Login failed after signup.', 401);
    }
    setTokens(res.access_token, res.refresh_token);
    const profile =
      (await fetchCurrentUser(res.access_token, { allowFallback: true })) ?? created;
    setUser(profile);
    persistUser(profile);
    return profile;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => {
      const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      return {
        user,
        isLoading,
        isAdmin:
          user?.role === 'ADMIN' ||
          (user?.email && adminEmails.includes(user.email)),
        login,
        register,
        logout,
        refreshUser,
      };
    },
    [user, isLoading, login, register, logout, refreshUser],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
