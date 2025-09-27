import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true; // Enable sending cookies with requests


const SignIn = ({ onClose = () => {}, redirectPath = "/" }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/login",
        { email, password },
        { withCredentials: true }
      );

      console.log("📩 Backend response:", response.data);

      localStorage.setItem("token", response.data.token);

      const userData = response.data.user || {
        name: email.split("@")[0],
        email,
      };
      login(userData, response.data.token);

      onClose(); // close modal
      navigate(redirectPath); // redirect to intended page

      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err.response?.data?.msg || "Login failed, check credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
      {error && (
        <p className="text-red-500 text-center text-xs sm:text-sm">{error}</p>
      )}
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
      <button
        type="submit"
        className="w-full px-4 py-2 sm:py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-yellow-400 transition-all duration-300 shadow-md text-sm sm:text-base"
      >
        Sign In
      </button>
    </form>
  );
};

export default SignIn;
