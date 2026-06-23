import { GameState, OreType } from './state';
import { GAME_CONFIG } from './constants';
import { getWorkerBonus } from './workers';
import { getEventStatus } from './events';
import { getSmeltingPerkBonus } from './perks';

export function queueOreForSmelting(state: GameState, ore: OreType, amount: number): GameState {
  const oreData = state.resources[ore];
  const amountToQueue = Math.min(amount, oreData.ore);

  if (amountToQueue === 0) {
    return state;
  }

  return {
    ...state,
    resources: {
      ...state.resources,
      [ore]: {
        ...oreData,
        ore: oreData.ore - amountToQueue,
      },
    },
    smelting: {
      ...state.smelting,
      [ore]: {
        ...state.smelting[ore],
        queuedOre: state.smelting[ore].queuedOre + amountToQueue,
      },
    },
  };
}

export function updateSmelting(state: GameState, deltaMs: number): GameState {
  // If furnace is broken (event active), don't smelt
  const eventStatus = getEventStatus(state);
  if (eventStatus.active && eventStatus.name.includes('Furnace')) {
    return state;
  }

  const speedMultiplier = 1 + state.upgrades.betterFurnace_level * (GAME_CONFIG.BETTER_FURNACE_SPEED_MULTIPLIER - 1);
  const perkBonus = getSmeltingPerkBonus(state);
  const workerBonus = getWorkerBonus(state, 'smelter');
  const smeltTimeMs = GAME_CONFIG.BASE_SMELT_TIME_MS / (speedMultiplier * perkBonus * workerBonus);

  let newState = state;

  for (const ore of ['copper', 'iron', 'tin'] as const) {
    const smeltData = state.smelting[ore];

    if (smeltData.queuedOre === 0) {
      continue;
    }

    let newProgress = smeltData.progress + deltaMs;
    let newQueued = smeltData.queuedOre;
    let barsProduced = 0;

    while (newProgress >= smeltTimeMs && newQueued > 0) {
      newProgress -= smeltTimeMs;
      newQueued -= 1;
      barsProduced += 1;
    }

    newState = {
      ...newState,
      resources: {
        ...newState.resources,
        [ore]: {
          ...newState.resources[ore],
          bars: newState.resources[ore].bars + barsProduced,
        },
      },
      smelting: {
        ...newState.smelting,
        [ore]: {
          queuedOre: newQueued,
          progress: newQueued > 0 ? newProgress : 0,
        },
      },
    };
  }

  return newState;
}

export function getSmeltProgress(ore: OreType, state: GameState): number {
  const smeltData = state.smelting[ore];
  if (smeltData.queuedOre === 0) return 0;

  const speedMultiplier = 1 + state.upgrades.betterFurnace_level * (GAME_CONFIG.BETTER_FURNACE_SPEED_MULTIPLIER - 1);
  const smeltTimeMs = GAME_CONFIG.BASE_SMELT_TIME_MS / speedMultiplier;

  return Math.min(100, (smeltData.progress / smeltTimeMs) * 100);
}

export function getSmeltRate(state: GameState): number {
  const speedMultiplier = 1 + state.upgrades.betterFurnace_level * (GAME_CONFIG.BETTER_FURNACE_SPEED_MULTIPLIER - 1);
  const perkBonus = getSmeltingPerkBonus(state);
  const workerBonus = getWorkerBonus(state, 'smelter');
  return (1000 / GAME_CONFIG.BASE_SMELT_TIME_MS) * speedMultiplier * perkBonus * workerBonus;
}
