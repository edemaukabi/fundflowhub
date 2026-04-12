import api from "./axios";

export interface CustomerInfo {
  account_number: string;
  full_name: string;
  email: string;
  photo_url: string | null;
  account_balance: string;
  account_type: string;
  currency: string;
}

export const tellerApi = {
  lookupAccount: (account_number: string) =>
    api.get<CustomerInfo>("/accounts/deposit/", { params: { account_number } }),

  deposit: (account_number: string, amount: string) =>
    api.post<{ message: string; new_balance: string }>("/accounts/deposit/", {
      account_number,
      amount,
    }),
};
