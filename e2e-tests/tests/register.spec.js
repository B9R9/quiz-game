const { test, expect } = require("@playwright/test");

test.describe("Register Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:7777/auth/register");
  });

  test("should display the register form", async ({ page }) => {
    const form = await page.locator("form");
    expect(form).not.toBeNull();
  });

  test("should display the register button", async ({ page }) => {
    const registerButton = await page.locator("button:has-text('Create')");
    expect(registerButton).not.toBeNull();
  });

  test("should display the login link", async ({ page }) => {
    const loginLink = await page.locator("a:has-text('Login')");
    expect(loginLink).not.toBeNull();
  });

  test("should display the email input", async ({ page }) => {
    const emailInput = await page.locator("input[name='email']");
    expect(emailInput).not.toBeNull();
  });

  test("should display the password input", async ({ page }) => {
    const passwordInput = await page.locator("input[name='password']");
    expect(passwordInput).not.toBeNull();
  });

  test("should display the confirm password input", async ({ page }) => {
    const confirmPasswordInput = await page.locator(
      "input[name='confirmPassword']"
    );
    expect(confirmPasswordInput).not.toBeNull();
  });

  test("should didplay username input", async ({ page }) => {
    const usernameInput = await page.locator("input[name='username']");
    expect(usernameInput).not.toBeNull();
  });

  test("Should display error message if passwords do not match", async ({
    page,
  }) => {
    await expect(page.locator("input[name='email']")).toBeVisible();
    await page.fill("input[name='email']", "qwer@qwre.com");

    await expect(page.locator("input[name='username']")).toBeVisible();
    await page.fill("input[name='username']", "qwer");

    await expect(page.locator("input[name='password']")).toBeVisible();
    await page.fill("input[name='password']", "Qwer@123");

    await expect(page.locator("input[name='confirmPW']")).toBeVisible();
    await page.fill("input[name='confirmPW']", "Qwer@1234");

    await page.click("button:has-text('Create')");
    const errorMessage = await page.locator(
      "div:has-text('Passwords do not match')"
    );
    expect(errorMessage).not.toBeNull();
  });
  test("should display error message if email is empty", async ({ page }) => {
    await page.fill("input[name='username']", "qwer");
    await page.fill("input[name='password']", "Qwer@123");
    await page.fill("input[name='confirmPW']", "Qwer@123");

    await page.click("button:has-text('Create')");
    const errorMessage = await page.locator(
      "div:has-text('Email is required')"
    );
    expect(errorMessage).not.toBeNull();
  });

  test("should display error message if username is empty", async ({
    page,
  }) => {
    await page.fill("input[name='email']", "qwer@qwre.com");
    await page.fill("input[name='password']", "Qwer@123");
    await page.fill("input[name='confirmPW']", "Qwer@123");

    await page.click("button:has-text('Create')");
    const errorMessage = await page.locator(
      "div:has-text('Username is required')"
    );
    expect(errorMessage).not.toBeNull();
  });

  test("should display error message if password is empty", async ({
    page,
  }) => {
    await page.fill("input[name='email']", "qwer@qwre.com");
    await page.fill("input[name='username']", "qwer");

    await page.click("button:has-text('Create')");
    const errorMessage = await page.locator(
      "div:has-text('Password is required')"
    );
    expect(errorMessage).not.toBeNull();
  });

  test("should display error message if confirm password is empty", async ({
    page,
  }) => {
    await page.fill("input[name='email']", "qwer@qwre.com");
    await page.fill("input[name='username']", "qwer");
    await page.fill("input[name='password']", "Qwer@123");

    await page.click("button:has-text('Create')");
    const errorMessage = await page.locator(
      "div:has-text('Confirm Password is required')"
    );
    expect(errorMessage).not.toBeNull();
  });
});
