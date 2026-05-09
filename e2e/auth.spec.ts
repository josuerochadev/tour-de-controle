import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should display the login page", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("form")).toBeVisible();
  });

  test("should reject invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "wrong@example.com");
    await page.fill('input[type="password"]', "wrongpassword");
    await page.click('button[type="submit"]');
    await expect(page.locator("text=Identifiants incorrects").or(page.locator("[role='alert']"))).toBeVisible({ timeout: 5000 });
  });

  test("should login with valid credentials and redirect to dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "developpeur@tour-de-controle.com");
    await page.fill('input[type="password"]', "Password1");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
  });

  test("should logout and redirect to login", async ({ page }) => {
    // Login first
    await page.goto("/login");
    await page.fill('input[type="email"]', "developpeur@tour-de-controle.com");
    await page.fill('input[type="password"]', "Password1");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });

    // Logout
    await page.click("text=Déconnexion").catch(() =>
      page.click("[data-testid='logout']").catch(() =>
        page.click("button:has-text('logout')")
      )
    );
    await expect(page).toHaveURL(/login/, { timeout: 5000 });
  });
});
