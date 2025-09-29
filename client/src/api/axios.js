import axios from 'axios';

// Use env variable or fallback - using local IP for mobile testing
// API_URL should be domain only (no /api at end)  
const API_URL = import.meta.env.VITE_API_URL || 'http://10.83.161.252:5001/api';

console.log('API URL:', API_URL);

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ✅ Request Interceptor: Attach token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Adding token to request:', config.baseURL + config.url);
    } else {
      console.warn('No token found in localStorage for request:', config.baseURL + config.url);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor: Handle responses and errors
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response [${response.status}] from ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`API Error [${error.response.status}] from ${error.config.url}:`, error.response.data);

      if (error.response.status === 401) {
        console.warn('Authentication error - user may need to log in again');
      }
    } else if (error.request) {
      console.error(`API Error: No response received from ${error.config.url}`);
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
