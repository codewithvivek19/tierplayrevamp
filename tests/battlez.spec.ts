import { test, expect } from "@playwright/test";
test("game cards and hero links lead to Tierplay destinations", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Explore our games" }).click();
  await expect(page).toHaveURL(/\/games$/);
  await expect(page.locator(".battle-game-card")).toHaveCount(6);
  await page.getByRole("link", { name: "Explore Rich Times", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Rich Times");
});
test("no WebGL is required and reduced motion preserves content", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?no-webgl");
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator(".battle-hero-copy h1")).toBeVisible();
  await expect(page.locator(".battle-hero-image")).toHaveCSS("transform", "none");
  await expect(page.locator(".market-note")).toHaveText("not available for Georgia market");
});
