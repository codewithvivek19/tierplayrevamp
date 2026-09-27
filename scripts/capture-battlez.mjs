import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:3004');
await page.locator('.battle-hero-image img').evaluate(img=>img.decode());
await page.screenshot({path:'docs/review/battlez-desktop.png'});
for(const id of ['experience','cabinets','games']){
 await page.locator('#'+id).scrollIntoViewIfNeeded();
 await page.screenshot({path:`docs/review/battlez-${id}.png`});
}
await page.locator('.footer-callout').scrollIntoViewIfNeeded();
await page.screenshot({path:'docs/review/battlez-footer.png'});
for(const width of [390,320]){
 await page.setViewportSize({width,height:844});await page.goto('http://127.0.0.1:3004');
 await page.locator('.battle-hero-image img').evaluate(img=>img.decode());
 await page.screenshot({path:`docs/review/battlez-mobile-${width}.png`});
 await page.locator('#games').scrollIntoViewIfNeeded();await page.screenshot({path:`docs/review/battlez-games-${width}.png`});
}
console.log({errors});await browser.close();
