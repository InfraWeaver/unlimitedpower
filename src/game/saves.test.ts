import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createInitialState } from './state';
import { saveGame, loadGame, hasSave, deleteSave } from './saves';

// Mock localStorage for Node environment
const mockStorage: Record<string, string> = {};

beforeEach(() => {
  mockStorage['idle-mining-game-state'] = '';
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (key: string) => mockStorage[key] || null,
      setItem: (key: string, value: string) => {
        mockStorage[key] = value;
      },
      removeItem: (key: string) => {
        delete mockStorage[key];
      },
      clear: () => {
        Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
      },
    },
    writable: true,
  });
});

describe('Save System', () => {
  beforeEach(() => {
    mockStorage['idle-mining-game-state'] = '';
  });

  it('should save game state', () => {
    const state = createInitialState();
    state.resources.coins = 1000;
    saveGame(state);
    expect(hasSave()).toBe(true);
  });

  it('should load saved game state', () => {
    const state = createInitialState();
    state.resources.coins = 1000;
    state.upgrades.hireMiner_level = 5;
    saveGame(state);

    const loaded = loadGame();
    expect(loaded).not.toBeNull();
    expect(loaded?.resources.coins).toBe(1000);
    expect(loaded?.upgrades.hireMiner_level).toBe(5);
  });

  it('should return null if no save exists', () => {
    delete mockStorage['idle-mining-game-state'];
    const loaded = loadGame();
    expect(loaded).toBeNull();
  });

  it('should delete save', () => {
    const state = createInitialState();
    saveGame(state);
    expect(hasSave()).toBe(true);
    deleteSave();
    expect(hasSave()).toBe(false);
  });

  it('should detect when save exists', () => {
    delete mockStorage['idle-mining-game-state'];
    expect(hasSave()).toBe(false);
    const state = createInitialState();
    saveGame(state);
    expect(hasSave()).toBe(true);
  });

  it('should handle corrupted save gracefully', () => {
    mockStorage['idle-mining-game-state'] = 'corrupted json {]';
    const loaded = loadGame();
    expect(loaded).toBeNull();
  });
});
