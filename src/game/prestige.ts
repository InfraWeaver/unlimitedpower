import { GameState, createInitialState } from './state';

export function calculatePrestigeBonus(prestigeLevel: number): number {
  // 5% passive rate bonus per prestige level
  return 1 + prestigeLevel * 0.05;
}

export function canPrestige(state: GameState): boolean {
  // Can prestige if have at least 1M coins
  return state.resources.coins >= 1000000;
}

export function getPrestigeReward(state: GameState): number {
  // Base reward: 1 prestige level per 1M coins
  return Math.floor(state.resources.coins / 1000000);
}

export function performPrestige(state: GameState): GameState {
  const prestigeGain = getPrestigeReward(state);

  if (prestigeGain === 0) {
    return state;
  }

  const newState = createInitialState();

  // Keep prestige level and unlock history
  return {
    ...newState,
    progression: {
      ...newState.progression,
      unlockedOres: state.progression.unlockedOres, // Keep unlocked ores
    },
    stats: {
      ...newState.stats,
      totalPrestigeLevels: state.stats.totalPrestigeLevels + prestigeGain,
      totalOreEverMined: state.stats.totalOreEverMined,
      totalCoinsEverEarned: state.stats.totalCoinsEverEarned,
      totalUpgradesPurchased: state.stats.totalUpgradesPurchased,
      prestigeLevels: state.stats.prestigeLevels + prestigeGain,
    },
  };
}

export function getPassiveRateWithPrestige(baseRate: number, prestigeLevel: number): number {
  const bonus = calculatePrestigeBonus(prestigeLevel);
  return baseRate * bonus;
}
