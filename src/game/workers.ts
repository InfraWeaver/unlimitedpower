import { GameState } from './state';
import { GAME_CONFIG } from './constants';

export interface Worker {
  type: 'miner' | 'smelter' | 'crafter';
  count: number;
  morale: number; // 0-100
}

export const WORKER_CONFIG = {
  miner: {
    name: 'Miner',
    baseCost: 10000,
    costMultiplier: 1.2,
    productionBonus: 0.5, // 50% ore/sec per worker
    description: 'Generates passive ore',
  },
  smelter: {
    name: 'Smelter',
    baseCost: 15000,
    costMultiplier: 1.2,
    productionBonus: 0.3, // 30% smelt speed per worker
    description: 'Speeds up smelting',
  },
  crafter: {
    name: 'Crafter',
    baseCost: 20000,
    costMultiplier: 1.2,
    productionBonus: 0.4, // 40% tool output per worker
    description: 'Increases tool production',
  },
};

export function getWorkerCost(workerType: keyof typeof WORKER_CONFIG, count: number): number {
  const config = WORKER_CONFIG[workerType];
  return Math.floor(config.baseCost * Math.pow(config.costMultiplier, count));
}

export function canHireWorker(state: GameState, workerType: keyof typeof WORKER_CONFIG): boolean {
  const cost = getWorkerCost(workerType, state.workers[workerType].count);
  return state.resources.coins >= cost;
}

export function hireWorker(state: GameState, workerType: keyof typeof WORKER_CONFIG): GameState {
  if (!canHireWorker(state, workerType)) {
    return state;
  }

  const cost = getWorkerCost(workerType, state.workers[workerType].count);

  return {
    ...state,
    resources: {
      ...state.resources,
      coins: state.resources.coins - cost,
    },
    workers: {
      ...state.workers,
      [workerType]: {
        ...state.workers[workerType],
        count: state.workers[workerType].count + 1,
      },
    },
  };
}

export function updateWorkerMorale(state: GameState, deltaMs: number): GameState {
  // Morale regenerates over time (0.5 per second when idle)
  const moralRegenRate = 0.5; // per second
  const moralRegen = (deltaMs / 1000) * moralRegenRate;

  let newState = state;

  for (const workerType of ['miner', 'smelter', 'crafter'] as const) {
    const worker = state.workers[workerType];
    if (worker.count > 0) {
      const newMorale = Math.min(100, worker.morale + moralRegen);
      newState = {
        ...newState,
        workers: {
          ...newState.workers,
          [workerType]: {
            ...worker,
            morale: newMorale,
          },
        },
      };
    }
  }

  return newState;
}

export function getWorkerBonus(state: GameState, workerType: keyof typeof WORKER_CONFIG): number {
  const worker = state.workers[workerType];
  const moralMultiplier = 0.5 + (worker.morale / 100) * 1.5; // 0.5x to 2x based on morale
  const bonusPerWorker = WORKER_CONFIG[workerType].productionBonus;
  return 1 + worker.count * bonusPerWorker * moralMultiplier;
}

export function getTotalWorkers(state: GameState): number {
  return state.workers.miner.count + state.workers.smelter.count + state.workers.crafter.count;
}
