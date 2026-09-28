import sharp from 'sharp';
import {test,expect} from '@playwright/test';

test('opening has no luminous tail and detail survives a 4K viewport',async({page})=>{
  test.setTimeout(60000);
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/');
  const hero=page.locator('.portal-hero');
  await expect(hero).toHaveAttribute('data-scene','webgl',{timeout:25000});
  await page.waitForTimeout(1000);
  const opening=await page.screenshot({path:'docs/review/cosmic-fireball/no-tail-opening.png'});
  // This area previously contained the luminous diagonal fireball tail.
  const data=await sharp(opening).extract({left:1085,top:200,width:95,height:110}).removeAlpha().raw().toBuffer();
  let bright=0;
  for(let i=0;i<data.length;i+=3)if(data[i]>125&&data[i+1]>100&&data[i+2]>160)bright++;
  expect(bright/(95*110),'the opening tail is absent').toBeLessThan(.025);
  for(const progress of [.37,.44,.58,.9,0]){
    await hero.evaluate((el,p)=>window.scrollTo(0,(el.clientHeight-innerHeight)*p),progress);
    await page.waitForTimeout(800);
    await page.screenshot({path:`docs/review/cosmic-fireball/departure-${progress}.png`});
  }
  await page.setViewportSize({width:3840,height:2160});
  await page.waitForTimeout(1000);
  const frame=await page.screenshot({path:'docs/review/cosmic-fireball/opening-4k.png'});
  const stats=await sharp(frame).extract({left:2500,top:960,width:180,height:200}).stats();
  expect(Math.max(...stats.channels.slice(0,3).map(c=>c.stdev))).toBeGreaterThan(7);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
