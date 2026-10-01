import { test, expect } from "@playwright/test";

test.describe("Cabinet 3D", () => {
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

  test("the tour switches to the Pinnacle and opens on it from a link", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/cabinets?no-preloader");
    const tour = page.locator(".altitude-tour");
    await tour.scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: /^Pinnacle/ }).click();
    await expect(tour).toHaveAttribute("data-cabinet", "pinnacle");
    await expect(page.getByRole("heading", { name: "Pinnacle, part by part." })).toBeVisible();
    await expect(tour.locator("h3", { hasText: "43-inch curved touchscreen" })).toHaveCount(1);
    await expect(page.getByRole("button", { name: /^Pinnacle/ })).toHaveAttribute("aria-pressed", "true");
    await page.goto("/cabinets?no-preloader#altitude-3d");
    await expect(page.locator(".altitude-tour")).toHaveAttribute("data-cabinet", "altitude");
    await page.getByRole("navigation", { name: "Choose a console to tour" }).getByRole("link", { name: /Pinnacle/ }).click();
    await expect(page.locator(".altitude-tour")).toHaveAttribute("data-cabinet", "pinnacle");
    if ((await tour.getAttribute("data-mode")) === "live") {
      await expect(tour).toHaveAttribute("data-ready", "true", { timeout: 30000 });
      await page.getByRole("button", { name: /Explore in 360/ }).first().click();
      const dialog = page.getByRole("dialog", { name: "Explore the Pinnacle" });
      await expect(dialog).toBeVisible();
      await dialog.getByRole("button", { name: "Lights out" }).click();
      await expect(dialog.getByRole("button", { name: "Lights out" })).toHaveAttribute("aria-pressed", "true");
      await dialog.getByRole("button", { name: /^Altitude/ }).click();
      await expect(page.getByRole("dialog", { name: "Explore the Altitude" })).toBeVisible();
      await page.keyboard.press("Escape");
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

  test("both consoles get equal billing on the homepage showroom", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/?no-preloader");
    const showroom = page.locator(".showroom");
    await showroom.scrollIntoViewIfNeeded();
    await expect(showroom).toHaveAttribute("data-mode", /live|image/);
    if ((await showroom.getAttribute("data-mode")) === "live") {
      await expect(showroom.getByRole("button", { name: /Altitude/ })).toHaveAttribute("aria-pressed", "true");
      await showroom.getByRole("button", { name: /Pinnacle/ }).click();
      await expect(showroom).toHaveAttribute("data-active", "pinnacle", { timeout: 10000 });
      await expect(showroom.getByRole("heading", { name: "Pinnacle", exact: true })).toBeVisible();
      await expect(showroom.locator("canvas")).toHaveCount(1);
    }
    expect(errors).toEqual([]);
  });

  test("no-WebGL fallback keeps the cabinet images and copy", async ({ page }) => {
    await page.goto("/cabinets?no-webgl");
    const tour = page.locator(".altitude-tour");
    await expect(tour).toHaveAttribute("data-mode", "image");
    await expect(tour.locator("canvas")).toHaveCount(0);
    await expect(tour.locator(".altitude-tour-fallback")).toBeVisible();
    await expect(page.locator(".cab-hero canvas")).toHaveCount(0);
    await expect(page.locator(".cab-hero__fallback img")).toHaveCount(2);
    await page.goto("/?no-webgl");
    await page.locator("#cabinets").scrollIntoViewIfNeeded();
    await expect(page.locator(".showroom canvas")).toHaveCount(0);
    await expect(page.locator(".showroom__card")).toHaveCount(2);

    await expect(page.getByRole("heading", { name: "Altitude", exact: true })).toBeVisible();
  });
});
