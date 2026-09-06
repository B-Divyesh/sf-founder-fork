# Founder Fork handoff

## Release

- Product: Founder Fork, a free browser strategy game for friends.
- Job: finish a deterministic four-turn duel by choosing a hidden bet and a
  public map goal each turn.
- First action: select **Try it with sample data** on the first screen.
- Implementation and deployed SHA: `0103cf7`.
- Deployment: product-owned Static Web App `sf-founder-fork` in `centralus`.
- Live origin: `https://founder-fork.sociobot.in`.
- No paid offer exists. No billing metadata or checkout was added.

## What shipped

- A complete four-turn daily match against a seeded opponent, with reveal,
  event, goal-fit, and final map-control scoring.
- A one-click populated sample at `/demo`. It begins at turn three, keeps a
  persistent sample label, resets to the same state, and never changes real
  match storage.
- Async challenge links. An independent player receives the same board and the
  creator's four hidden decisions. Active challenge progress survives reload.
- Pointer, touch, Tab/Enter/Space, and `1`–`3`/`Q`–`E`/Enter controls.
- Persisted sound and motion settings, local daily progress, safe recovery from
  corrupt or blocked storage, and confirmed local deletion controls.
- Privacy, terms, route-specific titles and canonical links, metadata, original
  social art, a styled HTTP 404, security headers, robots, and sitemap files.
- Original risograph tabletop art generated with the factory image model. The
  exact prompt and provenance are in `assets/src/` and `.factory/design.md`.

## Verification

All checks below ran from a detached clean worktree at `0103cf7` after
`npm ci` with Node.js 22 and npm 10.

- `npm run test:unit`: 5/5 passed.
- Every one of the 12 commands in `.factory/claims.json`: passed separately.
- `npm test`: 34/34 Playwright checks passed.
- `npm run build`: passed and produced `dist/`.
- `npm run test:budget`: 10,363-byte gzip JavaScript, 5,033-byte gzip CSS,
  and a 26,903-byte mobile AVIF scene.
- Local Lighthouse desktop: 100 performance, 100 accessibility,
  100 best practices, 100 SEO; LCP 0.3 s, CLS 0, TBT 0 ms.
- Local Lighthouse mobile: 100 performance, 100 accessibility,
  100 best practices, 100 SEO; LCP 1.1 s, CLS 0, TBT 0 ms.

Cold HTTPS verification after deployment:

- `/`, `/demo`, `/privacy`, and `/terms`: HTTP 200.
- An unknown path: HTTP 404 with the designed return page.
- `verify-url.sh`: 796 ms cold load, one H1, English language, main landmark,
  no missing alt text, no unlabeled buttons, and no console errors.
- Live axe checks found zero violations on the home, demo, privacy, terms,
  unknown-path, and static 404 pages.
- Live Lighthouse desktop and mobile: 100 in all four categories. Mobile LCP
  was 1.1 s, CLS 0, and TBT 10 ms.
- Fresh phone and desktop clients saw the job, audience, primary action, and
  live board before scrolling. The sample showed two filled ledger rows and
  placed tokens, reached an `Opponent wins` result after four turns, reset to
  turn three, kept its sample label, and left real storage unchanged.
- The measured live board loop was 60 fps on the phone viewport and 59 fps on
  desktop. A four-times CPU-throttled phone claim test remained within the
  declared 45–75 fps margin.
- Two independent live browser contexts completed a challenge. The second
  client resumed after reload and saw all four creator choices.
- Evidence is under `/work/.evidence/final-live/`.

## Earlier findings and disposition

There was no earlier product handoff or formal review. The interrupted builder
history contained transient build and test findings. Image conversion support,
Node type declarations, the Playwright report path, hidden controls in the
touch audit, reduced-motion duration serialization, a stale preview port, and
one crashed Lighthouse launch were all corrected or rerun successfully.

This continuation also found and fixed undersized restart/footer targets,
200% text overflow in the sample banner, challenge progress loss on reload,
missing back-navigation announcements, insufficient saved-state validation,
lost focus after restart, and storage-write failure handling. Each has a
behavioral browser regression check.

## Known gaps and next steps

- The researched completion and sharing percentages are not collected because
  this release has no analytics. Validate them through voluntary playtesting.
- Offline play is not advertised and no service worker ships in this release.
- Challenge links are asynchronous and local-first; there is no live room or
  chat service, in line with the brief's scope.

## Independent verification 1

Verification completed on 6 September 2026 against implementation `0103cf7`
and documentation `37b3a66`. The full report is
`.factory/verification-1.md`.

