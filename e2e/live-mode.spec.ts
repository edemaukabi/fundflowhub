import { test, expect, type Page } from "@playwright/test";

const BASE_API = "http://localhost:8001/api/v1";

async function setupTestAccountInLiveMode(page: Page) {
  // Mock /me — customer who has NOT completed KYC (is_test_account: true)
  await page.route(`${BASE_API}/auth/users/me/`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: "user-uuid-test",
        email: "customer@example.com",
        first_name: "Alice",
        last_name: "Smith",
        role: "customer",
        is_test_account: true,
      }),
    }),
  );

  await page.goto("/dashboard");

  // Switch to live mode via localStorage
  await page.evaluate(() => localStorage.setItem("ffh-mode", "live"));
  await page.reload();
}

async function setupVerifiedAccountInLiveMode(page: Page) {
  // Mock /me — customer who HAS completed KYC (is_test_account: false)
  await page.route(`${BASE_API}/auth/users/me/`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: "user-uuid-live",
        email: "verified@example.com",
        first_name: "Bob",
        last_name: "Jones",
        role: "customer",
        is_test_account: false,
      }),
    }),
  );

  // Mock accounts endpoint so dashboard loads cleanly
  await page.route(`${BASE_API}/accounts/`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    }),
  );

  await page.route(`${BASE_API}/accounts/transactions/**`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ count: 0, next: null, previous: null, results: [] }),
    }),
  );

  await page.goto("/dashboard");
  await page.evaluate(() => localStorage.setItem("ffh-mode", "live"));
  await page.reload();
}

test.describe("Live mode overlay", () => {
  test.afterEach(async ({ page }) => {
    await page.evaluate(() => localStorage.removeItem("ffh-mode"));
  });

  test("shows KYC required overlay for unverified customer in live mode", async ({
    page,
  }) => {
    await setupTestAccountInLiveMode(page);
    await expect(page.getByText(/KYC verification required/i)).toBeVisible();
  });

  test("overlay shows steps to complete KYC", async ({ page }) => {
    await setupTestAccountInLiveMode(page);
    await expect(page.getByText(/how to get verified/i)).toBeVisible();
    await expect(page.getByText(/Documents & KYC/i)).toBeVisible();
  });

  test("overlay has link to Settings page", async ({ page }) => {
    await setupTestAccountInLiveMode(page);
    const settingsLink = page.getByRole("link", { name: /go to documents/i });
    await expect(settingsLink).toBeVisible();
  });

  test("overlay has Back to Test mode button", async ({ page }) => {
    await setupTestAccountInLiveMode(page);
    const backBtn = page.getByRole("button", { name: /back to test mode/i });
    await expect(backBtn).toBeVisible();
  });

  test("clicking Back to Test mode dismisses overlay", async ({ page }) => {
    await setupTestAccountInLiveMode(page);
    await page.getByRole("button", { name: /back to test mode/i }).click();
    // Overlay should disappear — TEST MODE badge should appear
    await expect(page.getByText(/test mode/i)).toBeVisible();
    await expect(page.getByText(/KYC verification required/i)).not.toBeVisible();
  });

  test("Settings page is still accessible while overlay is shown", async ({
    page,
  }) => {
    await setupTestAccountInLiveMode(page);
    // Navigate directly to settings (not via the overlay link, which would navigate)
    await page.goto("/dashboard/settings");
    // Should NOT see the overlay on settings page
    await expect(page.getByText(/KYC verification required/i)).not.toBeVisible();
  });

  test("verified customer in live mode does NOT see overlay", async ({ page }) => {
    await setupVerifiedAccountInLiveMode(page);
    await expect(page.getByText(/KYC verification required/i)).not.toBeVisible();
  });

  test("LIVE — SETUP REQUIRED badge shown in topbar for unverified customer", async ({
    page,
  }) => {
    await setupTestAccountInLiveMode(page);
    await expect(page.getByText(/LIVE.*SETUP REQUIRED/i)).toBeVisible();
  });
});
