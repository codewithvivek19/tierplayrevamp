from pathlib import Path
import json,re,hashlib,collections
root=Path('.'); E=json.loads(Path('docs/audit/evidence/extracted-pages.json').read_text())
def write(p,s): Path(p).parent.mkdir(parents=True,exist_ok=True);Path(p).write_text(s.strip()+'\n')
def table(headers,rows):
 def esc(x):return str(x).replace('|','\\|').replace('\n',' ')
 return '| '+' | '.join(headers)+' |\n|'+'|'.join(['---']*len(headers))+'|\n'+'\n'.join('| '+' | '.join(esc(x) for x in row)+' |' for row in rows)+'\n'
routes=[('/', 'live-home.html'),('/games/','live-games.html'),('/cabinets/','live-cabinets.html'),('/products/','live-products.html'),('/player-journey/','live-player-journey.html'),('/up-to-date/','live-up-to-date.html'),('/contact-sales/','live-contact-sales.html'),('/24-7-support/','live-24-7-support.html'),('/games-collection/','live-games-collection.html'),('/our_games/sunscapes/','live-our_games_sunscapes.html')]+[('/our_games/sunscape-'+str(i)+'/', 'live-our_games_sunscape-'+str(i)+'.html') for i in range(2,7)]+[('/2024/06/04/hello-world/','live-hello-world.html')]
intro='Audit date: 2026-09-26. Source: public Electron Hubs/TierPlay HTML and WordPress public REST records. Raw snapshots live in `../research/live-*.html`; structured evidence in `evidence/extracted-pages.json`. Source statements are legacy claims, not independent validation. No forms submitted.\n\n'
write('docs/audit/README.md', '# Forensic audit\n\n'+intro+'''Coverage: nine public WordPress pages, six public game entries and one default blog post recovered. Public pages API returned nine records with per_page=10; game API returned six; posts API returned one. Hidden/draft/private content is outside public evidence. The source hostname has a certificate mismatch; ordinary HTTPS failed. Public unauthenticated recovery used curl certificate-verification bypass, recorded explicitly; browser security interstitials were not bypassed. Live UX/form delivery cannot be certified from HTML.

Earlier recovery was incomplete: home/cabinets snapshots were empty; `/sunscape-N/` paths were incorrect or returned home content. The correct board routes are `/our_games/sunscapes/` and `/our_games/sunscape-2/` … `/our_games/sunscape-6/`. Do not use old snapshots as detail-page evidence.

The final cabinet fetch completed after an initial partial timeout. Fetch log hashes identify retained files. API retry and raw text preserve both successful and failed evidence. No production implementation occurred in this audit.

Start with CONTENT-INVENTORY, ROUTE-MAP, PAGE-SEQUENCE, FEATURE-MATRIX, and SOURCE-CONFLICTS. Audit completeness means recovered public content is accounted for; it does not mean all factual conflicts or operational endpoints are resolved.''')
routeRows=[]
for r,f in routes:
 status='DEPRECATED-WITH-REASON' if 'hello-world' in r else 'REDESIGNED'
 note='Default WordPress post/comment, not company news; preserve snapshot, remove from production content with explicit migration record.' if 'hello-world' in r else 'Preserve URL and content purpose; no speculative redirect.'
 if r=='/games-collection/':note='Distinct published legacy page with media; retain until business confirms duplicate intent. No automatic merge into Games.'
 if r in ['/24-7-support/','/up-to-date/']:note='Published page has heading and shared form/footer, no substantial body in recovered HTML; request intended content.'
 routeRows.append([r,E[f]['title'][0] if E[f]['title'] else '',status,note,'Only / exists as a concept in current app' if r=='/' else 'Missing in app'])
