import { test, expect } from "@playwright/test";

test.describe("Altitude 3D", () => {
  test("cabinets tour renders the model and steps through published chapters", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/cabinets");
    const tour = page.locator(".altitude-tour");
    await tour.scrollIntoViewIfNeeded();
    await expect(tour).toHaveAttribute("data-mode", /live|image/);
    if ((await tour.getAttribute("data-mode")) === "live") {
      await expect(tour).toHaveAttribute("data-ready", "true", { timeout: 30000 });
      await expect(tour.locator("canvas")).toHaveCount(1);
      await page.getByRole("button", { name: /Payments/ }).click();
      await expect(page.getByRole("button", { name: /Payments/ })).toHaveAttribute("aria-current", "step", { timeout: 10000 });
      await expect(tour.locator("li[data-active='true'] h3")).toHaveText("Validators and ticketing");
    }
    for (const title of ["Altitude Console", "43-inch vertical touchscreen", "Ambient monitor lighting", "Dual bash buttons", "Modular, interchangeable build"]) {
      await expect(tour.locator("h3", { hasText: title })).toHaveCount(1);
    }
    expect(errors).toEqual([]);
  });

  test("reduced motion shows every chapter without the scroll stage", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/cabinets");
    const tour = page.locator(".altitude-tour");
    await expect(tour).toHaveAttribute("data-mode", /still|image/);
    await expect(tour.locator("li")).toHaveCount(7);
    for (const item of await tour.locator("li").all()) await expect(item).toBeVisible();
    await expect(page.locator(".altitude-tour-nav")).toHaveCount(0);
  });

  test("no-WebGL fallback keeps the Altitude image and copy", async ({ page }) => {
    await page.goto("/cabinets?no-webgl");
    const tour = page.locator(".altitude-tour");
    await expect(tour).toHaveAttribute("data-mode", "image");
    await expect(tour.locator("canvas")).toHaveCount(0);
    await expect(tour.locator(".altitude-tour-fallback")).toBeVisible();
    await page.goto("/?no-webgl");
    await page.locator("#cabinets").scrollIntoViewIfNeeded();
    await expect(page.locator(".floating-altitude canvas")).toHaveCount(0);
    await expect(page.locator(".floating-altitude-fallback")).toBeAttached();
    await expect(page.getByRole("heading", { name: "Altitude", exact: true })).toBeVisible();
  });
});
