import { GameState } from './state';

export const PRESTIGE_PERKS = {
  miningBoost: {
    name: '+10% Mining',
    description: 'Increases mining rate by 10% per level',
    costPerLevel: 1,
    maxLevel: 10,
  },
  smeltingBoost: {
    name: '+15% Smelting',
    description: 'Increases smelting speed by 15% per level',
    costPerLevel: 2,
    maxLevel: 10,
  },
  autoUnlockEarly: {
    name: 'Early Unlock',
    description: 'Unlock auto-mining 1 min earlier',
    costPerLevel: 3,
    maxLevel: 1,
  },
};

export function canBuyPerk(state: GameState, perkId: keyof typeof PRESTIGE_PERKS): boolean {
  const perk = PRESTIGE_PERKS[perkId];
  const currentLevel = state.prestigePerks[perkId];
  const cost = perk.costPerLevel;

  return state.stats.prestigeLevels >= cost && currentLevel < perk.maxLevel;
}

export function buyPerk(state: GameState, perkId: keyof typeof PRESTIGE_PERKS): GameState {
  if (!canBuyPerk(state, perkId)) {
    return state;
  }

  const perk = PRESTIGE_PERKS[perkId];

  return {
    ...state,
    stats: {
      ...state.stats,
      prestigeLevels: state.stats.prestigeLevels - perk.costPerLevel,
    },
    prestigePerks: {
      ...state.prestigePerks,
      [perkId]: state.prestigePerks[perkId] + 1,
    },
  };
}

export function getMiningPerkBonus(state: GameState): number {
  return 1 + state.prestigePerks.miningBoost * 0.1;
}

export function getSmeltingPerkBonus(state: GameState): number {
  return 1 + state.prestigePerks.smeltingBoost * 0.15;
}

export function getAutoUnlockTime(state: GameState): number {
  const baseTime = 5 * 60 * 1000; // 5 minutes
  const earlyUnlock = state.prestigePerks.autoUnlockEarly > 0 ? 60 * 1000 : 0; // 1 minute early if purchased
  return baseTime - earlyUnlock;
}
