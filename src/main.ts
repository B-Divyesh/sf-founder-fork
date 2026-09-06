import './styles.css';
import {
  BET_LABELS,
  BETS,
  createGame,
  createSampleGame,
  dailySeed,
  decodeChallenge,
  encodeChallenge,
  outcomeLabel,
  resolveTurn,
  type Bet,
  type Decision,
  type GameState,
} from './engine';

const REAL_GAME_KEY = 'founder-fork:game:v1';
const SETTINGS_KEY = 'founder-fork:settings:v1';
const CHALLENGE_GAME_PREFIX = 'founder-fork:challenge:v1:';
const BUILD_ID = '1.0.1 · 2026.09.06';
const appElement = document.querySelector<HTMLDivElement>('#app');
if (!appElement) throw new Error('The game could not start because its page container is missing.');
const app: HTMLDivElement = appElement;

interface Settings {
  sound: boolean;
  motion: boolean;
}

interface RouteInfo {
  kind: 'home' | 'demo' | 'challenge' | 'privacy' | 'terms' | 'not-found';
  challengeCode?: string;
}

let route = readRoute();
let game: GameState | null = null;
let selectedBet: Bet | null = null;
let selectedLaneId: string | null = null;
let notice = '';
let settings = loadSettings(route.kind === 'demo');
let challengeUrl = '';
let lastFocused: HTMLElement | null = null;
let audioContext: AudioContext | null = null;
let lastResultAnnouncement = '';
let lastResolvedTurn: number | null = null;

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character] ?? character);
}

function readRoute(): RouteInfo {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/') return { kind: 'home' };
  if (path === '/demo') return { kind: 'demo' };
  if (path === '/privacy') return { kind: 'privacy' };
  if (path === '/terms') return { kind: 'terms' };
  if (path.startsWith('/challenge/')) return { kind: 'challenge', challengeCode: path.slice('/challenge/'.length) };
  return { kind: 'not-found' };
}

function loadSettings(isDemo: boolean): Settings {
  if (isDemo) return { sound: false, motion: true };
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? 'null') as Partial<Settings> | null;
    return { sound: saved?.sound === true, motion: saved?.motion !== false };
  } catch {
    return { sound: false, motion: true };
  }
}

function restoreSavedGame(value: unknown, initial: GameState): GameState | null {
  if (!value || typeof value !== 'object') return null;
  const saved = value as Partial<GameState>;
  if (saved.version !== 1
    || saved.mode !== initial.mode
    || saved.seed !== initial.seed
    || !Array.isArray(saved.history)
    || saved.history.length > 4) return null;

  let replay = initial;
  try {
    for (const entry of saved.history) {
      const decision = (entry as { player?: Partial<Decision> } | null)?.player;
      if (!decision
        || !BETS.includes(decision.bet as Bet)
        || typeof decision.laneId !== 'string') return null;
      replay = resolveTurn(replay, { bet: decision.bet as Bet, laneId: decision.laneId });
    }
  } catch {
    return null;
  }

  return JSON.stringify(replay) === JSON.stringify(value) ? replay : null;
}

function loadDailyGame(): GameState {
  try {
    const raw = localStorage.getItem(REAL_GAME_KEY);
    if (!raw) return createGame(dailySeed());
    const parsed: unknown = JSON.parse(raw);
    const initial = createGame(dailySeed());
    const restored = restoreSavedGame(parsed, initial);
    if (restored) return restored;
    const savedSeed = typeof parsed === 'object' && parsed ? (parsed as { seed?: unknown }).seed : null;
    notice = savedSeed !== dailySeed()
      ? 'A saved match was out of date. Today’s fresh board is ready.'
      : 'The saved match was incomplete. Today’s fresh board is ready.';
  } catch {
    notice = 'The saved match could not be read. Today’s fresh board is ready.';
  }
  return createGame(dailySeed());
}

function challengeStorageKey(code: string): string {
  return `${CHALLENGE_GAME_PREFIX}${code}`;
}

function loadChallengeGame(code: string, seed: string, plan: Decision[]): GameState {
  const initial = createGame(seed, 'challenge', plan);
  try {
    const raw = localStorage.getItem(challengeStorageKey(code));
    if (!raw) return initial;
    const restored = restoreSavedGame(JSON.parse(raw) as unknown, initial);
    if (restored) return restored;
    try { localStorage.removeItem(challengeStorageKey(code)); } catch { /* The fresh in-memory challenge still works. */ }
    notice = 'The saved challenge was incomplete. A fresh challenge is ready.';
  } catch {
    try { localStorage.removeItem(challengeStorageKey(code)); } catch { /* The fresh in-memory challenge still works. */ }
    notice = 'The saved challenge could not be read. A fresh challenge is ready.';
  }
  return initial;
}

