# Play a four-turn startup strategy duel — verification 3

**Verdict: PASS**

- Findings: **0**
- Untested public claims: **0**
- Implementation reviewed: `2b35ddf`
  (`2b35ddf2f5d2ff81cd6e17ec3a0add62084e9420`)
- Documentation reviewed: `c6ce397`
  (`c6ce397f10ce19fadd202f777bbe4a98573ccccf`)
- Live URL: https://founder-fork.sociobot.in
- Completed: 6 September 2026 UTC

## Job, audience, and first action

- Job: finish a four-turn strategy duel by choosing one hidden bet and one
  public map goal each turn.
- Audience: friends who want a quick strategy puzzle with startup satire, no
  business knowledge, and no account.
- First action: select **Try it with sample data**.

Fresh 390 × 844 phone and 1440 × 900 desktop contexts opened the live home
page at scroll position zero. Both showed the job, audience, first action, and
active daily board before scrolling. The phone had no horizontal overflow.

## Live game and sample

Both fresh clients entered the sample in one action. It opened at turn three
with two ledger rows, four placed tokens, and the persistent **Demo — sample
data, nothing is saved** label.

- The phone used touch controls. The desktop used Enter on the sample link,
  then `3`, `E`, Enter and `1`, `Q`, Enter.
- Both runs reached the actual **Opponent wins** end screen after four turns,
  with a 6–13 score and four ledger rows.
- **Play again** returned the phone run to turn one with zero scores, no
  tokens, and an empty ledger.
- **Reset demo** restored the populated turn-three sample and its label.
- Before opening the sample, the phone client saved a real daily turn, changed
  both real settings, and added a challenge sentinel. Sample play, sample
  settings, replay, and reset left the complete local-storage snapshot
  byte-for-byte unchanged. **Start for real** restored the one-turn match and
  its saved settings.
- Normal play requested only `https://founder-fork.sociobot.in`. No console or
  page errors occurred.
- The live phone board reported 60 fps.

Fresh run recordings and end-screen images are in
`/work/.evidence/founder-fork-verify-3/live/phone-run.webm`,
`desktop-run.webm`, `phone-end-screen.png`, and `desktop-end-screen.png`.

## Challenge, settings, recovery, and privacy

Two independent live browser contexts exercised the real async challenge.
The creator completed Learn, Build, Buzz, Learn. The friend resolved one turn,
reloaded with that row intact, finished all four turns, and saw those four
creator choices in order. The challenge returned HTTP 200, used the title
**Challenge — Founder Fork**, and made only same-origin requests.

Live checks also proved:

- Sound starts off. Real sound and motion settings persist. Sample settings
  return to their defaults and do not change real settings.
- Tab reaches the skip link. Enter follows the focused sample link. Space
  resets the focused sample button. The settings dialog moves focus to Sound,
  closes with Escape, and returns focus to Settings.
- The visible focus ring is a four-pixel solid outline.
- An invalid challenge explains the problem and returns to the game.
- Corrupt saved data recovers to a fresh board. If storage rejects a write,
  the resolved turn remains playable and a clear warning appears.
- Cancelling privacy deletion keeps daily, settings, and challenge data.
  Confirming it removes all three.
- Offline and update behavior are not promised. No service worker or web app
  manifest is present.

The product is a static site with no backend, tenant, health, restart, room,
or rate-limit surface. Backend-only 429 and persistence checks do not apply.
The advertised two-client path is the encoded async challenge tested above.

## Accessibility, routes, and performance

- Live axe scans on `/`, `/demo`, `/privacy`, `/terms`, `/404.html`, and an
  unknown route found zero violations of any severity.
- Every app route had its exact title, one H1, and header, main, and footer
  landmarks. All 11 discovered internal links returned 200.
- The unknown route returned the intended HTTP 404 and the designed return
  page. Its one browser 404 network entry is expected, not a page defect.
- All 17 visible phone controls measured at least 44 px. At 200% text size,
  horizontal overflow remained zero.
- Reduced motion set the checked transition duration to `1e-05s`.
- `verify-url.sh` loaded the live page in 640 ms with `lang="en"`, one H1, a
  main landmark, complete alt text, labelled buttons, and no console errors.
- Live Lighthouse mobile and desktop scored 100 for performance,
  accessibility, best practices, and SEO. Mobile LCP was 1,039 ms, CLS was 0,
  and TBT was 52 ms. Desktop LCP was 281 ms, CLS was 0, and TBT was 0 ms.
- The response includes the declared same-origin CSP, `frame-ancestors` as a
  header, Referrer-Policy, X-Content-Type-Options, Permissions-Policy, HSTS,
  and Cross-Origin-Opener-Policy.

## Clean checkout and claims

A separate clean clone at documentation SHA `c6ce397` used Node `v22.23.2`
and npm `10.9.8`. `npm ci --include=dev` passed with zero vulnerabilities.
The only changes after implementation `2b35ddf` are handoff records.

- `npm run test:unit`: 5/5 passed.
- Every exact command in `.factory/claims.json` passed separately.
- `npm test`: 35/35 browser tests passed.
- `npm run build`: passed and produced `dist/`.
- `npm run test:budget`: 10,373-byte gzip JavaScript, 5,033-byte gzip CSS,
  and a 26,903-byte mobile AVIF scene.

| Declared claim | Result |
| --- | --- |
| `four-turn-end` | PASS |
| `restart-reset` | PASS |
| `settings-persist` | PASS |
| `third-party-requests` | PASS |
| `local-progress` | PASS |
| `demo-sandbox` | PASS |
| `async-challenge` | PASS |
| `keyboard-play` | PASS |
| `keyboard-controls` | PASS |
| `frame-rate` | PASS |
| `daily-seed` | PASS |
| `free-play` | PASS |
| `five-minute-match` | PASS |

The live landing page, sample, privacy page, terms, footer, README, and demo
documentation were cross-checked against the declarations and their outcome
tests. No false, incomplete, missing, or untested public claim remains.

The deployed assets exactly match the clean build:

| Asset | SHA-256 |
| --- | --- |
| `index-CanSojyL.js` | `85375d505edec199514fc437fe2fd7134953439c2d20e83a4906c188ec1b5e2c` |
| `index-B87S_nzk.css` | `c43eb0ff873150ce50bcdc0c218bd791b5f4e1a041063b6cab46c6c8da091e49` |

This proves that the live runtime is implementation `2b35ddf`. The later
documentation-only commits do not require a new product image.

## Earlier findings

- **FF-V1-001 remains resolved.** The public copy distinguishes Enter on
  links and buttons from Space on buttons. Its exact claim passed again, and
  the live keyboard outcomes match it.
- **FF-R2-001 remains resolved.** The page now promises only same-day seed
  stability. The updated claim completed two isolated fixed-date matches and
  compared their visible seed, goals, four events, opponent placements, and
  revealed opponent choices.
- Earlier minor builder items remain resolved: image conversion, Node types,
  report output, hidden-control touch auditing, reduced-motion serialization,
  preview state, Lighthouse launch, target sizes, 200% reflow, challenge
  reload, route announcement, saved-state validation, restart focus, and
  blocked-storage recovery. The clean 35-test suite and fresh live checks
  exercised their current behavior.

## Final result

**PASS — zero findings and zero untested public claims.**
