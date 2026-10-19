import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // httpOnly cookie JWT — required for auth
  headers: {
    "Content-Type": "application/json",
  },
});

// Pages anyone may be on without signing in. Matched exactly: a prefix match
// on "/" would make every page public and the redirect below would never run.
const PUBLIC_PATHS = ["/", "/login", "/register", "/verify-otp", "/forgot-password", "/docs"];
// The reset link carries its uid and token in the path.
const PUBLIC_PREFIXES = ["/reset-password/"];

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.includes(pathname) || PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

// Redirect to login on 401 (token expired / not authenticated)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (!isPublicPath(window.location.pathname)) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
