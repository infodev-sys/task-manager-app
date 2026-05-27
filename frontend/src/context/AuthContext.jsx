import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_SUCCESS':
      return { ...state, user: action.payload.user, token: action.payload.token, isAuthenticated: true, loading: false };
    case 'AUTH_FAIL':
      return { ...state, user: null, token: null, isAuthenticated: false, loading: false };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    case 'LOADING_DONE':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on app start
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        dispatch({ type: 'LOADING_DONE' });
        return;
      }
      try {
        const { data } = await authAPI.getMe();
        dispatch({ type: 'AUTH_SUCCESS', payload: { user: data.user, token } });
      } catch {
        localStorage.removeItem('token');
        dispatch({ type: 'AUTH_FAIL' });
      }
    };
    loadUser();
  }, []);

  const register = useCallback(async (formData) => {
    const { data } = await authAPI.register(formData);
    localStorage.setItem('token', data.token);
    dispatch({ type: 'AUTH_SUCCESS', payload: { user: data.user, token: data.token } });
    toast.success('Welcome to TaskFlow! 🎉');
  }, []);

  const login = useCallback(async (formData) => {
    const { data } = await authAPI.login(formData);
    localStorage.setItem('token', data.token);
    dispatch({ type: 'AUTH_SUCCESS', payload: { user: data.user, token: data.token } });
    toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    dispatch({ type: 'AUTH_FAIL' });
    toast.success('Logged out successfully.');
  }, []);

  const updateProfile = useCallback(async (formData) => {
    const { data } = await authAPI.updateProfile(formData);
    dispatch({ type: 'UPDATE_USER', payload: data.user });
    toast.success('Profile updated!');
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
