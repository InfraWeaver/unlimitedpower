import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState } from './state';
import { performPrestige, canPrestige, getPrestigeReward, calculatePrestigeBonus, getPassiveRateWithPrestige } from './prestige';
import { GAME_CONFIG } from './constants';

describe('Prestige System', () => {
  let state = createInitialState();

  beforeEach(() => {
    state = createInitialState();
  });

  it('should calculate prestige bonus', () => {
    const bonus0 = calculatePrestigeBonus(0);
    const bonus1 = calculatePrestigeBonus(1);
    const bonus5 = calculatePrestigeBonus(5);

    expect(bonus0).toBe(1); // no bonus
    expect(bonus1).toBe(1.05); // 5% per level
    expect(bonus5).toBe(1.25); // 25% total
  });

  it('should require 1M coins to prestige', () => {
    state.resources.coins = 999999;
    expect(canPrestige(state)).toBe(false);

    state.resources.coins = 1000000;
    expect(canPrestige(state)).toBe(true);
  });

  it('should calculate prestige reward', () => {
    state.resources.coins = 1000000;
    expect(getPrestigeReward(state)).toBe(1);

    state.resources.coins = 3500000;
    expect(getPrestigeReward(state)).toBe(3);
  });

  it('should perform prestige reset', () => {
    state.resources.coins = 2000000;
    state.upgrades.hireMiner_level = 10;
    state.resources.copper.ore = 5000;

    const newState = performPrestige(state);

    expect(newState.resources.coins).toBe(0); // reset
    expect(newState.resources.copper.ore).toBe(0); // reset
    expect(newState.upgrades.hireMiner_level).toBe(0); // reset
    expect(newState.stats.prestigeLevels).toBe(2); // gained 2 levels
    expect(newState.stats.totalPrestigeLevels).toBe(2); // cumulative
  });

  it('should apply prestige bonus to passive rate', () => {
    const baseRate = GAME_CONFIG.BASE_PASSIVE_RATE;

    const rate0 = getPassiveRateWithPrestige(baseRate, 0);
    const rate5 = getPassiveRateWithPrestige(baseRate, 5);

    expect(rate0).toBe(baseRate);
    expect(rate5).toBe(baseRate * 1.25); // 5% * 5 levels
  });

  it('should not prestige if insufficient coins', () => {
    state.resources.coins = 500000;
    const newState = performPrestige(state);
    expect(newState).toEqual(state); // No change
  });

  it('should keep unlocked ores after prestige', () => {
    state.resources.coins = 1000000;
    state.progression.unlockedOres = ['copper', 'iron', 'tin'];

    const newState = performPrestige(state);

    expect(newState.progression.unlockedOres).toContain('copper');
    expect(newState.progression.unlockedOres).toContain('iron');
    expect(newState.progression.unlockedOres).toContain('tin');
  });
});
