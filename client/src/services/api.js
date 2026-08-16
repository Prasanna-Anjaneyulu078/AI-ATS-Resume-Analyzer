import axios from "axios";

// Default to Express backend on http://localhost:5000 if environment variable is not explicitly provided
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://resumeats-ai.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Unified response error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMsg =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "An unexpected network error occurred.";

    return Promise.reject(new Error(errorMsg));
  }
);

export default api;
