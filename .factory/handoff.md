# Founder Fork handoff

## Release

- Product: Founder Fork, a free browser strategy game for friends.
- Job: finish a deterministic four-turn duel by choosing a hidden bet and a
  public map goal each turn.
- First action: select **Try it with sample data** on the first screen.
- Implementation and deployed SHA: `7ff658f`.
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

## Independent verification 2

Verification completed on 6 September 2026 against implementation `7ff658f`,
test-only follow-up `3acca02`, and documentation `8c076b5`. Verdict:
**PASS** with zero findings and zero untested public claims. The detailed
record is `.factory/verification-2.md`.

From a separate clean clone with Node 22.23.2 and npm 10.9.8, 5 unit tests,
all 13 claim commands run separately, the 35-test browser suite, build, and
budgets passed. Live phone and desktop runs showed the job, audience, action,
and game before scrolling. The populated sample reached an end screen, reset
to its labelled seed, and did not change real storage. Live keyboard,
reduced-motion, accessibility, route/404, and independent two-client async
challenge checks passed. The deployed JS and CSS hashes match the clean build.

Evidence: `/work/.evidence/founder-fork-verify-2/`.

## Strict review 1

Strict review completed on 6 September 2026. Verdict: **PASS** with zero
findings and zero untested public claims. The implementation reviewed was
`7ff658f` (`7ff658fd06a768661f81e609dfdb978179f208c3`); the latest
documentation record was `b977bfd`
(`b977bfddfa33fb6336603291728f84ca126e805a`). The documentation/report
commit does not change product assets.

A fresh desktop and phone browser showed the job, audience, first action, and
live board before scrolling. The one-click sample was populated, retained its
sample label, reset correctly, reached an actual end screen, and did not change
real saved state. Fresh live runs covered settings, keyboard, reduced motion,
60 fps, designed 404, privacy routes, expected HTTP 404 behavior, and an
independent two-client async challenge with reload recovery.

From a detached clean worktree at `8c076b5`, after `npm ci --include=dev`,
5/5 unit tests, each of 13 claim commands separately, the 35/35 browser
suite, build, and budget test passed. The deployed JavaScript and CSS hashes
exactly match the clean build of the implementation candidate. All earlier
minor findings, including FF-V1-001, remain resolved.

Reports and evidence:

- `.factory/review-1.md`
- `/work/.evidence/qa-report.md`
- `/work/.evidence/qa-result.json`
- `/work/.evidence/founder-fork-review-1/`

## Strict review 2

Strict review 2 completed on 6 September 2026 against implementation
`7ff658f`, test-only follow-up `3acca02`, and documentation baseline
`92b9898`. Verdict: **FAIL** with one minor finding and one untested public
claim. The report is `.factory/review-2.md`.

Fresh desktop and phone browsers completed the sample through the 6–13
**Opponent wins** end screen, replayed and reset it, proved sample isolation,
and exercised settings, keyboard, touch, reduced motion, privacy deletion,
recovery, legal routes, the designed 404, and an independent two-client
challenge with reload. Full axe scans had zero violations. Fresh Lighthouse
mobile and desktop runs scored 100 in all four categories. A clean checkout
passed 5 unit tests, all 13 claim commands separately, all 35 browser tests,
the production build, and budgets. Live JavaScript and CSS hashes match the
clean build.

The blocker is FF-R2-001: the live sentence “Each day reshuffles the events,
map goals, and opponent plan” has no matching declared outcome test. The
`daily-seed` claim only proves that one seed remains stable after reload, and
a 3,652-transition diagnostic found 41 dates where at least one named output
group stayed unchanged. No product code was changed during review. Evidence
is under `/work/.evidence/founder-fork-review-2/`.

## Repair 2

### Release status

- **PASS.** FF-R2-001 is resolved with no remaining product defect.
- Product implementation deployed to production: `2b35ddf`
  (`2b35ddf2f5d2ff81cd6e17ec3a0add62084e9420`).
- Documentation is a later handoff-only commit; the implementation SHA above
  is the deployed product image.
- Deployment reused the product-owned Static Web App `sf-founder-fork` in
  `centralus`. No backend, shared database, billing, or external integration
  was added.
- Live origin: `https://founder-fork.sociobot.in`.

### What changed

