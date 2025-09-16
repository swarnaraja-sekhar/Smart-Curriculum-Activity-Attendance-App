import axios from 'axios';

// This code automatically uses the Vercel environment variable when deployed,
// and the .env file when running locally.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
