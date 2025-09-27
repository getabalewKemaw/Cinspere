import React, { useState, useEffect } from 'react';
import { AuthContext } from './auth'; // Import from auth.js


export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // { name, email } or null

  useEffect(() => {
    // Check for existing token on mount (persists login across refreshes)
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      // Optionally fetch user data from backend here if needed
      // For now, assume user is stored or derived
    }
  }, []);

   const login = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      // Optional: Call backend logout if it exists (e.g., invalidate token)
      // await axios.post('http://localhost:5000/api/user/logout', {}, { withCredentials: true });
      localStorage.removeItem('token');
      setUser(null);
      setIsLoggedIn(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
