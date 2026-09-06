# Play a four-turn startup strategy duel — repair verification 2

**Verdict: PASS**

- Previous failed verification: `d3685f4`
- Production implementation: `7ff658f`
- Verification-only follow-up: `3acca02`
- Live URL: `https://founder-fork.sociobot.in`
- Completed: 6 September 2026 UTC

## Previous finding

FF-V1-001 found a false README statement: Space was said to operate every
control, but a focused sample link correctly followed native link behavior and
only Enter opened it. The statement is now narrow and true. It documents Tab
focus movement, Enter for focused links and buttons, and Space for focused
buttons. A declared `keyboard-controls` claim proves all three outcomes.

## Clean verification

A fresh clone of `3acca02` ran `npm ci` with Node 22.23.2 and npm 10.9.8.

- 5 unit tests passed.
- All 13 declared claim commands passed separately; their final status is 0.
- The full Playwright suite passed 35/35 tests.
- The build produced `dist/`.
- Budget results: 10,363-byte gzip JavaScript, 5,033-byte gzip CSS, and a
  26,903-byte mobile scene.

The browser suite includes axe scans for home, demo, privacy, terms, unknown
route, and static 404. It also covers keyboard focus, 44-pixel targets, phone
layout, 200% text, reduced motion, saved-state recovery, privacy deletion,
route navigation, internal links, and a two-client challenge reload.

## Cold live verification

`verify-url.sh` returned a 200 response in 768 ms with no console errors, one
H1, English page language, a main landmark, no missing image alt text, and no
unlabelled buttons. The expected unknown-route response was HTTP 404 and
showed the product’s return path.

Fresh 1440 × 900 and 390 × 844 browser contexts both showed the job, audience,
sample action, and game board before scrolling. The desktop run saved one real
turn, opened the sample with Enter, reached the `Opponent wins` end screen,
reset the sample with Space, and confirmed the real saved state was byte-for-
byte unchanged. A second live context completed the async challenge after a
reload and saw the creator plan in order.

The live JavaScript matched the clean build by SHA-256:
`78cb8d69af82815dd5c01a88e54916f5446fc2ce7465d18ad920fbe899ca670c`.
The later follow-up changes only test and report files, so no second product
image was needed after the successful production deployment.

Evidence is stored in `/work/.evidence/final-live-repair-1/`, including
`phone-first-screen.png`, `desktop-populated-sample.png`,
`desktop-sample-end-visible.png`, the recorded desktop run, and
`live-run.json`.
