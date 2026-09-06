# Play a four-turn startup strategy duel — verification 1

**Verdict: FAIL**

- Findings: **1**
- Untested public claims: **1**
- Implementation reviewed: `0103cf7`
- Documentation reviewed: `37b3a66`
- Live URL: `https://founder-fork.sociobot.in`
- Verification completed: 6 September 2026 UTC

## Job, audience, and first action

- Job: finish a deterministic four-turn strategy duel by choosing a hidden bet
  and a public map goal each turn.
- Audience: friends who like short strategy puzzles and startup satire without
  needing an account or business knowledge.
- First action: select **Try it with sample data**.

On fresh 390 × 844 and 1440 × 900 browsers, all three points were visible
before scrolling. The live game board also began in the first viewport.

## Finding

### FF-V1-001 — Minor — The public Space-key claim is false and undeclared

`README.md` says: “Tab, Enter, and Space also operate every control.” In a
fresh live desktop browser, I focused **Try it with sample data** and pressed
Space. The URL stayed on `/` and the page scrolled 700 px; the link did not
open the sample. Enter does open links, and Space operates native buttons, so
the game remains keyboard-operable. The defect is the broader public claim.

`.factory/claims.json` contains the narrower `keyboard-play` claim for the
`1`–`3`, `Q`–`E`, and Enter shortcuts. It does not list or test the statement
that Space operates every control. Fix the sentence to describe standard
link/button behavior, or add Space handling and an exact tagged claim test.

## Live game evidence

- Phone: 390 × 844, DPR 2, fresh context. Desktop: 1440 × 900, fresh context.
- The phone first screen showed the H1, audience sentence, sample action, and
  top of the live board at scroll position 0. The primary action occupied
  y=386.6–434.6 px. Desktop showed the same content at scroll position 0.
- The one-click sample opened at turn three with two ledger rows and four
  placed tokens. The label **Demo — sample data, nothing is saved** remained
  visible after play and reset.
- A valid real daily state was saved before entering the sample. Playing and
  resetting the sample left its exact storage value unchanged. **Start for
  real** restored the one-turn real match.
- The recorded sample run used Buzz/map goal 3, then Learn/map goal 1. It
  reached the actual **Opponent wins** end screen after four turns, 6–13.
  **Play again** reset the ledger, scores, tokens, and turn to one in one tap.
- A separate live creator finished four turns and generated a challenge. An
  independent friend context played one turn, reloaded, resumed, and finished.
  Its ledger showed the creator plan Learn, Build, Buzz, Learn. The result was
  a draw.
- Sound started off. Sound on and motion off both survived a live reload.
- The live board reported 60 fps on the phone run. The four-times-throttled
  declared claim test passed its 45–75 fps boundary.

Recorded evidence:

- `/work/.evidence/qa-live/phone-video/phone-sample-run.webm`
- `/work/.evidence/qa-live/phone-first-screen.png`
- `/work/.evidence/qa-live/phone-populated-sample.png`
- `/work/.evidence/qa-live/phone-end-viewport.png`
- `/work/.evidence/qa-live/phone-end-screen.png`
- `/work/.evidence/qa-live/desktop-video/desktop-keyboard-run.webm`
- `/work/.evidence/qa-live/desktop-first-screen.png`
- `/work/.evidence/qa-live/challenge-friend-end.png`

## Declared claims

Every command was run separately from a clean clone at documentation SHA
`37b3a66` after `npm ci`. The only code difference from implementation SHA
`0103cf7` is the later copy-audit and handoff documentation.

| Claim | Result |
| --- | --- |
| `four-turn-end` | PASS |
| `restart-reset` | PASS |
| `settings-persist` | PASS |
| `third-party-requests` | PASS |
| `local-progress` | PASS |
| `demo-sandbox` | PASS |
| `async-challenge` | PASS |
| `keyboard-play` | PASS |
| `frame-rate` | PASS |
| `daily-seed` | PASS |
| `free-play` | PASS |
| `five-minute-match` | PASS |

