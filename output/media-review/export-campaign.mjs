import sharp from 'sharp';
import { mkdir, copyFile } from 'node:fs/promises';
const root = '/Users/vivekdutta/.codex/generated_images/01a0d510-4010-7de2-951f-20ebcbfebe5b/';
const assets = {
  'link-jackpot': root + 'exec-306c4280-b94e-40c7-af18-962f5424fb41.png',
  'progressive-jackpots': root + 'exec-55a0b31f-8319-47b3-a039-7136155e70c4.png',
  'loyalty': root + 'exec-75fed6ab-c6a9-4820-8df1-45c8c05c1565.png',
  'collection-management': root + 'exec-8ddf3b31-fb9d-460f-8a09-a86bffe81623.png',
  'sunscape': root + 'exec-669d5fe3-d510-469d-8a45-45806858c1f3.png',
  'gaming-floor': root + 'exec-00f0f8df-b97f-4ebb-aa01-6801f64ad2cf.png',
  'cabinets': 'output/media-review/cabinet-realism-landscape-v1.png',
};
await mkdir('public/media/generated/campaign-v6', { recursive: true });
await mkdir('output/media-review/campaign-v6-originals', { recursive: true });
for (const [name, src] of Object.entries(assets)) {
  await copyFile(src, `output/media-review/campaign-v6-originals/${name}.png`);
  const result = await sharp(src).webp({ quality: 88, effort: 6 }).toFile(`public/media/generated/campaign-v6/${name}.webp`);
  console.log(name, result.width, result.height, result.size);
}
