import type { GameInventorySlot } from "@/engine";

export const starterGarageInventorySlots: GameInventorySlot[] = [
  { slotId: "slot_chassis_01", entityId: "common_chassis_01", quantity: 1, gridPosition: { column: 0, row: 0 } },
  { slotId: "slot_engine_01", entityId: "common_engine_01", quantity: 1, gridPosition: { column: 2, row: 0 } },
  { slotId: "slot_gearbox_01", entityId: "common_gearbox_01", quantity: 1, gridPosition: { column: 4, row: 0 } },
  { slotId: "slot_suspension_01", entityId: "common_suspension_01", quantity: 1, gridPosition: { column: 0, row: 2 } },
  { slotId: "slot_front_wing_01", entityId: "common_front_wing_01", quantity: 1, gridPosition: { column: 2, row: 2 } },
  { slotId: "slot_rear_wing_01", entityId: "common_rear_wing_01", quantity: 1, gridPosition: { column: 0, row: 3 } },
  { slotId: "slot_floor_01", entityId: "common_floor_01", quantity: 1, gridPosition: { column: 3, row: 3 } },
  { slotId: "slot_brakes_01", entityId: "common_brakes_01", quantity: 1, gridPosition: { column: 5, row: 2 } },
  { slotId: "slot_chassis_02", entityId: "common_chassis_01", quantity: 1, gridPosition: { column: 0, row: 5 } },
  { slotId: "slot_engine_02", entityId: "common_engine_01", quantity: 1, gridPosition: { column: 2, row: 5 } },
  { slotId: "slot_gearbox_02", entityId: "common_gearbox_01", quantity: 1, gridPosition: { column: 4, row: 5 } },
  { slotId: "slot_suspension_02", entityId: "common_suspension_01", quantity: 1, gridPosition: { column: 0, row: 7 } },
  { slotId: "slot_front_wing_02", entityId: "common_front_wing_01", quantity: 1, gridPosition: { column: 2, row: 7 } },
  { slotId: "slot_rear_wing_02", entityId: "common_rear_wing_01", quantity: 1, gridPosition: { column: 0, row: 8 } },
  { slotId: "slot_floor_02", entityId: "common_floor_01", quantity: 1, gridPosition: { column: 3, row: 8 } },
  { slotId: "slot_brakes_02", entityId: "common_brakes_01", quantity: 1, gridPosition: { column: 5, row: 7 } },
];

export const starterOwnedPartIds = [
  "common_chassis_01",
  "common_engine_01",
  "common_gearbox_01",
  "common_suspension_01",
  "common_front_wing_01",
  "common_rear_wing_01",
  "common_floor_01",
  "common_brakes_01",
];
