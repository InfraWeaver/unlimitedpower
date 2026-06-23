import { GameState } from './state';
import { queueOreForSmelting } from './smelting';
import { craftTools, sellTools } from './crafting';

export interface AutoFeatures {
  autoCraft: boolean;
  autoSmelt: boolean;
  autoSell: boolean;
}

export function updateAutomation(state: GameState): GameState {
  let newState = state;

  // Auto-smelt: queue all available ore
  if (state.automation.autoSmelt) {
    for (const ore of state.progression.unlockedOres) {
      const availableOre = Math.floor(newState.resources[ore].ore);
      if (availableOre > 0) {
        newState = queueOreForSmelting(newState, ore, availableOre);
      }
    }
  }

  // Auto-craft: craft tools from available bars
  if (state.automation.autoCraft) {
    for (const ore of state.progression.unlockedOres) {
      const availableBars = Math.floor(newState.resources[ore].bars);
      if (availableBars >= 5) {
        const toolsToCraft = Math.floor(availableBars / 5);
        newState = craftTools(newState, ore, toolsToCraft);
      }
    }
  }

  // Auto-sell: sell all tools
  if (state.automation.autoSell && newState.resources.tools > 0) {
    newState = sellTools(newState, newState.resources.tools);
  }

  return newState;
}

export function toggleAutomation(state: GameState, feature: keyof AutoFeatures): GameState {
  return {
    ...state,
    automation: {
      ...state.automation,
      [feature]: !state.automation[feature],
    },
  };
}
