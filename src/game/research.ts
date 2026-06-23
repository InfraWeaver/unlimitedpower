import { GameState, OreType } from './state';
import { GAME_CONFIG } from './constants';

export const RESEARCH_PROJECTS = {
  doubleSmelt: {
    name: 'Double Smelting',
    description: '2x smelting speed (but 2x ore consumption)',
    cost: 50,
    effect: 'Increases smelting efficiency',
  },
  toolFusion: {
    name: 'Tool Fusion',
    description: 'Combine 5 tools into 1 rare tool worth 5x value',
    cost: 100,
    effect: 'Unlock tool merging mechanic',
  },
  automatedMining: {
    name: 'Automated Mining',
    description: '10% of passive mining runs even when tab closed',
    cost: 150,
    effect: 'Enable background mining',
  },
};

export function earnResearchPoints(state: GameState, amount: number): GameState {
  return {
    ...state,
    research: {
      ...state.research,
      points: state.research.points + amount,
    },
  };
}

export function purchaseResearch(state: GameState, projectId: keyof typeof RESEARCH_PROJECTS): GameState {
  const project = RESEARCH_PROJECTS[projectId];

  if (state.research.points < project.cost) {
    return state;
  }

  return {
    ...state,
    research: {
      ...state.research,
      points: state.research.points - project.cost,
      [projectId]: true,
    },
  };
}

export function getOreBonus(state: GameState, ore: OreType): number {
  const oreConfig = GAME_CONFIG.ORES[ore];
  return oreConfig.oreGenBonus;
}

export function getToolValueBonus(state: GameState, ore: OreType): number {
  const oreConfig = GAME_CONFIG.ORES[ore];
  let bonus = oreConfig.toolValueBonus;

  if (state.research.toolFusion) {
    bonus *= 1.2; // Slight boost from tool fusion research
  }

  return bonus;
}
