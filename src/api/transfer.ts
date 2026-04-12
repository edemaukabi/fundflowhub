import api from "./axios";
import type { PendingFlowResponse, Transaction } from "@/types";

export const transferApi = {
  initiate: (payload: {
    sender_account: string;
    receiver_account: string;
    amount: string;
    description?: string;
  }) => api.post<PendingFlowResponse>("/accounts/transfer/initiate/", payload),

  verifySecurity: (token: string, security_answer: string) =>
    api.post<PendingFlowResponse>("/accounts/transfer/verify-security-question/", {
      token,
      security_answer,
    }),

  verifyOtp: (token: string, otp: string) =>
    api.post<Transaction>("/accounts/transfer/verify-otp/", { token, otp }),
};
