import { test, expect } from "@playwright/test";

test.describe("Auth pages", () => {
  test.describe("Login page", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/login");
    });

    test("renders email and password fields", async ({ page }) => {
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
    });

    test("Sign in button is present", async ({ page }) => {
      await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
    });

    test("shows email validation error for empty submit", async ({ page }) => {
      await page.getByRole("button", { name: /sign in/i }).click();
      await expect(page.getByText(/enter a valid email/i)).toBeVisible();
    });

    test("shows password required error for empty submit", async ({ page }) => {
      await page.getByRole("button", { name: /sign in/i }).click();
      await expect(page.getByText(/password is required/i)).toBeVisible();
    });

    test("has link to register page", async ({ page }) => {
      await expect(page.getByRole("link", { name: /create one/i })).toHaveAttribute(
        "href",
        "/register",
      );
    });

    test("password field toggles visibility", async ({ page }) => {
      const passwordInput = page.getByLabel(/password/i);
      await expect(passwordInput).toHaveAttribute("type", "password");
      // Click the eye button (no accessible name — find by type=button near the input)
      await page.locator("button[type=button]").filter({ hasNot: page.getByRole("button", { name: /sign in/i }) }).first().click();
      await expect(passwordInput).toHaveAttribute("type", "text");
    });
  });

  test.describe("OTP page", () => {
    test("redirects to /login when no email in sessionStorage", async ({ page }) => {
      // Clear sessionStorage then navigate
      await page.goto("/login");
      await page.evaluate(() => sessionStorage.clear());
      await page.goto("/verify-otp");
      await expect(page).toHaveURL("/login");
    });

    test("shows 6 digit boxes when email is in session", async ({ page }) => {
      await page.goto("/login");
      await page.evaluate(() =>
        sessionStorage.setItem("ffh-otp-email", "user@example.com"),
      );
      await page.goto("/verify-otp");
      const inputs = page.locator('input[type="text"][maxlength="1"]');
      await expect(inputs).toHaveCount(6);
    });

    test("shows email address on OTP page", async ({ page }) => {
      await page.goto("/login");
      await page.evaluate(() =>
        sessionStorage.setItem("ffh-otp-email", "alice@example.com"),
      );
      await page.goto("/verify-otp");
      await expect(page.getByText("alice@example.com")).toBeVisible();
    });

    test("shows error when submitting incomplete OTP", async ({ page }) => {
      await page.goto("/login");
      await page.evaluate(() =>
        sessionStorage.setItem("ffh-otp-email", "user@example.com"),
      );
      await page.goto("/verify-otp");
      // Type only 3 digits
      const inputs = page.locator('input[type="text"][maxlength="1"]');
      await inputs.nth(0).fill("1");
      await inputs.nth(1).fill("2");
      await inputs.nth(2).fill("3");
      await page.getByRole("button", { name: /verify otp/i }).click();
      await expect(page.getByText(/enter the complete 6-digit/i)).toBeVisible();
    });
  });

  test.describe("Register page", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/register");
    });

    test("shows Create account heading", async ({ page }) => {
      await expect(page.getByRole("heading", { name: /create account/i })).toBeVisible();
    });

    test("has link back to login", async ({ page }) => {
      await expect(page.getByRole("link", { name: /sign in/i })).toBeVisible();
    });

    test("shows required field errors on empty submit", async ({ page }) => {
      await page.getByRole("button", { name: /create account/i }).click();
      // At least one validation error should appear
      const errors = page.locator("p.text-xs");
      await expect(errors.first()).toBeVisible();
    });
  });
});
