import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Check if user has a theme preference in localStorage or use system preference
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    
    // Check if user prefers dark mode
    const prefersDark = window.matchMedia && 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    return prefersDark ? 'dark' : 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme());
  const [fontSize, setFontSize] = useState(localStorage.getItem('fontSize') || 'medium');

  // Apply theme to document when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Add or remove dark class from body
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  // Apply font size when it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSize);
    localStorage.setItem('fontSize', fontSize);
    
    // Apply font size class to body
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    document.body.classList.add(`font-${fontSize}`);
  }, [fontSize]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Set specific theme
  const setSpecificTheme = (newTheme) => {
    if (newTheme === 'light' || newTheme === 'dark') {
      setTheme(newTheme);
    }
  };

  // Change font size
  const changeFontSize = (size) => {
    if (['small', 'medium', 'large'].includes(size)) {
      setFontSize(size);
    }
  };

  const value = {
    theme,
    fontSize,
    toggleTheme,
    setTheme: setSpecificTheme,
    changeFontSize
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
