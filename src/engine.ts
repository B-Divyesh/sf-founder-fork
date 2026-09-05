export const BETS = ['learn', 'build', 'buzz'] as const;
export type Bet = (typeof BETS)[number];

export type GameMode = 'daily' | 'demo' | 'challenge';

export interface Decision {
  bet: Bet;
  laneId: string;
}

export interface Lane {
  id: string;
  name: string;
  detail: string;
  affinity: Bet;
}

export interface EventCard {
  name: string;
  detail: string;
  boost: Bet;
}

export interface TurnResult {
  turn: number;
  event: EventCard;
  player: Decision;
  opponent: Decision;
  playerPoints: number;
  opponentPoints: number;
  result: 'win' | 'tie' | 'loss';
}

export interface GameState {
  version: 1;
  seed: string;
  mode: GameMode;
  lanes: Lane[];
  events: EventCard[];
  opponentPlan: Decision[];
  history: TurnResult[];
  playerTokens: Record<string, number>;
  opponentTokens: Record<string, number>;
  playerScore: number;
  opponentScore: number;
  boardPlayerPoints: number;
  boardOpponentPoints: number;
  status: 'active' | 'finished';
}

const LANE_POOL: Omit<Lane, 'id'>[] = [
  { name: 'First users', detail: 'Win attention from early testers.', affinity: 'buzz' },
  { name: 'Clear problem', detail: 'Learn what people need.', affinity: 'learn' },
  { name: 'Useful release', detail: 'Ship a working product.', affinity: 'build' },
  { name: 'Trust', detail: 'Make a reliable first impression.', affinity: 'build' },
  { name: 'Good feedback', detail: 'Turn reactions into direction.', affinity: 'learn' },
  { name: 'Launch reach', detail: 'Help the right people find it.', affinity: 'buzz' },
];

const EVENT_POOL: EventCard[] = [
  { name: 'Five useful interviews', detail: 'Learn earns 1 extra point this turn.', boost: 'learn' },
  { name: 'Prototype holds together', detail: 'Build earns 1 extra point this turn.', boost: 'build' },
  { name: 'A small post travels', detail: 'Buzz earns 1 extra point this turn.', boost: 'buzz' },
  { name: 'Requirements change', detail: 'Learn earns 1 extra point this turn.', boost: 'learn' },
  { name: 'Quiet shipping day', detail: 'Build earns 1 extra point this turn.', boost: 'build' },
  { name: 'Community mention', detail: 'Buzz earns 1 extra point this turn.', boost: 'buzz' },
];

export const BET_LABELS: Record<Bet, { label: string; detail: string; beats: Bet }> = {
  learn: { label: 'Learn', detail: 'Beats Build', beats: 'build' },
  build: { label: 'Build', detail: 'Beats Buzz', beats: 'buzz' },
  buzz: { label: 'Buzz', detail: 'Beats Learn', beats: 'learn' },
};

