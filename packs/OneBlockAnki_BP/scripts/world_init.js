import { system, world } from "@minecraft/server";
import { CORE_BLOCK_POS, DEFAULT_CORE_BLOCK, DEFAULT_INITIAL_BALANCE, OVERWORLD_ID, PLAYER_PROPS, PLAYER_SPAWN_POS, WORLD_PROPS } from "./constants.js";
import { DEFAULT_GUARANTEE_STATE, saveGuarantees } from "./guarantee_manager.js";
import { logInfo, logError } from "./logger.js";
import { getPlayerNumber, getWorldBoolean, setPlayerNumber, setWorldBoolean, setWorldNumber, setWorldString } from "./storage.js";

export function overworld() {
  return world.getDimension(OVERWORLD_ID);
}

export function blockAt(pos) {
  return overworld().getBlock(pos);
}

export function placeCoreIfMissing(blockType = DEFAULT_CORE_BLOCK) {
  try {
    const block = blockAt(CORE_BLOCK_POS);
    if (!block || block.typeId === "minecraft:air" || block.typeId === "minecraft:void_air") block?.setType(blockType);
  } catch (error) {
    logError("WorldInit", "core repair failed", error);
  }
}

export function initializeWorldIfNeeded() {
  if (getWorldBoolean(WORLD_PROPS.initialized, false)) return;
  setWorldBoolean(WORLD_PROPS.initialized, true);
  setWorldNumber(WORLD_PROPS.schemaVersion, 1);
  setWorldNumber(WORLD_PROPS.totalRefreshes, 0);
  setWorldNumber(WORLD_PROPS.stageId, 0);
  setWorldString(WORLD_PROPS.altarState, "reserved");
  setWorldBoolean(WORLD_PROPS.altarGenerated, false);
  setWorldBoolean(WORLD_PROPS.enteredNetherAny, false);
  setWorldBoolean(WORLD_PROPS.blazeProofAny, false);
  setWorldBoolean(WORLD_PROPS.dragonDefeated, false);
  saveGuarantees(DEFAULT_GUARANTEE_STATE);
  placeCoreIfMissing();
  logInfo("WorldInit", "world initialized");
}

export function initializePlayerIfNeeded(player) {
  if (getPlayerNumber(player, PLAYER_PROPS.balance, -1) >= 0) return;
  setPlayerNumber(player, PLAYER_PROPS.balance, DEFAULT_INITIAL_BALANCE);
  setPlayerNumber(player, PLAYER_PROPS.quizSetsCompleted, 0);
  setPlayerNumber(player, PLAYER_PROPS.quizCardsAnswered, 0);
  setPlayerNumber(player, PLAYER_PROPS.quizCorrect, 0);
  setPlayerNumber(player, PLAYER_PROPS.quizWrong, 0);
  setPlayerNumber(player, PLAYER_PROPS.lastAltarWarningTick, 0);
  player.sendMessage("§bAnki 单方块生存：破坏核心方块开始。余额用完后完成 5 题获得 5 次刷新。");
}

export function teleportPlayerToStartIfUnsafe(player) {
  if (player.dimension.id !== OVERWORLD_ID) return;
  if (player.location.y > 0 && Math.abs(player.location.x) < 32 && Math.abs(player.location.z) < 32) return;
  system.runTimeout(() => player.teleport(PLAYER_SPAWN_POS, { dimension: overworld() }), 1);
}

