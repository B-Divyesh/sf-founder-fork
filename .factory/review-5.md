# Play a four-turn startup strategy duel — review 5

**Verdict: PASS**

- Findings: **0**
- Untested public claims: **0**
- Implementation reviewed: `2b35ddf` (`2b35ddf2f5d2ff81cd6e17ec3a0add62084e9420`)
- Documentation reviewed: `10dfe56a` (`10dfe56a7b3d199b7a036ae4c940846cab305fe8`)
- Live URL: https://founder-fork.sociobot.in
- Completed: 6 September 2026 UTC

## Job, audience, and first action

- Job: finish a four-turn strategy duel by choosing one hidden bet and one public map goal each turn.
- Audience: friends who want a quick three-choice strategy puzzle with startup satire and no account.
- First action: select **Try it with sample data**.

Fresh 1440 × 900 desktop and 390 × 844 touch-phone browser contexts opened at
scroll position zero. Both showed the H1, audience sentence, sample action, and
active board before scrolling. The phone had zero horizontal overflow.

## Live game and sample

The desktop entered the one-click sample after first saving one real daily turn.
The sample opened at turn three with two ledger rows, four tokens, and the
persistent **Demo — sample data, nothing is saved** label. Two selections
reached the actual **Opponent wins** end screen after four rows, at 6–13.

**Play again** returned the run to turn one with zero scores, zero tokens, and
an empty ledger. **Reset demo** restored the populated turn-three sample.
**Start for real** returned to the real daily game; its exact saved storage
value was unchanged. The desktop checked that Sound starts off, then saved
Sound on and Motion off; both values survived reload.

The touch phone entered the sample with a tap and completed both remaining
turns with touch controls. It reached the same end screen, had no visible
control smaller than 44 CSS px, had no horizontal overflow, and reported 60
fps. Desktop and phone screenshots and the structured run result are in
`/work/.evidence/founder-fork-review-5/live/`.

An independent creator completed Learn, Build, Buzz, Learn and made a
challenge link. A fresh friend context resolved one turn, reloaded with one row
intact, finished, and saw the creator plan in that order. The route title was
**Challenge — Founder Fork**.

## Keyboard, recovery, privacy, and requests

Live keyboard checks showed Tab focusing the skip link, Enter opening the
focused sample link, and Space resetting the focused **Reset demo** button to
the populated turn-three state. At 200% text size the phone layout still had
zero horizontal overflow. Reduced motion set the checked transition duration to
`1e-05s`.

Live recovery checks found a clear fresh-board message for unreadable saved
state, a clear warning while play continued when browser storage rejected a
save, and a useful invalid-challenge page with a return path. Privacy deletion
kept all three saved keys after cancellation and removed them after confirmed
deletion. Normal play through the sample end screen requested only
`https://founder-fork.sociobot.in`.

The product is a static local-first site. It has no backend, tenant, health,
restart, live-room, or rate-limit surface, so backend-only tenant-isolation,
restart-persistence, and 429/Retry-After checks do not apply. It does not
promise offline or update behavior and ships no service worker.

## Accessibility, routes, links, and headers

Live Playwright axe scans found zero violations on `/`, `/demo`, `/privacy`,
`/terms`, `/404.html`, and an unknown route. Each had one H1, one main
landmark, and its route-specific title. `verify-url.sh` loaded the home page in
663 ms with `lang="en"`, one H1, a main landmark, complete image alt text,
labelled buttons, and no console errors.

All 11 discovered internal links returned HTTP 200. `/`, `/demo`, `/privacy`,
`/terms`, `/404.html`, `robots.txt`, and `sitemap.xml` returned 200. The
unknown route returned the designed page with HTTP 404, as intended. Its one
browser failed-resource console entry is the expected consequence of requesting
an HTTP 404, not a page defect. The live response includes same-origin CSP with
`frame-ancestors` as a header, HSTS, Referrer-Policy, X-Content-Type-Options,
Permissions-Policy, and Cross-Origin-Opener-Policy.

## Clean checkout and claims

This clean checkout used Node `v22.23.2` and npm `10.9.8`.

- `npm ci --include=dev`: passed with zero vulnerabilities.
- `npm run test:unit`: passed, 5/5 tests.
- Every one of the 13 exact commands declared in `.factory/claims.json` was
  run separately and passed.
- `npm test`: passed, 35/35 browser checks.
- `npm run build`: passed and produced `dist/`.
- `npm run test:budget`: passed: 10,373-byte gzip JavaScript, 5,033-byte gzip
  CSS, and a 26,903-byte mobile scene.

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

The live landing page, README, sample banner, privacy page, terms page, and
footer were cross-checked against `.factory/claims.json`. No public
visitor-reliance claim was missing an exact outcome test.

## Candidate comparison and earlier findings

`git diff 2b35ddf..10dfe56a` contains only the handoff and prior review or
verification reports. The live assets match the clean candidate build exactly:

| Asset | SHA-256 |
| --- | --- |
| `index-CanSojyL.js` | `85375d505edec199514fc437fe2fd7134953439c2d20e83a4906c188ec1b5e2c` |
| `index-B87S_nzk.css` | `c43eb0ff873150ce50bcdc0c218bd791b5f4e1a041063b6cab46c6c8da091e49` |

**FF-V1-001 remains resolved.** The public keyboard wording matches native
link and button behavior, and `keyboard-controls` passed locally and live.
**FF-R2-001 remains resolved.** The page now promises same-day seed stability,
and `daily-seed` completed two independent fixed-date runs and compared visible
goals, events, placements, and the opponent plan.

The earlier minor builder findings are also still resolved: image conversion,
type setup, report output, hidden touch-control auditing, reduced-motion
serialization, preview state, Lighthouse launch, touch target size, 200% text
reflow, challenge reload, navigation announcement, saved-state validation,
restart focus, and blocked-storage recovery. The current clean regression
suite and the live checks above exercised their behavior.

## Final result

**PASS — zero findings and zero untested public claims.**
