import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProtectedRoute = ({ children, role }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - Current user:', currentUser);
  console.log('ProtectedRoute - Required role:', role);
  console.log('ProtectedRoute - Current path:', location.pathname);

  // Show loading state while checking authentication
  if (loading) {
    return <div className="container text-center my-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3">Verifying authentication...</p>
    </div>;
  }

  // If not authenticated, redirect to login
  if (!currentUser) {
    console.log('ProtectedRoute - Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is specified and user doesn't have that role, redirect to appropriate dashboard
  if (role && currentUser.role !== role) {
    console.log(`ProtectedRoute - User role (${currentUser.role}) doesn't match required role (${role})`);
    
    if (currentUser.role === 'doctor') {
      return <Navigate to="/doctor-dashboard" replace />;
    } else if (currentUser.role === 'patient') {
      return <Navigate to="/patient-dashboard" replace />;
    } else if (currentUser.role === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // If authenticated and has correct role, render the protected component
  console.log('ProtectedRoute - Authentication successful, rendering protected content');
  return children;
};

export default ProtectedRoute;
