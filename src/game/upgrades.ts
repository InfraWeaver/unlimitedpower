import { GameState } from './state';
import { GAME_CONFIG, getUpgradeCost } from './constants';

export interface UpgradeInfo {
  name: string;
  cost: number;
  maxLevel: number;
  level: number;
  description: string;
}

export function getUpgradeInfo(state: GameState, upgradeId: keyof typeof GAME_CONFIG.UPGRADES): UpgradeInfo {
  const upgradeConfig = GAME_CONFIG.UPGRADES[upgradeId];
  const level = state.upgrades[`${upgradeId}_level` as keyof typeof state.upgrades] as number;
  const cost = getUpgradeCost(level, upgradeConfig.baseCost, upgradeConfig.costMultiplier);

  return {
    name: upgradeConfig.name,
    cost,
    maxLevel: upgradeConfig.maxLevel,
    level,
    description: upgradeConfig.effect,
  };
}

export function canAffordUpgrade(state: GameState, upgradeId: keyof typeof GAME_CONFIG.UPGRADES): boolean {
  const info = getUpgradeInfo(state, upgradeId);
  return state.resources.coins >= info.cost && info.level < info.maxLevel;
}

export function purchaseUpgrade(state: GameState, upgradeId: keyof typeof GAME_CONFIG.UPGRADES): GameState {
  if (!canAffordUpgrade(state, upgradeId)) {
    return state;
  }

  const info = getUpgradeInfo(state, upgradeId);

  return {
    ...state,
    resources: {
      ...state.resources,
      coins: state.resources.coins - info.cost,
    },
    upgrades: {
      ...state.upgrades,
      [`${upgradeId}_level`]: state.upgrades[`${upgradeId}_level` as keyof typeof state.upgrades] + 1,
    },
  };
}

export function getAllUpgrades(state: GameState): Record<keyof typeof GAME_CONFIG.UPGRADES, UpgradeInfo> {
  return {
    hireMiner: getUpgradeInfo(state, 'hireMiner'),
    betterFurnace: getUpgradeInfo(state, 'betterFurnace'),
    betterSmith: getUpgradeInfo(state, 'betterSmith'),
  };
}
