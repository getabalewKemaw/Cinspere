// src/api.js
import axios from "axios";

const API_BASE = "https://cinspherebackend-2.onrender.com/api";

axios.defaults.withCredentials = true; // Send cookies automatically

export const loginUser = (data) => axios.post(`${API_BASE}/user/login`, data);
export const signupUser = (data) => axios.post(`${API_BASE}/user/signup`, data);
export const getFavorites = (token) =>
  axios.get(`${API_BASE}/favorites`, { headers: { Authorization: `Bearer ${token}` } });
export const addFavorite = (movie, token) =>
  axios.post(`${API_BASE}/favorites/add`, movie, { headers: { Authorization: `Bearer ${token}` } });
export const removeFavorite = (movieId, token) =>
  axios.delete(`${API_BASE}/favorites/remove`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { movieId },
  });







