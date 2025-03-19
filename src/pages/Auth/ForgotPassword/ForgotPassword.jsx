import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Password reset logic here
  };

  return (
    <div className="container-fluid forgot-password-container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-6 col-lg-4">
          <motion.div 
            className="card forgot-password-card shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="card-body p-4">
              <h2 className="text-center mb-2">Reset Password</h2>
              <p className="text-center text-muted mb-4">Enter your email to reset your password</p>

              <form onSubmit={handleSubmit} className="forgot-password-form">
                <div className="form-group mb-4">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email Address"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100 mb-3">Send Reset Link</button>
              </form>

              <div className="text-center mt-3">
                <Link to="/login" className="text-muted">Back to Login</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
