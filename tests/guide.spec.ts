import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Tierplay guide", () => {
  test("opens, answers from published facts, and closes with Escape", async ({ page }) => {
    await page.goto("/games?no-preloader");
    const launcher = page.getByRole("button", { name: "Open Tierplay guide" });
    await launcher.click();
    const panel = page.getByRole("dialog", { name: "Tierplay guide" });
    await expect(panel).toBeVisible();
    await page.getByLabel("Ask about Tierplay").fill("Which board has Tiki Twist?");
    await page.keyboard.press("Enter");
    await expect(panel).toContainText("Tiki Twist is on Sunscape 2", { timeout: 5000 });
    await panel.getByRole("button", { name: "Availability" }).click();
    await expect(panel).toContainText("not available for Georgia market", { timeout: 5000 });
    await page.getByLabel("Ask about Tierplay").fill("what is the price");
    await page.keyboard.press("Enter");
    await expect(panel).toContainText("Pricing isn’t published", { timeout: 5000 });
    const results = await new AxeBuilder({ page }).include(".guide").analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(page.getByRole("button", { name: "Open Tierplay guide" })).toBeFocused();
  });

  test("off-topic questions get the catalogue fallback", async ({ page }) => {
    await page.goto("/?no-preloader&no-webgl");
    await page.getByRole("button", { name: "Open Tierplay guide" }).click();
    await page.getByLabel("Ask about Tierplay").fill("what is the weather in paris");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog", { name: "Tierplay guide" })).toContainText("I only know Tierplay’s published catalogue", { timeout: 5000 });
  });
});
