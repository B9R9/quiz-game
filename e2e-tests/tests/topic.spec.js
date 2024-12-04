const { test, expect } = require("@playwright/test");
const { userProfil, adminProfil } = require("./utils/utils");

test.describe("Topics Page", () => {
  test.describe("When not authenticated", () => {
    test("should redirect to login", async ({ page }) => {
      await page.goto("http://localhost:7777/topics");
      await expect(page).toHaveURL("http://localhost:7777/auth/login");
    });
  });

  test.describe("When authenticated ", () => {
    test.beforeEach(async ({ page }) => {
      // Create and authenticate a user
      await page.goto("http://localhost:7777/auth/login");
      await page.fill("input[name='email']", adminProfil.email);
      await page.fill("input[name='password']", adminProfil.password);

      await Promise.all([
        page.waitForNavigation({ url: "http://localhost:7777/topics" }),
        page.click("button:has-text('Login')"),
      ]);

      expect(page.url()).toBe("http://localhost:7777/topics");

      // Create a topic
      await page.fill("input[name='name']", "New Topic");
      await Promise.all([
        page.waitForNavigation({ url: "http://localhost:7777/topics" }),
        await page.click("input[type='submit']"),
      ]);

      // Create a question
      await page.click("a:has-text('New Topic')");
    });

    test("should display the topics header", async ({ page }) => {
      const header = await page.locator("h1:has-text('Topics:')");
      expect(header).not.toBeNull();
    });

    test("should display the questions list", async ({ page }) => {
      const questionsList = await page.locator(".topics__list");
      expect(questionsList).not.toBeNull();
    });

    test("should allow user to add a new question", async ({ page }) => {
      await page.fill("input[name='question_text']", "New Question");
      await page.click("input[type='submit']");

      const newQuestion = await page.locator(
        ".topics__list__content ul li:has-text('New Question')"
      );
      expect(newQuestion).not.toBeNull();
    });

    // test("should allow user to delete a question", async ({ page }) => {
    //   await page.fill("input[name='question_text']", "Question to Delete");
    //   await page.click("input[type='submit']");

    //   const questionToDelete = await page.locator(
    //     ".topics__list__content ul li:has-text('Question to Delete')"
    //   );
    //   await questionToDelete.locator("button.delete-button").click();

    //   const deletedQuestion = await page.locator(
    //     ".topics__list__content ul li:has-text('Question to Delete')"
    //   );
    //   expect(deletedQuestion).toBeNull();
    // });
  });
});