function initializeRoute(): void {
  selectedBet = null;
  selectedLaneId = null;
  challengeUrl = '';
  notice = '';
  lastResultAnnouncement = '';
  lastResolvedTurn = null;
  if (route.kind === 'demo') {
    settings = loadSettings(true);
    game = createSampleGame();
  } else if (route.kind === 'challenge') {
    settings = loadSettings(false);
    const decoded = decodeChallenge(route.challengeCode ?? '');
    game = decoded ? loadChallengeGame(route.challengeCode ?? '', decoded.seed, decoded.plan) : null;
  } else if (route.kind === 'home') {
    settings = loadSettings(false);
    game = loadDailyGame();
  } else {
    settings = loadSettings(false);
    game = null;
  }
  applyMotionSetting();
}

function applyMotionSetting(): void {
  document.documentElement.dataset.motion = settings.motion ? 'on' : 'off';
}

function persistGame(): void {
  try {
    if (route.kind === 'home' && game?.mode === 'daily') {
      localStorage.setItem(REAL_GAME_KEY, JSON.stringify(game));
    } else if (route.kind === 'challenge' && game?.mode === 'challenge' && route.challengeCode) {
      localStorage.setItem(challengeStorageKey(route.challengeCode), JSON.stringify(game));
    }
  } catch {
    notice = 'This browser blocked saving. You can keep playing, but a reload will reset this match.';
  }
}

function persistSettings(): void {
  if (route.kind === 'demo') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    const message = document.querySelector('.settings-dialog .dialog-note');
    if (message) message.textContent = 'This browser blocked saving. These settings will reset after a reload.';
  }
}

function pageMeta(title: string, description: string, canonicalPath: string): void {
  const url = `https://founder-fork.sociobot.in${canonicalPath}`;
  document.title = title;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', description);
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', url);
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute('content', title);
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute('content', description);
  document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.setAttribute('content', url);
  document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')?.setAttribute('content', title);
  document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')?.setAttribute('content', description);
}

function headerMarkup(): string {
  return `
    <header class="site-header">
      <div class="header-inner">
        <a class="wordmark" href="/" data-route>Founder Fork</a>
        <nav aria-label="Main navigation">
          <a href="/demo" data-route>Demo</a>
          <a href="/#how-it-works" data-route>How to play</a>
          <a href="/privacy" data-route>Privacy</a>
          <button class="text-button" type="button" data-action="open-settings">Settings</button>
        </nav>
      </div>
    </header>`;
}

function footerMarkup(): string {
  return `
    <footer class="site-footer">
      <div>
        <p><strong>Founder Fork</strong> is a free four-turn strategy game.</p>
        <p class="footer-note">The editorial scene was generated for this game. The board art and icons are original.</p>
      </div>
      <nav aria-label="Footer navigation">
        <a href="/privacy" data-route>Privacy</a>
        <a href="/terms" data-route>Terms</a>
        <span>Built by Param Factory</span>
      </nav>
      <p class="build-id">v${BUILD_ID}</p>
    </footer>`;
}

function dialogMarkup(): string {
  return `
    <dialog class="settings-dialog" id="settings-dialog" aria-labelledby="settings-title">
      <form method="dialog">
        <div class="dialog-heading">
          <h2 id="settings-title">Game settings</h2>
          <button class="icon-button" value="close" aria-label="Close settings">×</button>
        </div>
        <label class="setting-row">
          <span><strong>Sound</strong><small>Play a short tone when a turn resolves.</small></span>
          <input type="checkbox" name="sound" ${settings.sound ? 'checked' : ''} />
        </label>
        <label class="setting-row">
          <span><strong>Motion</strong><small>Animate the brief turn result.</small></span>
          <input type="checkbox" name="motion" ${settings.motion ? 'checked' : ''} />
        </label>
        ${route.kind === 'demo' ? '<p class="dialog-note" role="status" aria-live="polite">Demo settings return to defaults when you leave the sample.</p>' : '<p class="dialog-note" role="status" aria-live="polite">Settings stay in this browser.</p>'}
        <button class="primary-button full-button" value="close">Save settings</button>
      </form>
    </dialog>
    <dialog class="confirm-dialog" id="confirm-dialog" aria-labelledby="confirm-title">
      <form method="dialog">
        <h2 id="confirm-title">Restart this match?</h2>
        <p>The four turns, points, and placed tokens will reset.</p>
        <div class="button-row">
          <button class="secondary-button" value="cancel">Keep playing</button>
          <button class="danger-button" value="confirm" data-action="confirm-restart">Restart match</button>
        </div>
      </form>
    </dialog>
    <dialog class="confirm-dialog" id="clear-dialog" aria-labelledby="clear-title">
      <form method="dialog">
        <h2 id="clear-title">Clear saved game and settings?</h2>
        <p>This removes saved matches and both settings from this browser.</p>
        <div class="button-row">
          <button class="secondary-button" value="cancel">Keep saved data</button>
          <button class="danger-button" value="confirm" data-action="confirm-clear-data">Clear saved data</button>
        </div>
      </form>
    </dialog>
    <div class="route-announcer sr-only" aria-live="polite" aria-atomic="true"></div>`;
}