Individual outputs are in `/work/.evidence/qa-claims/`. The untested claim in
FF-V1-001 is additional public copy and is not one of these 12 declarations.

## Normal, invalid, boundary, and recovery checks

- Normal pointer, touch, shortcut-key, and Tab/Enter game paths passed.
- Invalid challenge input showed its own title, explanation, and return link.
- Corrupt JSON, internally inconsistent saved state, and blocked writes all
  recovered with plain status messages in the clean browser suite.
- Daily and challenge progress survived reload. Restart returned focus to the
  reset board. Turn resolution announced both score changes.
- Privacy deletion preserved data when cancelled, then removed daily,
  settings, and challenge keys after confirmation.
- The phone had zero horizontal overflow, and all 17 visible controls measured
  at least 44 × 44 CSS px. At 200% text size, horizontal overflow remained 0.
- Reduced motion produced a `0.00001s` transition duration. Settings-dialog
  focus entered the first control and returned to the opener on Escape.
- Live axe scans reported zero violations on `/`, `/demo`, `/privacy`,
  `/terms`, an unknown URL, and `/404.html`.
- `/`, `/demo`, `/privacy`, and `/terms` returned 200. The unknown URL
  deliberately returned 404 with the designed page. Its expected browser 404
  resource message was not classified as a product error. Eleven discovered
  internal links returned below 400.
- `verify-url.sh` passed in 670 ms with one H1, English language, a main
  landmark, alt text, labelled buttons, and no console errors.
- No offline or update behavior is promised, and no service worker ships.
- This is a static product with no backend, tenant, rate-limit, or restart
  persistence surface. The advertised async challenge was tested with two
  independent real browser contexts.

## Quality and deployment checks

From the clean clone:

- `npm run test:unit`: 5/5 passed.
- `npm test`: 34/34 passed.
- `npm run build`: passed and produced `dist/`.
- `npm run test:budget`: 10,363-byte gzip JS, 5,033-byte gzip CSS, and
  26,903-byte mobile AVIF.
- Live Lighthouse mobile: 100 performance, 100 accessibility, 100 best
  practices, 100 SEO; LCP 978 ms, CLS 0, TBT 25 ms.
- Live Lighthouse desktop: 100 in all four categories; LCP 311 ms, CLS 0,
  TBT 0 ms.

The first mobile Lighthouse attempt produced a complete 100/100/100/100 JSON
report but exited with a browser-tab crash after collection. A fresh rerun with
the full-page screenshot disabled exited 0 and produced the values above. This
was a verifier process failure, not a page failure.

The live JavaScript and CSS names and SHA-256 hashes exactly matched the clean
production build:

- JS `index-DnYUMndI.js`: `78cb8d69af82815dd5c01a88e54916f5446fc2ce7465d18ad920fbe899ca670c`
- CSS `index-B87S_nzk.css`: `c43eb0ff873150ce50bcdc0c218bd791b5f4e1a041063b6cab46c6c8da091e49`

This proves the live runtime is the implementation candidate; the later
documentation-only commit does not require another product image.

## Earlier findings

The prior handoff reported no earlier formal review. I independently checked
all minor builder findings it listed:

- Image conversion, Node declarations, Playwright report output, and the stale
  preview issue were resolved by the clean install, build, and full suite.
- Hidden controls no longer affect the touch audit; visible live controls met
  the 44 px minimum.
- Reduced-motion serialization passed live and locally.
- The earlier Lighthouse launch issue was rerun successfully as recorded
  above.
- Restart/footer targets, 200% sample-banner overflow, challenge reload,
  back-navigation announcement, saved-state validation, restart focus, and
  blocked-storage handling all passed their regression checks.

## Final result

The product behavior and all 12 declared claims passed. Acceptance remains
**FAIL** because FF-V1-001 is a false, undeclared, and untested public claim.
