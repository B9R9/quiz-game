const { test, expect } = require("@playwright/test");

test.describe("Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:7777/login");
  });

  test("should display the login form", async ({ page }) => {
    const form = await page.locator("form");
    expect(form).not.toBeNull();
  });
});