function demoBanner(): string {
  if (route.kind !== 'demo') return '';
  return `
    <aside class="demo-banner" aria-label="Demo status">
      <strong>Demo — sample data, nothing is saved</strong>
      <div>
        <button type="button" data-action="reset-demo">Reset demo</button>
        <a href="/" data-action="start-real">Start for real</a>
      </div>
    </aside>`;
}

function betMark(bet: Bet): string {
  const symbols: Record<Bet, string> = { learn: '△', build: '■', buzz: '●' };
  return `<span class="bet-mark bet-mark--${bet}" aria-hidden="true">${symbols[bet]}</span>`;
}

function tokensMarkup(playerCount: number, opponentCount: number): string {
  const playerTokens = Array.from({ length: playerCount }, () => '<span class="resource-token resource-token--player" aria-hidden="true">P</span>').join('');
  const opponentTokens = Array.from({ length: opponentCount }, () => '<span class="resource-token resource-token--opponent" aria-hidden="true">O</span>').join('');
  return `${playerTokens}${opponentTokens}` || '<span class="no-tokens">No tokens yet</span>';
}

function historyMarkup(current: GameState): string {
  if (current.history.length === 0) {
    return '<p class="empty-ledger">Resolved turns will appear here. Choose a bet and a map goal to play turn one.</p>';
  }
  return `
    <ol class="turn-ledger">
      ${current.history.map((turn) => `
        <li class="${lastResolvedTurn === turn.turn ? 'new-result' : ''}">
          <span class="turn-number">${turn.turn}</span>
          <span><strong>${BET_LABELS[turn.player.bet].label}</strong> vs ${BET_LABELS[turn.opponent.bet].label}</span>
          <span class="result-stamp result-stamp--${turn.result}">${turn.result === 'win' ? 'Won reveal' : turn.result === 'loss' ? 'Lost reveal' : 'Tied reveal'}</span>
          <span class="turn-points">+${turn.playerPoints} / +${turn.opponentPoints}</span>
        </li>`).join('')}
    </ol>`;
}

function endScreenMarkup(current: GameState): string {
  const outcome = outcomeLabel(current);
  const isPlayerWin = outcome === 'You win';
  const isDraw = outcome === 'Draw';
  const summary = isPlayerWin
    ? 'Your reveals and map control finished ahead.'
    : isDraw
      ? 'The reveals and map control finished level.'
      : 'The opponent finished ahead. Review the ledger and try another plan.';
  return `
    <section class="end-screen" aria-labelledby="end-title" tabindex="-1" data-outcome="${escapeHtml(outcome)}">
      <p class="section-kicker">Match complete</p>
      <h3 id="end-title">${escapeHtml(outcome)}</h3>
      <p>${summary}</p>
      <div class="final-score" aria-label="Final score">
        <span><small>You</small><strong>${current.playerScore}</strong></span>
        <span aria-hidden="true">—</span>
        <span><small>Opponent</small><strong>${current.opponentScore}</strong></span>
      </div>
      <p class="board-bonus">Map control added ${current.boardPlayerPoints} points for you and ${current.boardOpponentPoints} for the opponent.</p>
      <div class="button-row end-actions">
        <button class="primary-button" type="button" data-action="play-again">Play again</button>
        ${route.kind === 'demo' ? '<a class="secondary-button link-button" href="/" data-action="start-real">Start for real</a>' : '<button class="secondary-button" type="button" data-action="create-challenge">Create challenge link</button>'}
      </div>
      ${challengeUrl ? `
        <div class="share-panel" aria-live="polite">
          <label for="challenge-url">Friend challenge link</label>
          <div class="share-row">
            <input id="challenge-url" value="${escapeHtml(challengeUrl)}" readonly />
            <button type="button" data-action="copy-challenge">Copy link</button>
          </div>
          <p>Your friend faces your four hidden choices on the same board.</p>
          <p class="inline-status" id="share-status" role="status" aria-live="polite"></p>
        </div>` : ''}
    </section>`;
}

