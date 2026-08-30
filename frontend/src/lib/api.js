import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("airo6_admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function extractErrorMessage(
  err,
  fallback = "Something went wrong. Please try again."
) {
  return err?.response?.data?.message || fallback;
}

export default api;