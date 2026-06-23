import { OreType } from './state';

export const GAME_CONFIG = {
  // Timing
  PASSIVE_UPDATE_INTERVAL_MS: 100, // Update passive generation every 100ms
  AUTO_UNLOCK_TIME_MS: 5 * 60 * 1000, // 5 minutes

  // Mining
  BASE_PASSIVE_RATE: 1, // ore/sec
  BASE_CLICK_BONUS: 50, // ore per click
  HIRE_MINER_RATE_MULTIPLIER: 2.5, // rate increase per level

  // Smelting
  BASE_SMELT_TIME_MS: 2000, // 2 seconds per bar
  BETTER_FURNACE_SPEED_MULTIPLIER: 1.5, // per level

  // Crafting
  BARS_PER_TOOL: 5,
  BASE_COINS_PER_TOOL: 50,
  BETTER_SMITH_OUTPUT_MULTIPLIER: 1.2, // per level

  // Upgrades
  UPGRADES: {
    hireMiner: {
      name: 'Hire Miner',
      baseCost: 100,
      costMultiplier: 1.15,
      maxLevel: 50,
      effect: 'Increases mining rate by 2.5x per level',
    },
    betterFurnace: {
      name: 'Better Furnace',
      baseCost: 200,
      costMultiplier: 1.15,
      maxLevel: 50,
      effect: 'Increases smelting speed by 1.5x per level',
    },
    betterSmith: {
      name: 'Better Smith',
      baseCost: 300,
      costMultiplier: 1.15,
      maxLevel: 50,
      effect: 'Increases tool output by 1.2x per level',
    },
  },

  // Progression
  ORES: {
    copper: {
      displayName: 'Copper',
      unlockedAt: 0,
      unlockedByBars: 0,
      oreGenBonus: 1.0,
      toolValueBonus: 1.0,
    },
    iron: {
      displayName: 'Iron',
      unlockedAt: 10000, // 10s of playtime (ms)
      unlockedByBars: 100,
      oreGenBonus: 1.5,
      toolValueBonus: 2.0,
    },
    tin: {
      displayName: 'Tin',
      unlockedAt: 30000, // 30s of playtime
      unlockedByBars: 300,
      oreGenBonus: 2.0,
      toolValueBonus: 4.0,
    },
    gold: {
      displayName: 'Gold',
      unlockedAt: 120000, // 2min of playtime
      unlockedByBars: 1000,
      oreGenBonus: 3.0,
      toolValueBonus: 10.0,
    },
    platinum: {
      displayName: 'Platinum',
      unlockedAt: 300000, // 5min of playtime
      unlockedByBars: 3000,
      oreGenBonus: 5.0,
      toolValueBonus: 50.0,
    },
  } as const,
};

export function getUpgradeCost(level: number, baseCost: number, multiplier: number): number {
  return Math.floor(baseCost * Math.pow(multiplier, level));
}
