import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState } from './state';
import { queueOreForSmelting, updateSmelting, getSmeltProgress } from './smelting';

describe('Smelting System', () => {
  let state = createInitialState();

  beforeEach(() => {
    state = createInitialState();
    state.resources.copper.ore = 100;
  });

  it('should queue ore for smelting', () => {
    const newState = queueOreForSmelting(state, 'copper', 10);
    expect(newState.resources.copper.ore).toBe(90);
    expect(newState.smelting.copper.queuedOre).toBe(10);
  });

  it('should not queue more ore than available', () => {
    const newState = queueOreForSmelting(state, 'copper', 200);
    expect(newState.resources.copper.ore).toBe(0);
    expect(newState.smelting.copper.queuedOre).toBe(100);
  });

  it('should smelt queued ore over time', () => {
    let newState = queueOreForSmelting(state, 'copper', 5);
    newState = updateSmelting(newState, 10000); // 10 seconds
    expect(newState.resources.copper.bars).toBeGreaterThan(0);
    expect(newState.smelting.copper.queuedOre).toBeLessThan(5);
  });

  it('should apply furnace upgrade multiplier', () => {
    state.upgrades.betterFurnace_level = 1;
    let newState = queueOreForSmelting(state, 'copper', 5);
    const initialOre = newState.smelting.copper.queuedOre;
    newState = updateSmelting(newState, 2000); // 2 seconds
    expect(newState.resources.copper.bars).toBeGreaterThan(0);
  });

  it('should calculate smelt progress', () => {
    let newState = queueOreForSmelting(state, 'copper', 1);
    newState = updateSmelting(newState, 1000); // 1 second
    const progress = getSmeltProgress('copper', newState);
    expect(progress).toBeGreaterThan(0);
    expect(progress).toBeLessThanOrEqual(100);
  });
});
