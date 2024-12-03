const { test, expect } = require("@playwright/test");

test.describe("Footer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:7777");
  });

  test("Home Icon should redirect to home", async ({ page }) => {
    await page.click("#homeLink");
    expect(page.url()).toBe("http://localhost:7777/");
  });

  test("Linkedin Icon should redirec", async ({ context, page }) => {
    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      page.click("#linkedinLink"),
    ]);
    await newPage.waitForLoadState();
    expect(newPage.url()).toBe("https://www.linkedin.com/in/baptiste-riffard/");
  });

  test("Github Icon should redirect", async ({ page, context }) => {
    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      page.click("#githubLink"),
    ]);
    await newPage.waitForLoadState();
    expect(newPage.url()).toBe("https://github.com/B9R9");
  });
});
