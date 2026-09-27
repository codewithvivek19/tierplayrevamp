# Route map

Audit date: 2026-09-26. Source: public Electron Hubs/TierPlay HTML and WordPress public REST records. Raw snapshots live in `../research/live-*.html`; structured evidence in `evidence/extracted-pages.json`. Source statements are legacy claims, not independent validation. No forms submitted.

| Legacy route | Document title | Disposition | Migration decision | Repository |
|---|---|---|---|---|
| / | TierPlay | REDESIGNED | Preserve URL and content purpose; no speculative redirect. | Only / exists as a concept in current app |
| /games/ | Games – TierPlay | REDESIGNED | Preserve URL and content purpose; no speculative redirect. | Missing in app |
| /cabinets/ | Cabinets – TierPlay | REDESIGNED | Preserve URL and content purpose; no speculative redirect. | Missing in app |
| /products/ | Products – TierPlay | REDESIGNED | Preserve URL and content purpose; no speculative redirect. | Missing in app |
| /player-journey/ | Player Journey – TierPlay | REDESIGNED | Preserve URL and content purpose; no speculative redirect. | Missing in app |
| /up-to-date/ | Up to Date – TierPlay | REDESIGNED | Published page has heading and shared form/footer, no substantial body in recovered HTML; request intended content. | Missing in app |
| /contact-sales/ | Contact Sales – TierPlay | REDESIGNED | Preserve URL and content purpose; no speculative redirect. | Missing in app |
| /24-7-support/ | 24/7 SUPPORT – TierPlay | REDESIGNED | Published page has heading and shared form/footer, no substantial body in recovered HTML; request intended content. | Missing in app |
| /games-collection/ | Games Collection – TierPlay | REDESIGNED | Distinct published legacy page with media; retain until business confirms duplicate intent. No automatic merge into Games. | Missing in app |
| /our_games/sunscapes/ | Sunscape 1 Skill Game Board – TierPlay | REDESIGNED | Preserve URL and content purpose; no speculative redirect. | Missing in app |
| /our_games/sunscape-2/ | Sunscape 2 Skill Game Board – TierPlay | REDESIGNED | Preserve URL and content purpose; no speculative redirect. | Missing in app |
| /our_games/sunscape-3/ | Sunscape 3 Skill Game Board – TierPlay | REDESIGNED | Preserve URL and content purpose; no speculative redirect. | Missing in app |
| /our_games/sunscape-4/ | Sunscape 4 Skill Game Board – TierPlay | REDESIGNED | Preserve URL and content purpose; no speculative redirect. | Missing in app |
| /our_games/sunscape-5/ | Sunscape 5 Skill Game Board – TierPlay | REDESIGNED | Preserve URL and content purpose; no speculative redirect. | Missing in app |
| /our_games/sunscape-6/ | Sunscape 5 Skill Game Board – TierPlay | REDESIGNED | Preserve URL and content purpose; no speculative redirect. | Missing in app |
| /2024/06/04/hello-world/ | Hello world! – TierPlay | DEPRECATED-WITH-REASON | Default WordPress post/comment, not company news; preserve snapshot, remove from production content with explicit migration record. | Missing in app |

Header order: Games → Cabinets → Products → Player Journey. Footer adds Up to Date. Contact Sales, 24/7 Support and Games Collection are public REST-discovered routes, not observed in primary navigation. Preserve them without arbitrarily promoting/reordering them.

Privacy Policy and Terms of Service are visible footer text; no usable href recovered. No public /about/ or /contact/ page in the page index. Do not invent those as replacements. Canonical host decision remains pending; preserve path parity when moving to the authorized production hostname.
