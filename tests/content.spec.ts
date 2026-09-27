import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = [
  "/games", "/cabinets", "/products", "/player-journey", "/games-collection",
  "/contact-sales", "/24-7-support", "/up-to-date",
  "/our_games/sunscapes", "/our_games/sunscape-2", "/our_games/sunscape-3",
  "/our_games/sunscape-4", "/our_games/sunscape-5", "/our_games/sunscape-6",
];

test("all recovered-content routes render without broken media or overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const broken = await page.locator("img").evaluateAll(async (images) => {
      const checks = await Promise.all(images.map(async (image) => {
        const source = (image as HTMLImageElement).currentSrc || (image as HTMLImageElement).src;
        if (!source) return "missing src";
        const response = await fetch(source);
        return response.ok ? null : `${response.status} ${source}`;
      }));
      return checks.filter(Boolean);
    });
    expect(broken, `broken media on ${route}`).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test("catalogue retains the complete named-game evidence and accessible structure", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/games");
  await expect(page.locator(".board-card")).toHaveCount(6);
  for (const title of ["Rich Times", "Gang of Evils", "Rise of the Dragon", "Bison Showdown", "Tiki Twist", "Sinister Show", "Fortune Quest", "Birix Haven", "Fiery Frenzy", "Jade Empire", "Fiesta Riches", "Mermaid’s Treasure", "Eagle Strike", "Frozen War", "Bandit Bounty"]) {
    await expect(page.locator("body")).toContainText(title);
  }
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.map(({ id }) => id)).toEqual([]);
});
