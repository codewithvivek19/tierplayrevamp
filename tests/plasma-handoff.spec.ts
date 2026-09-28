import sharp from "sharp";
import { test, expect } from "@playwright/test";

test.use({viewport:{width:1440,height:900},reducedMotion:"no-preference"});
test("fireball remains luminous through both directions of the pillar handoff",async({page})=>{
  test.setTimeout(60000);
  const errors:string[]=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto('/');
  await expect(page.locator('.portal-hero')).toHaveAttribute('data-scene','webgl',{timeout:25000});
  for(const progress of [0,.34,.48,.60,.72,.88,.60,.34,0]){
    await page.locator('.portal-hero').evaluate((el,p)=>window.scrollTo(0,(el.clientHeight-innerHeight)*p),progress);
    await page.waitForTimeout(750);
    const frame=await page.screenshot({path:`docs/review/cosmic-fireball/progress-${progress}.png`});
    const {data,info}=await sharp(frame).extract({left:500,top:160,width:730,height:490}).removeAlpha().raw().toBuffer({resolveWithObject:true});
    let energy=0;
    for(let i=0;i<data.length;i+=info.channels){const r=data[i],g=data[i+1],b=data[i+2];if(b>110&&b>g*1.35&&r>45)energy++;}
    expect(energy,`energy field at progress ${progress}`).toBeGreaterThan(200);
    if(progress >= .88){
      const column=await sharp(frame).extract({left:690,top:210,width:60,height:310}).removeAlpha().raw().toBuffer();
      let filament=0;
      for(let i=0;i<column.length;i+=3) if(column[i]>120 && column[i+2]>155 && column[i+2]>column[i+1]*1.12)filament++;
      expect(filament,'the upper pillar light remains visible, not just its source sphere').toBeGreaterThan(100);
    }
    await expect(page.locator('canvas')).toHaveCount(1);
  }
  // Exercise the world-space ghost trail, idle fade and route cleanup.
  await page.locator('.portal-hero').evaluate(el=>window.scrollTo(0,(el.clientHeight-innerHeight)*.98));
  await page.waitForTimeout(800);
  await page.mouse.move(760,360);
  await page.mouse.move(920,470,{steps:12});
  await page.waitForTimeout(150);
  await page.screenshot({path:'docs/review/cosmic-fireball/pointer-radiance.png'});
  await page.waitForTimeout(2600);
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.waitForTimeout(750);
  await page.getByRole('link',{name:'Explore the games',exact:true}).click();
  await expect(page.locator('canvas')).toHaveCount(0);
  expect(errors).toEqual([]);
});
