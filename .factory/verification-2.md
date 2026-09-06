# Play a four-turn startup strategy duel — verification 2

**Verdict: PASS**

- Findings: **0**
- Untested public claims: **0**
- Implementation reviewed: `7ff658f` (`7ff658fd06a768661f81e609dfdb978179f208c3`)
- Documentation and test follow-up reviewed: `8c076b5`
- Test-only code follow-up: `3acca02`
- Live URL: `https://founder-fork.sociobot.in`
- Completed: 6 September 2026 UTC

## Job, audience, and first action

- Job: finish a four-turn strategy duel by choosing a hidden bet and a public
  map goal each turn.
- Audience: friends who want a short strategy puzzle with startup satire, no
  business knowledge, and no account.
- First action: select **Try it with sample data**.

Fresh 1440 × 900 and 390 × 844 live browser contexts showed all three points
and the game board before scrolling. The phone had zero horizontal overflow.

## Clean checkout verification

A separate clone at `8c076b5` was installed with Node `v22.23.2` and npm
`10.9.8` (`npm ci --include=dev`).

- `npm run test:unit`: 5/5 passed.
- Each of the 13 commands declared in `.factory/claims.json` passed separately.
- `npm test`: 35/35 passed.
- `npm run build`: passed and wrote `dist/`.
- `npm run test:budget`: 10,363-byte gzip JavaScript, 5,033-byte gzip CSS,
  and a 26,903-byte mobile scene.

The full browser suite covered normal play, invalid challenge recovery,
corrupt/inconsistent/blocked storage recovery, privacy deletion confirmation,
links and route titles, keyboard focus, 44 px touch targets, 200% text,
reduced motion, all required routes and the designed 404. Its local axe scans
found no serious or critical violations.

## Declared claims

All 13 declared claims passed independently: four-turn end, restart reset,
settings persistence, no third-party requests, local progress, demo isolation,
async challenge reload, keyboard play, documented keyboard controls, frame
rate, daily seed, free play without an account, and the five-minute match.

No unlisted public claim was found in the landing page, README, privacy page,
or terms that changes what a visitor can rely on. Offline and update behavior
are not promised; no service worker is shipped.

## Live verification

- `/`, `/demo`, `/privacy`, `/terms`, `/404.html`, `robots.txt`, and
  `sitemap.xml` returned 200. An unknown route returned the expected HTTP 404
  and a complete designed return page.
- The factory `verify-url.sh` cold check returned 200 in 658 ms with no
  console errors, title, `lang="en"`, one H1, a main landmark, no missing
  image alt text, and no unlabelled buttons.
- Live axe scans on home, demo, privacy, terms, the unknown route, and static
  404 found zero serious or critical violations. The browser's expected
  network console entry for the deliberate HTTP 404 was excluded as specified
  by the review contract.
- A real daily turn was saved, then the live sample opened with two ledger
  rows, four placed tokens, and the persistent **Demo — sample data, nothing
  is saved** label. Two moves reached the actual **Opponent wins** end screen.
  Reset restored populated turn three, and returning to real play proved the
  saved real state was byte-for-byte unchanged.
- Live keyboard checks proved Tab reached the skip link, Enter opened the
  focused sample link, and Space reset the focused sample button. With reduced
  motion, the live transition duration was `1e-05s`.
- Separate live creator and friend browser contexts completed an async
  challenge. The friend reloaded after turn one, resumed with one ledger row,
  then finished and saw the creator plan Learn, Build, Buzz, Learn.
- The deployed `index-DnYUMndI.js` and `index-B87S_nzk.css` SHA-256 values
  exactly match the clean build. This proves the live runtime is the reviewed
  implementation; `3acca02` and `8c076b5` do not alter its product assets.

Evidence is under `/work/.evidence/founder-fork-verify-2/`.

## Earlier findings

**FF-V1-001 is resolved.** The README now correctly says Tab moves focus,
Enter follows focused links or activates buttons, and Space activates buttons.
The declared `keyboard-controls` claim passed locally and live.

The older builder notes on image conversion, type declarations, report output,
touch auditing, reduced motion, stale preview, Lighthouse launch, target size,
200% text reflow, challenge reload, navigation announcement, state validation,
restart focus, and blocked storage remain resolved. The clean build and the
35-test regression suite exercised their current behavior.

## Final result

**PASS — zero findings and zero untested public claims.**
