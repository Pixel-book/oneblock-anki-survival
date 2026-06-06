import { system, world } from "@minecraft/server";
import { ALTAR_CENTER, ALTAR_RESERVED_RADIUS, ALTAR_WARNING_COOLDOWN_TICKS, ALTAR_WARNING_RADIUS, NETHER_ID, PLAYER_PROPS, THE_END_ID, WORLD_PROPS } from "./constants.js";
import { logError, logInfo } from "./logger.js";
import { getPlayerNumber, getWorldBoolean, getWorldNumber, getWorldString, setPlayerNumber, setWorldBoolean, setWorldString } from "./storage.js";
import { overworld } from "./world_init.js";

function distance2d(a, b) {
  const dx = a.x - b.x;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dz * dz);
}

export function handleAltarProximityTick() {
  const tick = system.currentTick;
  for (const player of world.getAllPlayers()) {
    if (player.dimension.id !== "minecraft:overworld") continue;
    if (distance2d(player.location, ALTAR_CENTER) > ALTAR_WARNING_RADIUS) continue;
    if (getWorldString(WORLD_PROPS.altarState, "reserved") !== "reserved") continue;
    const last = getPlayerNumber(player, PLAYER_PROPS.lastAltarWarningTick, 0);
    if (tick - last < ALTAR_WARNING_COOLDOWN_TICKS) continue;
    setPlayerNumber(player, PLAYER_PROPS.lastAltarWarningTick, tick);
    player.sendMessage("§d前方出现了空间波动。\n这里的空间还不稳定，等以后再来探索吧。");
  }
  maybeGenerateAltar();
}

export function handleAltarPlaceBefore(event) {
  const player = event.player;
  if (!player || player.dimension.id !== "minecraft:overworld") return;
  const loc = event.block?.location ?? event.permutationToPlace?.location;
  if (!loc || distance2d(loc, ALTAR_CENTER) > ALTAR_RESERVED_RADIUS) return;
  if (getWorldString(WORLD_PROPS.altarState, "reserved") !== "reserved") return;
  try { event.cancel = true; } catch (error) {}
  player.sendMessage("§d空间波动吞没了这个动作。这里似乎还不能建造。");
}

export function noteDimensionChange(event) {
  if (event.toDimension?.id === NETHER_ID) setWorldBoolean(WORLD_PROPS.enteredNetherAny, true);
  if (event.toDimension?.id === THE_END_ID) logInfo("AltarZone", "player entered the end");
}

export function noteEntityDie(event) {
  if (event.deadEntity?.typeId === "minecraft:ender_dragon") setWorldBoolean(WORLD_PROPS.dragonDefeated, true);
}

export function noteInventoryItem(player, itemStack) {
  if (!itemStack) return;
  if (itemStack.typeId === "minecraft:blaze_rod" || itemStack.typeId === "minecraft:blaze_powder") setWorldBoolean(WORLD_PROPS.blazeProofAny, true);
}

function altarUnlocked() {
  return getWorldNumber(WORLD_PROPS.totalRefreshes, 0) >= 1700 &&
    getWorldBoolean(WORLD_PROPS.enteredNetherAny, false) &&
    getWorldBoolean(WORLD_PROPS.blazeProofAny, false);
}

function maybeGenerateAltar() {
  if (getWorldBoolean(WORLD_PROPS.altarGenerated, false)) return;
  if (getWorldString(WORLD_PROPS.altarState, "reserved") === "disabled_due_to_conflict") return;
  if (!altarUnlocked()) return;
  try {
    if (hasConflict()) {
      setWorldString(WORLD_PROPS.altarState, "disabled_due_to_conflict");
      return;
    }
    generateAltar();
    setWorldBoolean(WORLD_PROPS.altarGenerated, true);
    setWorldString(WORLD_PROPS.altarState, "generated");
    logInfo("AltarZone", "altar generated");
  } catch (error) {
    logError("AltarZone", "altar generation failed", error);
  }
}

function hasConflict() {
  const dim = overworld();
  for (const player of world.getAllPlayers()) {
    if (player.dimension.id === "minecraft:overworld" && distance2d(player.location, ALTAR_CENTER) <= ALTAR_RESERVED_RADIUS) return true;
  }
  for (let x = -12; x <= 12; x += 4) {
    for (let z = -12; z <= 12; z += 4) {
      const block = dim.getBlock({ x: ALTAR_CENTER.x + x, y: ALTAR_CENTER.y, z: ALTAR_CENTER.z + z });
      if (block && block.typeId !== "minecraft:air" && block.typeId !== "minecraft:void_air") return true;
    }
  }
  return false;
}

function generateAltar() {
  const dim = overworld();
  for (let x = -10; x <= 10; x += 1) {
    for (let z = -10; z <= 10; z += 1) {
      const edge = Math.abs(x) === 10 || Math.abs(z) === 10;
      dim.getBlock({ x: ALTAR_CENTER.x + x, y: ALTAR_CENTER.y, z: ALTAR_CENTER.z + z })?.setType(edge ? "minecraft:obsidian" : "minecraft:end_stone");
    }
  }
  const frames = [
    [-2, -1], [-2, 0], [-2, 1],
    [2, -1], [2, 0], [2, 1],
    [-1, -2], [0, -2], [1, -2],
    [-1, 2], [0, 2], [1, 2]
  ];
  for (const [x, z] of frames) dim.getBlock({ x: ALTAR_CENTER.x + x, y: ALTAR_CENTER.y + 1, z: ALTAR_CENTER.z + z })?.setType("minecraft:end_portal_frame");
}

