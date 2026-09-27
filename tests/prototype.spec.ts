import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { sceneReducer, initialScene } from "../prototype/state/SceneDirector";
import { initialQuality, PerformanceManager } from "../prototype/performance/PerformanceManager";
import { parseManifest } from "../prototype/assets/contract";
import { AssetManager } from "../prototype/assets/AssetManager";
import manifest from "../public/media/production/manifest.json";

test("scene rejects entry without assets and ignores stale completion", () => {
  expect(sceneReducer(initialScene, {type:"ENTER"})).toEqual(initialScene);
  let s = sceneReducer(initialScene, {type:"READY",ready:true});
  s = sceneReducer(s,{type:"ENTER"}); const old = s.operation;
  s = sceneReducer(s,{type:"SKIP"});
  expect(s.phase).toBe("FLOOR");
  expect(sceneReducer(s,{type:"SETTLED",operation:old})).toEqual(s);
  s = sceneReducer(s,{type:"FOCUS"}); s = sceneReducer(s,{type:"SELECT"});
  s = sceneReducer(s,{type:"CANCEL"}); expect(s.phase).toBe("FOCUS");
});
test("semantic path settles through screen entry and supports return", () => {
  let s = sceneReducer(initialScene,{type:"READY",ready:true});
  s=sceneReducer(s,{type:"ENTER"}); s=sceneReducer(s,{type:"SETTLED",operation:s.operation});
  s=sceneReducer(s,{type:"FOCUS"}); s=sceneReducer(s,{type:"SELECT"});
  s=sceneReducer(s,{type:"SETTLED",operation:s.operation});expect(s.phase).toBe("CROSSING");
  s=sceneReducer(s,{type:"SETTLED",operation:s.operation});expect(s.phase).toBe("EXIT");
  expect(sceneReducer(s,{type:"CANCEL"}).phase).toBe("FOCUS");
});
test("manifest cannot silently omit or redirect required assets",()=>{
  expect(parseManifest(manifest).assets).toHaveLength(3);
  expect(()=>parseManifest({...manifest,assets:[]})).toThrow();
  const invalid=structuredClone(manifest);invalid.assets[0].url="https://outside.example/asset.glb" as never;
  expect(()=>parseManifest(invalid)).toThrow("local media path");
});
test("quality waits for sustained slow frames and honors static preferences",()=>{
  expect(initialQuality({reduced:true,saveData:false,coarse:false,noWebgl:false})).toBe("static");
  const monitor=new PerformanceManager("high");
  for(let i=0;i<179;i++) monitor.sample(40);
  expect(monitor.tier).toBe("high");monitor.sample(40);expect(monitor.tier).toBe("balanced");
});
test("missing and unapproved assets never trigger downloads",async()=>{
  const manager=new AssetManager();manager.configure(parseManifest(manifest).assets);
  await manager.load("cabinet-altitude");
  expect(manager.snapshot().every(r=>r.status==="blocked")).toBe(true);
  expect(manager.get("TP-001")).toBeUndefined();
});
test("cancelled download cannot repopulate a new asset generation",async()=>{
  const original=global.fetch;
  let finish: ((r:Response)=>void)|undefined;
  global.fetch=()=>new Promise<Response>(resolve=>{finish=resolve;});
  try {
    const manager=new AssetManager();manager.configure([{id:"test",label:"test",kind:"image",bundle:"critical",url:"/media/test.webp",approved:true,required:true}]);
    const loading=manager.load("critical");manager.configure([]);
    finish!(new Response(new Uint8Array([1,2,3])));await loading;
    expect(manager.snapshot()).toEqual([]);expect(manager.get("test")).toBeUndefined();
  } finally {global.fetch=original;}
});
for(const [width,height] of [[2560,1080],[1440,900],[1024,768],[768,1024],[390,844],[320,740]]) {
  test(`prototype layout and truthful asset gate ${width}`,async({page})=>{
    await page.setViewportSize({width,height});const errors:string[]=[];page.on("pageerror",e=>errors.push(e.message));
    await page.goto("/prototype-01");await expect(page.getByRole("button",{name:"Load experience"})).toBeDisabled();
    await expect(page.getByRole("heading",{name:"ALTITUDE",exact:true})).toBeVisible();
    await page.getByRole("button",{name:"Inspect reference"}).click();
    await expect(page.getByText("This is the recovered product image",{exact:false})).toBeVisible();
    await page.keyboard.press("Escape");await expect(page.getByRole("button",{name:"Inspect reference"})).toBeVisible();
    await page.getByText("Production readiness",{exact:false}).click();
    await expect(page.getByText("BLOCKED BY ASSET: TP-001",{exact:false})).toBeVisible();
    expect(await page.locator("canvas").count()).toBe(0);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}
test("prototype menu escape restores focus",async({page})=>{
  await page.goto("/prototype-01");const button=page.getByRole("button",{name:"Index +"});await button.click();
  await page.getByRole("navigation",{name:"Study navigation"}).getByRole("link",{name:"Interface system"}).focus();await page.keyboard.press("Escape");await expect(button).toBeFocused();
});
test("manifest error preserves reference and allows retry",async({page})=>{
  await page.route("**/media/production/manifest.json",route=>route.fulfill({status:503,body:"unavailable"}));
  await page.goto("/prototype-01");await expect(page.getByRole("status")).toContainText("unavailable");
  await expect(page.getByRole("img",{name:"Original Tierplay"})).toBeVisible();
  await page.unroute("**/media/production/manifest.json");await page.getByText("Production readiness",{exact:false}).click();
  await page.getByRole("button",{name:"Check assets again"}).click();await expect(page.getByText("BLOCKED BY ASSET",{exact:false})).toBeVisible();
});
test("interface tabs use keyboard and form never sends",async({page})=>{
  const posts:string[]=[];page.on("request",r=>{if(r.method()==="POST")posts.push(r.url());});
  await page.goto("/design-system");await page.getByRole("tab",{name:"Cabinet",exact:true}).focus();await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab",{name:"Display",exact:true})).toHaveAttribute("aria-selected","true");
  await page.getByLabel("Email (required)").fill("review@example.com");await page.getByRole("radio",{name:"Operator",exact:true}).check();
  await page.getByRole("button",{name:"Validate fields"}).click();await expect(page.getByRole("status")).toContainText("has not sent or saved");expect(posts).toEqual([]);
});
for(const path of ["/prototype-01?no-webgl=1","/design-system"]) test(`accessible static interface ${path}`,async({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"});await page.goto(path);
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
});
