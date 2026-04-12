import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("shows hero heading", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("shows FundFlowHub branding", async ({ page }) => {
    await expect(page.getByText(/fundflowhub/i).first()).toBeVisible();
  });

  test("has Sign in link pointing to /login", async ({ page }) => {
    const loginLink = page.getByRole("link", { name: /sign in/i }).first();
    await expect(loginLink).toBeVisible();
    await expect(loginLink).toHaveAttribute("href", "/login");
  });

  test("has Get started link pointing to /register", async ({ page }) => {
    const registerLink = page.getByRole("link", { name: /get started/i }).first();
    await expect(registerLink).toBeVisible();
    await expect(registerLink).toHaveAttribute("href", "/register");
  });

  test("theme toggle button is visible", async ({ page }) => {
    const toggle = page.getByRole("button", { name: /toggle theme/i });
    await expect(toggle).toBeVisible();
  });

  test("clicking theme toggle switches dark class on html", async ({ page }) => {
    const htmlEl = page.locator("html");
    const hasDarkInitially = await htmlEl.evaluate((el) => el.classList.contains("dark"));

    await page.getByRole("button", { name: /toggle theme/i }).click();

    if (hasDarkInitially) {
      await expect(htmlEl).not.toHaveClass(/dark/);
    } else {
      await expect(htmlEl).toHaveClass(/dark/);
    }
  });

  test("security section mentions key security features", async ({ page }) => {
    // Scroll to make sure section is in view
    await page.getByText(/security/i).first().scrollIntoViewIfNeeded();
    await expect(page.getByText(/security/i).first()).toBeVisible();
  });

  test("clicking Sign in navigates to /login", async ({ page }) => {
    await page.getByRole("link", { name: /sign in/i }).first().click();
    await expect(page).toHaveURL("/login");
  });
});
