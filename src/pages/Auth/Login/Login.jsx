import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserMd, FaUser, FaUserCog, FaSignInAlt } from 'react-icons/fa';
import AnimatedButton from '../../../components/Buttons/AnimatedButton.jsx'
import './Login.css';
import { useAuth } from '../../../context/AuthContext';

const Login = () => {
  const [role, setRole] = useState('patient');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await login(formData.email, formData.password);
      if (!result) {
        setError('Login failed. Please check your credentials.');
      }
      
      // Store the token
      localStorage.setItem('token', token);
      
      // Store the user data
      localStorage.setItem('user', JSON.stringify(user));
      
       // Use the login function from AuthContext
       login(user, token);
      
       // Navigate to dashboard based on role
       if (role === 'patient') {
         navigate('/patient-dashboard');
       } else if (role === 'doctor') {
         navigate('/doctor-dashboard');
       } else if (role === 'admin') {
         navigate('/admin-dashboard');
       }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid credentials');
    }
  };

  const roles = [
    { id: 'patient', icon: FaUser, label: 'Patient' },
    { id: 'doctor', icon: FaUserMd, label: 'Doctor' },
    { id: 'admin', icon: FaUserCog, label: 'Admin' }
  ];

  return (
    <div className="container-fluid login-container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-6 col-lg-4">
          <motion.div 
            className="card login-card shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="card-body p-4">
              <h2 className="text-center mb-2">Welcome Back</h2>
              <p className="text-center text-muted mb-4">Login to access your dashboard</p>

              <div className="role-selector d-flex justify-content-around mb-4">
                {roles.map(({ id, icon: Icon, label }) => (
                  <motion.div
                    key={id}
                    className={`role-card ${role === id ? 'active' : ''}`}
                    onClick={() => setRole(id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="role-icon mb-2" />
                    <span className="d-block">{label}</span>
                  </motion.div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="login-form">
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                
                <div className="form-group mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email Address"
                    autoComplete="username"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="form-group mb-4">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                <AnimatedButton
                  type="submit"
                  variant="primary"
                  fullWidth
                  icon={<FaSignInAlt />}
                >
                  Sign In
                </AnimatedButton>
              </form>

              <div className="text-center mt-3">
                <p className="mb-2">Don't have an account? <Link to="/register">Register here</Link></p>
                <Link to="/forgot-password" className="text-muted">Forgot Password?</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login; 