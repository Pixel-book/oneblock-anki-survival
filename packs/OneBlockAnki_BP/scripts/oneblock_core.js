import { ItemStack, system } from "@minecraft/server";
import { CORE_BLOCK_POS, DEFAULT_CORE_BLOCK, PLAYER_PROPS, WORLD_PROPS } from "./constants.js";
import { openBalanceHelp } from "./anki_ui.js";
import { applyGuarantees, recordResource } from "./guarantee_manager.js";
import { logError, logDebug } from "./logger.js";
import { pick, STAGE_POOLS } from "./loot_tables.js";
import { maybeSpawnMob } from "./spawn_manager.js";
import { currentStage, updateStageAfterRefresh } from "./stage_manager.js";
import { getPlayerNumber, getWorldNumber, setPlayerNumber, setWorldNumber } from "./storage.js";
import { blockAt, placeCoreIfMissing, runOverworldCommand } from "./world_init.js";

let coreRefreshLock = false;
const UNSAFE_CORE_BLOCKS = new Set([
  "minecraft:gravel",
  "minecraft:sand",
  "minecraft:red_sand",
  "minecraft:white_concrete_powder",
  "minecraft:orange_concrete_powder",
  "minecraft:magenta_concrete_powder",
  "minecraft:light_blue_concrete_powder",
  "minecraft:yellow_concrete_powder",
  "minecraft:lime_concrete_powder",
  "minecraft:pink_concrete_powder",
  "minecraft:gray_concrete_powder",
  "minecraft:light_gray_concrete_powder",
  "minecraft:cyan_concrete_powder",
  "minecraft:purple_concrete_powder",
  "minecraft:blue_concrete_powder",
  "minecraft:brown_concrete_powder",
  "minecraft:green_concrete_powder",
  "minecraft:red_concrete_powder",
  "minecraft:black_concrete_powder"
]);

export function isCorePosition(location) {
  return location?.x === CORE_BLOCK_POS.x && location?.y === CORE_BLOCK_POS.y && location?.z === CORE_BLOCK_POS.z;
}

export function handleCoreBreakBefore(event) {
  if (!isCorePosition(event.block?.location)) return;
  try { event.cancel = true; } catch (error) {}
  system.run(() => tryRefreshCore(event.player));
}

export function handleCoreBreakAfter(event) {
  if (!isCorePosition(event.block?.location)) return;
  system.run(() => tryRefreshCore(event.player));
}

export function tryRefreshCore(player) {
  if (coreRefreshLock) return;
  coreRefreshLock = true;
  try {
    executeCoreRefresh(player);
  } catch (error) {
    logError("OneBlockCore", "Failed to refresh core.", error);
  } finally {
    system.runTimeout(() => { coreRefreshLock = false; }, 1);
  }
}

function executeCoreRefresh(player) {
  const balance = getPlayerNumber(player, PLAYER_PROPS.balance, 0);
  if (balance <= 0) {
    placeCoreIfMissing(safeBlockForCurrentStage());
    player.sendMessage("§e方块刷新余额不足。\n完成一套题可获得 5 次刷新余额。");
    openBalanceHelp(player);
    return;
  }
  setPlayerNumber(player, PLAYER_PROPS.balance, balance - 1);
  const total = getWorldNumber(WORLD_PROPS.totalRefreshes, 0) + 1;
  setWorldNumber(WORLD_PROPS.totalRefreshes, total);
  const stage = updateStageAfterRefresh(player, total);
  const pool = applyGuarantees(stage, STAGE_POOLS[stage.name] ?? STAGE_POOLS.tutorial);
  const blockId = pickSafeCoreBlock(pool.blocks);
  setCoreBlock(blockId);
  recordResource(blockId);
  maybeCreateChest(pool.chest);
  maybeSpawnMob(pool.mobs, stage);
  logDebug("OneBlockCore", `refresh=${total} stage=${stage.name} block=${blockId}`);
}

export function debugRefreshCoreWithoutPlayer() {
  const total = getWorldNumber(WORLD_PROPS.totalRefreshes, 0) + 1;
  setWorldNumber(WORLD_PROPS.totalRefreshes, total);
  const stage = updateStageAfterRefresh(undefined, total);
  const pool = applyGuarantees(stage, STAGE_POOLS[stage.name] ?? STAGE_POOLS.tutorial);
  const blockId = pickSafeCoreBlock(pool.blocks);
  const actualBlockId = setCoreBlock(blockId);
  recordResource(blockId);
  logDebug("OneBlockCore", `debug refresh=${total} stage=${stage.name} block=${blockId} actual=${actualBlockId}`);
  return { total, stage, blockId, actualBlockId };
}

function setCoreBlock(blockId) {
  const block = blockAt(CORE_BLOCK_POS);
  if (block) {
    block.setType(blockId);
    return block.typeId;
  }
  runOverworldCommand(`setblock ${CORE_BLOCK_POS.x} ${CORE_BLOCK_POS.y} ${CORE_BLOCK_POS.z} ${blockId}`, "OneBlockCore");
  return blockAt(CORE_BLOCK_POS)?.typeId ?? "missing";
}

function safeBlockForCurrentStage() {
  const pool = STAGE_POOLS[currentStage().name] ?? STAGE_POOLS.tutorial;
  return pool.blocks.find((block) => !block.includes("water") && !block.includes("lava") && !UNSAFE_CORE_BLOCKS.has(block)) ?? DEFAULT_CORE_BLOCK;
}

function pickSafeCoreBlock(blocks) {
  const safeBlocks = blocks.filter((block) => !UNSAFE_CORE_BLOCKS.has(block));
  return pick(safeBlocks.length ? safeBlocks : [DEFAULT_CORE_BLOCK]);
}

function maybeCreateChest(items) {
  if (!items.length || Math.random() > 0.08) return;
  try {
    const chestPos = { x: CORE_BLOCK_POS.x + 2, y: CORE_BLOCK_POS.y, z: CORE_BLOCK_POS.z };
    const chest = blockAt(chestPos);
    chest?.setType("minecraft:chest");
    const container = chest?.getComponent("inventory")?.container;
    for (let i = 0; i < Math.min(3, items.length); i += 1) {
      const itemId = pick(items);
      container?.addItem(new ItemStack(itemId, 1));
      recordResource(itemId);
    }
  } catch (error) {
    logError("OneBlockCore", "chest event failed", error);
  }
}
