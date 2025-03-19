import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get('https://health-management-backend.onrender.com/api/auth/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setCurrentUser(response.data.user);
        } else {
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Auth verification error:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post('https://health-management-backend.onrender.com/api/auth/login', { email, password });
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setCurrentUser(response.data.user);
        
        // Redirect based on user role
        if (response.data.user.role === 'doctor') {
          navigate('/doctor-dashboard');
        } else if (response.data.user.role === 'patient') {
          navigate('/patient-dashboard');
        } else if (response.data.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/');
        }
        
        return response.data;
      } else {
        setError(response.data.message || 'Login failed');
        return null;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      return null;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      const response = await axios.post('https://health-management-backend.onrender.com/api/auth/register', userData);
      
      if (response.data.success) {
        return response.data;
      } else {
        setError(response.data.message || 'Registration failed');
        return null;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      return null;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/login');
  };

  // Password reset request
  const requestPasswordReset = async (email) => {
    try {
      setError(null);
      const response = await axios.post('https://health-management-backend.onrender.com/api/auth/forgot-password', { email });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request password reset');
      return null;
    }
  };

  // Reset password with token
  const resetPassword = async (token, newPassword) => {
    try {
      setError(null);
      const response = await axios.post('https://health-management-backend.onrender.com/api/auth/reset-password', { 
        token, 
        password: newPassword 
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
      return null;
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      
      const response = await axios.put('https://health-management-backend.onrender.com/api/users/profile', userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setCurrentUser({...currentUser, ...response.data.user});
        return response.data;
      } else {
        setError(response.data.message || 'Failed to update profile');
        return null;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      return null;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    requestPasswordReset,
    resetPassword,
    updateProfile,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
