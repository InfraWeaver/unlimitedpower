import { GameState, OreType } from './state';
import { GAME_CONFIG } from './constants';
import { trackCoinsEarned } from './statistics';

export function craftTools(state: GameState, ore: OreType, numTools: number = 1): GameState {
  const barsNeeded = GAME_CONFIG.BARS_PER_TOOL * numTools;
  const oreData = state.resources[ore];

  if (oreData.bars < barsNeeded) {
    return state;
  }

  const toolsCreated = numTools;

  return {
    ...state,
    resources: {
      ...state.resources,
      [ore]: {
        ...oreData,
        bars: oreData.bars - barsNeeded,
      },
      tools: state.resources.tools + toolsCreated,
    },
  };
}

export function sellTools(state: GameState, numTools: number = 1): GameState {
  const toolsToSell = Math.min(numTools, state.resources.tools);

  if (toolsToSell === 0) {
    return state;
  }

  const coinsPerTool = GAME_CONFIG.BASE_COINS_PER_TOOL * (1 + state.upgrades.betterSmith_level * (GAME_CONFIG.BETTER_SMITH_OUTPUT_MULTIPLIER - 1));
  const coinsGenerated = Math.floor(coinsPerTool * toolsToSell);

  let newState = {
    ...state,
    resources: {
      ...state.resources,
      tools: state.resources.tools - toolsToSell,
      coins: state.resources.coins + coinsGenerated,
    },
  };

  // Track coins earned
  newState = trackCoinsEarned(newState, coinsGenerated);

  return newState;
}

export function getToolValue(state: GameState): number {
  return GAME_CONFIG.BASE_COINS_PER_TOOL * (1 + state.upgrades.betterSmith_level * (GAME_CONFIG.BETTER_SMITH_OUTPUT_MULTIPLIER - 1));
}

export function getCraftCost(ore: OreType): number {
  return GAME_CONFIG.BARS_PER_TOOL;
}
