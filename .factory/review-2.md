# Play a four-turn startup strategy duel — review 2

**Verdict: FAIL**

- Findings: **1 minor**
- Untested public claims: **1**
- Implementation reviewed: `7ff658f` (`7ff658fd06a768661f81e609dfdb978179f208c3`)
- Documentation reviewed: `92b9898` (`92b9898adf7e01e2ea25a92a17272d0d37582ae5`)
- Test-only follow-up included: `3acca02`
- Live URL: https://founder-fork.sociobot.in
- Completed: 6 September 2026 UTC

## Job, audience, and first action

- Job: finish a four-turn strategy duel by choosing one hidden bet and one
  public map goal each turn.
- Audience: friends who want a short strategy puzzle with startup satire, no
  business knowledge, and no account.
- First action: select **Try it with sample data**.

Fresh 1440 × 900 desktop and 390 × 844 phone browsers showed the H1, audience
sentence, sample action, and active game board before scrolling. The phone had
zero horizontal overflow. The first screen states the job and action in plain
words.

## Finding

### FF-R2-001 — Minor — The daily reshuffle statement is undeclared and not always observable

The live home page says: **“Each day reshuffles the events, map goals, and
opponent plan.”** This is a public statement about recurring game content.

The declared `daily-seed` claim and its tagged test prove only that the same
seed keeps the board unchanged after reload. The engine unit test compares two
seeds but asserts only that the opponent plan differs. No declared command
proves the advertised day-to-day change for events, map goals, and the
opponent plan.

A diagnostic across 3,652 consecutive date changes found 41 cases where at
least one named output group stayed unchanged. The current 5, 6, and 7
September seeds happen to differ in all three groups, but that does not make
the sentence a reliable daily guarantee. This fails the claims contract.
Either narrow the live sentence to the deterministic same-seed behavior
already tested, or change the generator and add an exact declared claim whose
test proves the final wording. No product code was changed during this review.

## Live game review

Both fresh browsers exercised the complete sample loop from entry through
active play to an actual end screen:

- The one-click sample opened at turn three with two ledger rows, four placed
  tokens, and the persistent **Demo — sample data, nothing is saved** label.
- Desktop used only `3`, `E`, Enter, then `1`, `Q`, Enter for the last two
  turns. Phone used touch controls.
- Both runs reached **Opponent wins**, 6–13, with four ledger rows.
- **Play again** returned to turn one with zero score, zero tokens, and an
  empty ledger on both screen sizes.
- Space on the focused **Reset demo** button restored the populated turn-three
  sample. Daily-match, settings, and challenge sentinel values were all
  byte-for-byte unchanged after sample play, reset, and settings changes.
  **Start for real** restored the saved match's one ledger row.
- Sound started off. The settings dialog focused Sound, saved sound on and
  motion off across reload, closed with Escape, and returned focus to its
  opener.
- The phone board measured 60 fps. Its 17 visible controls were at least
  44 px in both dimensions.

The desktop and phone recordings, first-screen images, populated sample
images, and end-screen images are under
`/work/.evidence/founder-fork-review-2/live/`.

## Challenge, recovery, privacy, and offline behavior

Independent creator and friend browser contexts exercised the real encoded
challenge path. The creator completed four turns. The friend resolved one
turn, reloaded with one ledger row intact, completed the game, and saw the
creator plan Learn, Build, Buzz, Learn in order.

The generated challenge deep link returned 200 with the title **Challenge —
Founder Fork**, one H1, one main landmark, and a visible board.

Invalid challenge input showed its own title, clear explanation, and return
link. Corrupt saved data recovered to a fresh turn-one board. When storage
writes were blocked, play continued and the page explained that reload would
reset the match. Privacy deletion preserved data after cancellation, then
removed daily, settings, and challenge keys after confirmation.

Offline play and update behavior are not advertised. The live page had no
service-worker registration, controller, or web app manifest. The product is
static and has no backend, tenant, health, restart-persistence, or rate-limit
surface. Backend-only checks therefore do not apply.

## Accessibility, routes, links, and performance

- `/`, `/demo`, `/privacy`, `/terms`, `/404.html`, `robots.txt`, and
  `sitemap.xml` returned 200. `/review-2-missing-page` returned the expected
  HTTP 404 with the designed return page.
- Every app route and both 404 paths had the expected route title, one H1,
  and header, main, and footer landmarks. All 11 discovered internal links
  returned 200.
- Fresh full axe scans on home, demo, privacy, terms, static 404, and the
  deliberate HTTP 404 reported zero violations of any severity.
- The live verification script reported no console errors, `lang="en"`, one
  H1, a main landmark, complete image alt text, and labelled buttons. The only
  console entry on the unknown URL was the browser's expected failed-resource
  message for its deliberate 404.
- Keyboard focus, dialog focus return, route focus announcement, screen-reader
  turn status, 200% text reflow, and reduced motion passed. Reduced motion set
  the relevant transition to `1e-05s`.
- Fresh Lighthouse mobile and desktop runs scored 100 in performance,
  accessibility, best practices, and SEO. Mobile LCP was 1,073 ms, CLS 0,
  and TBT 0 ms. Desktop LCP was 282 ms, CLS 0, and TBT 0 ms.

## Clean checkout and declared claims

A new detached checkout at `92b9898` was installed with Node `v22.23.2` and
npm `10.9.8` using `npm ci --include=dev`.

- `npm run test:unit`: 5 of 5 passed.
- Every command in `.factory/claims.json` passed separately.
- `npm test`: 35 of 35 browser checks passed.
- `npm run build`: passed and produced `dist/`.
- `npm run test:budget`: 10,363-byte gzip JavaScript, 5,033-byte gzip CSS,
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

The deployed `index-DnYUMndI.js` and `index-B87S_nzk.css` hashes exactly match
the clean build. Later commits after `7ff658f` change only a claim test and
review documentation, so the implementation candidate remains `7ff658f`.

## Earlier findings

FF-V1-001 remains resolved. The README now states the native keyboard behavior
accurately, the declared `keyboard-controls` command passed, and fresh live
checks proved Enter on the sample link and Space on the reset button.

The earlier builder notes on image conversion, type declarations, report
output, touch target auditing, reduced motion, stale preview state, Lighthouse
launch, 200% reflow, challenge reload, route announcement, saved-state
validation, restart focus, and blocked-storage recovery remain resolved. The
clean suite and fresh live checks exercised their current behavior. One initial
Lighthouse process crashed before collection; the immediate rerun completed
and produced the scores above, so this was a review-process issue rather than a
page defect.

## Final result

**FAIL — one minor finding and one untested public claim.**

All runtime paths and all declared claim commands passed. FF-R2-001 prevents a
PASS because the live day-to-day reshuffle statement is not proven by a
matching declared claim test.
