import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: string | number,
  currency: string = "us_dollar",
): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  const localeMap: Record<string, { locale: string; currency: string }> = {
    us_dollar: { locale: "en-US", currency: "USD" },
    pound_sterling: { locale: "en-GB", currency: "GBP" },
    kenya_shilling: { locale: "sw-KE", currency: "KES" },
  };
  const { locale, currency: code } = localeMap[currency] ?? localeMap.us_dollar;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
  }).format(num);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function maskCardNumber(cardNumber: string): string {
  return `•••• •••• •••• ${cardNumber.slice(-4)}`;
}
