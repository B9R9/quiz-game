const { test, expect } = require("@playwright/test");

test.describe("Question Page", () => {
  test.describe("When user is not authenticated", () => {
    test("should redirect to login", async ({ page }) => {
      await page.goto("http://localhost:7777/topics/1/questions/1");
      await expect(page).toHaveURL("http://localhost:7777/auth/login");
    });
  });

  test.describe("When user is authenticated", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("http://localhost:7777/auth/register");
      await page.fill("input[name='email']", "topics@testUser.test");
      await page.fill("input[name='username']", "topicsTest");
      await page.fill("input[name='password']", "Password123");
      await page.fill("input[name='confirmPW']", "Password123");
      await page.click("button:has-text('Create')");
      await page.goto("http://localhost:7777/auth/login");
      await page.fill("input[name='email']", "topics@testUser.test");
      await page.fill("input[name='password']", "Password123");
      await page.click("button:has-text('Login')");

      await page.goto("http://localhost:7777/topics");

      // add a topic
      await page.fill("input[name='name']", "New Topic");
      await page.click("input[type='submit']");

      // Create a question
      await page.click("a:has-text('New Topic')");

      // add a option
      await page.fill("input[name='option_text[]']", "New Option");
    });
  });
});

// test("should display question and options if user is authenticated", async ({
//   page,
// }) => {
//   await page.goto("http://localhost:7777/topics/1/questions/1");
//   const questionHeader = await page.locator(".question-header h1");
//   expect(questionHeader).not.toBeNull();

//   const options = await page.locator(
//     ".answer-topics .answer-topic-container"
//   );
//   expect(await options.count()).toBe(0);
// });

// test("should allow user to choose an option", async ({ page }) => {
//   await page.goto("http://localhost:7777/topics/1/questions/1");
//   const options = await page.locator(
//     ".answer-topics .answer-topic-container form input[type='submit']"
//   );
//   expect(await options.count()).toBe(0);

//   await options.first().click();
//   await page.waitForNavigation();
//   expect(page.url()).toContain("/quiz/");
// });