write('docs/audit/ROUTE-MAP.md','# Route map\n\n'+intro+table(['Legacy route','Document title','Disposition','Migration decision','Repository'],routeRows)+'''\nHeader order: Games → Cabinets → Products → Player Journey. Footer adds Up to Date. Contact Sales, 24/7 Support and Games Collection are public REST-discovered routes, not observed in primary navigation. Preserve them without arbitrarily promoting/reordering them.

Privacy Policy and Terms of Service are visible footer text; no usable href recovered. No public /about/ or /contact/ page in the page index. Do not invent those as replacements. Canonical host decision remains pending; preserve path parity when moving to the authorized production hostname.''')
write('docs/audit/ROUTES.md','# Routes\n\nCanonical audit: [ROUTE-MAP.md](ROUTE-MAP.md).')
# Every heading/paragraph/list block and raw page retained with a disposition, including repeated chrome.
content='# Content inventory\n\n'+intro+'''Every recovered textual block below has a migration disposition. Repeated responsive/header/footer content remains present in evidence; MERGED means one accessible equivalent, not content deletion. Headings/p/list/labels are indexed below; remaining div/span text and media are retained in the full-text and asset inventories. Original spelling is preserved here.

Disposition is a proposed migration treatment, not a claim it has been implemented. No source section is silently removed. Home testimonials are specifically held pending attribution; game-count and cabinet-feature conflicts are preserved in SOURCE-CONFLICTS.
'''
seq='# Page sequence\n\n'+intro
for ri,(r,f) in enumerate(routes,1):
 p=E[f];write('docs/audit/evidence/'+f.replace('.html','.txt'),p['text'])
 rows=[]
 for bi,b in enumerate(p['blocks'],1):
  t=b['text']; status='PRESERVED';reason='Retain source meaning; verify factual claims before publication.'
  if t in ['Games','Cabinets','Products','Player Journey','Up to Date','GET IN TOUCH'] or t.startswith('STAY TUNED'): status='MERGED';reason='Shared navigation/footer, same purpose and destination.'
  if b['tag'].startswith('h'):status='REDESIGNED';reason='Retain section purpose with new visual hierarchy.'
  if 'avid gamer' in t or 'Add Your Heading' in t:status='DEPRECATED-WITH-REASON';reason='Unattributed repeated placeholder testimonial; archive source, require authentic replacement.'
  if 'hello-world' in r:status='DEPRECATED-WITH-REASON';reason='Default WordPress starter content, not TierPlay editorial.'
  rows.append([f'P{ri:02}-B{bi:03}',b['tag'],t,status,reason])
 content+='\n## '+r+'\n\n[Raw complete text](evidence/'+f.replace('.html','.txt')+') · [HTML](../research/'+f+')\n\n'+table(['ID','Element','Source content','Status','Reason'],rows)
 seq+='\n## '+r+'\n\n'+ ' → '.join(h['text'] for h in p['headings'])+'\n\n'
