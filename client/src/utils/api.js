import axios from "axios";

// Base API instance
const API = axios.create({
  baseURL: "http://localhost:5000/api", // backend URL
  headers: { "Content-Type": "application/json" },
});

// Add JWT token automatically if exists
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default API;
