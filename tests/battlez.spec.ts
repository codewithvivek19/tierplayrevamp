import { test, expect } from "@playwright/test";
test("game cards and hero links lead to Tierplay destinations", async ({ page }) => {
  await page.goto("/?no-preloader");
  await page.getByRole("link", { name: "Explore the games", exact: true }).click();
  await expect(page).toHaveURL(/\/games$/);
  await expect(page.locator(".ds-board-grid .ds-card")).toHaveCount(6);
  await page.locator(".ds-board-grid").getByRole("link", { name: /Sunscape 2/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sunscape 2 Skill Game Board");
});
test("no WebGL is required and reduced motion preserves content", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?no-webgl");
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator(".hero-copy h1")).toBeVisible();
  await expect(page.locator(".battle-hero-image")).toHaveCSS("transform", "none");
  await expect(page.locator(".ds-note--market").first()).toHaveText("not available for Georgia market");
});
