import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // httpOnly cookie JWT — required for auth
  headers: {
    "Content-Type": "application/json",
  },
});

// Redirect to login on 401 (token expired / not authenticated)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const publicPrefixes = ["/", "/login", "/register", "/verify-otp", "/forgot-password", "/reset-password/", "/docs"];
      const isPublic = publicPrefixes.some((p) => window.location.pathname === p || window.location.pathname.startsWith(p));
      if (!isPublic) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
