import { test, expect, type Page } from "@playwright/test";

/**
 * Dashboard E2E tests.
 *
 * These tests use API mocking via page.route() so the dev server does not
 * need a live backend. Auth is simulated by intercepting /auth/users/me/.
 */

const BASE_API = "http://localhost:8001/api/v1";

/** Inject auth cookies so ProtectedRoute passes, then mock /auth/users/me/. */
async function setupAuthenticatedCustomer(page: Page) {
  // Mock the /me endpoint before navigation so AuthContext resolves immediately
  await page.route(`${BASE_API}/auth/users/me/`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: "user-uuid-1",
        email: "customer@example.com",
        first_name: "Alice",
        last_name: "Smith",
        role: "customer",
        is_test_account: true,
      }),
    }),
  );

  // Mock dashboard data endpoints
  await page.route(`${BASE_API}/accounts/`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          id: "acc-1",
          account_number: "FFH1234567890",
          account_type: "savings",
          balance: "5000.00",
          currency: "us_dollar",
          is_active: true,
          kyc_verified: true,
          created_at: "2024-01-01T00:00:00Z",
        },
      ]),
    }),
  );

  await page.route(`${BASE_API}/accounts/transactions/**`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ count: 0, next: null, previous: null, results: [] }),
    }),
  );
}

test.describe("Dashboard — authenticated customer", () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedCustomer(page);
    await page.goto("/dashboard");
  });

  test("renders the dashboard page without crashing", async ({ page }) => {
    // If ProtectedRoute redirects to /login the heading won't be visible
    await expect(page).not.toHaveURL("/login");
  });

  test("sidebar is visible", async ({ page }) => {
    const sidebar = page.locator("nav, aside").first();
    await expect(sidebar).toBeVisible();
  });

  test("shows FundFlowHub branding in sidebar", async ({ page }) => {
    await expect(page.getByText(/fundflowhub/i).first()).toBeVisible();
  });
});

test.describe("ProtectedRoute — unauthenticated", () => {
  test("redirects to /login when /me returns 401", async ({ page }) => {
    await page.route(`${BASE_API}/auth/users/me/`, (route) =>
      route.fulfill({ status: 401, body: "" }),
    );

    await page.goto("/dashboard");
    await expect(page).toHaveURL("/login");
  });
});

test.describe("Sidebar navigation", () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedCustomer(page);
    await page.goto("/dashboard");
  });

  test("has Accounts nav link", async ({ page }) => {
    await expect(page.getByRole("link", { name: /accounts/i })).toBeVisible();
  });

  test("has Transactions nav link", async ({ page }) => {
    await expect(page.getByRole("link", { name: /transactions/i })).toBeVisible();
  });

  test("has Transfer nav link", async ({ page }) => {
    await expect(page.getByRole("link", { name: /transfer/i })).toBeVisible();
  });

  test("clicking Accounts navigates to /dashboard/accounts", async ({ page }) => {
    await page.getByRole("link", { name: /accounts/i }).click();
    await expect(page).toHaveURL("/dashboard/accounts");
  });
});

test.describe("Topbar", () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedCustomer(page);
    await page.goto("/dashboard");
  });

  test("shows TEST MODE badge for test accounts", async ({ page }) => {
    await expect(page.getByText(/test mode/i)).toBeVisible();
  });

  test("has theme toggle button", async ({ page }) => {
    await expect(page.getByRole("button", { name: /toggle theme/i })).toBeVisible();
  });

  test("has logout button", async ({ page }) => {
    await expect(page.getByRole("button", { name: /log ?out/i })).toBeVisible();
  });
});
