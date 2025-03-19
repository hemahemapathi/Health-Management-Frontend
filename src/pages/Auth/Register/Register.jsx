import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserMd, FaUser, FaUserCog, FaUserPlus } from 'react-icons/fa';
import AnimatedButton from '../../../components/Buttons/AnimatedButton.jsx';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [role, setRole] = useState('patient');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Basic validation
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please fill in all required fields');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // Email domain validation based on role
      let emailDomain;
      if (role === 'patient') {
        emailDomain = '@patients.com';
      } else if (role === 'doctor') {
        emailDomain = '@doctors.com';
      } else if (role === 'admin') {
        emailDomain = '@admin.com';
      }

      if (!formData.email.endsWith(emailDomain)) {
        setError(`For ${role} accounts, email must end with ${emailDomain}`);
        return;
      }

      setLoading(true);
      setError(null);
      setSuccess(null);

      console.log('Attempting registration with:', {
         name: formData.name,
         email: formData.email
       });

      const response = await axios.post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role
      });

      console.log('Registration response:', response.data);

      if (response.data.success) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);

      if (err.response) {
        setError(err.response.data?.message || `Server error: ${err.response.status}`);
      } else if (err.request) {
        setError('No response from server. Check your network connection.');
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: 'patient', icon: FaUser, label: 'Patient' },
    { id: 'doctor', icon: FaUserMd, label: 'Doctor' },
    { id: 'admin', icon: FaUserCog, label: 'Admin' }
  ];

  // Update email domain when role changes
  const updateEmailDomain = (selectedRole) => {
    setRole(selectedRole);

    // Extract username part if email has a domain
    let username = '';
    if (formData.email.includes('@')) {
      username = formData.email.split('@')[0];
    } else {
      username = formData.email;
    }

    // Add appropriate domain
    let domain = '';
    if (selectedRole === 'patient') {
      domain = '@patients.com';
    } else if (selectedRole === 'doctor') {
      domain = '@doctors.com';
    } else if (selectedRole === 'admin') {
      domain = '@admin.com';
    }

    setFormData({
      ...formData,
      email: username + domain
    });
  };

  return (
    <div className="container-fluid register-container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-6 col-lg-4">
          <motion.div 
            className="card register-card shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="card-body p-4">
              <h2 className="text-center mb-2">Create an Account</h2>
              <p className="text-center text-muted mb-4">Join our healthcare platform</p>

              <div className="role-selector d-flex justify-content-around mb-4">
                {roles.map(({ id, icon: Icon, label }) => (
                  <motion.div
                    key={id}
                    className={`role-card ${role === id ? 'active' : ''}`}
                    onClick={() => updateEmailDomain(id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="role-icon mb-2" />
                    <span className="d-block">{label}</span>
                  </motion.div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="register-form">
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                
                <div className="form-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder={`Email (${role}@${role}s.com)`}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                  />
                </div>
                
                <div className="form-group mb-4">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <AnimatedButton
                  type="submit"
                  className="btn btn-primary w-100 mb-3"
                  loading={loading}
                >
                  Create Account
                </AnimatedButton>
              </form>

              <div className="text-center mt-3">
                <p>Already have an account? <Link to="/login">Login here</Link></p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
