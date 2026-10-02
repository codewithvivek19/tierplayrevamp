import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('output/media-review/qa', { recursive: true });
const browser = await chromium.launch({ args: ['--use-angle=metal'] });
const report = [];
for (const width of [1440, 768, 390, 320]) {
  const page = await browser.newPage({ viewport: { width, height: width > 900 ? 900 : 844 }, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  for (const route of ['/games', '/products', '/player-journey', '/contact-sales', '/']) {
    await page.goto(`http://localhost:3014${route}`);
    await page.locator('h1').waitFor();
    const posters = page.locator('img[src*="campaign-v6"]');
    for (const img of await posters.all()) {
      if (await img.isVisible()) {
        await img.scrollIntoViewIfNeeded();
        await img.evaluate(el => el.decode());
      }
    }
    const checks = await posters.evaluateAll(images => images.map(img => {
      const r = img.getBoundingClientRect();
      return { alt: img.alt, loaded: img.complete && img.naturalWidth > 0, width: r.width, height: r.height, fit: getComputedStyle(img).objectFit, ratio: r.height ? r.width / r.height : 0 };
    }));
    report.push({ width, route, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), images: checks, errors: [...errors] });
    await page.evaluate(() => scrollTo(0, 0));
    const name = route === '/' ? 'home' : route.slice(1);
    if (route !== '/') await page.screenshot({ path: `output/media-review/qa/${name}-${width}.png` });
    if (route === '/player-journey') {
      await page.locator('#sequence').scrollIntoViewIfNeeded();
      await page.screenshot({ path: `output/media-review/qa/journey-posters-${width}.png` });
    }
    if (route === '/') {
      await page.locator('.ds-bento--posters').screenshot({ path: `output/media-review/qa/home-posters-${width}.png` });
      await page.locator('#journey').screenshot({ path: `output/media-review/qa/home-journey-${width}.png` });
    }
  }
  await page.close();
}
await browser.close();
await writeFile('output/media-review/qa/report.json', JSON.stringify(report, null, 2));
const failures = report.filter(r => r.overflow || r.errors.length || r.images.some(i => i.width && (!i.loaded || Math.abs(i.ratio - 4 / 3) > .02)));
console.log(JSON.stringify({ pages: report.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;
