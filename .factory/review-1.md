# Play a four-turn startup strategy duel — review 1

**Verdict: PASS**

- Findings: **0**
- Untested public claims: **0**
- Implementation reviewed: 7ff658f (7ff658fd06a768661f81e609dfdb978179f208c3)
- Documentation reviewed: b977bfd (b977bfddfa33fb6336603291728f84ca126e805a)
- Test follow-up reviewed: 3acca02; verification documentation follow-up: 8c076b5
- Live URL: https://founder-fork.sociobot.in
- Completed: 6 September 2026 UTC

## Job, audience, and first action

- Job: finish a four-turn strategy duel by selecting one hidden bet and one public map goal each turn.
- Audience: friends who want a quick strategy puzzle with startup satire, without business knowledge or an account.
- First action: select Try it with sample data.

Fresh 1440 × 900 and 390 × 844 contexts opened the live origin. On both, the H1, audience sentence, sample action, and active game board were in the first viewport. The phone had zero horizontal overflow. The job, audience, and action use plain words; the page and report title name the job rather than a mood or metaphor.

## Live game review

The fresh desktop daily board saved one real turn. The sample then opened in one click with two resolved ledger rows, placed tokens, and the persistent label “Demo — sample data, nothing is saved.” Playing in the sample and using Reset demo restored the populated turn-three state. Start for real returned to the daily match, whose exact saved value was unchanged.

The recorded sample run selected Buzz with the third goal, then Learn with the first goal. It reached the actual Opponent wins end screen after four turns, with a 6–13 score and four ledger rows. Play again reset the ledger to zero and returned the match to turn one. Desktop and phone recordings and end-screen screenshots are in /work/.evidence/founder-fork-review-1/.

Fresh live checks also found:

- Sound starts off; settings dialog focus moves to Sound and returns correctly.
- The 1, Q, Enter keyboard run advanced the sample to three ledger rows. Local claim verification also covers Tab, Enter on a link, and Space on a focused button.
- A reduced-motion context reported a 1e-05s transition duration.
- A phone-sized live context reported 60 fps after 2.5 seconds.
- A creator and an independent friend context completed a real async challenge. The friend reloaded after one resolved turn, resumed with one row, finished the match, and saw the creator choices Learn, Build, Buzz, Learn in order.

The game has no product backend. Its advertised async challenge is a local-first encoded link, so tenant, health, restart-persistence, and request-rate checks are not applicable. The two independent browser contexts above test the actual advertised multiplayer-like path.

## Clean checkout and claims

A detached clean worktree at 8c076b5 was installed with Node 22 and npm 10 using npm ci --include=dev. The later b977bfd commit changes review records only; 3acca02 is a test-only follow-up. The runtime source inputs and clean production assets are unchanged from 7ff658f.

- npm run test:unit passed: 5 of 5.
- Each declared command in .factory/claims.json passed separately.
- npm test passed: 35 of 35 browser checks.
- npm run build passed and produced dist.
- npm run test:budget passed: 10,363-byte gzip JavaScript, 5,033-byte gzip CSS, and a 26,903-byte mobile AVIF scene.

| Claim | Result |
| --- | --- |
| four-turn-end | PASS |
| restart-reset | PASS |
| settings-persist | PASS |
| third-party-requests | PASS |
| local-progress | PASS |
| demo-sandbox | PASS |
| async-challenge | PASS |
| keyboard-play | PASS |
| keyboard-controls | PASS |
| frame-rate | PASS |
| daily-seed | PASS |
| free-play | PASS |
| five-minute-match | PASS |

The separate command log and status list are /work/.evidence/ff-review-1-claims.log and /work/.evidence/ff-review-1-claims.status. Public copy on the live routes, README, privacy page, terms, footer, and demo banner was cross-checked against the declared claims. No unlisted visitor-reliance claim was found. Offline and update behavior are not promised.

## Routes, accessibility, privacy, and links

- Live /, /demo, /privacy, /terms, /404.html, robots.txt, and sitemap.xml returned 200. /missing-page returned the expected HTTP 404 and a complete designed return page.
- Every checked app route had its route-specific title, exactly one H1, and one main landmark. The static 404 has the same required structure.
- Fresh live axe scans on home, demo, privacy, terms, unknown route, and static 404 found zero serious or critical violations. The only console entry on the unknown route was the browser’s expected failed-network entry for its deliberate HTTP 404; it is not a page error.
- Home, demo, privacy, terms, and static 404 had no console errors. The local full suite also covered visible focus, dialog focus management, 44 px targets, 200% text reflow, route announcements, recovery from invalid/corrupt/blocked storage, privacy deletion, and internal links.
- Headers include a restrictive same-origin CSP, Referrer-Policy, X-Content-Type-Options, Permissions-Policy, and frame-ancestors as a response header. Normal-play request testing passed with no third-party origin.

The live assets were compared with the clean production build:

| Asset | SHA-256 |
| --- | --- |
| index-DnYUMndI.js | 78cb8d69af82815dd5c01a88e54916f5446fc2ce7465d18ad920fbe899ca670c |
| index-B87S_nzk.css | c43eb0ff873150ce50bcdc0c218bd791b5f4e1a041063b6cab46c6c8da091e49 |

Both live hashes exactly equal the build from the implementation candidate. This confirms the deployed runtime is 7ff658f; report-only b977bfd does not require a new product image.

## Earlier findings

FF-V1-001 is still resolved. The README now says that Tab moves focus, Enter follows focused links or activates buttons, and Space activates focused buttons. The separate keyboard-controls claim command passed and the live keyboard checks match that wording.

The earlier minor builder and verifier notes remain resolved: image conversion and type setup, report output, hidden touch-audit controls, reduced-motion serialization, stale preview, Lighthouse launch, undersized targets, 200% sample-banner reflow, challenge reload, navigation announcement, saved-state validation, restart focus, and blocked-storage recovery. The clean 35-test suite and the fresh live flows exercised the relevant current behavior.

## Final result

**PASS — zero findings and zero untested public claims.**