function hashSeed(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

export function dailySeed(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function compareBets(player: Bet, opponent: Bet): 'win' | 'tie' | 'loss' {
  if (player === opponent) return 'tie';
  return BET_LABELS[player].beats === opponent ? 'win' : 'loss';
}

export function createGame(
  seed: string,
  mode: GameMode = 'daily',
  challengePlan?: Decision[],
): GameState {
  const random = mulberry32(hashSeed(`founder-fork:${seed}`));
  const lanes = shuffled(LANE_POOL, random).slice(0, 3).map((lane, index) => ({
    ...lane,
    id: `lane-${index + 1}`,
  }));
  const events = shuffled(EVENT_POOL, random).slice(0, 4);
  const generatedPlan = Array.from({ length: 4 }, () => ({
    bet: BETS[Math.floor(random() * BETS.length)],
    laneId: lanes[Math.floor(random() * lanes.length)].id,
  }));

  const opponentPlan = challengePlan?.length === 4
    ? challengePlan.map((decision) => ({ ...decision }))
    : generatedPlan;

  return {
    version: 1,
    seed,
    mode,
    lanes,
    events,
    opponentPlan,
    history: [],
    playerTokens: Object.fromEntries(lanes.map((lane) => [lane.id, 0])),
    opponentTokens: Object.fromEntries(lanes.map((lane) => [lane.id, 0])),
    playerScore: 0,
    opponentScore: 0,
    boardPlayerPoints: 0,
    boardOpponentPoints: 0,
    status: 'active',
  };
}

export function resolveTurn(state: GameState, player: Decision): GameState {
  if (state.status === 'finished' || state.history.length >= 4) return state;
  if (!BETS.includes(player.bet) || !state.lanes.some((lane) => lane.id === player.laneId)) {
    throw new Error('Choose one bet and one map goal before resolving the turn.');
  }

  const turnIndex = state.history.length;
  const opponent = state.opponentPlan[turnIndex];
  const event = state.events[turnIndex];
  const result = compareBets(player.bet, opponent.bet);
  const playerLane = state.lanes.find((lane) => lane.id === player.laneId)!;
  const opponentLane = state.lanes.find((lane) => lane.id === opponent.laneId)!;
  const playerPoints = (result === 'win' ? 2 : result === 'tie' ? 1 : 0)
    + (player.bet === event.boost ? 1 : 0)
    + (player.bet === playerLane.affinity ? 1 : 0);
  const opponentPoints = (result === 'loss' ? 2 : result === 'tie' ? 1 : 0)
    + (opponent.bet === event.boost ? 1 : 0)
    + (opponent.bet === opponentLane.affinity ? 1 : 0);
  const playerTokens = { ...state.playerTokens, [player.laneId]: state.playerTokens[player.laneId] + 1 };
  const opponentTokens = {
    ...state.opponentTokens,
    [opponent.laneId]: state.opponentTokens[opponent.laneId] + 1,
  };
  const history: TurnResult[] = [
    ...state.history,
    {
      turn: turnIndex + 1,
      event,
      player: { ...player },
      opponent: { ...opponent },
      playerPoints,
      opponentPoints,
      result,
    },
  ];

  let boardPlayerPoints = 0;
  let boardOpponentPoints = 0;
  let status: GameState['status'] = 'active';
  if (history.length === 4) {
    status = 'finished';
    for (const lane of state.lanes) {
      const playerCount = playerTokens[lane.id];
      const opponentCount = opponentTokens[lane.id];
      if (playerCount > opponentCount) boardPlayerPoints += 2;
      else if (opponentCount > playerCount) boardOpponentPoints += 2;
      else {
        boardPlayerPoints += 1;
        boardOpponentPoints += 1;
      }
    }
  }

  return {
    ...state,
    history,
    playerTokens,
    opponentTokens,
    playerScore: state.playerScore + playerPoints + boardPlayerPoints,
    opponentScore: state.opponentScore + opponentPoints + boardOpponentPoints,
    boardPlayerPoints,
    boardOpponentPoints,
    status,
  };
}

export function createSampleGame(): GameState {
  let game = createGame('sample-launch-week', 'demo');
  game = resolveTurn(game, { bet: 'learn', laneId: game.lanes[0].id });
  game = resolveTurn(game, { bet: 'build', laneId: game.lanes[1].id });
  return game;
}

interface ChallengePayload {
  v: 1;
  seed: string;
  plan: Decision[];
}

export function encodeChallenge(state: GameState): string {
  const payload: ChallengePayload = {
    v: 1,
    seed: state.seed,
    plan: state.history.map((turn) => turn.player),
  };
  if (payload.plan.length !== 4) throw new Error('Finish the match before creating a challenge.');
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

export function decodeChallenge(encoded: string): { seed: string; plan: Decision[] } | null {
  if (encoded.length < 8 || encoded.length > 2_048) return null;
  try {
    const normalized = encoded.replaceAll('-', '+').replaceAll('_', '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes)) as ChallengePayload;
    if (parsed.v !== 1
      || typeof parsed.seed !== 'string'
      || parsed.seed.length < 1
      || parsed.seed.length > 80
      || !Array.isArray(parsed.plan)
      || parsed.plan.length !== 4) return null;
    if (!parsed.plan.every((decision) => BETS.includes(decision.bet) && /^lane-[1-3]$/.test(decision.laneId))) return null;
    return { seed: parsed.seed, plan: parsed.plan.map((decision) => ({ ...decision })) };
  } catch {
    return null;
  }
}

export function outcomeLabel(state: GameState): 'You win' | 'Opponent wins' | 'Draw' {
  if (state.playerScore > state.opponentScore) return 'You win';
  if (state.playerScore < state.opponentScore) return 'Opponent wins';
  return 'Draw';
}
