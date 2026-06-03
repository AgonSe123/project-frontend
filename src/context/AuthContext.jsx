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
import { usersApi } from '@/api/users';
import bcrypt from 'bcryptjs';

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

async function fetchCurrentUser() {
  try {
    const profile = await authApi.me();
    if (profile) {
      persistUser(profile);
      return profile;
    }
  } catch (err) {
    if (!(err instanceof ApiClientError && err.status === 404)) {
      throw err;
    }
  }

  const email = emailFromAccessToken(getAccessToken());
  const stored = loadStoredUser();
  if (stored?.email === email && stored?.id) {
    return stored;
  }
  return email ? { email, role: 'USER' } : null;
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
      const profile = await fetchCurrentUser();
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
    const res = await authApi.login(data);
    setTokens(res.access_token, res.refresh_token);
    const profile = await fetchCurrentUser();
    setUser(profile);
    return profile;
  }, []);

  const register = useCallback(async ({ email, password }) => {
    const password_hash = bcrypt.hashSync(password, 10);
    await usersApi.save({
      email,
      password_hash,
      is_verified: false,
      role: 'USER',
    });

    return login({ email, password });
  }, [login]);

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
