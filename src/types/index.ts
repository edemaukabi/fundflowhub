// User & Auth

export type Role =
  | "customer"
  | "teller"
  | "account_executive"
  | "branch_manager";

export interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: Role;
  is_test_account: boolean;
  account_status: "active" | "locked";
}

// Bank Accounts

export type Currency = "us_dollar" | "pound_sterling" | "kenya_shilling";
export type AccountType = "current" | "savings";
export type AccountStatus = "active" | "in-active";

export interface BankAccount {
  id: string;
  account_number: string;
  account_balance: string; // Decimal comes as string from DRF
  currency: Currency;
  account_status: AccountStatus;
  account_type: AccountType;
  is_primary: boolean;
  kyc_submitted: boolean;
  kyc_verified: boolean;
  fully_activated: boolean;
}

// Transactions

export type TransactionType = "deposit" | "withdrawal" | "transfer" | "interest";
export type TransactionStatus = "pending" | "completed" | "failed";

export interface Transaction {
  id: string;
  amount: string;
  description: string | null;
  status: TransactionStatus;
  transaction_type: TransactionType;
  created_at: string;
  sender: string | null;
  receiver: string | null;
  sender_account: string | null;
  receiver_account: string | null;
}

// Virtual Cards

export type CardStatus = "active" | "frozen";

export interface VirtualCard {
  id: string;
  card_number: string;
  expiry_date: string;
  balance: string;
  status: CardStatus;
}

// Multi-step flow tokens

export interface PendingFlowResponse {
  message: string;
  next_step: string;
  token: string;
}

// API generic wrapper (GenericJSONRenderer)

export interface ApiResponse<T> {
  status_code: number;
  visa_card?: T;
  deposit?: T;
  verification?: T;
  [key: string]: T | number | undefined;
}

// App mode

export type AppMode = "test" | "live";
