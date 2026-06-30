# Architecture

## Core Rule

The game has one source of truth: `GameState`.

UI components must not own game data such as inventory, loadout, player economy, race results, progression or market state.

## Layers

```txt
Mobile UI
↓
Game Store (Zustand)
↓
Game Engines
↓
Game Database
↓
Save / Pool App Integration
```

## GameState

`src/engine/GameState.ts` owns the structure of the active game state.

The current v1 state contains:

- player profile
- garage inventory
- owned drivers
- owned staff
- owned parts
- active race loadout
- current race weekend
- economy placeholders
- progression placeholders

## Game Store

`src/store/useGameStore.ts` exposes the active state and approved actions.

Screens may read state from the store and call actions, but they may not mutate game state directly.

Approved v1 actions:

- `selectDriver`
- `equipCarPart`
- `equipTeamMember`
- `resetGameState`

## Game Engines

Engines contain business logic.

Current v1 engine:

- `LoadoutEngine`

The loadout engine validates ownership and compatibility before changing the active loadout.

## UI Rule

React local state may be used for temporary UI state only, such as:

- selected tab
- open picker screen
- modal state
- expanded cards

React local state may not be used for persistent game systems.

Do not use local React state for:

- loadout
- inventory
- currency
- race weekend
- standings
- market
- rewards
- progression

## Integration Rule

This repository must remain standalone, but it must be able to integrate into the Pool App later.

The Pool App should eventually provide:

- `userId`
- saved state loading
- saved state persistence
- auth/session context
- wallet/balance if needed

The racing game should expose:

- mobile UI
- game state
- engines
- save adapter hooks
