import api from "./axios";
import type { PendingFlowResponse, Transaction } from "@/types";

export const withdrawalApi = {
  initiate: (payload: { account_number: string; amount: string }) =>
    api.post<PendingFlowResponse>("/accounts/initiate-withdrawal/", payload),

  verifyUsername: (token: string, username: string) =>
    api.post<{ message: string; transaction: Transaction }>(
      "/accounts/verify-username-and-withdraw/",
      { token, username },
    ),
};
