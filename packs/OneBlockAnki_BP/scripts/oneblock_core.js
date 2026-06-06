import { ItemStack, system } from "@minecraft/server";
import { CORE_BLOCK_POS, DEFAULT_CORE_BLOCK, PLAYER_PROPS, WORLD_PROPS } from "./constants.js";
import { openBalanceHelp } from "./anki_ui.js";
import { applyGuarantees, recordResource } from "./guarantee_manager.js";
import { logError, logDebug } from "./logger.js";
import { pick, STAGE_POOLS } from "./loot_tables.js";
import { maybeSpawnMob } from "./spawn_manager.js";
import { currentStage, updateStageAfterRefresh } from "./stage_manager.js";
import { getPlayerNumber, getWorldNumber, setPlayerNumber, setWorldNumber } from "./storage.js";
import { blockAt, placeCoreIfMissing } from "./world_init.js";

let coreRefreshLock = false;

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
  const blockId = pick(pool.blocks);
  blockAt(CORE_BLOCK_POS)?.setType(blockId);
  recordResource(blockId);
  maybeCreateChest(pool.chest);
  maybeSpawnMob(pool.mobs, stage);
  logDebug("OneBlockCore", `refresh=${total} stage=${stage.name} block=${blockId}`);
}

function safeBlockForCurrentStage() {
  const pool = STAGE_POOLS[currentStage().name] ?? STAGE_POOLS.tutorial;
  return pool.blocks.find((block) => !block.includes("water") && !block.includes("lava")) ?? DEFAULT_CORE_BLOCK;
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

