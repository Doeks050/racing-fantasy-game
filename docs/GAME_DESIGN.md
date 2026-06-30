# Racing Fantasy Game - Game Design

## Core Concept
Standalone fantasy racing game, built as a separate Next.js repository, but designed to be integrated later into the Pool App.

## Main Screens
- Home
- Race Loadout
- Garage Stash
- Market
- Standings
- Race Weekend
- Circuits
- Team HQ
- Upgrades
- Sponsors
- Race Results

## Race Loadout
The loadout screen has 3 tabs:
- Car 1
- Car 2
- Team

Car 1 and Car 2 each contain:
- Driver slot
- Car visual with clickable part slots
- Car performance stats
- Driver stats

Team contains:
- Pitwall / pitstop visual
- Clickable team slots
- Team performance stats

## Car Parts Per Car
Each car has 8 fixed part slots:
- Chassis
- Engine
- Gearbox
- Suspension
- Front Wing
- Rear Wing
- Floor
- Brakes

## Team Slots
- Pit Crew
- Strategist
- Race Engineer
- Data Analyst
- Mechanic Chief

## Garage Stash
Garage Stash uses a 6-column inventory grid inspired by the extraction-game stash.

Items have:
- grid size
- position
- rotation
- quantity

The player should be able to drag items inside the stash grid. Items snap to the grid and cannot overlap.

Tapping an item opens an item info screen.

## Item Stacking Rule
Items do not stack.

If the market or garage contains multiple copies of the same item, each copy must be represented as a separate grid item with its own slot/listing position.

Do not show `x2`, `x3`, stock badges, or stacked quantities on item cards.

## Market
Market also uses a 6-column grid system instead of a flat shop list.

Market is organized by specialist traders.

The trader selector must fit inside the mobile screen. No horizontal scrolling is allowed.

Current trader categories:
- Aero Lab: Front Wing, Rear Wing, Floor
- Powertrain Bay: Engine, Gearbox
- Mechanical Shop: Chassis, Suspension, Brakes
- Driver Agency: Drivers

Each trader shows listings inside a grid layout. This keeps Garage and Market visually and mechanically consistent.

Future trader categories can include:
- Team Staff Office
- Sponsor Broker
- Prototype Parts Dealer
