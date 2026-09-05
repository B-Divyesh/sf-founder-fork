# Founder Fork

Founder Fork is a free daily strategy game for friends. Each match has four
turns. Both sides choose Learn, Build, or Buzz in secret, then place one public
resource token. The choices resolve together. Final map control can change the
winner.

A match is designed to finish in about five minutes. The sample starts with two
turns complete. Play it at `/demo` without changing a saved daily match.

## Who it is for

It is for people who enjoy short strategy puzzles and startup satire. The rules
use three plain choices. No account is needed. All companies and events are
fictional. The game is entertainment, not business or investment advice.

## Play

- Choose a hidden bet. Learn beats Build, Build beats Buzz, and Buzz beats
  Learn.
- Place a public token on one of three map goals. The opponent's placement is
  already visible.
- Resolve four turns. Reveal points, event bonuses, and final map control set
  the result.
- Finish a match to create an async challenge link. A second player faces your
  four saved choices on the same board.

Keyboard controls: `1`–`3` choose a bet, `Q`–`E` choose a map goal, and `Enter`
resolves the turn. Tab, Enter, and Space also operate every control.

Daily match and challenge progress stay in local storage in the browser.
Real-game settings use the same storage. The sample uses memory only. Sound
defaults off. Normal play makes no requests to third-party services. The board
loop targets 60 frames per second.

## Clean setup

Prerequisites: Node.js 22 and npm 10.

```bash
npm ci
npm run test:unit
npm test
npm run build
npm run test:budget
```

`npm test` starts a production preview and runs the browser, claim, route,
mobile, keyboard, reduced-motion, console, and axe checks. The pinned
Playwright version is 1.58.2. If Chromium is missing, run:

```bash
npx playwright install chromium
```

Run one public claim exactly as listed in `.factory/claims.json`:

```bash
npm run test:claims -- --grep "@claim:four-turn-end"
```

For local development:

```bash
npm run dev
```

The production build is written to `dist/`. It is a static Vite site with no
backend, account system, third-party runtime script, analytics, or payment
integration. Deployment is handled by the Param Factory.

## Routes

- `/` — daily game
- `/demo` — isolated populated sample
- `/challenge/<code>` — async friend challenge
- `/privacy` — saved data and deletion controls
- `/terms` — game terms

## Project records

- `.factory/brief.json` — researched opportunity
- `.factory/design.md` — visual direction, mechanics, and asset provenance
- `.factory/claims.json` — public claims and exact browser checks
- `.factory/demo.md` — sample data and isolation
- `.factory/copy-audit.md` — plain-language sentence audit
- `.factory/handoff.md` — verification and release record

## License

Code is available under the MIT License. Generated and authored game artwork is
included for use with this product.
