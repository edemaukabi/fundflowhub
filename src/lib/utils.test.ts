import { describe, it, expect } from "vitest";
import { cn, formatCurrency, formatDate, maskCardNumber } from "./utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("handles conditional classes", () => {
    expect(cn("a", false && "b", "c")).toBe("a c");
  });

  it("resolves Tailwind conflicts — last wins", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});

describe("formatCurrency", () => {
  it("formats USD by default", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
  });

  it("formats GBP", () => {
    expect(formatCurrency(100, "pound_sterling")).toBe("£100.00");
  });

  it("accepts a string amount", () => {
    expect(formatCurrency("500.00")).toBe("$500.00");
  });

  it("falls back to USD for unknown currency", () => {
    expect(formatCurrency(50, "unknown_currency")).toBe("$50.00");
  });
});

describe("formatDate", () => {
  it("returns a non-empty, human-readable string", () => {
    const result = formatDate("2024-06-15T10:30:00Z");
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it("includes the year from the ISO string", () => {
    const result = formatDate("2024-06-15T10:30:00Z");
    expect(result).toContain("2024");
  });
});

describe("maskCardNumber", () => {
  it("shows only the last 4 digits", () => {
    expect(maskCardNumber("4111111111111234")).toBe("•••• •••• •••• 1234");
  });

  it("works with any 16-digit string", () => {
    expect(maskCardNumber("5500005555555599")).toBe("•••• •••• •••• 5599");
  });
});