write('docs/audit/CONTENT-INVENTORY.md',content)
seq+='''## Home order decision

Observed: shared header → image-led opening (no semantic hero heading) → Newly released Games (six visual assets/lightbox links) → About Us → Cabinets → Testimonials → distributor/operator form → contact/navigation/legal footer. Raw widget/media evidence also preserves image-only content.

Proposed longer target introduces technology, TLJ, products and player-journey teasers between these anchors, pulling existing content from their dedicated routes. That is an explicit homepage expansion, not the legacy order. Partners/distribution is NOT a verified logo collection. Do not insert invented partner logos. Keep the relative legacy anchor order; document any eventual move before implementation. First prototype stops at screen entry and contains none of these later sections.

Player Journey is currently benefits-led: Link Jackpots → Standard Progressive Jackpots → Loyalty → bonus/free-spin media → form. The proposed DISCOVER/PLAY/ENGAGE/REWARD/RETURN sequence is not source copy and is not adopted as fact.
'''
write('docs/audit/PAGE-SEQUENCE.md',seq)
write('docs/audit/SOURCE-CONFLICTS.md', '''# Source conflicts and publication holds

| ID | Evidence | Required resolution |
|---|---|---|
| C01 | Sunscape 1 intro: 3 progressive jackpots; shared block: 8 per game + 4 linked | Product owner confirms correct board/version counts; retain both in audit |
| C02 | Sunscape 3 intro: 5 jackpots; shared block: 8 | Same; do not normalize to 8 |
| C03 | Sunscape 4 intro: 3 jackpots; shared block: 8 | Same |
| C04 | /sunscape-6/ document and headings say Sunscape 5; no game descriptions | Request actual sixth board identity, games, copy and media |
| C05 | Sunscape 5 next-link label says Sunscape 5 | Preserve real destination and correct label only after mapping confirmation |
| C06 | Games page reuses 2.1/2.2/2.3 images across later boards | Do not infer game identity from reused artwork |
| C07 | Cabinet overview says 43 inch HD; product blocks say 4K; Pinnacle copy says flat and curved | Obtain per-model/version specification sheets |
| C08 | Phone numbers differ: footer 706-575-8838; games +1(888)4886551; cabinets +8(888)488 6551 | Confirm canonical sales/support numbers and proper tel destinations |
| C09 | Footer Products links to /cabinets/ | Preserve intent, fix to verified /products/ rather than reproduce broken link |
| C10 | Download Flyer href empty; social hrefs empty; legal labels have no recovered links | Preserve requirement, obtain actual files/destinations; no fake working control |
| C11 | Repeated testimonial with Add Your Heading Text Here and placeholder portraits | Explicitly deprecate placeholder; authentic attribution required before replacement |
| C12 | Form State select contains only Arizona | Confirm supported states; don't fabricate eligibility or expand list |
| C13 | 20+ years, USA manufacture, UL/shock testing, 24/7 support, 3x jackpots/25% faster/40% engagement appear as legacy claims | Retain exact provenance; client substantiation required, not externally certified |
| C14 | not available for Georgia market occurs in recovered game media context | Preserve wherever relevant; confirm affected products/territories, do not apply globally by inference |
| C15 | News and Support routes have no substantial body; default Hello world post exists | Preserve route purpose; default post explicitly deprecated; request actual editorial/support content |

Nothing in this list authorizes invented replacement facts. Footer address is a recovered claim, not proof of current business location. Contact form submission, email delivery and operational support were not tested.
''')
boards=[('1','/our_games/sunscapes/','Rich Times; Gang of Evils; Rise of the Dragon','8×5','3 (shared block says 8)'),('2','/our_games/sunscape-2/','Bison Showdown; Tiki Twist; Sinister Show','10×5','8'),('3','/our_games/sunscape-3/','Fortune Quest; Birix Haven; Fiery Frenzy','10×5','5 (shared block says 8)'),('4','/our_games/sunscape-4/','Jade Empire; Fiesta Riches; Mermaid’s Treasure','4×5','3 (shared block says 8)'),('5','/our_games/sunscape-5/','Eagle Strike; Frozen War; Bandit Bounty','10×5','8'),('6','/our_games/sunscape-6/','Unspecified; page incorrectly titled Sunscape 5','Not provided','Not provided')]
write('docs/audit/GAME-MATRIX.md','# Games and boards\n\n'+intro+table(['Board route identity','Source route','Source-named games','Intro free-spin grid claim','Intro jackpot claim'],boards)+'''\nFifteen distinct game names are present in board descriptions 1–5; sixth-board content is unknown. These are not fifteen confirmed individual game routes. Preserve board-level URLs, date metadata (June 24, 2024), technical support, flyer requirement and adjacent-board navigation. Do not equate cabinet compatibility from shared boilerplate with validated hardware mapping. Game logos and source filenames contain spelling variations; the matrix follows body copy without silently rewriting source snapshots.''')
write('docs/audit/CABINET-MATRIX.md','# Cabinet matrix\n\n'+intro+table(['Model','Source claim','Specific image','Availability','Production requirement'],[['ALTITUDE CONSOLE','Vertical monitor; 43 inch touchscreen; 4K display; modular design','vertical-cabinet-with-tierplay-logo.webp','No approved GLB/CAD in repository','TP-001; orthographic photos/dimensions and separate display/glass'],['PINNACLE CONSOLE','Curved monitor; body also says flat and curved; 43 inch; 4K','Curved-single-side-with-tierplay-logo.webp','No approved GLB/CAD in repository','TP-002; resolve curvature and per-model specification']])+'''\nShared feature list is NOT assigned to either model without approval. Preserve claims about PCAP, I/O board, dual bash buttons, on-screen button, withdrawal controls, validators, ticketing, charger, lighting, compact design, audio, stats and error reporting as source-derived entries in FEATURE-MATRIX. Do not invent internal mechanics for an exploded view. Existing generated hero is not a validated Altitude render.''')
write('docs/audit/PRODUCT-MATRIX.md','# Product matrix\n\n'+intro+table(['Product/system','Source','Meaning to preserve','Hold'],[['Tierplay collection management (TCM)','/products/','Remote machine shutdown; route monitoring/management; dispute handling','Actual UI, access controls and approved scope required'],['Tierplay Link Jackpot (TLJ)','/products/; /player-journey/','Links machines at a location into a progressive jackpot','Topology illustration must be labelled explanatory, no invented rates'],['Standard progressive jackpots','/player-journey/','Machine/game progressive jackpot explanation','Counts/quantitative growth claims conflict or lack substantiation'],['Loyalty System','/products/; /player-journey/','Phone/email registration, free plays and follow-up offers','Consent flow and exact behavior require product approval'],['Altitude / Pinnacle','/cabinets/','Distinct physical cabinet families','Per-model validated technical sheets'],['Sunscape boards 1–6','/games/; /our_games/*','Board catalogue, constituent games, media, support and flyers','Sixth entry incomplete; preserve route']]))
features=[]
for f in ['live-cabinets.html','live-products.html','live-player-journey.html']:
 for b in E[f]['blocks']:
  if b['tag'] in ['li','p'] and b['text'] not in ['Games','Cabinets','Products','Player Journey','Up to Date'] and not b['text'].startswith(('STAY TUNED','145 Challenger','706-','info@')):
   features.append([f,b['text'],'PRESERVED','DOM specification/prose; animated explanation only where useful','Legacy claim; verify model and current validity'])