- Replaced the unreliable statement that every named output group reshuffles
  each day. The page now says that one daily seed keeps events, map goals, and
  the opponent plan fixed for that day.
- Updated the declared `daily-seed` claim to match the public statement.
- Replaced the single-page reload check with an outcome check across two
  isolated clients. Both clients use the same fixed date, complete all four
  turns with the same choices, and must show the same map goals, four events,
  public opponent placements, and revealed opponent choices.
- Expanded the unit regression to compare goals, events, and the opponent plan
  for a repeated seed. Updated the copy audit and release marker to `1.0.1`.
- The catalog description remains verb-first and under 120 characters. It was
  copied to `/work/.evidence/catalog-description.txt`.

### Verification

All clean checks ran from detached checkout `2b35ddf` after
`npm ci --include=dev` with Node `v22.23.2` and npm `10.9.8`.

- `npm run test:unit`: 5/5 passed.
- Every one of the 13 exact commands in `.factory/claims.json`: passed
  separately, including the expanded `daily-seed` run.
- `npm test`: 35/35 Playwright checks passed.
- `npm run build`: passed and produced `dist/`.
- `npm run test:budget`: 10,373-byte gzip JavaScript, 5,033-byte gzip CSS,
  and a 26,903-byte mobile AVIF scene.
- Local Playwright axe checks found no serious or critical issues on all
  required routes.

Cold HTTPS verification after deployment:

- `/`, `/demo`, `/privacy`, and `/terms`: HTTP 200. An unknown route returned
  the intended HTTP 404 with the designed return page.
- `verify-url.sh`: 787 ms load, one H1, English language, a main landmark,
  complete image alt text, labelled buttons, and no console errors.
- Fresh live axe scans found zero violations of any severity on home, demo,
  privacy, terms, the static 404, and the intended HTTP 404.
- A live full sample run requested only the product origin. Keyboard checks
  passed for Tab focus, Enter on the sample link, `1`/`Q`/Enter turn play,
  Space on Reset demo, and settings-dialog focus return.
- Fresh 1440 × 900 and touch-enabled 390 × 844 clients saw the job, audience,
  first action, and live board before scrolling. Both populated samples reached
  **Opponent wins** at 6–13 with four ledger rows. Reset restored turn three
  with two populated rows and the persistent sample label. Returning to real
  play preserved an exact pre-demo storage snapshot.
- The live phone board measured 60 fps. All visible phone controls met the
  44 px minimum. Reduced motion produced a `0.00001s` transition duration.
- Two independent live clients completed a challenge. The second client
  resumed after reload and revealed the creator choices Learn, Build, Buzz,
  Learn.
- Privacy deletion preserved data after cancellation, then removed daily,
  settings, and challenge data after confirmation.
- Live Lighthouse mobile and desktop scored 100 in performance,
  accessibility, best practices, and SEO. Mobile LCP was 1,076 ms, CLS 0,
  and TBT 12.5 ms. Desktop LCP was 294 ms, CLS 0, and TBT 0 ms.
- Live JavaScript SHA-256
  `85375d505edec199514fc437fe2fd7134953439c2d20e83a4906c188ec1b5e2c`
  and CSS SHA-256
  `c43eb0ff873150ce50bcdc0c218bd791b5f4e1a041063b6cab46c6c8da091e49`
  exactly match the clean build.

Evidence is under `/work/.evidence/founder-fork-repair-2/`.

### Finding disposition and known gaps

- **FF-R2-001 (minor): resolved.** The public sentence no longer promises a
  different value in every generated group on every date. Its narrower
  same-day result is declared and tested through complete independent runs.
- **FF-V1-001 remains resolved.** The keyboard copy still distinguishes Enter
  on links and buttons from Space on buttons. Its exact claim passed again.
- All earlier builder findings remain covered by the passing full suite:
  conversion and type setup, report output, touch auditing, reduced motion,
  preview state, Lighthouse launch, target sizes, 200% reflow, challenge
  reload, navigation announcement, saved-state validation, restart focus, and
  blocked-storage recovery.
- Completion and sharing targets still need voluntary playtesting because the
  product has no analytics. Offline/update behavior remains unadvertised.
  Challenges remain local-first async links, not live rooms or chat. These are
  intentional scope limits.
