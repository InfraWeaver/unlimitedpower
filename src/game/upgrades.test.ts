import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState } from './state';
import { getUpgradeInfo, canAffordUpgrade, purchaseUpgrade, getAllUpgrades } from './upgrades';

describe('Upgrades System', () => {
  let state = createInitialState();

  beforeEach(() => {
    state = createInitialState();
    state.resources.coins = 1000;
  });

  it('should get upgrade info', () => {
    const info = getUpgradeInfo(state, 'hireMiner');
    expect(info.name).toBe('Hire Miner');
    expect(info.level).toBe(0);
    expect(info.cost).toBe(100);
  });

  it('should check if upgrade is affordable', () => {
    expect(canAffordUpgrade(state, 'hireMiner')).toBe(true);
    state.resources.coins = 50;
    expect(canAffordUpgrade(state, 'hireMiner')).toBe(false);
  });

  it('should purchase upgrade and deduct coins', () => {
    const initialCoins = state.resources.coins;
    const newState = purchaseUpgrade(state, 'hireMiner');
    const info = getUpgradeInfo(newState, 'hireMiner');
    expect(newState.resources.coins).toBe(initialCoins - 100);
    expect(info.level).toBe(1);
  });

  it('should increase upgrade cost with each level', () => {
    let newState = state;
    const info1 = getUpgradeInfo(newState, 'hireMiner');
    expect(info1.cost).toBe(100);

    newState = purchaseUpgrade(newState, 'hireMiner');
    const info2 = getUpgradeInfo(newState, 'hireMiner');
    expect(info2.cost).toBeGreaterThan(100);
  });

  it('should not purchase if insufficient coins', () => {
    state.resources.coins = 50;
    const newState = purchaseUpgrade(state, 'hireMiner');
    expect(newState).toEqual(state);
  });

  it('should not purchase if at max level', () => {
    state.upgrades.hireMiner_level = 50; // max level
    const newState = purchaseUpgrade(state, 'hireMiner');
    expect(newState).toEqual(state);
  });

  it('should get all upgrades', () => {
    const allUpgrades = getAllUpgrades(state);
    expect(allUpgrades.hireMiner).toBeDefined();
    expect(allUpgrades.betterFurnace).toBeDefined();
    expect(allUpgrades.betterSmith).toBeDefined();
  });
});
