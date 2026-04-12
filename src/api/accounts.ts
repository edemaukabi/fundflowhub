import api from "./axios";
import type { BankAccount, Transaction } from "@/types";

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const accountsApi = {
  list: () => api.get<BankAccount[]>("/accounts/"),

  transactions: (params?: {
    page?: number;
    account_number?: string;
    start_date?: string;
    end_date?: string;
    ordering?: string;
  }) =>
    api.get<PaginatedResponse<Transaction>>("/accounts/transactions/", {
      params,
    }),

  requestPdf: (payload: {
    account_number?: string;
    start_date?: string;
    end_date?: string;
  }) => api.post("/accounts/transactions/pdf/", payload),
};
