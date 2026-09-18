import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const TOKEN_STORAGE_KEY = 'pawlet_admin_jwt';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(TOKEN_STORAGE_KEY) || null;
    }
    return null;
  });

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize API token and verify session
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (token) {
        api.setAuthToken(token);
        try {
          const user = await api.getCurrentAdmin();
          if (mounted) setAdmin(user);
        } catch (err) {
          console.error('Session expired or invalid token:', err);
          if (mounted) {
            sessionStorage.removeItem(TOKEN_STORAGE_KEY);
            setToken(null);
            setAdmin(null);
            api.setAuthToken(null);
          }
        }
      } else {
        api.setAuthToken(null);
      }
      if (mounted) setLoading(false);
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, [token]);

  const login = async (username, password) => {
    const data = await api.loginAdmin(username, password);
    const accessToken = data.access_token;
    sessionStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
    api.setAuthToken(accessToken);
    setToken(accessToken);
    setAdmin({ username: username.trim(), is_authenticated: true });
    return data;
  };

  const logout = () => {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    api.setAuthToken(null);
    setToken(null);
    setAdmin(null);
  };

  const value = {
    token,
    admin,
    isAuthenticated: !!token,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
