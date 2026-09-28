import sharp from "sharp";
import { test, expect } from "@playwright/test";

test.use({ reducedMotion: "no-preference" });
for (const [width, height] of [[320, 568], [390, 844], [844, 390], [768, 1024], [1024, 768], [1920, 1080]]) {
  test(`environment framing and reversible scroll at ${width}x${height}`, async ({ page }) => {
    test.setTimeout(60000);
    await page.setViewportSize({ width, height });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    await page.goto("/");
    const hero = page.locator(".portal-hero");
    await expect(hero).toHaveAttribute("data-scene", "webgl", { timeout: 25000 });
    const stage = await page.locator(".portal-stage").boundingBox();
    expect(stage?.height).toBeLessThanOrEqual(height + 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    for (const name of ["Explore the games", "Skip to explore"]) {
      await expect(page.getByRole("link", { name, exact: true })).toBeInViewport({ ratio: .99 });
    }
    const pause = await page.getByRole("button", { name: "Pause motion", exact: true }).boundingBox();
    expect(pause!.y + pause!.height).toBeLessThanOrEqual(height + 1);
    await page.screenshot({ path: `docs/review/environment-polish/final-${width}x${height}-hero.png` });
    await hero.evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + scrollY + (el.clientHeight - document.querySelector(".portal-stage")!.clientHeight) * .99));
    await expect(hero).toHaveAttribute("data-chapter", "2");
    await expect(page.locator(".portal-arrival-copy")).toHaveCSS("opacity", "1");
    await expect(page.getByRole("link", { name: "Discover the Tierplay experience" })).toBeInViewport();
    const arrivalFrame = await page.screenshot({ path: `docs/review/environment-polish/final-${width}x${height}-arrival.png` });
    // DOM/canvas presence alone missed a NaN spreading through the bloom pass.
    // Inspect an architectural region above the copy for actual rendered detail.
    const pixels = await sharp(arrivalFrame).extract({ left: Math.floor(width * .48), top: Math.floor(height * .25), width: Math.floor(width * .23), height: Math.floor(height * .22) }).stats();
    expect(Math.max(...pixels.channels.slice(0, 3).map(channel => channel.stdev))).toBeGreaterThan(7);
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(hero).toHaveAttribute("data-chapter", "0");
    await expect(page.locator(".battle-hero-content")).not.toHaveAttribute("inert", "");
    await expect(page.locator("canvas")).toHaveCount(1);
    expect(errors).toEqual([]);
  });
}
