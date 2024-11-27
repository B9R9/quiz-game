const { test, expect } = require("@playwright/test");

test.describe("Register Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:7777/register");
  });

  test("should display the register form", async ({ page }) => {
    const form = await page.locator("form");
    expect(form).not.toBeNull();
  });
});