function gameMarkup(current: GameState): string {
  const turnIndex = current.history.length;
  const event = current.events[Math.min(turnIndex, 3)];
  const opponentPlacement = current.opponentPlan[Math.min(turnIndex, 3)]?.laneId;
  return `
    <section class="game-board ${lastResolvedTurn ? 'turn-just-resolved' : ''}" id="game" aria-labelledby="game-title" data-game-status="${current.status}" tabindex="-1">
      <p class="sr-only turn-announcer" role="status" aria-live="polite" aria-atomic="true">${escapeHtml(lastResultAnnouncement)}</p>
      <div class="board-topline">
        <div>
          <p class="section-kicker">${current.mode === 'challenge' ? 'Friend challenge' : current.mode === 'demo' ? 'Sample match' : `Daily seed ${escapeHtml(current.seed)}`}</p>
          <h2 id="game-title">Launch week board</h2>
        </div>
        <div class="score-strip" aria-label="Current score">
          <span><small>You</small><strong data-score="player">${current.playerScore}</strong></span>
          <span><small>Opponent</small><strong data-score="opponent">${current.opponentScore}</strong></span>
        </div>
        ${current.status === 'active' ? '<button class="board-restart" type="button" data-action="request-restart">Restart match</button>' : ''}
      </div>

      <div class="turn-track" aria-label="Match progress">
        ${Array.from({ length: 4 }, (_, index) => `<span class="${index < current.history.length ? 'done' : index === current.history.length && current.status === 'active' ? 'current' : ''}">${index + 1}<span class="sr-only">${index < current.history.length ? ' complete' : index === current.history.length ? ' current' : ' not played'}</span></span>`).join('')}
      </div>

      ${current.status === 'finished' ? endScreenMarkup(current) : `
        <div class="event-card">
          <p>Turn ${turnIndex + 1} event</p>
          <h3>${escapeHtml(event.name)}</h3>
          <span>${escapeHtml(event.detail)}</span>
        </div>

        <div class="play-grid">
          <fieldset class="choice-group">
            <legend>1. Choose your hidden bet</legend>
            <p>Your choice stays hidden until both sides resolve.</p>
            <div class="bet-options">
              ${BETS.map((bet, index) => `
                <button type="button" class="bet-button ${selectedBet === bet ? 'selected' : ''}" data-bet="${bet}" aria-pressed="${selectedBet === bet}">
                  <kbd>${index + 1}</kbd>${betMark(bet)}
                  <span><strong>${BET_LABELS[bet].label}</strong><small>${BET_LABELS[bet].detail}</small></span>
                </button>`).join('')}
            </div>
          </fieldset>

          <fieldset class="choice-group map-group">
            <legend>2. Place one public resource</legend>
            <p>The opponent’s placement is visible before you commit.</p>
            <div class="lane-options">
              ${current.lanes.map((lane, index) => {
                const opponentHere = opponentPlacement === lane.id;
                return `
                  <button type="button" class="lane-button ${selectedLaneId === lane.id ? 'selected' : ''}" data-lane="${lane.id}" aria-pressed="${selectedLaneId === lane.id}">
                    <span class="lane-key"><kbd>${['Q', 'W', 'E'][index]}</kbd></span>
                    <span class="lane-copy"><strong>${escapeHtml(lane.name)}</strong><small>${escapeHtml(lane.detail)}</small></span>
                    <span class="lane-affinity">Bonus with ${BET_LABELS[lane.affinity].label}</span>
                    <span class="token-row" aria-label="${current.playerTokens[lane.id]} player and ${current.opponentTokens[lane.id]} opponent tokens">${tokensMarkup(current.playerTokens[lane.id], current.opponentTokens[lane.id])}</span>
                    ${opponentHere ? '<span class="incoming-token"><span aria-hidden="true">O</span> Opponent places here</span>' : ''}
                  </button>`;
              }).join('')}
            </div>
          </fieldset>
        </div>

        <div class="commit-row">
          <p id="choice-summary">${selectedBet && selectedLaneId ? `${BET_LABELS[selectedBet].label} selected. Resource ready.` : 'Choose one bet and one map goal.'}</p>
          <button class="primary-button resolve-button" type="button" data-action="resolve" ${selectedBet && selectedLaneId ? '' : 'disabled'}>Resolve turn ${turnIndex + 1}</button>
        </div>`}

      <section class="ledger" aria-labelledby="ledger-title">
        <div class="ledger-heading">
          <h3 id="ledger-title">Turn ledger</h3>
          <span>Points: reveal + event + goal fit</span>
        </div>
        ${historyMarkup(current)}
      </section>
      <p class="rule-note"><strong>Choice cycle:</strong> Learn beats Build. Build beats Buzz. Buzz beats Learn.</p>
      <span class="fps-readout" aria-hidden="true">Board loop <span id="fps-value">60</span> fps</span>
    </section>`;
}

