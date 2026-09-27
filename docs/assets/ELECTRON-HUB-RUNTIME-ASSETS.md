# Electron Hub runtime asset set

Date: 2026-09-27

The redesign now exposes 104 validated image and logo files from the existing public recovery under `public/media/legacy/`. They were copied byte-for-byte from `assets/source-recovery/`; the authoritative URL, hash, dimensions and rights-review fields remain in `assets/manifest.json` and `docs/MEDIA-RECOVERY.md`.

The recovery file named `tiki-twist.webp` contains an HTML response rather than WebP image bytes, so it remains preserved only in the source-recovery archive and is deliberately excluded from the runtime media directory.

The recovery used only anonymous public pages, WordPress media records and files already returned by those public endpoints. No login, access control, anti-bot system, paywall or private endpoint was bypassed.

Five recovered Sunscape MP4 files remain in `assets/source-recovery/games/` as source material. They are not duplicated into the public bundle because current publication approval, captions, poster decisions and performance treatment are unresolved. The site keeps its existing labelled video production slot until those requirements are approved.

Runtime usage:

- `public/media/legacy/`: original recovered product, feature, board, brand and background media.
- `public/media/generated/theme-v3/`: generated cinematic presentation art.
- `public/media/generated/production-stills/tierplay-logo-official.svg`: exact recovered Tierplay logo used as the visible brand overlay.

The sixth Sunscape route has artwork but no named games or technical description in the public source. Its catalogue card and detail page explicitly state that the source entry is incomplete.
