import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ args: ['--use-angle=metal'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto('http://localhost:3004/');
await page.locator('.portal-ready').waitFor({ timeout: 30000 });
await page.waitForTimeout(1800);
const backend = await page.locator('canvas').evaluate(c => { const g = c.getContext('webgl2'), d = g.getExtension('WEBGL_debug_renderer_info'); return { renderer: d ? g.getParameter(d.UNMASKED_RENDERER_WEBGL) : 'unknown', buffer: [c.width, c.height], quality: c.dataset.quality }; });
const evidence = { backend, phases: [], errors };
for (const [phase, progress] of [['hero', 0], ['unfold', .48], ['passage', .64], ['arrival', .97]]) {
  await page.locator('.portal-hero').evaluate((el, p) => window.scrollTo(0, (el.clientHeight - innerHeight) * p), progress);
  await page.waitForTimeout(1200);
  const frameTimes = await page.evaluate(() => new Promise(resolve => {
    const values = []; let last;
    function tick(time) { if (last !== undefined) values.push(time - last); last = time; if (values.length < 120) requestAnimationFrame(tick); else {values.sort((a,b)=>a-b);resolve({median:values[60],p95:values[114],max:values[119]});} }
    requestAnimationFrame(tick);
  }));
  const frame = await page.screenshot({ path: `docs/review/cosmic-fireball/metal-desktop-${phase}.png` });
  if (phase === 'arrival') {
    const pixels = await sharp(frame).extract({left:1400,top:400,width:400,height:400}).stats();
    evidence.arrivalDetail = Math.max(...pixels.channels.map(c=>c.stdev));
    if (evidence.arrivalDetail < 7) throw new Error('Arrival rendering lost detail');
  }
  evidence.phases.push({ phase, frameTimes, quality: await page.locator('canvas').getAttribute('data-quality') });
}
for (const [width,height] of [[320,568],[390,844],[768,1024],[844,390]]) {
  await page.setViewportSize({width,height}); await page.waitForTimeout(350); await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'})); await page.waitForTimeout(1300);
  await page.screenshot({path:`docs/review/cosmic-fireball/metal-${width}x${height}.png`});
  evidence.phases.push({viewport:[width,height], quality:await page.locator('canvas').getAttribute('data-quality'), overflow:await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)});
}
await writeFile('docs/review/cosmic-fireball/metal-review.json',JSON.stringify(evidence,null,2));
console.log(JSON.stringify(evidence,null,2)); await browser.close();
