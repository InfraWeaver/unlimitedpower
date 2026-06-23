import { GameState } from './state';

export const DAILY_GOAL = {
  target: 500, // smelt 500 bars per day
  reward: 5000, // bonus coins
};

export const WEEKLY_CHALLENGE = {
  mineTarget: 50000, // mine 50K ore per week
  reward: 25000,
};

export function updateDailyProgress(state: GameState, barsSmelted: number): GameState {
  const progress = Math.min(1, (state.challenges.dailyGoalProgress + barsSmelted) / DAILY_GOAL.target);
  return {
    ...state,
    challenges: {
      ...state.challenges,
      dailyGoalProgress: progress,
    },
  };
}

export function completeDailyGoal(state: GameState): GameState {
  if (state.challenges.dailyGoalProgress >= 1) {
    return {
      ...state,
      resources: {
        ...state.resources,
        coins: state.resources.coins + DAILY_GOAL.reward,
      },
      challenges: {
        ...state.challenges,
        dailyGoalProgress: 0,
        dailyGoalReward: state.challenges.dailyGoalReward + DAILY_GOAL.reward,
      },
    };
  }
  return state;
}

export function recordUpgradeCombo(state: GameState): GameState {
  const now = Date.now();
  const timeSinceLastUpgrade = now - state.challenges.lastUpgradeTime;
  const comboWindow = 10000; // 10 seconds between upgrades for combo

  let combo = state.challenges.upgradeCombo;
  if (timeSinceLastUpgrade < comboWindow && state.challenges.upgradeCombo > 0) {
    combo += 1;
  } else {
    combo = 1;
  }

  return {
    ...state,
    challenges: {
      ...state.challenges,
      upgradeCombo: combo,
      lastUpgradeTime: now,
    },
  };
}

export function getComboDiscount(comboLevel: number): number {
  // Each combo level gives 5% discount (max 20% at combo 4)
  return Math.min(0.2, comboLevel * 0.05);
}
