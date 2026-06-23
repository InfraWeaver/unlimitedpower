import { GameState } from './state';
import { GAME_CONFIG } from './constants';

export function handleMiningClick(state: GameState): GameState {
  const clickAmount = state.mining.clickBonus;

  return {
    ...state,
    resources: {
      ...state.resources,
      copper: {
        ...state.resources.copper,
        ore: state.resources.copper.ore + clickAmount,
      },
    },
  };
}

export function updatePassiveMining(state: GameState, deltaMs: number): GameState {
  const timeSinceLastUpdate = Date.now() - state.mining.lastPassiveUpdate;

  if (timeSinceLastUpdate < GAME_CONFIG.PASSIVE_UPDATE_INTERVAL_MS) {
    return state;
  }

  // Calculate passive rate with upgrades
  const passiveRateMultiplier =
    1 + state.upgrades.hireMiner_level * (GAME_CONFIG.HIRE_MINER_RATE_MULTIPLIER - 1);
  const effectiveRate = GAME_CONFIG.BASE_PASSIVE_RATE * passiveRateMultiplier;

  // Generate ore based on time elapsed
  const oreGenerated = (timeSinceLastUpdate / 1000) * effectiveRate;

  return {
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
}

export function getDisplayPassiveRate(state: GameState): number {
  const passiveRateMultiplier =
    1 + state.upgrades.hireMiner_level * (GAME_CONFIG.HIRE_MINER_RATE_MULTIPLIER - 1);
  return GAME_CONFIG.BASE_PASSIVE_RATE * passiveRateMultiplier;
}
