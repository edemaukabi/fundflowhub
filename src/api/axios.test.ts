import { describe, expect, it } from "vitest";

import { isPublicPath } from "./axios";

describe("isPublicPath", () => {
  it("treats the landing, docs and auth pages as public", () => {
    for (const path of ["/", "/docs", "/login", "/register", "/verify-otp", "/forgot-password"]) {
      expect(isPublicPath(path)).toBe(true);
    }
  });

  it("treats a password reset link as public", () => {
    expect(isPublicPath("/reset-password/MQ/abc-123")).toBe(true);
  });

  it("does not treat the dashboard as public, so an expired session goes to login", () => {
    expect(isPublicPath("/dashboard")).toBe(false);
    expect(isPublicPath("/dashboard/transfers")).toBe(false);
  });
});
