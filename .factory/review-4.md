# Play a four-turn startup strategy duel — review 4

**Verdict: PASS**

- Findings: **0**
- Untested public claims: **0**
- Implementation reviewed: `2b35ddf` (`2b35ddf2f5d2ff81cd6e17ec3a0add62084e9420`)
- Documentation reviewed: `272746c` (`272746cf5f558445cb8100c83521c553b432700b`)
- Live URL: https://founder-fork.sociobot.in
- Completed: 6 September 2026 UTC

## Job, audience, and first action

- Job: finish a four-turn strategy duel by choosing one hidden bet and one public map goal each turn.
- Audience: friends who want a quick three-choice strategy puzzle with startup satire and no account.
- First action: select **Try it with sample data**.

Fresh 1440 × 900 desktop and 390 × 844 touch-phone contexts opened at scroll position zero. Both showed the H1, audience sentence, sample action, and active game board before scrolling. The phone had zero horizontal overflow.

## Live game, sample, and challenge

The desktop and phone each entered `/demo` in one action and completed active play through the actual end screen. Both samples began with two ledger rows and the persistent **Demo — sample data, nothing is saved** label. Desktop reached **Opponent wins** after four ledger rows using the game controls. The phone did the same with touch controls and reported 60 fps.

On desktop, **Play again** reset to turn one with zero ledger rows and zero placed tokens. **Reset demo** restored turn three with two populated rows and retained the sample label. Normal desktop play made requests only to `https://founder-fork.sociobot.in` and produced no console errors.

An independent creator context completed a real match with Learn, Build, Buzz, Learn, created a challenge link, and a separate friend context opened it. The friend completed one turn, reloaded with that ledger row still present, completed the remaining turns, and saw the creator decisions in order: Learn, Build, Buzz, Learn. The challenge route had the title **Challenge — Founder Fork**.

Screenshots: `/work/.evidence/founder-fork-review-4/live/desktop-first-screen.png`, `desktop-end-screen.png`, `phone-first-screen.png`, `phone-end-screen.png`, and `challenge-end-screen.png`.

## Claims and clean checkout

This checkout is clean at documentation SHA `272746c`. `git diff 2b35ddf..272746c` contains only `.factory/handoff.md` and `.factory/verification-3.md`; therefore the implementation candidate is `2b35ddf`.

After `npm ci` with Node 22 and npm 10:

- `npm run test:unit`: passed, 5/5 tests.
- Each of the 13 exact commands declared in `.factory/claims.json` was invoked separately and passed.
- `npm test`: passed, 35/35 browser checks; `test-results/.last-run.json` records `status: "passed"` and no failed tests.
- `npm run build`: passed and produced `dist/`.
- `npm run test:budget`: passed: 10,373-byte gzip JavaScript, 5,033-byte gzip CSS, and a 26,903-byte mobile scene.

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

The public landing page, demo banner, README, privacy page, terms, and footer were cross-checked against the declarations. No visitor-reliance statement lacked an exact listed outcome test. Offline and update behavior are not advertised. The product has no backend, so tenant isolation, health, restart persistence, and 429 checks do not apply.

## Accessibility, routes, recovery, privacy, and links

Live Playwright axe scans on `/`, `/demo`, `/privacy`, `/terms`, `/404.html`, and `/review-4-missing` reported zero violations, including zero serious or critical violations. Every route had its route-specific title, exactly one H1, and header, main, and footer landmarks. The unknown route returned the intended HTTP 404 and designed page. Its one browser console error was the expected failed-resource message for that deliberate 404, not a page error.

The full clean browser suite also passed its keyboard focus, dialog-focus return, 44 px touch target, 200% text reflow, reduced-motion, route-announcement, corrupt-storage, blocked-storage, privacy deletion confirmation, invalid challenge, and internal-link checks. This exercises normal, invalid, boundary, and recovery paths. The normal-play origin check passed, and the live response includes same-origin CSP, Referrer-Policy, X-Content-Type-Options, Permissions-Policy, HSTS, and `frame-ancestors` as a response header.

## Live candidate comparison and earlier findings

The deployed assets match the clean build of `2b35ddf` exactly:

| Asset | SHA-256 |
| --- | --- |
| `index-CanSojyL.js` | `85375d505edec199514fc437fe2fd7134953439c2d20e83a4906c188ec1b5e2c` |
| `index-B87S_nzk.css` | `c43eb0ff873150ce50bcdc0c218bd791b5f4e1a041063b6cab46c6c8da091e49` |

FF-V1-001 remains resolved: the public keyboard wording distinguishes Enter on links and buttons from Space on buttons, and its exact claim passed. FF-R2-001 remains resolved: the live wording promises same-day seed stability, and the exact daily-seed claim completes two independent fixed-date runs and compares visible seed, goals, events, placements, and plan. The earlier documented minor issues for targets, reflow, challenge reload, route announcement, saved-state validation, restart focus, and blocked storage remain covered by passing behavior tests. The unrelated renderer diagnosis in prior review discussion was discarded; it concerns neither this product nor its implementation.

## Final result

**PASS — zero findings and zero untested public claims.**
