import api from "./axios";
import type { VirtualCard } from "@/types";

export const cardsApi = {
  list: () => api.get<VirtualCard[]>("/cards/virtual-cards/"),

  create: (bank_account_number: string) =>
    api.post<VirtualCard>("/cards/virtual-cards/", { bank_account_number }),

  detail: (id: string) => api.get<VirtualCard>(`/cards/virtual-cards/${id}/`),

  topUp: (id: string, amount: string) =>
    api.patch<VirtualCard>(`/cards/virtual-cards/${id}/top-up/`, { amount }),

  revealCvv: (id: string) =>
    api.get<{ id: string; cvv: string }>(`/cards/virtual-cards/${id}/reveal-cvv/`),

  updateStatus: (id: string, status: "active" | "frozen") =>
    api.patch<VirtualCard>(`/cards/virtual-cards/${id}/`, { status }),

  delete: (id: string) => api.delete(`/cards/virtual-cards/${id}/`),
};
