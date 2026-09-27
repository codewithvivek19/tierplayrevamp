# Forensic audit

Audit date: 2026-09-26. Source: public Electron Hubs/TierPlay HTML and WordPress public REST records. Raw snapshots live in `../research/live-*.html`; structured evidence in `evidence/extracted-pages.json`. Source statements are legacy claims, not independent validation. No forms submitted.

Coverage: nine public WordPress pages, six public game entries and one default blog post recovered. Public pages API returned nine records with per_page=10; game API returned six; posts API returned one. Hidden/draft/private content is outside public evidence. The source hostname has a certificate mismatch; ordinary HTTPS failed. Public unauthenticated recovery used curl certificate-verification bypass, recorded explicitly; browser security interstitials were not bypassed. Live UX/form delivery cannot be certified from HTML.

Earlier recovery was incomplete: home/cabinets snapshots were empty; `/sunscape-N/` paths were incorrect or returned home content. The correct board routes are `/our_games/sunscapes/` and `/our_games/sunscape-2/` … `/our_games/sunscape-6/`. Do not use old snapshots as detail-page evidence.

The final cabinet fetch completed after an initial partial timeout. Fetch log hashes identify retained files. API retry and raw text preserve both successful and failed evidence. No production implementation occurred in this audit.

Start with CONTENT-INVENTORY, ROUTE-MAP, PAGE-SEQUENCE, FEATURE-MATRIX, and SOURCE-CONFLICTS. Audit completeness means recovered public content is accounted for; it does not mean all factual conflicts or operational endpoints are resolved.
