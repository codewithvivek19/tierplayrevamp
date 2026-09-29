import sharp from "sharp";
import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: "no-preference" });

test("fireball keeps rendered detail across successive animated frames", async ({ page }) => {
  await page.goto("/?no-preloader");
  await expect(page.locator(".portal-hero")).toHaveAttribute("data-scene", "webgl", { timeout: 25000 });
  await page.waitForTimeout(600);
  const samples: Buffer[] = [];
  const coreFrames: Buffer[] = [];
  for (let i = 0; i < 4; i++) {
    const frame = await page.screenshot();
    const { width = 0, height = 0 } = await sharp(frame).metadata();
    if(i === 0){
      // A background outside the far plane used to appear only after scrolling.
      const sky=await sharp(frame).resize(1440,900).extract({left:400,top:105,width:170,height:90}).removeAlpha().raw().toBuffer();
      let cloud=0;
      for(let k=0;k<sky.length;k+=3) if(sky[k]>9 && sky[k+2]>20)cloud++;
      expect(cloud/(170*90),'cosmic clouds are visible in the opening frame').toBeGreaterThan(.12);
    }
    coreFrames.push(await sharp(frame).extract({left:Math.floor(width*.66),top:Math.floor(height*.46),width:Math.floor(width*.06),height:Math.floor(height*.10)}).resize(64,64).removeAlpha().raw().toBuffer());
    const region = sharp(frame).extract({ left: Math.floor(width * .58), top: Math.floor(height * .3), width: Math.floor(width * .2), height: Math.floor(height * .4) });
    const stats = await region.clone().stats();
    // Invalid fragment values can blank the bloom output without any console error.
    expect(Math.max(...stats.channels.slice(0, 3).map(c => c.stdev))).toBeGreaterThan(7);
    samples.push(await region.resize(120, 120).removeAlpha().raw().toBuffer());
    await page.waitForTimeout(200);
  }
  const difference = samples[0].reduce((sum, value, i) => sum + Math.abs(value - samples[3][i]), 0) / samples[0].length;
  expect(difference).toBeGreaterThan(.2);
  const coreChange=coreFrames[0].reduce((sum,value,i)=>sum+Math.abs(value-coreFrames[3][i]),0)/coreFrames[0].length;
  expect(coreChange,'the fireball texture itself flows while scroll is stationary').toBeGreaterThan(4);
});
