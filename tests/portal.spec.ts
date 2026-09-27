import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });

test("portal renders, travels in both scroll directions, pauses and exits", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/");
  const hero = page.locator(".portal-hero");
  await expect(hero).toHaveAttribute("data-scene", "webgl", { timeout: 20000 });
  await expect(page.locator("canvas")).toHaveCount(1);
  await hero.evaluate(el => window.scrollTo(0, (el.clientHeight - innerHeight) * .99));
  await expect(hero).toHaveAttribute("data-chapter", "2");
  await expect(page.locator(".portal-arrival-copy")).toHaveCSS("opacity", "1");
  // The destination stays in the same live canvas; it must not become an image overlay.
  await expect(page.locator("canvas")).toHaveCount(1);
  await expect(page.locator(".portal-canvas")).toHaveCSS("opacity", "1");
  await expect(page.locator(".portal-arrival")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Every world starts here." })).toBeVisible();
  await expect(page.locator(".battle-hero-content")).toHaveAttribute("inert", "");
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(hero).toHaveAttribute("data-chapter", "0");
  await page.getByRole("button", { name: "Pause motion" }).click();
  await expect(page.getByRole("button", { name: "Resume motion" })).toHaveAttribute("aria-pressed", "true");
  await page.waitForTimeout(1500);
  const frame = await page.locator("canvas").screenshot();
  await page.waitForTimeout(350);
  expect(await page.locator("canvas").screenshot()).toEqual(frame);
  await page.getByRole("button", { name: "Resume motion" }).click();
  await page.getByRole("link", { name: "Skip to explore" }).click();
  await expect(page.locator("#experience")).toBeInViewport();
  expect(errors).toEqual([]);
});

test("context loss returns to the original hero image and usable navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".portal-hero")).toHaveAttribute("data-scene", "webgl", { timeout: 20000 });
  await page.locator("canvas").evaluate(canvas => {
    const gl = (canvas as HTMLCanvasElement).getContext("webgl2");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  });
  await expect(page.locator(".portal-hero")).toHaveAttribute("data-scene", "still");
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator(".battle-hero-image")).toHaveCSS("opacity", "1");
  await page.getByRole("link", { name: "Explore the games" }).click();
  await expect(page).toHaveURL(/\/games$/);
});

test("explicit WebGL fallback and live reduced-motion changes remove the long stage", async ({ page }) => {
  await page.goto("/?no-webgl");
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator(".portal-hero")).toHaveClass(/portal-static/);
  await expect(page.locator(".portal-static-gateway img")).toBeAttached();
  await page.goto("/");
  await expect(page.locator(".portal-hero")).toHaveAttribute("data-scene", "webgl", { timeout: 20000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator(".portal-hero")).toHaveClass(/portal-static/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("mobile scene fits the page and remounts once after route navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".portal-hero")).toHaveAttribute("data-scene", "webgl", { timeout: 20000 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.getByRole("link", { name: "Explore the games" })).toBeInViewport();
  await page.getByRole("link", { name: "Explore the games" }).click();
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.goBack();
  await expect(page.locator(".portal-hero")).toHaveAttribute("data-scene", "webgl", { timeout: 20000 });
  await expect(page.locator("canvas")).toHaveCount(1);
});
