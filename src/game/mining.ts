import { GameState } from './state';
import { GAME_CONFIG } from './constants';
import { calculatePrestigeBonus } from './prestige';
import { trackOreMined } from './statistics';
import { getWorkerBonus } from './workers';
import { getEventMultiplier } from './events';
import { getMiningPerkBonus } from './perks';
import { getOreBonus } from './research';

export function handleMiningClick(state: GameState): GameState {
  const clickAmount = state.mining.clickBonus;

  let newState = {
    ...state,
    resources: {
      ...state.resources,
      copper: {
        ...state.resources.copper,
        ore: state.resources.copper.ore + clickAmount,
      },
    },
  };

  // Track ore mined
  newState = trackOreMined(newState, clickAmount);

  return newState;
}

export function updatePassiveMining(state: GameState, deltaMs: number): GameState {
  const timeSinceLastUpdate = Date.now() - state.mining.lastPassiveUpdate;

  if (timeSinceLastUpdate < GAME_CONFIG.PASSIVE_UPDATE_INTERVAL_MS) {
    return state;
  }

  // Calculate passive rate with all bonuses
  const passiveRateMultiplier =
    1 + state.upgrades.hireMiner_level * (GAME_CONFIG.HIRE_MINER_RATE_MULTIPLIER - 1);
  const prestigeBonus = calculatePrestigeBonus(state.stats.prestigeLevels);
  const perkBonus = getMiningPerkBonus(state);
  const workerBonus = getWorkerBonus(state, 'miner');
  const eventMultiplier = getEventMultiplier(state, 'ore_strike');
  const avgOreBonus = state.progression.unlockedOres.reduce((sum, ore) => sum + getOreBonus(state, ore), 0) / Math.max(1, state.progression.unlockedOres.length);
  const effectiveRate = GAME_CONFIG.BASE_PASSIVE_RATE * passiveRateMultiplier * prestigeBonus * perkBonus * workerBonus * eventMultiplier * avgOreBonus;

  // Generate ore based on time elapsed
  const oreGenerated = (timeSinceLastUpdate / 1000) * effectiveRate;

  let newState = {
    ...state,
    resources: {
      ...state.resources,
      copper: {
        ...state.resources.copper,
        ore: state.resources.copper.ore + oreGenerated,
      },
    },
    mining: {
      ...state.mining,
      passiveRate: effectiveRate,
      lastPassiveUpdate: Date.now(),
    },
  };

  // Track ore mined
  newState = trackOreMined(newState, oreGenerated);

  return newState;
}

export function getDisplayPassiveRate(state: GameState): number {
  const passiveRateMultiplier =
    1 + state.upgrades.hireMiner_level * (GAME_CONFIG.HIRE_MINER_RATE_MULTIPLIER - 1);
  const prestigeBonus = calculatePrestigeBonus(state.stats.prestigeLevels);
  const perkBonus = getMiningPerkBonus(state);
  const workerBonus = getWorkerBonus(state, 'miner');
  const eventMultiplier = getEventMultiplier(state, 'ore_strike');
  // Average ore bonus across all unlocked ores
  const avgOreBonus = state.progression.unlockedOres.reduce((sum, ore) => sum + getOreBonus(state, ore), 0) / Math.max(1, state.progression.unlockedOres.length);
  return GAME_CONFIG.BASE_PASSIVE_RATE * passiveRateMultiplier * prestigeBonus * perkBonus * workerBonus * eventMultiplier * avgOreBonus;
}
