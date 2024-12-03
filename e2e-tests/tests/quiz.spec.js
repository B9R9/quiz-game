const { test, expect } = require("@playwright/test");

test.describe("Quiz Page", () => {
  test.beforeEach(async ({ page }) => {
    // Créer et authentifier un utilisateur
    await page.goto("http://localhost:7777/auth/register");
    await page.fill("input[name='email']", "user@example.com");
    await page.fill("input[name='username']", "user");
    await page.fill("input[name='password']", "Password123");
    await page.fill("input[name='confirmPW']", "Password123");
    await page.click("button:has-text('Create')");

    await page.goto("http://localhost:7777/auth/login");
    await page.fill("input[name='email']", "user@example.com");
    await page.fill("input[name='password']", "Password123");
    await page.click("button:has-text('Login')");
  });

  // test("should redirect to login if user is not authenticated", async ({
  //   page,
  // }) => {
  //   await page.evaluate(() => {
  //     window.localStorage.removeItem("user");
  //   });
  //   await page.goto("http://localhost:7777/quiz");
  //   await expect(page).toHaveURL("http://localhost:7777/auth/login");
  // });

  test("should display topics if user is authenticated", async ({ page }) => {
    await page.goto("http://localhost:7777/quiz");
    const header = await page.locator(".quiz__header h1");
    expect(header).not.toBeNull();

    const topicsList = await page.locator(".quiz-topics-list");
    expect(await topicsList.count()).toBeGreaterThan(0);
  });

  // test("should allow user to choose a topic", async ({ page }) => {
  //   await page.goto("http://localhost:7777/quiz");
  //   const topics = await page.locator(".quiz-topic-container a");
  //   expect(await topics.count()).toBeGreaterThan(0);

  //   await topics.first().click();
  //   await page.waitForNavigation();
  //   expect(page.url()).toContain("/quiz/");
  // });
});

test.describe("Question Page", () => {
  test.beforeEach(async ({ page }) => {
    // Créer et authentifier un utilisateur
    await page.goto("http://localhost:7777/auth/register");
    await page.fill("input[name='email']", "user@example.com");
    await page.fill("input[name='username']", "user");
    await page.fill("input[name='password']", "Password123");
    await page.fill("input[name='confirmPW']", "Password123");
    await page.click("button:has-text('Create')");

    await page.goto("http://localhost:7777/auth/login");
    await page.fill("input[name='email']", "user@example.com");
    await page.fill("input[name='password']", "Password123");
    await page.click("button:has-text('Login')");

    // Choisir un sujet
    await page.goto("http://localhost:7777/quiz");
    const topics = await page.locator(".quiz-topic-container a");
    await topics.first().click();
    await page.waitForNavigation();
  });

  // test("should display question and options if user is authenticated", async ({
  //   page,
  // }) => {
  //   const questionHeader = await page.locator(".question-header h1");
  //   expect(questionHeader).not.toBeNull();

  //   const options = await page.locator(
  //     ".answer-topics .answer-topic-container"
  //   );
  //   expect(await options.count()).toBeGreaterThan(0);
  // });

  // test("should allow user to choose an option and see result", async ({
  //   page,
  // }) => {
  //   const options = await page.locator(
  //     ".answer-topics .answer-topic-container form input[type='submit']"
  //   );
  //   expect(await options.count()).toBeGreaterThan(0);

  //   await options.first().click();
  //   await page.waitForNavigation();
  //   expect(page.url()).toContain("/quiz/");
  // });
});

test.describe("Result Page", () => {
  test.beforeEach(async ({ page }) => {
    // Créer et authentifier un utilisateur
    await page.goto("http://localhost:7777/auth/register");
    await page.fill("input[name='email']", "user@example.com");
    await page.fill("input[name='username']", "user");
    await page.fill("input[name='password']", "Password123");
    await page.fill("input[name='confirmPW']", "Password123");
    await page.click("button:has-text('Create')");

    await page.goto("http://localhost:7777/auth/login");
    await page.fill("input[name='email']", "user@example.com");
    await page.fill("input[name='password']", "Password123");
    await page.click("button:has-text('Login')");

    // Choisir un sujet et une question
    await page.goto("http://localhost:7777/quiz");
    const topics = await page.locator(".quiz-topic-container a");
    await topics.first().click();
    await page.waitForNavigation();

    const options = await page.locator(
      ".answer-topics .answer-topic-container form input[type='submit']"
    );
    await options.first().click();
    await page.waitForNavigation();
  });

  // test("should display correct result", async ({ page }) => {
  //   const resultHeader = await page.locator(".result-text h1");
  //   expect(resultHeader).not.toBeNull();

  //   const homeLink = await page.locator(".result-links a:has-text('Home')");
  //   expect(homeLink).not.toBeNull();

  //   const topicsLink = await page.locator(".result-links a:has-text('Topics')");
  //   expect(topicsLink).not.toBeNull();

  //   const nextQuestionLink = await page.locator(
  //     ".result-links a:has-text('Next Question')"
  //   );
  //   expect(nextQuestionLink).not.toBeNull();
  // });
});