function homeMarkup(current: GameState, isChallenge = false): string {
  const title = isChallenge ? 'Play this four-turn strategy challenge' : 'Play a four-turn startup strategy duel';
  const intro = isChallenge
    ? 'A friend set four hidden choices. Beat their plan on the same seeded board.'
    : 'For friends who want a quick three-choice strategy puzzle with startup satire and no account.';
  return `
    ${demoBanner()}
    <main id="main" tabindex="-1">
      <div class="first-screen">
        <section class="intro" aria-labelledby="page-title">
          <p class="eyebrow">Founder Fork · daily strategy game</p>
          <h1 id="page-title" tabindex="-1">${title}</h1>
          <p class="intro-copy">${intro}</p>
          ${isChallenge ? `
            <a class="primary-button link-button" href="#game">Play this challenge</a>
            <p class="action-note">Your friend’s bets stay hidden until each turn resolves.</p>` : `
            <div class="intro-actions">
              <a class="primary-button link-button" href="/demo" data-route>Try it with sample data</a>
              <a class="secondary-link" href="#game">Play today</a>
            </div>
            <p class="action-note">The sample opens at turn three with a filled ledger and map.</p>`}
          <ul class="plain-facts" aria-label="Game facts">
            <li>Free to play</li>
            <li>Progress stays in this browser</li>
            <li>Satire, not business advice</li>
          </ul>
        </section>
        ${gameMarkup(current)}
      </div>

      <section class="how-section" id="how-it-works" aria-labelledby="how-title" tabindex="-1">
        <div class="section-heading">
          <p class="section-kicker">Four turns from start to result</p>
          <h2 id="how-title">How the game works</h2>
        </div>
        <ol class="steps">
          <li><span>1</span><div><h3>Choose a secret bet</h3><p>Pick Learn, Build, or Buzz. Each choice beats one other choice.</p></div></li>
          <li><span>2</span><div><h3>Place a public token</h3><p>Add one resource to a map goal. Match its bonus to your bet for one point.</p></div></li>
          <li><span>3</span><div><h3>Resolve both plans</h3><p>Score the reveal and event. After four turns, map control decides the final points.</p></div></li>
        </ol>
        <figure class="editorial-scene">
          <picture>
            <source type="image/avif" srcset="/assets/sf-founder-fork-launch-table-768.avif 768w, /assets/sf-founder-fork-launch-table-1280.avif 1280w" sizes="(max-width: 760px) 100vw, 760px" />
            <source type="image/webp" srcset="/assets/sf-founder-fork-launch-table-768.webp 768w, /assets/sf-founder-fork-launch-table-1280.webp 1280w" sizes="(max-width: 760px) 100vw, 760px" />
            <img src="/assets/sf-founder-fork-launch-table-768.jpg" width="768" height="512" loading="lazy" decoding="async" alt="An abstract paper game board shows three branching paths and four round pieces." />
          </picture>
          <figcaption>One daily seed keeps the events, map goals, and opponent plan fixed for that day.</figcaption>
        </figure>
      </section>

      <section class="limits-section" aria-labelledby="limits-title">
        <div>
          <p class="section-kicker">Scope and privacy</p>
          <h2 id="limits-title">What the game does not do</h2>
        </div>
        <p>Founder Fork uses fictional companies and events. It does not use real company data.</p>
        <p>There are no accounts, ads, payments, analytics, chat, or investment advice.</p>
      </section>
    </main>`;
}

function demoPageMarkup(current: GameState): string {
  return `
    ${demoBanner()}
    <main id="main" tabindex="-1">
      <section class="demo-intro" aria-labelledby="page-title">
        <p class="eyebrow">Founder Fork sample</p>
        <h1 id="page-title" tabindex="-1">Try a populated four-turn strategy duel</h1>
        <p>Two turns are complete. Play the last two to see map scoring and the end screen.</p>
      </section>
      <div class="demo-board-wrap">${gameMarkup(current)}</div>
    </main>`;
}

