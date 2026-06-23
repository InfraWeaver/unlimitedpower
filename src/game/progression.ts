import { GameState, OreType } from './state';
import { GAME_CONFIG } from './constants';
import { getAutoUnlockTime } from './perks';

export function updateProgression(state: GameState, deltaMs: number): GameState {
  const newPlaytime = state.progression.totalPlaytimeMs + deltaMs;
  let newState = {
    ...state,
    progression: {
      ...state.progression,
      totalPlaytimeMs: newPlaytime,
    },
  };

  // Check for auto-unlock trigger
  if (!newState.progression.autoUnlockTriggered && newPlaytime >= GAME_CONFIG.AUTO_UNLOCK_TIME_MS) {
    newState = {
      ...newState,
      progression: {
        ...newState.progression,
        autoUnlockTriggered: true,
      },
    };
  }

  // Check for ore unlocks (based on bars smelted, not just playtime)
  const oreTypesToCheck: OreType[] = ['iron', 'tin'];
  let unlockedOres = [...newState.progression.unlockedOres];

  for (const ore of oreTypesToCheck) {
    if (!unlockedOres.includes(ore)) {
      const oreConfig = GAME_CONFIG.ORES[ore];
      const currentOreBarsSmelted = getBarsSmelted(newState, 'copper'); // Check copper bars for now

      // Unlock by playtime milestone OR by smelting enough bars of previous ore
      if (newPlaytime >= oreConfig.unlockedAt) {
        unlockedOres = [...unlockedOres, ore];
      }
    }
  }

  return {
    ...newState,
    progression: {
      ...newState.progression,
      unlockedOres,
    },
  };
}

function getBarsSmelted(state: GameState, ore: OreType): number {
  // Track total bars ever smelted (simplified - could enhance with save tracking)
  return state.resources[ore].bars;
}

export function getTimeToAutoUnlock(state: GameState): number {
  if (state.progression.autoUnlockTriggered) {
    return 0;
  }
  const autoUnlockTime = getAutoUnlockTime(state);
  const remaining = autoUnlockTime - state.progression.totalPlaytimeMs;
  return Math.max(0, remaining);
}

export function formatTimeMs(ms: number): string {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
