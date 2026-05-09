import { test, expect } from "@playwright/test";

test.describe("Health & Navigation", () => {
  test("API health endpoint returns 200", async ({ request }) => {
    const response = await request.get("http://localhost:4000/health");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.databaseConnected).toBe(true);
  });

  test("frontend serves the app", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Tour de Contr/i);
  });

  test("unknown routes show 404 or redirect to login", async ({ page }) => {
    await page.goto("/this-does-not-exist");
    const is404 = page.locator("text=404").or(page.locator("text=Not found"));
    const isLogin = page.locator("form");
    await expect(is404.or(isLogin)).toBeVisible({ timeout: 5000 });
  });
});
