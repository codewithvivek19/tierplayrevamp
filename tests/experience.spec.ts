import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test.use({ reducedMotion: "no-preference" });

for (const [width, height] of [[1440, 900], [1024, 768], [768, 1024], [390, 844], [320, 740]]) {
  test(`complete homepage at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await expect(page).toHaveTitle(/Tierplay/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Play beyond/i);
    await expect(page.locator(".battle-hero")).toBeVisible();
    await expect(page.getByRole("heading", { name: /The Sunscape lineup/i })).toBeAttached();
    await expect(page.getByRole("link", { name: "Contact sales", exact: true }).last()).toBeAttached();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}

test("mobile menu closes with Escape and restores focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.locator(".menu-button");
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toBeFocused();
});

test("core navigation routes render", async ({ page }) => {
  for (const route of ["/games", "/cabinets", "/products", "/player-journey", "/contact-sales", "/our_games/sunscapes"]) {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

test("homepage reduced-motion accessibility audit", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.map((violation) => ({ id: violation.id, nodes: violation.nodes.map((node) => node.target) }))).toEqual([]);
});