Verdict: **FAIL** with one minor finding and one untested public claim. All 12
declared claim commands, 5 unit tests, 34 browser tests, the build, budgets,
live phone and desktop play, two-client async challenge, accessibility checks,
and live Lighthouse checks passed. Live JS and CSS exactly matched the clean
build of the implementation candidate.

The blocking finding is a README sentence claiming that Space operates every
control. On the live **Try it with sample data** link, Space scrolled the page
instead of opening the sample. The claim is also absent from
`.factory/claims.json`. Narrow the sentence to standard link/button keyboard
behavior, or implement Space for links and add an exact tagged claim test.

## Repair 1

### Release status

- Verdict: **PASS**. FF-V1-001 is resolved.
- Product implementation deployed to production: `7ff658f`
  (`7ff658fd06a768661f81e609dfdb978179f208c3`).
- Follow-up verification-only commit: `3acca02`
  (`3acca02d822edd554450dd29020bbca15d020721`). It adds a Tab assertion to
  the browser check and does not change the built JavaScript or CSS.
- Deployment reused the existing product-owned Static Web App
  `sf-founder-fork` in `centralus`. The product remains a static, single-site
  deployment with no backend, tenant data, billing, or external integration.
- Live origin: `https://founder-fork.sociobot.in`.

### What changed

- Replaced the false README promise that Space operates every control.
  It now documents the actual native behavior: Tab moves focus, Enter follows
  focused links or activates focused buttons, and Space activates focused
  buttons.
- Added the declared `keyboard-controls` claim and an outcome-based browser
  check. It verifies a real Tab focus transition, Enter opening the sample
  link, and Space resetting the sample back to its populated turn-three state.
- Updated the copy audit. The catalog description remains verb-first, 92
  characters, and was copied unchanged to
  `/work/.evidence/catalog-description.txt`.

### Verification

From a fresh clone of `3acca02` with Node `v22.23.2` and npm `10.9.8`:

- `npm ci`: passed with no dependency vulnerabilities.
- `npm run test:unit`: 5/5 passed.
- Every one of the 13 exact commands in `.factory/claims.json`: passed
  separately. The full log and status are
  `/work/.evidence/final-live-repair-1/final-claims.log` and
  `/work/.evidence/final-live-repair-1/final-claims.status`.
- `npm test`: 35/35 passed, including local axe scans on all required routes,
  phone layout, 200% text, reduced motion, recovery, 404, and two-client
  challenge checks.
- `npm run build`: passed and produced `dist/`.
- `npm run test:budget`: 10,363-byte gzip JavaScript, 5,033-byte gzip CSS,
  and a 26,903-byte mobile AVIF scene.

Cold HTTPS checks after deployment:

- `verify-url.sh` returned HTTP 200 in 768 ms with no console errors, one H1,
  an English `lang`, a main landmark, and no missing image alt text or
  unlabeled buttons.
- `/`, `/demo`, `/privacy`, and `/terms` returned 200. An unknown route
  returned the designed HTTP 404, as intended.
- The deployed JavaScript SHA-256 was
  `78cb8d69af82815dd5c01a88e54916f5446fc2ce7465d18ad920fbe899ca670c`,
  exactly matching the clean build. The unchanged CSS and asset names also
  match the prior verified product image, so the earlier live Lighthouse and
  live axe results remain applicable; this repair introduced no production
  asset change after that image.
- Fresh 1440 × 900 and 390 × 844 clients saw the job, audience, first action,
  and board before scrolling. The live sample opened with two ledger rows and
  its persistent sample label, reached **Opponent wins** at 6–13, reset with
  Space to turn three, and left an exact saved real match unchanged.
- Two independent live browser contexts completed an async challenge. The
  second player reloaded after turn one and then saw the creator’s four choices
  in order: Learn, Build, Buzz, Learn.
- Live screenshots, video, cold-load output, and structured run result are in
  `/work/.evidence/final-live-repair-1/`. The end screen is recorded at
  `desktop-sample-end-visible.png`.

### Finding disposition and known gaps

- **FF-V1-001 (minor): resolved.** Space is no longer claimed to open links.
  The documented and tested semantics now match the live controls.
- The prior verification’s other builder findings remain covered by the full
  regression suite and were not regressed.
- There are still no analytics, so completion and sharing targets need
  voluntary playtesting. Offline/update behavior is not advertised and no
  service worker ships. Challenges are local-first async links, not live rooms
  or chat. These are intentional scope limits, not missing promised features.
