import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api/auth.js';
import { storage } from '../services/storage.js';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
  const token = storage.getItem('token');
  const savedUser = storage.getItem('user');
  
  if (token && savedUser) {
    try {
      const response = await authService.getMe();
      if (response.success) {
        setUser(response.user);
        storage.setItem('user', response.user);
      } else {
        // Token invalid
        logout();
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      logout(); // Auto-logout on 401
    }
  }
  setLoading(false);
};

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authService.login({ email, password });
      
      if (response.success) {
        setUser(response.user);
        storage.setItem('token', response.token);
        storage.setItem('user', response.user);
        return { success: true };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authService.register(userData);
      
      if (response.success) {
        setUser(response.user);
        storage.setItem('token', response.token);
        storage.setItem('user', response.user);
        return { success: true };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    storage.setItem('user', updatedUser);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

