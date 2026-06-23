import { GameState } from './state';
import { GAME_CONFIG } from './constants';
import { calculatePrestigeBonus } from './prestige';
import { trackOreMined } from './statistics';
import { getWorkerBonus } from './workers';
import { getEventMultiplier } from './events';

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

  // Calculate passive rate with upgrades, prestige, workers, and events
  const passiveRateMultiplier =
    1 + state.upgrades.hireMiner_level * (GAME_CONFIG.HIRE_MINER_RATE_MULTIPLIER - 1);
  const prestigeBonus = calculatePrestigeBonus(state.stats.prestigeLevels);
  const workerBonus = getWorkerBonus(state, 'miner');
  const eventMultiplier = getEventMultiplier(state, 'ore_strike');
  const effectiveRate = GAME_CONFIG.BASE_PASSIVE_RATE * passiveRateMultiplier * prestigeBonus * workerBonus * eventMultiplier;

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
  const workerBonus = getWorkerBonus(state, 'miner');
  const eventMultiplier = getEventMultiplier(state, 'ore_strike');
  return GAME_CONFIG.BASE_PASSIVE_RATE * passiveRateMultiplier * prestigeBonus * workerBonus * eventMultiplier;
}
