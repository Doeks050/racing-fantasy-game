import { carParts, circuits, drivers, teamMembers } from "@/data";
import { calculateRaceResult } from "@/systems";
import type { GameState } from "./GameState";

export const RaceEngine = {
  getCurrentCircuit(state: GameState) {
    return circuits.find((circuit) => circuit.id === state.race.currentCircuitId) ?? circuits[0];
  },

  calculateCurrentRaceResult(state: GameState) {
    return calculateRaceResult({
      loadout: state.race.activeLoadout,
      circuit: this.getCurrentCircuit(state),
      drivers,
      parts: carParts,
      teamMembers,
    });
  },
};
