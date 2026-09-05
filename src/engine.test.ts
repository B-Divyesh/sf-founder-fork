import { describe, expect, it } from 'vitest';
import {
  BETS,
  compareBets,
  createGame,
  decodeChallenge,
  encodeChallenge,
  resolveTurn,
} from './engine';

describe('deterministic game engine', () => {
  it('uses a complete and balanced choice cycle', () => {
    expect(compareBets('learn', 'build')).toBe('win');
    expect(compareBets('build', 'buzz')).toBe('win');
    expect(compareBets('buzz', 'learn')).toBe('win');
    for (const bet of BETS) expect(compareBets(bet, bet)).toBe('tie');
  });

  it('creates the same board and opponent plan for the same seed', () => {
    expect(createGame('2026-09-05')).toEqual(createGame('2026-09-05'));
    expect(createGame('2026-09-05').opponentPlan).not.toEqual(createGame('2026-09-06').opponentPlan);
  });

  it('finishes after exactly four valid turns and awards map control', () => {
    let game = createGame('engine-end-test');
    for (let turn = 0; turn < 4; turn += 1) {
      game = resolveTurn(game, { bet: BETS[turn % 3], laneId: game.lanes[turn % 3].id });
    }
    expect(game.status).toBe('finished');
    expect(game.history).toHaveLength(4);
    expect(game.boardPlayerPoints + game.boardOpponentPoints).toBeGreaterThanOrEqual(6);
    expect(resolveTurn(game, { bet: 'learn', laneId: game.lanes[0].id })).toBe(game);
  });

  it('rejects an invalid map goal without changing state', () => {
    const game = createGame('invalid-test');
    expect(() => resolveTurn(game, { bet: 'learn', laneId: 'missing' })).toThrow(/Choose one bet/);
    expect(game.history).toHaveLength(0);
  });

  it('round-trips a finished player plan through a challenge code', () => {
    let game = createGame('challenge-test');
    const plan = BETS.concat('learn');
    for (let turn = 0; turn < 4; turn += 1) {
      game = resolveTurn(game, { bet: plan[turn], laneId: game.lanes[turn % 3].id });
    }
    const decoded = decodeChallenge(encodeChallenge(game));
    expect(decoded?.seed).toBe('challenge-test');
    expect(decoded?.plan.map((decision) => decision.bet)).toEqual(plan);
    expect(decodeChallenge('not-a-code')).toBeNull();
    expect(decodeChallenge('x'.repeat(2_049))).toBeNull();
  });
});
