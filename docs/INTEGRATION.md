# Pool App Integration

This repository must work standalone, but later be importable into the Pool App.

## Rule

No hard dependency on the Pool App.

The racing game owns its game logic. The Pool App may provide user context and persistence, but it should not contain racing-game business logic.

## Current Standalone Flow

```txt
RacingFantasyApp
↓
useGameStore
↓
GameState
↓
SaveEngine
↓
LocalStorageSaveAdapter
```

Standalone development uses localStorage through `LocalStorageSaveAdapter`.

## Future Pool App Flow

```txt
Pool App user/session
↓
PoolAppUserContext
↓
PoolAppSaveClient
↓
createPoolAppSaveAdapter()
↓
SaveEngine.loadAsync() / SaveEngine.saveAsync()
↓
GameState
```

## Pool App Provides

- `userId`
- optional `teamName`
- optional credits/balance mapping
- saved racing game state
- async load function
- async save function
- optional clear/reset function

## Racing Game Provides

- mobile UI
- GameState
- GameStore
- engine layer
- garage stash
- race loadout
- race simulation
- rewards
- standings data
- integration adapter types

## Integration Files

```txt
src/integration/PoolAppAdapter.ts
src/integration/index.ts
```

## Required Pool App Save Client Shape

```ts
export type PoolAppSaveClient = {
  loadRacingFantasyState: (userId: string) => Promise<unknown>;
  saveRacingFantasyState: (userId: string, state: GameState) => Promise<void>;
  clearRacingFantasyState?: (userId: string) => Promise<void>;
};
```

## User Context

```ts
export type PoolAppUserContext = {
  userId: string;
  teamName?: string;
  credits?: number;
};
```

Use `applyPoolAppUserContext()` to merge Pool App user data into the racing game state without changing the rest of the save file.

## Important Boundary

The Pool App should never directly mutate nested racing-game state.

Allowed:

```ts
SaveEngine.saveAsync(gameState, poolAdapter);
```

Not allowed:

```ts
gameState.race.activeLoadout.car1.parts.engine = "...";
```

All gameplay changes must go through the racing game engines.
