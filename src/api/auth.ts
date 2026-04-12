import api from "./axios";
import type { User } from "@/types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  re_password: string;
  first_name: string;
  last_name: string;
  id_no: number;
  security_question: string;
  security_answer: string;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<{ email: string }>("/auth/login/", payload),

  verifyOtp: (otp: string) =>
    api.post<{ success: string }>("/auth/verify-otp/", { otp }),

  register: (payload: RegisterPayload) =>
    api.post<User>("/auth/users/", payload),

  me: () => api.get<User>("/auth/users/me/"),

  logout: () => api.post("/auth/logout/"),

  refreshToken: () => api.post("/auth/refresh/"),
};
