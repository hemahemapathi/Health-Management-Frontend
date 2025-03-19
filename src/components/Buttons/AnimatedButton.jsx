import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import './AnimatedButton.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AnimatedButton = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  // Button variants
  const variants = {
    primary: 'animated-btn-primary',
    secondary: 'animated-btn-secondary',
    tertiary: 'animated-btn-tertiary',
    success: 'animated-btn-success',
    danger: 'animated-btn-danger',
    warning: 'animated-btn-warning',
    info: 'animated-btn-info',
    light: 'animated-btn-light',
    dark: 'animated-btn-dark',
    link: 'animated-btn-link',
    outline: 'animated-btn-outline',
  };

  // Button sizes
  const sizes = {
    small: 'animated-btn-sm',
    medium: 'animated-btn-md',
    large: 'animated-btn-lg',
  };

  // Button animation
  const buttonAnimation = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  // Icon animation
  const iconAnimation = {
    rest: { x: 0 },
    hover: { x: iconPosition === 'right' ? 3 : -3 },
  };

  return (
    <motion.button
      type={type}
      className={`
        animated-btn 
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'animated-btn-full-width' : ''}
        ${disabled ? 'animated-btn-disabled' : ''}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      animate="rest"
      variants={buttonAnimation}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <motion.span className="animated-btn-icon-left" variants={iconAnimation}>
          {icon}
        </motion.span>
      )}
      
      <span className="animated-btn-text">{children}</span>
      
      {icon && iconPosition === 'right' && (
        <motion.span className="animated-btn-icon-right" variants={iconAnimation}>
          {icon}
        </motion.span>
      )}
    </motion.button>
  );
};

AnimatedButton.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf([
    'primary', 'secondary', 'tertiary', 'success', 
    'danger', 'warning', 'info', 'light', 'dark', 
    'link', 'outline'
  ]),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string,
};

export default AnimatedButton;
