import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';

const STORAGE_KEY = 'lethem_auth_session';
const AuthContext = createContext(null);

function readSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session?.access_token || !session?.expires_at) return null;
    if (Number(session.expires_at) <= Date.now() + 30000) return null;
    return session;
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const syncSession = useCallback(() => {
    setIsLoadingAuth(true);
    try {
      const session = readSession();
      setUser(session?.user || null);
      setIsAuthenticated(Boolean(session?.access_token));
      setAuthError(null);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      setAuthError(error?.message ? { message: error.message } : null);
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    syncSession();
  }, [syncSession]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY || event.key === null) {
        syncSession();
      }
    };
    const handlePopState = () => {
      syncSession();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [syncSession]);

  const checkUserAuth = useCallback(() => {
    if (!authChecked) {
      syncSession();
    }
  }, [authChecked, syncSession]);

  const value = useMemo(() => ({
    user,
    isAuthenticated,
    isLoading: isLoadingAuth,
    isLoadingAuth,
    authError,
    authChecked,
    checkUserAuth,
  }), [user, isAuthenticated, isLoadingAuth, authError, authChecked, checkUserAuth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};