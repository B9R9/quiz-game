const { test, expect } = require("@playwright/test");
const { userProfil, adminProfil } = require("./utils/utils");

test.describe("Topics Page", () => {
  test.describe("when user is not authenticated", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("http://localhost:7777/topics");
    });

    test("should redirect to login", async ({ page }) => {
      expect(page.url()).toBe("http://localhost:7777/auth/login");
    });
  });

  test.describe("when user is authenticated but not Admin", () => {
    test.beforeEach(async ({ page }) => {
      // Create and authenticate a user
      await page.goto("http://localhost:7777/auth/login");
      await page.fill("input[name='email']", userProfil.email);
      await page.fill("input[name='password']", userProfil.password);

      await Promise.all([
        page.waitForNavigation({ url: "http://localhost:7777/topics" }),
        page.click("button:has-text('Login')"),
      ]);

      expect(page.url()).toBe("http://localhost:7777/topics");
    });
    test("should display the topics header", async ({ page }) => {
      const header = await page.locator("h1:has-text('Topics:')");
      expect(header).not.toBeNull();
    });

    test("should display the topics list", async ({ page }) => {
      const topicsList = await page.locator(".topics__list");
      expect(topicsList).not.toBeNull();
    });
    test("shouldn't display the create topic form if user is not admin", async ({
      page,
    }) => {
      const createTopicForm = await page.locator(".topics__form");
      await expect(createTopicForm).toBeHidden();
    });
  });

  test.describe("when user is Admin", () => {
    test.beforeEach(async ({ page }) => {
      // Create and authenticate an admin user
      await page.goto("http://localhost:7777/auth/login");
      await page.fill("input[name='email']", adminProfil.email);
      await page.fill("input[name='password']", adminProfil.password);

      await Promise.all([
        page.waitForNavigation({ url: "http://localhost:7777/topics" }),
        page.click("button:has-text('Login')"),
      ]);

      expect(page.url()).toBe("http://localhost:7777/topics");
    });

    test("should display the create topic form if user is admin", async ({
      page,
    }) => {
      const createTopicForm = await page.locator(".topics__form");
      expect(createTopicForm).not.toBeNull();
    });

    test("should allow admin to create a new topic", async ({ page }) => {
      await page.goto("http://localhost:7777/topics");
      await page.fill("input[name='name']", "Test adding new topic");
      await page.click("input[type='submit']");
      await page.waitForSelector(".topics__list__content ul li");
      const newTopic = await page.locator(
        ".topics__list__content ul li:has-text('New Topic')"
      );
      expect(newTopic).not.toBeNull();
    });

    test("should display delete button for each topic if user is admin", async ({
      page,
    }) => {
      await page.goto("http://localhost:7777/topics");
      const deleteButtons = await page.locator(".delete-button");
      expect(await deleteButtons.count()).toBeGreaterThan(0);
    });

    test("should allow admin to delete a topic", async ({ page }) => {
      await page.goto("http://localhost:7777/topics");
      await page.fill("input[name='name']", "Topic to delete");
      await page.click("input[type='submit']");
      await page.waitForSelector(".topics__list__content ul li");
      const topicToDelete = await page.locator(
        ".topics__list__content ul li:has-text('Topic to delete')"
      );
      expect(topicToDelete).not.toBeNull();
      await topicToDelete.locator(".delete-button").click();
      await page.waitForSelector(
        ".topics__list__content ul li:has-text('Topic to delete')",
        { state: "detached" }
      );
    });

    test("should display error message if topic name is empty", async ({
      page,
    }) => {
      await page.goto("http://localhost:7777/topics");
      const submitButton = await page.locator("input[type='submit']");
      await submitButton.click();
      const errorMessage = await page.locator(
        "#error-message:has-text('Topic name must be at least 1 character long.')"
      );
      expect(errorMessage).not.toBeNull();
    });

    test("should add a new topic to the list if name is valid", async ({
      page,
    }) => {
      await page.goto("http://localhost:7777/topics");
      await page.fill("input[name='name']", "New Topic");
      await page.click("input[type='submit']");
      await page.waitForSelector(".topics__list__content ul li");
      const newTopic = await page.locator(
        ".topics__list__content ul li:has-text('New Topic')"
      );
      expect(newTopic).not.toBeNull();
    });

    test("should delete a topic from the list", async ({ page }) => {
      await page.goto("http://localhost:7777/topics");
      await page.fill("input[name='name']", "Topic to delete");
      await page.click("input[type='submit']");
      await page.waitForSelector(".topics__list__content ul li");
      const topicToDelete = await page.locator(
        ".topics__list__content ul li:has-text('Topic to delete')"
      );
      expect(topicToDelete).not.toBeNull();
      await topicToDelete.locator(".delete-button").click();
      await page.waitForSelector(
        ".topics__list__content ul li:has-text('Topic to delete')",
        { state: "detached" }
      );
    });
  });
});
