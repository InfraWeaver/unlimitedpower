# Idle Mining Game - Architecture

## Overview

A lightweight, extensible idle game built with TypeScript and Vite. ~4KB minified JavaScript (gzipped).

## State Management

**Immutable Updates**: All game state changes return new state objects. This enables:
- Predictable behavior (no mutations)
- Easy debugging and state inspection
- Time-travel debug capabilities (future enhancement)
- Clean testing without mocks

**GameState Structure** (`src/game/state.ts`):
```typescript
type GameState = {
  resources: { copper/iron/tin: { ore, bars }, tools, coins }
  mining: { passiveRate, clickBonus, lastPassiveUpdate }
  smelting: { copper/iron/tin: { queuedOre, progress } }
  upgrades: { hireMiner_level, betterFurnace_level, betterSmith_level }
  progression: { totalPlaytimeMs, unlockedOres, autoUnlockTriggered }
  ui: { activeTab }
}
```

## Module Organization

### Game Logic (`src/game/`)
Pure TypeScript functions with zero DOM dependencies. Each module handles one system:

- **mining.ts**: Click bonus, passive generation
- **smelting.ts**: Ore queuing, bar production
- **crafting.ts**: Tool creation, coin generation
- **upgrades.ts**: Purchase logic, cost calculation
- **progression.ts**: Ore unlocks, auto-unlock trigger
- **saves.ts**: localStorage persistence
- **state.ts**: Type definitions and initial state
- **constants.ts**: Game balance parameters

### UI Rendering (`src/ui/`)
- **renderer.ts**: Converts GameState → HTML. No side effects.
  - One render function per panel (renderMiningPanel, etc.)
  - Event handlers collect in parent render() function
  - All business logic in game/* modules

### Game Loop (`src/app.ts`)
```
constructor() → load saved state
gameLoop(60 FPS) →
  update(deltaMs)
    - updatePassiveMining()
    - updateSmelting()
    - updateProgression()
  renderFrame()
    - render UI from current state
  handle user input
    - handleOreClick()
    - handleQueueOre()
    - handleCraftTools()
    - purchaseUpgrade()
    - switchTab()
```

## Key Design Decisions

### 1. Pure Game Logic
Game mechanics are completely separate from UI. This means:
- Logic can be tested without a DOM
- UI can be swapped (React, Vue, Canvas, etc.) without touching game code
- Logic can be ported to server/mobile without changes

### 2. Single Game Loop
One RAF loop handles all updates. Delta-time calculations ensure:
- Passive generation is frame-rate independent
- Smelting speed is consistent regardless of FPS
- Progression tracks real time, not update count

### 3. Immutable State Updates
Every state change is a pure function returning new state:
```typescript
function handleOreClick(state: GameState): GameState {
  return {
    ...state,
    resources: {
      ...state.resources,
      copper: {
        ...state.resources.copper,
        ore: state.resources.copper.ore + state.mining.clickBonus,
      },
    },
  };
}
```

Benefits:
- No hidden mutations
- State changes are testable in isolation
- Easy to debug ("what changed?")
- Enables time-travel debugging

### 4. Tab-Based UI (not scrolling)
Tabs keep UI mobile-friendly:
- One tab visible at a time → less info overload
- Touch-friendly buttons → no hover states
- Resources always visible in header

### 5. Exponential Cost Scaling
Upgrades use 1.15x multiplier per level:
```
cost(level) = baseCost × 1.15^level
```
This creates natural progression gates without explicit level caps.

## Testing Strategy

**Unit Tests** (27 total, all passing):
- Mining: Click bonus, passive generation, upgrades
- Smelting: Queuing, progress, bar production
- Crafting: Tool creation, selling, value scaling
- Upgrades: Cost calculation, affordability, purchasing
- Saves: Persistence, loading, corruption handling

**No Integration Tests Needed**:
Each system is independently testable. Game loop integration is tested manually (visual verification).

## Performance Characteristics

- **CPU**: <1ms per frame (60 FPS)
- **Memory**: ~1KB per game state (localStorage fits ~50MB)
- **Build Size**: 14KB minified, 4.2KB gzipped
- **No External Dependencies**: Pure TypeScript

## Extensibility Points

### Adding a New Ore Tier
1. Add to `GAME_CONFIG.ORES` in constants.ts
2. Add unlock condition in progression.ts
3. UI automatically renders new ore in smelting panel

### Adding a New Upgrade
1. Add to `GAME_CONFIG.UPGRADES` in constants.ts
2. Add `[name]_level` field to GameState upgrades
3. Implement effect in relevant system (mining.ts, smelting.ts, etc.)
4. UI automatically renders in upgrades panel

### Changing Resource Generation Speed
Edit constants.ts:
- `BASE_PASSIVE_RATE`: ore/sec
- `BASE_SMELT_TIME_MS`: seconds per bar
- `BARS_PER_TOOL`: bars needed per tool

### Swapping the Rendering Engine
Current: DOM + inline HTML
Possible: React, Canvas, WebGL, etc.
- Only `src/ui/renderer.ts` and `index.html` need changes
- All game logic stays the same

## Future Enhancement Ideas

### Phase 5: Quality of Life
- Settings panel (volume, speed, dark mode)
- Statistics page (total ore mined, upgrades purchased, etc.)
- Prestige/reset system (restart with permanent bonuses)

### Phase 6: Advanced Features
- Random events (ore strikes, furnace breakdowns)
- Worker scheduling (active/idle automation strategies)
- Seasonal ore types (time-limited resources)

### Phase 7: Multiplayer / Cloud
- Cloud saves (OAuth)
- Leaderboards (JSON backend)
- Shared world state (optional, no server required)

### Phase 8: Mobile App
- Wrap with Capacitor (iOS/Android native)
- Push notifications (ore ready, upgrades available)
- Biometric unlock (fingerprint)

## Deployment

```bash
npm run build
# outputs to dist/

# Serve static files
npx serve dist

# Or deploy to Vercel/Netlify
vercel deploy dist
```

No backend required. Game runs entirely in browser.