function privacyMarkup(): string {
  return `
    <main id="main" class="legal-page" tabindex="-1">
      <p class="eyebrow">Privacy</p>
      <h1 id="page-title" tabindex="-1">See what the game saves</h1>
      <p class="legal-lead">Founder Fork has no accounts, analytics, advertising, or server database.</p>
      <h2>Data in your browser</h2>
      <p>The daily match, active challenges, and settings use local storage in this browser.</p>
      <p>Normal play makes no requests to third-party services.</p>
      <p>The sample runs in memory. It does not read or change your saved daily match.</p>
      <h2>Challenge links</h2>
      <p>A challenge link contains the daily seed and your four game choices. Share it only with people you choose.</p>
      <h2>Clear your data</h2>
      <p>Clearing site data in your browser removes matches and settings. You can also clear them here.</p>
      <button class="danger-button" type="button" data-action="clear-data">Clear saved game and settings</button>
      <p class="inline-status" id="privacy-status" role="status" aria-live="polite"></p>
      <h2>Privacy requests</h2>
      <p>The game does not ask for personal details. The controls above remove all saved game data.</p>
      <p>Last updated: 5 September 2026.</p>
    </main>`;
}

function termsMarkup(): string {
  return `
    <main id="main" class="legal-page" tabindex="-1">
      <p class="eyebrow">Terms</p>
      <h1 id="page-title" tabindex="-1">Use the game as entertainment</h1>
      <p class="legal-lead">Founder Fork is a free strategy game with fictional startup events.</p>
      <h2>Acceptable use</h2>
      <p>You may play the game and share its challenge links. Do not use the site to break laws or disrupt the service.</p>
      <h2>No business advice</h2>
      <p>The choices, scores, and events are satire. They are not business, legal, or investment advice.</p>
      <h2>Availability</h2>
      <p>The game is provided as available, without a promise that every daily seed will remain online forever.</p>
      <h2>Changes</h2>
      <p>These terms may change with a future release. The date below shows the current version.</p>
      <p>Last updated: 5 September 2026.</p>
    </main>`;
}

function notFoundMarkup(invalidChallenge = false): string {
  return `
    <main id="main" class="not-found-page" tabindex="-1">
      <div class="missing-paper">
        <p class="eyebrow">${invalidChallenge ? 'Invalid challenge' : '404'}</p>
        <h1 id="page-title" tabindex="-1">${invalidChallenge ? 'This challenge link does not work' : 'This page does not exist'}</h1>
        <p>${invalidChallenge ? 'The link is incomplete or changed. Ask your friend for a new challenge link.' : 'The game board is still ready on the home page.'}</p>
        <a class="primary-button link-button" href="/" data-route>Return to the game</a>
      </div>
    </main>`;
}

function render(): void {
  route = readRoute();
  let content = '';
  if (route.kind === 'home' && game) {
    pageMeta('Founder Fork — play a four-turn strategy duel', 'Play a daily four-turn strategy game with hidden choices, public tokens, and startup satire.', '/');
    content = homeMarkup(game);
  } else if (route.kind === 'demo' && game) {
    pageMeta('Demo — Founder Fork', 'Try a populated Founder Fork match at turn three without changing your saved daily game.', '/demo');
    content = demoPageMarkup(game);
  } else if (route.kind === 'challenge' && game) {
    pageMeta('Challenge — Founder Fork', 'Play a four-turn Founder Fork challenge against a friend’s hidden choices.', window.location.pathname);
    content = homeMarkup(game, true);
  } else if (route.kind === 'privacy') {
    pageMeta('Privacy — Founder Fork', 'See what Founder Fork saves in your browser and how to clear it.', '/privacy');
    content = privacyMarkup();
  } else if (route.kind === 'terms') {
    pageMeta('Terms — Founder Fork', 'Read the terms for playing the free Founder Fork strategy game.', '/terms');
    content = termsMarkup();
  } else {
    const invalidChallenge = route.kind === 'challenge';
    pageMeta(invalidChallenge ? 'Invalid challenge — Founder Fork' : 'Page not found — Founder Fork', 'Return to the Founder Fork daily strategy game.', window.location.pathname);
    content = notFoundMarkup(invalidChallenge);
  }

  app.innerHTML = `${headerMarkup()}${notice ? `<div class="global-notice" role="status">${escapeHtml(notice)}</div>` : ''}${content}${footerMarkup()}${dialogMarkup()}`;
  bindDialogEvents();
}

