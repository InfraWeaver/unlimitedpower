import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState } from './state';
import { craftTools, sellTools, getToolValue } from './crafting';

describe('Crafting System', () => {
  let state = createInitialState();

  beforeEach(() => {
    state = createInitialState();
    state.resources.copper.bars = 50;
  });

  it('should craft tools from bars', () => {
    const newState = craftTools(state, 'copper', 1);
    expect(newState.resources.copper.bars).toBe(45); // 50 - 5
    expect(newState.resources.tools).toBe(1);
  });

  it('should not craft if insufficient bars', () => {
    state.resources.copper.bars = 3;
    const newState = craftTools(state, 'copper', 1);
    expect(newState.resources.copper.bars).toBe(3);
    expect(newState.resources.tools).toBe(0);
  });

  it('should craft multiple tools', () => {
    const newState = craftTools(state, 'copper', 5);
    expect(newState.resources.copper.bars).toBe(25); // 50 - 25
    expect(newState.resources.tools).toBe(5);
  });

  it('should sell tools for coins', () => {
    state.resources.tools = 10;
    const newState = sellTools(state, 10);
    expect(newState.resources.tools).toBe(0);
    expect(newState.resources.coins).toBeGreaterThan(0);
  });

  it('should not sell more tools than available', () => {
    state.resources.tools = 5;
    const newState = sellTools(state, 10);
    expect(newState.resources.tools).toBe(0);
    expect(newState.resources.coins).toBe(5 * getToolValue(state));
  });

  it('should apply smith upgrade to tool value', () => {
    state.upgrades.betterSmith_level = 1;
    const value = getToolValue(state);
    expect(value).toBeGreaterThan(50); // BASE_COINS_PER_TOOL
  });
});
