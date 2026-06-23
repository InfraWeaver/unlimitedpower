import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState } from './state';
import { trackOreMined, trackCoinsEarned, trackUpgradePurchased, formatLargeNumber } from './statistics';

describe('Statistics System', () => {
  let state = createInitialState();

  beforeEach(() => {
    state = createInitialState();
  });

  it('should track ore mined', () => {
    expect(state.stats.totalOreEverMined).toBe(0);

    let newState = trackOreMined(state, 100);
    expect(newState.stats.totalOreEverMined).toBe(100);

    newState = trackOreMined(newState, 50);
    expect(newState.stats.totalOreEverMined).toBe(150);
  });

  it('should track coins earned', () => {
    expect(state.stats.totalCoinsEverEarned).toBe(0);

    let newState = trackCoinsEarned(state, 1000);
    expect(newState.stats.totalCoinsEverEarned).toBe(1000);

    newState = trackCoinsEarned(newState, 500);
    expect(newState.stats.totalCoinsEverEarned).toBe(1500);
  });

  it('should track upgrades purchased', () => {
    expect(state.stats.totalUpgradesPurchased).toBe(0);

    let newState = trackUpgradePurchased(state);
    expect(newState.stats.totalUpgradesPurchased).toBe(1);

    newState = trackUpgradePurchased(newState);
    expect(newState.stats.totalUpgradesPurchased).toBe(2);
  });

  it('should format large numbers', () => {
    expect(formatLargeNumber(500)).toBe('500');
    expect(formatLargeNumber(1500)).toBe('1.5K');
    expect(formatLargeNumber(1000000)).toBe('1.0M');
    expect(formatLargeNumber(5500000)).toBe('5.5M');
  });

  it('should maintain independent stats', () => {
    let newState = trackOreMined(state, 100);
    newState = trackCoinsEarned(newState, 50);
    newState = trackUpgradePurchased(newState);

    expect(newState.stats.totalOreEverMined).toBe(100);
    expect(newState.stats.totalCoinsEverEarned).toBe(50);
    expect(newState.stats.totalUpgradesPurchased).toBe(1);
  });
});