function navigate(href: string): void {
  const url = new URL(href, window.location.href);
  window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`);
  route = readRoute();
  initializeRoute();
  render();
  if (url.hash) document.querySelector<HTMLElement>(url.hash)?.focus({ preventScroll: true });
  else document.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
  document.querySelector('.route-announcer')!.textContent = document.title;
  window.scrollTo({ top: url.hash ? document.querySelector<HTMLElement>(url.hash)?.offsetTop ?? 0 : 0, behavior: settings.motion ? 'smooth' : 'auto' });
}

function bindDialogEvents(): void {
  const settingsDialog = document.querySelector<HTMLDialogElement>('#settings-dialog');
  settingsDialog?.addEventListener('close', () => {
    lastFocused?.focus();
  });
  settingsDialog?.querySelector<HTMLInputElement>('input[name="sound"]')?.addEventListener('change', (event) => {
    settings.sound = (event.currentTarget as HTMLInputElement).checked;
    persistSettings();
  });
  settingsDialog?.querySelector<HTMLInputElement>('input[name="motion"]')?.addEventListener('change', (event) => {
    settings.motion = (event.currentTarget as HTMLInputElement).checked;
    applyMotionSetting();
    persistSettings();
  });
  document.querySelector<HTMLDialogElement>('#confirm-dialog')?.addEventListener('close', () => lastFocused?.focus());
  document.querySelector<HTMLDialogElement>('#clear-dialog')?.addEventListener('close', () => lastFocused?.focus());
}

function playTone(result: 'win' | 'tie' | 'loss'): void {
  if (!settings.sound) return;
  audioContext ??= new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.frequency.value = result === 'win' ? 520 : result === 'loss' ? 210 : 360;
  gain.gain.setValueAtTime(0.05, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.12);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.12);
}

function resetCurrentGame(): void {
  if (route.kind === 'demo') game = createGame('sample-launch-week', 'demo');
  else if (route.kind === 'challenge') {
    const decoded = decodeChallenge(route.challengeCode ?? '');
    game = decoded ? createGame(decoded.seed, 'challenge', decoded.plan) : null;
  } else game = createGame(dailySeed());
  selectedBet = null;
  selectedLaneId = null;
  challengeUrl = '';
  persistGame();
  render();
  document.querySelector<HTMLElement>('#game')?.focus();
}

async function copyChallenge(): Promise<void> {
  const input = document.querySelector<HTMLInputElement>('#challenge-url');
  if (!input) return;
  try {
    await navigator.clipboard.writeText(input.value);
    const status = document.querySelector('#share-status');
    if (status) status.textContent = 'Challenge link copied.';
  } catch {
    input.focus();
    input.select();
    const status = document.querySelector('#share-status');
    if (status) status.textContent = 'Select the challenge link and copy it.';
  }
}

app.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const routeLink = target.closest<HTMLAnchorElement>('a[data-route]');
  if (routeLink && routeLink.origin === window.location.origin) {
    event.preventDefault();
    navigate(routeLink.href);
    return;
  }

  const betButton = target.closest<HTMLButtonElement>('[data-bet]');
  if (betButton) {
    selectedBet = betButton.dataset.bet as Bet;
    render();
    document.querySelector<HTMLButtonElement>(`[data-bet="${selectedBet}"]`)?.focus();
    return;
  }

  const laneButton = target.closest<HTMLButtonElement>('[data-lane]');
  if (laneButton) {
    selectedLaneId = laneButton.dataset.lane ?? null;
    render();
    document.querySelector<HTMLButtonElement>(`[data-lane="${selectedLaneId}"]`)?.focus();
    return;
  }

  const actionTarget = target.closest<HTMLElement>('[data-action]');
  const action = actionTarget?.dataset.action;
  if (!action) return;

  if (action === 'open-settings') {
    lastFocused = actionTarget;
    document.querySelector<HTMLDialogElement>('#settings-dialog')?.showModal();
    document.querySelector<HTMLInputElement>('#settings-dialog input')?.focus();
  } else if (action === 'request-restart') {
    lastFocused = actionTarget;
    document.querySelector<HTMLDialogElement>('#confirm-dialog')?.showModal();
    document.querySelector<HTMLButtonElement>('#confirm-dialog button')?.focus();
  } else if (action === 'resolve' && game && selectedBet && selectedLaneId) {
    const next = resolveTurn(game, { bet: selectedBet, laneId: selectedLaneId });
    playTone(next.history.at(-1)!.result);
    game = next;
    const result = game.history.at(-1)!;
    lastResolvedTurn = result.turn;
    lastResultAnnouncement = `Turn ${result.turn} resolved. You gained ${result.playerPoints} points. The opponent gained ${result.opponentPoints} points.`;
    selectedBet = null;
    selectedLaneId = null;
    persistGame();
    render();
    lastResultAnnouncement = '';
    lastResolvedTurn = null;
    const focusTarget = game.status === 'finished' ? '.end-screen' : '[data-bet="learn"]';
    document.querySelector<HTMLElement>(focusTarget)?.focus();
  } else if (action === 'reset-demo') {
    game = createSampleGame();
    selectedBet = null;
    selectedLaneId = null;
    notice = 'The sample returned to the start of turn three.';
    render();
  } else if (action === 'start-real') {
    event.preventDefault();
    navigate('/');
  } else if (action === 'play-again') {
    resetCurrentGame();
  } else if (action === 'create-challenge' && game) {
    const code = encodeChallenge(game);
    challengeUrl = `${window.location.origin}/challenge/${code}`;
    render();
    document.querySelector<HTMLInputElement>('#challenge-url')?.focus();
  } else if (action === 'copy-challenge') {
    void copyChallenge();
  } else if (action === 'confirm-restart') {
    resetCurrentGame();
  } else if (action === 'clear-data') {
    lastFocused = actionTarget;
    document.querySelector<HTMLDialogElement>('#clear-dialog')?.showModal();
    document.querySelector<HTMLButtonElement>('#clear-dialog button')?.focus();
  } else if (action === 'confirm-clear-data') {
    const status = document.querySelector('#privacy-status');
    try {
      localStorage.removeItem(REAL_GAME_KEY);
      localStorage.removeItem(SETTINGS_KEY);
      for (let index = localStorage.length - 1; index >= 0; index -= 1) {
        const key = localStorage.key(index);
        if (key?.startsWith(CHALLENGE_GAME_PREFIX)) localStorage.removeItem(key);
      }
      if (status) status.textContent = 'Saved game and settings cleared.';
    } catch {
      if (status) status.textContent = 'Saved data could not be cleared. Clear this site’s data in your browser settings.';
    }
  }
});

document.addEventListener('keydown', (event) => {
  if (!game || game.status !== 'active' || document.querySelector('dialog[open]')) return;
  const activeTag = (document.activeElement as HTMLElement | null)?.tagName;
  if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;
  const betIndex = ['1', '2', '3'].indexOf(event.key);
  const laneIndex = ['q', 'w', 'e'].indexOf(event.key.toLowerCase());
  if (betIndex >= 0) {
    selectedBet = BETS[betIndex];
    render();
    document.querySelector<HTMLButtonElement>(`[data-bet="${selectedBet}"]`)?.focus();
    event.preventDefault();
  } else if (laneIndex >= 0) {
    selectedLaneId = game.lanes[laneIndex].id;
    render();
    document.querySelector<HTMLButtonElement>(`[data-lane="${selectedLaneId}"]`)?.focus();
    event.preventDefault();
  } else if (event.key === 'Enter' && selectedBet && selectedLaneId) {
    document.querySelector<HTMLButtonElement>('[data-action="resolve"]')?.click();
    event.preventDefault();
  }
});

window.addEventListener('popstate', () => {
  route = readRoute();
  initializeRoute();
  render();
  document.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
  document.querySelector('.route-announcer')!.textContent = document.title;
});

let priorFrame = performance.now();
let accumulator = 0;
let sampleStart = priorFrame;
let sampleFrames = 0;
const fixedStep = 1000 / 60;

function frameLoop(now: number): void {
  if (!document.hidden) {
    const delta = Math.min(100, now - priorFrame);
    accumulator += delta;
    while (accumulator >= fixedStep) accumulator -= fixedStep;
    sampleFrames += 1;
    if (now - sampleStart >= 1000) {
      const fps = Math.round((sampleFrames * 1000) / (now - sampleStart));
      document.documentElement.dataset.fps = String(fps);
      const output = document.querySelector('#fps-value');
      if (output) output.textContent = String(fps);
      sampleFrames = 0;
      sampleStart = now;
    }
  } else {
    sampleStart = now;
    sampleFrames = 0;
  }
  priorFrame = now;
  requestAnimationFrame(frameLoop);
}

initializeRoute();
render();
requestAnimationFrame(frameLoop);
