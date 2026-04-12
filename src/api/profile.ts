import api from "./axios";

export interface Profile {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  username: string;
  email: string;
  full_name: string;
  id_no: number;
  date_joined: string;
  title?: string;
  gender?: string;
  date_of_birth?: string;
  country_of_birth?: string;
  place_of_birth?: string;
  marital_status?: string;
  means_of_identification?: string;
  id_issue_date?: string;
  id_expiry_date?: string;
  passport_number?: string;
  nationality?: string;
  phone_number?: string;
  address?: string;
  city?: string;
  country?: string;
  employment_status?: string;
  employer_name?: string;
  annual_income?: string;
  photo_url?: string;
  id_photo_url?: string;
  signature_photo_url?: string;
  account_currency?: string;
  account_type?: string;
  next_of_kin: NextOfKin[];
}

export interface NextOfKin {
  id: string;
  first_name: string;
  last_name: string;
  relationship: string;
  phone_number: string;
  email?: string;
  country?: string;
}

export interface PendingKYCAccount {
  id: string;
  account_number: string;
  account_type: string;
  currency: string;
  full_name: string;
  email: string;
  photo_url: string | null;
  kyc_submitted: boolean;
  kyc_verified: boolean;
  fully_activated: boolean;
  account_status: string;
  created_at: string;
}

export const profileApi = {
  getMyProfile: () => api.get<Profile>("/profiles/my-profile/"),

  updateProfile: (data: FormData | Partial<Profile>) =>
    api.patch<{ message: string; data: Profile }>("/profiles/my-profile/", data, {
      headers:
        data instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : undefined,
    }),

  listNextOfKin: () => api.get<{ results: NextOfKin[] }>("/profiles/my-profile/next-of-kin/"),

  addNextOfKin: (nok: Omit<NextOfKin, "id">) =>
    api.post<NextOfKin>("/profiles/my-profile/next-of-kin/", nok),

  deleteNextOfKin: (id: string) =>
    api.delete(`/profiles/my-profile/next-of-kin/${id}/`),
};

export const kycApi = {
  pendingList: () =>
    api.get<{ results: PendingKYCAccount[] }>("/accounts/pending-kyc/"),

  verify: (
    accountId: string,
    payload: {
      kyc_submitted: boolean;
      kyc_verified: boolean;
      verification_date: string;
      verification_notes: string;
    },
  ) => api.patch(`/accounts/verify/${accountId}/`, payload),

  lookupByAccountNumber: (account_number: string) =>
    api.get("/accounts/deposit/", { params: { account_number } }),
};
