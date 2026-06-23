import { GameState } from './state';

export type EventType = 'ore_strike' | 'furnace_break' | 'market_crash' | 'discovery' | 'none';

export interface GameEvent {
  type: EventType;
  timeRemainingMs: number;
  effect: number; // multiplier or adjustment
}

export const EVENT_DEFINITIONS = {
  ore_strike: {
    name: '⚡ Ore Strike!',
    description: 'Mining rate 2x for 30s',
    rarity: 0.01, // 1% chance per second
    duration: 30000,
    effect: 2.0,
  },
  furnace_break: {
    name: '🔥 Furnace Breakdown',
    description: 'Smelting halted for 10s',
    rarity: 0.005, // 0.5% per second
    duration: 10000,
    effect: 0.0,
  },
  market_crash: {
    name: '📉 Market Crash',
    description: 'Tool value 50% for 60s',
    rarity: 0.002, // 0.2% per second
    duration: 60000,
    effect: 0.5,
  },
  discovery: {
    name: '🎉 Discovery!',
    description: 'Coin generation 3x for 20s',
    rarity: 0.003, // 0.3% per second
    duration: 20000,
    effect: 3.0,
  },
};

export function checkForRandomEvent(state: GameState): GameState {
  // If event already active, decrement timer
  if (state.currentEvent.type !== 'none') {
    const newTimeRemaining = state.currentEvent.timeRemainingMs - 100; // Assuming ~100ms per check

    if (newTimeRemaining <= 0) {
      return {
        ...state,
        currentEvent: {
          type: 'none',
          timeRemainingMs: 0,
          effect: 1,
        },
      };
    }

    return {
      ...state,
      currentEvent: {
        ...state.currentEvent,
        timeRemainingMs: newTimeRemaining,
      },
    };
  }

  // Random event check (if no event active)
  const eventTypes = ['ore_strike', 'furnace_break', 'market_crash', 'discovery'] as const;

  for (const eventType of eventTypes) {
    const eventDef = EVENT_DEFINITIONS[eventType];
    const eventChance = Math.random();

    if (eventChance < eventDef.rarity) {
      return {
        ...state,
        currentEvent: {
          type: eventType,
          timeRemainingMs: eventDef.duration,
          effect: eventDef.effect,
        },
      };
    }
  }

  return state;
}

export function getEventMultiplier(state: GameState, eventType: 'ore_strike' | 'market_crash' | 'discovery'): number {
  if (state.currentEvent.type === eventType) {
    return state.currentEvent.effect;
  }
  return 1;
}

export function getEventStatus(state: GameState): { active: boolean; name: string; timeLeft: string } {
  if (state.currentEvent.type === 'none') {
    return { active: false, name: '', timeLeft: '' };
  }

  const eventDef = EVENT_DEFINITIONS[state.currentEvent.type];
  const seconds = Math.ceil(state.currentEvent.timeRemainingMs / 1000);

  return {
    active: true,
    name: eventDef.name,
    timeLeft: `${seconds}s`,
  };
}
