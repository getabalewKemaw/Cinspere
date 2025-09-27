import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import axios from 'axios';
import { useAuth } from '../context/auth';// New import
const SignUp = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
const { login } = useAuth(); // Use context
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
   try {
  const response = await axios.post(
    'http://localhost:5000/api/user/signup', // your backend endpoint
    { name: email.split('@')[0], email, password }, // optional: derive name from email
    { withCredentials: true } // needed if your backend sets cookies
  );

  console.log('📩 Backend response:', response.data);

  // Save token to localStorage (optional)
  localStorage.setItem('token', response.data.token);

const userData = response.data.user || { name: email.split('@')[0], email };
      login(userData, response.data.token); // Call context login

      onClose(); // "Redirect" by closing modal
      setEmail('');
      setPassword('');
      setConfirmPassword('');
} catch (err) {
  console.error('❌ Signup error:', err);
  setError(err.response?.data?.msg || 'Something went wrong');
}

  
  
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
      {error && <p className="text-red-500 text-center text-xs sm:text-sm">{error}</p>}
      <div className="relative">
        <Icon
          icon="mdi:email-outline"
          width="20"
          height="20"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-light-200"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 sm:py-2.5 pl-10 rounded-lg bg-light-100/5 text-light-200 placeholder-light-200 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm sm:text-base"
          aria-label="Email"
        />
      </div>
      <div className="relative">
        <Icon
          icon="mdi:lock-outline"
          width="20"
          height="20"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-light-200"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 sm:py-2.5 pl-10 rounded-lg bg-light-100/5 text-light-200 placeholder-light-200 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm sm:text-base"
          aria-label="Password"
        />
      </div>
      <div className="relative">
        <Icon
          icon="mdi:lock-check-outline"
          width="20"
          height="20"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-light-200"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 sm:py-2.5 pl-10 rounded-lg bg-light-100/5 text-light-200 placeholder-light-200 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm sm:text-base"
          aria-label="Confirm Password"
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 sm:py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-yellow-400 transition-all duration-300 shadow-md text-sm sm:text-base"
      >
        Sign Up
      </button>
    </form>
  );
};

export default SignUp;