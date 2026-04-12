import api from "./axios";
import type { PaginatedResponse } from "./accounts";

export interface CustomerProfile {
  full_name: string;
  username: string;
  gender: string | null;
  nationality: string | null;
  country_of_birth: string | null;
  email: string;
  phone_number: string | null;
  photo: string | null;
}

export const customersApi = {
  list: (params?: { search?: string; page?: number }) =>
    api.get<PaginatedResponse<CustomerProfile>>("/profiles/all/", { params }),
};
