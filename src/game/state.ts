export type OreType = 'copper' | 'iron' | 'tin';

export interface GameState {
  // Resources
  resources: {
    copper: { ore: number; bars: number };
    iron: { ore: number; bars: number };
    tin: { ore: number; bars: number };
    tools: number;
    coins: number;
  };

  // Mining
  mining: {
    passiveRate: number; // ore/sec
    clickBonus: number; // ore per click
    lastPassiveUpdate: number; // timestamp for passive calculation
  };

  // Smelting queues
  smelting: {
    copper: { queuedOre: number; progress: number };
    iron: { queuedOre: number; progress: number };
    tin: { queuedOre: number; progress: number };
  };

  // Upgrades
  upgrades: {
    hireMiner_level: number;
    betterFurnace_level: number;
    betterSmith_level: number;
  };

  // Progression
  progression: {
    totalPlaytimeMs: number;
    unlockedOres: OreType[];
    autoUnlockTriggered: boolean;
  };

  // UI state
  ui: {
    activeTab: 'mining' | 'smelting' | 'crafting' | 'upgrades' | 'stats' | 'prestige';
  };

  // Statistics
  stats: {
    totalOreEverMined: number;
    totalCoinsEverEarned: number;
    totalUpgradesPurchased: number;
    totalPrestigeLevels: number;
    prestigeLevels: number;
  };
}

export function createInitialState(): GameState {
  return {
    resources: {
      copper: { ore: 0, bars: 0 },
      iron: { ore: 0, bars: 0 },
      tin: { ore: 0, bars: 0 },
      tools: 0,
      coins: 0,
    },
    mining: {
      passiveRate: 1, // 1 ore/sec initially
      clickBonus: 50,
      lastPassiveUpdate: Date.now(),
    },
    smelting: {
      copper: { queuedOre: 0, progress: 0 },
      iron: { queuedOre: 0, progress: 0 },
      tin: { queuedOre: 0, progress: 0 },
    },
    upgrades: {
      hireMiner_level: 0,
      betterFurnace_level: 0,
      betterSmith_level: 0,
    },
    progression: {
      totalPlaytimeMs: 0,
      unlockedOres: ['copper'],
      autoUnlockTriggered: false,
    },
    ui: {
      activeTab: 'mining',
    },
    stats: {
      totalOreEverMined: 0,
      totalCoinsEverEarned: 0,
      totalUpgradesPurchased: 0,
      totalPrestigeLevels: 0,
      prestigeLevels: 0,
    },
  };
}
