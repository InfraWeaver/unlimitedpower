import { GameState } from './state';

export interface GameStats {
  totalOreEverMined: number;
  totalCoinsEverEarned: number;
  totalUpgradesPurchased: number;
  totalPrestigeLevels: number;
  prestigeLevels: number;
}

export function trackOreMined(state: GameState, oreAmount: number): GameState {
  return {
    ...state,
    stats: {
      ...state.stats,
      totalOreEverMined: state.stats.totalOreEverMined + oreAmount,
    },
  };
}

export function trackCoinsEarned(state: GameState, coinAmount: number): GameState {
  return {
    ...state,
    stats: {
      ...state.stats,
      totalCoinsEverEarned: state.stats.totalCoinsEverEarned + coinAmount,
    },
  };
}

export function trackUpgradePurchased(state: GameState): GameState {
  return {
    ...state,
    stats: {
      ...state.stats,
      totalUpgradesPurchased: state.stats.totalUpgradesPurchased + 1,
    },
  };
}

export function formatLargeNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return Math.floor(num).toString();
}
