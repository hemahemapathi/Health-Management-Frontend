import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserMd, FaSignInAlt, FaUserPlus, FaSun, FaMoon } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();  // Use currentUser directly, not user
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <motion.nav 
      className={`navbar ${isScrolled ? 'scrolled' : ''} ${theme === 'dark' ? 'dark-mode' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar-container">
        <Link to="/" className="logo">
          <motion.img 
            src="/assets/logoo.png" 
            alt="MediCare Plus"
            whileHover={{ scale: 1.1 }}
          />
         
        </Link>

        <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to="/doctors" onClick={() => setMobileMenuOpen(false)}>Find Doctors</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
        </div>

        <div className="navbar-right">
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>

          <div className={`auth-buttons ${mobileMenuOpen ? 'active' : ''}`}>
            {currentUser ? (  // Changed from user to currentUser
              <>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="dashboard-btn"
                  onClick={() => {
                    navigate(`/${currentUser.role}-dashboard`);  // Changed from user to currentUser
                    setMobileMenuOpen(false);
                  }}
                >
                  Dashboard
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="logout-btn"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="login-btn"
                  >
                    <FaSignInAlt /> Login
                  </motion.button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="register-btn"
                  >
                    <FaUserPlus /> Register
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            <div className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
