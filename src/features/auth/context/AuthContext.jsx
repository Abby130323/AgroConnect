import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService.js';
import { saveSession, getSession, clearSession } from '../utils/sessionStorage.js';
import { hasPermission } from '../utils/permissions.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehidratación de sesión al cargar la aplicación
  useEffect(() => {
    const initSession = async () => {
      try {
        const stored = getSession();
        if (stored && stored.id) {
          // Revalidar y refrescar desde MockAPI de forma asíncrona
          try {
            const freshUser = await authService.getUserById(stored.id);
            if (freshUser && freshUser.active) {
              setUser(freshUser);
              saveSession(freshUser);
            } else {
              clearSession();
              setUser(null);
            }
          } catch {
            // Si MockAPI falla temporalmente, mantenemos la sesión cacheada
            setUser(stored);
          }
        }
      } catch (err) {
        console.error('Error al inicializar sesión:', err);
        clearSession();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initSession();
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const authenticatedUser = await authService.login(email, password);
      setUser(authenticatedUser);
      saveSession(authenticatedUser);
      return authenticatedUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const checkPermission = useCallback(
    (permission) => {
      return hasPermission(user, permission);
    },
    [user]
  );

  const value = {
    user,
    isAuthenticated: Boolean(user && user.active),
    isLoading,
    login,
    logout,
    checkPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
