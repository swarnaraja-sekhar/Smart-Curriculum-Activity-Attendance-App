import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const authService = {
  login: async ({ email, password }) => {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    localStorage.setItem("user", JSON.stringify(res.data)); // persist login
    return res.data;
  },

  register: async ({ name, email, password, role }) => {
    const res = await axios.post(`${API_URL}/register`, { name, email, password, role });
    localStorage.setItem("user", JSON.stringify(res.data));
    return res.data;
  },

  logout: () => {
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem("user"));
  },
};
