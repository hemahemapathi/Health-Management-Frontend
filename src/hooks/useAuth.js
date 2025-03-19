import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setCurrentUser(null);
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
          setCurrentUser(null);
        }
      } catch (err) {
        console.error('Auth verification error:', err);
        localStorage.removeItem('token');
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
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
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await axios.post('https://health-management-backend.onrender.com/api/auth/register', userData);
      
      if (response.data.success) {
        // Optionally auto-login after registration
        // localStorage.setItem('token', response.data.token);
        // setCurrentUser(response.data.user);
        return response.data;
      } else {
        setError(response.data.message || 'Registration failed');
        return null;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/login');
  }, [navigate]);

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return null;
      }
      
      const response = await axios.put('https://health-management-backend.onrender.com/api/users/profile', userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setCurrentUser(prev => ({ ...prev, ...response.data.user }));
        return response.data;
      } else {
        setError(response.data.message || 'Profile update failed');
        return null;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Profile update failed. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Reset password request
  const forgotPassword = async (email) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await axios.post('https://health-management-backend.onrender.com/api/auth/forgot-password', { email });
      
      if (response.data.success) {
        return response.data;
      } else {
        setError(response.data.message || 'Password reset request failed');
        return null;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset request failed. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Reset password with token
  const resetPassword = async (token, newPassword) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await axios.post('https://health-management-backend.onrender.com/api/auth/reset-password', { 
        token, 
        password: newPassword 
      });
      
      if (response.data.success) {
        return response.data;
      } else {
        setError(response.data.message || 'Password reset failed');
        return null;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword,
    setError
  };
};

export default useAuth;
