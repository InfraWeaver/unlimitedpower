# ⛏️ Idle Mining Game

A light, fast, extensible idle game. Mine ore, smelt bars, craft tools, upgrade your operation.

**Play now**: `npm run dev` then open http://localhost:5173

## What's Included

✅ **Mining** — Click to mine (50 ore/click), passive generation starts at 1 ore/sec  
✅ **Smelting** — Queue ore, auto-convert to bars over time  
✅ **Crafting** — Convert bars to tools, sell for coins  
✅ **Upgrades** — Three tiers to purchase: Hire Miner, Better Furnace, Better Smith  
✅ **Progression** — Auto-unlock passive mining at 5 minutes  
✅ **Persistence** — Save/load every 5 seconds to localStorage  
✅ **Tests** — 27 unit tests covering all game systems  

## Tech Stack

- **Language**: TypeScript
- **Build**: Vite
- **Testing**: Vitest
- **Size**: 4.2 KB gzipped
- **Dependencies**: Zero (except dev tools)

## Getting Started

```bash
npm install
npm run dev        # Start dev server at http://localhost:5173
npm test           # Run all 27 tests
npm run build      # Build for production (outputs to dist/)
```

## How to Play

1. **Mining Tab** — Click the ore deposit to mine. Passive generation runs in background.
2. **Smelting Tab** — Queue ore to convert into bars. Speed increases with Better Furnace upgrades.
3. **Crafting Tab** — Convert bars to tools, then sell all tools for coins.
4. **Upgrades Tab** — Spend coins to unlock upgrades (rate 1.15x per level).
5. **Progression** — After 5 minutes, auto-mining unlocks. Keep playing to discover new ore types.

## Project Structure

```
src/
  game/              # Pure game logic (no DOM dependencies)
    mining.ts        # Click bonus, passive generation
    smelting.ts      # Ore → bars
    crafting.ts      # Bars → tools → coins
    upgrades.ts      # Purchase and cost logic
    progression.ts   # Ore unlocks, auto-unlock
    saves.ts         # localStorage persistence
    state.ts         # Game state types
    constants.ts     # Balance tuning
    *.test.ts        # Unit tests (27 total)
  ui/
    renderer.ts      # Converts state to HTML
  app.ts             # Game loop (60 FPS)
  main.ts            # Entry point
  index.html         # Shell + inline CSS

ARCHITECTURE.md     # Design decisions and extensibility
```

## Design Philosophy

- **No external dependencies** — Pure TypeScript for simplicity and speed
- **Immutable state** — All updates return new state objects (testable, debuggable)
- **Clean separation** — Game logic in `/game`, UI rendering in `/ui`
- **Fast and lean** — 60 FPS loop, 4.2 KB gzipped, <1ms per frame
- **Test-driven** — 27 unit tests, all systems covered

## Game Balance

Tweak values in `src/game/constants.ts`:

```typescript
BASE_PASSIVE_RATE: 1,                    // ore/sec
BASE_SMELT_TIME_MS: 2000,                // 2 seconds per bar
BARS_PER_TOOL: 5,                        // 5 bars → 1 tool
BASE_COINS_PER_TOOL: 50,                 // 50 coins per tool
HIRE_MINER_RATE_MULTIPLIER: 2.5,        // 2.5x per level
```

## Roadmap

**Phase 1 ✅** — Mining system  
**Phase 2 ✅** — Smelting & crafting  
**Phase 3 ✅** — Upgrades shop  
**Phase 4 ✅** — Save/load persistence  

**Future**:
- Prestige/reset systems
- Events and random mechanics
- Cloud saves
- Mobile app (Capacitor)

## Architecture & Extensibility

See [ARCHITECTURE.md](./ARCHITECTURE.md) for:
- How to add new ore tiers
- How to add new upgrades
- How to swap the UI renderer
- Why certain design decisions were made

## Contributing

Game code lives in `src/game/`. Add new feature:
1. Create logic file (e.g., `src/game/features.ts`)
2. Add tests (`src/game/features.test.ts`)
3. Wire into game loop in `src/app.ts`
4. Add UI panel in `src/ui/renderer.ts`

All game logic must be testable without DOM.

## License

MIT

---

Made with ❤️ and TypeScript. No ads, no tracking, no fluff.