write('docs/audit/FEATURE-MATRIX.md','# Feature preservation matrix\n\n'+intro+table(['Source snapshot','Feature/copy','Status','Implementation target','Evidence limit'],features)+'''\nFunctional features also retained: responsive main navigation; catalogue-to-board links; image galleries/lightboxes; game video controls; previous/next board navigation; supporting flyer download; sales and distributor forms; public news/support routes; footer contact/social/legal information. No evidence of a working catalogue filter in source HTML: filters would be an explicitly added usability enhancement, not claimed legacy parity.''')
ctas=[]
for r,f in routes:
 for l in E[f]['links']:
  if l['text'] and l['text']!='Skip to content':
   row=[r,l['text'],l['href'] or '(empty)','PRESERVED' if l['href'] and l['href']!='#' else 'REDESIGNED','Keep intent; correct broken destination with verified target' if not l['href'] or l['href']=='#' else 'Verify destination at migration']
   if row not in ctas:ctas.append(row)
write('docs/audit/EXISTING-CTA-MATRIX.md','# CTA inventory\n\n'+intro+table(['Page','Label','Legacy href','Status','Action'],ctas)+'''\n## Forms
Shared lead form: Name; Email (required); Company Name; State (Select State / Arizona only); required role (Distributor, Operator, Location Owner, Other); Message; Send. Elementor POST without explicit form action in HTML; submission likely depends on plugin runtime. Delivery endpoint, recipient, spam protection, consent, error and success behavior require operational validation.

Contact Sales has a separate Send Message form in addition to the shared lead form; preserve both intents and audit fields in evidence. Replacing either with mailto loses functionality. Do not send a test lead without an authorized test recipient. Privacy/Terms footer labels must become real approved links before public release.
''')
# Media discovered in HTML, including CSS backgrounds, not just img tags.
manifest=json.loads(Path('assets/manifest.json').read_text());byurl={a.get('original','').replace('http:','https:'):a for a in manifest}
assetrefs={}
for r,f in routes:
 raw=Path('docs/research/'+f).read_text()
 for u in re.findall(r'https?[^\s"<>]+?\.(?:webp|png|jpg|jpeg|svg|mp4|pdf|glb|gltf)',raw.replace('\\/','/')):
  if '/uploads/' in u:assetrefs.setdefault(u.replace('http:','https:'),set()).add(r)
rows=[]
for u,rr in sorted(assetrefs.items()):
 a=byurl.get(u);rows.append([u,', '.join(sorted(rr)),a.get('local') if a else 'Not in recovered manifest','PRESERVED','Original/reference only; inspect resolution, rights and model mapping'])
write('docs/audit/EXISTING-ASSET-INVENTORY.md','# Existing asset inventory\n\n'+intro+f'''Original manifest: {sum(not a.get('generated',False) for a in manifest)} recovered originals. Generated concept derivatives: {sum(bool(a.get('generated',False)) for a in manifest)}. Manifest bytes total: {sum(a.get('bytes',0) for a in manifest):,}; original media must not all load on entry. Five MP4 assets recovered; no production GLB, CAD, KTX2, HDRI or audio pack found in asset inventory. Fresh audit finds {len(assetrefs)} unique upload references including responsive variants; these are not all unique creative assets or all locally recovered.

'''+table(['Source URL','Pages','Local recovery','Status','Treatment'],rows)+'''\nGenerated dragon desktop/world/mobile art is retained as archived concept evidence. It cannot establish cabinet geometry, branding accuracy, screen count or production material properties. Replacement source cabinet imagery discovered on /cabinets/ must be inspected before use. All generated files remain unapproved in assets/manifest.json.''')
write('docs/audit/ASSET-INVENTORY.md','# Asset inventory\n\nSee [EXISTING-ASSET-INVENTORY.md](EXISTING-ASSET-INVENTORY.md), original `../../assets/manifest.json`, and `../assets/ASSET-REQUESTS.md`.')
seo=[]
for r,f in routes:
 p=E[f];meta={x.get('name',x.get('property','')):x.get('content') for x in p['seo']};canon=next((x.get('href') for x in p['seo'] if x.get('rel')=='canonical'),None)
 seo.append([r,'; '.join(p['title']),canon or 'Absent',meta.get('description','Absent'),sum(h['tag']=='h1' for h in p['headings']),meta.get('robots','Absent')])
