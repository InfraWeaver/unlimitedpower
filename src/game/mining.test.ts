import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState } from './state';
import { handleMiningClick, updatePassiveMining } from './mining';

describe('Mining System', () => {
  let state = createInitialState();

  beforeEach(() => {
    state = createInitialState();
  });

  it('should add ore on click', () => {
    const initialOre = state.resources.copper.ore;
    const newState = handleMiningClick(state);
    expect(newState.resources.copper.ore).toBe(initialOre + 50);
  });

  it('should generate passive ore', () => {
    const initialOre = state.resources.copper.ore;
    // Simulate 1 second of passive mining
    state.mining.lastPassiveUpdate = Date.now() - 1100;
    const newState = updatePassiveMining(state, 1100);
    expect(newState.resources.copper.ore).toBeGreaterThan(initialOre);
  });

  it('should apply hire miner upgrade', () => {
    const upgradedState = { ...state, upgrades: { ...state.upgrades, hireMiner_level: 1 } };
    upgradedState.mining.lastPassiveUpdate = Date.now() - 1100;
    const newState = updatePassiveMining(upgradedState, 1100);
    // With 1 level of hire miner, rate should be base * (1 + 1 * 1.5) = base * 2.5
    expect(newState.resources.copper.ore).toBeGreaterThan(1);
  });
});
