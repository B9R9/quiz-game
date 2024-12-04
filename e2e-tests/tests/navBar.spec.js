const { test, expect } = require("@playwright/test");

test.describe("NavBar", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:7777");
  });

  test.describe("When not authenticated", () => {
    test.beforeEach(async ({ page }) => {
      // Ensure no authentication cookie or local storage is set
      await page.context().clearCookies();
      await page.goto("http://localhost:7777");
    });

    test("Login link should be visible", async ({ page }) => {
      await expect(page.locator("text=Login")).toBeVisible();
    });

    test("Sign In link should be visible", async ({ page }) => {
      await expect(page.locator("text=Sign In")).toBeVisible();
    });

    test("Home link should redirect to the home page", async ({ page }) => {
      await page.click("text=Home");
      expect(page.url()).toBe("http://localhost:7777/");
    });

    test("Topics link should redirect to the login page", async ({ page }) => {
      await page.click("text=Topics");
      expect(page.url()).toBe("http://localhost:7777/auth/login");
    });

    test("Quiz link should redirect to the login page", async ({ page }) => {
      await page.click("text=Quiz");
      expect(page.url()).toBe("http://localhost:7777/auth/login");
    });

    test("Course link should open the course page in a new tab", async ({
      page,
      context,
    }) => {
      const [newPage] = await Promise.all([
        context.waitForEvent("page"),
        page.click("text=Course"),
      ]);
      await newPage.waitForLoadState();
      expect(newPage.url()).toBe(
        "https://fitech101.aalto.fi/web-software-development-1-0/35-course-project-ii/1-project-handout/#overview-and-database-schema"
      );
    });

    test("Login link should redirect to the login page", async ({ page }) => {
      await page.click("text=Login");
      expect(page.url()).toBe("http://localhost:7777/auth/login");
    });

    test("Register link should redirect to the register page", async ({
      page,
    }) => {
      await page.click("text=Sign In");
      expect(page.url()).toBe("http://localhost:7777/auth/register");
    });

    test("Statistics shouldn't be visible", async ({ page }) => {
      await expect(page.locator("a:has-text('Statistics')")).not.toBeVisible();
    });

    test("Account shouldn't be visible", async ({ page }) => {
      await expect(page.locator("a:has-text('Account')")).not.toBeVisible();
    });
  });

  test.describe("When authenticated", () => {
    test.beforeEach(async ({ page }) => {
      // Simulate authentication by logging in
      await page.goto("http://localhost:7777/auth/login");
      await page.fill('input[name="email"]', "admin@admin.admin");
      await page.fill('input[name="password"]', "Admin@4");

      await Promise.all([
        page.waitForNavigation({ url: "http://localhost:7777/topics" }),
        page.click("button:has-text('Login')"),
      ]);

      expect(page.url()).toBe("http://localhost:7777/topics");
    });

    test("Statistics link should be visible", async ({ page }) => {
      await expect(page.locator("a:has-text('Statistics')")).toBeVisible();
    });

    test("Account link should be visible", async ({ page }) => {
      await expect(page.locator("a:has-text('Account')")).toBeVisible();
    });

    test("Login link shouldn't be visible", async ({ page }) => {
      await expect(page.locator("text=Login")).not.toBeVisible();
    });

    test("Sign In link shouldn't be visible", async ({ page }) => {
      await expect(page.locator("text=Sign In")).not.toBeVisible();
    });

    test("Should see welcome message with username", async ({ page }) => {
      await expect(page.locator("text=Welcome Bob Dylan")).toBeVisible();
    });

    test("Logout button should be visible and functional", async ({ page }) => {
      await expect(
        page.locator("form[action='/auth/logout'] button")
      ).toBeVisible();
      await page.click("form[action='/auth/logout'] button");
      // Verify that the user is logged out, e.g., by checking the URL or the presence of the login button
      await expect(page.locator("text=Login")).toBeVisible();
    });
  });
});