write('docs/audit/EXISTING-SEO-INVENTORY.md','# Existing SEO inventory\n\n'+intro+table(['Route','Title','Canonical','Description','H1 count','Robots meta'],seo)+'''\nPreserve URL intent and document redirects before changing slugs. Legacy canonicals point to electronhubs.com. No migration to a guessed host. Missing descriptions, weak H1 structure, duplicate Sunscape 5 titles and image-only game labels need correction from validated content. Raw metadata in extracted-pages.json remains the authority. robots.txt retrieval was empty; previous sitemap path returned homepage HTML, not a valid sitemap. Do not claim a complete working source sitemap. Search Console, indexing history and inbound-link data were not available. Current Next prototype intentionally noindex; this remains appropriate until production approval.''')
write('docs/audit/SEO-INVENTORY.md','# SEO inventory\n\nSee [EXISTING-SEO-INVENTORY.md](EXISTING-SEO-INVENTORY.md).')
write('docs/audit/CURRENT-REPOSITORY-AUDIT.md', '''# Current repository audit

2026-09-26. Read-only app inspection; no app implementation changed in this assignment.

| Area | Evidence | Finding / disposition |
|---|---|---|
| Routes | app/page.tsx; no other route pages | Only concept homepage; every business route remains missing |
| Visual medium | experience/ExperienceCanvas.tsx | One textured plane plus ember points; 2.5D displacement, not cabinet geometry |
| Camera | experience/camera/CameraDirector.tsx | Dampened pointer x/y, fixed look-at; no entrance spline, screen-plane crossing or FOV choreography |
| Choreography | experience/Experience.tsx | Scroll normalized into image reveal and copy changes; no actual boot/floor/focus states |
| Loading | systems/AssetManager.ts | Image decode cache; no bundle dependency graph, real progress accounting, GLB validation or staged model loading |
| Adaptive quality | systems/DeviceTier.ts | Motion/data/memory hints plus viewport; no runtime GPU/frame-time adaptive tiers |
| Screen | ExperienceCanvas shader | Screen-origin image transition; no independent screen mesh, glass or media controller |
| Form parity | app/page.tsx | mailto only; legacy lead form and Contact Sales form absent |
| Content | content/experience.ts, app/page.tsx | Content partly hardcoded, one world; no typed catalogue/cabinet/product/navigation data |
| Navigation | components/navigation/Navigation.tsx | Three anchors replace business IA; must restore source routes at content milestone |
| Accessibility | tests/experience.spec.ts | Ten existing tests, axe/reduced motion/menu/fallback coverage; not a complete production accessibility certification |
| Performance | docs/review/lighthouse-v2.json | Previous local mobile run 86/100/100; LCP 4.3s, TBT 40ms, CLS 0; LCP fails 2.5s target |
| Frame evidence | docs/review/performance-v2.json | Previous rAF median16.7ms/p9516.8ms; not GPU timing, INP field data or physical-device proof |
| Quality tooling | package.json, tsconfig.json | Strict TS; build/typecheck/Playwright scripts. No ESLint/Prettier pinned/configured scripts; no dependency audit proving dead imports removed |
| Ownership | existing directors and docs | Single camera owner is reusable; retain after isolating scene lifecycle |
| Provenance | assets/manifest.json | 110 originals and 3 generated concept derivatives; none approved production models |
| Git | git status --short | Project remains untracked/uncommitted baseline; do not delete or overwrite assets during re-scope |
| Documentation drift | docs/WEBGL.md, MOTION.md vs runtime | Docs claim macro/boot/demand rendering more broadly than runtime; superseded by this audit until reconciled |

Keep reusable font hosting, original assets, semantic HTML, reduced-motion fallback, menu keyboard behavior, visibility pausing and test infrastructure. Archive current dragon art direction as a prior concept. Do not call its 2.5D transition the required physical screen-entry prototype. The new spec supersedes ADR0008 for future work; application remains unchanged for comparison.
''')
print('Audit documents written')
