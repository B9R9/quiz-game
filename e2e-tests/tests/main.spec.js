// @ts-check
const { test, expect } = require("@playwright/test");

test.describe("Main Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:7777");
  });

  test("should display correct statistics", async ({ page }) => {
    // Attendre que les compteurs soient animés
    await page.waitForTimeout(2500);

    // Vérifier les valeurs des compteurs
    const topics = await page.locator(".stat-number").nth(0).textContent();
    const questions = await page.locator(".stat-number").nth(1).textContent();
    const answers = await page.locator(".stat-number").nth(2).textContent();

    expect(parseInt(topics)).toBe(0);
    expect(parseInt(questions)).toBe(0);
    expect(parseInt(answers)).toBe(0);
  });
});
