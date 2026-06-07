import { world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { CORE_BLOCK_POS, PLAYER_PROPS, PLAYER_SPAWN_POS, WORLD_PROPS } from "./constants.js";
import { startQuiz } from "./anki_ui.js";
import { debugRefreshCoreWithoutPlayer } from "./oneblock_core.js";
import { STAGES } from "./stage_manager.js";
import { getPlayerNumber, getWorldNumber, getWorldString, setPlayerNumber, setWorldNumber } from "./storage.js";
import { initializePlayerIfNeeded, initializeWorldIfNeeded, placeCoreIfMissing, teleportPlayerToStart } from "./world_init.js";

export function diagnosticSummary() {
  return `refresh=${getWorldNumber(WORLD_PROPS.totalRefreshes, 0)} stage=${getWorldNumber(WORLD_PROPS.stageId, 0)} altar=${getWorldString(WORLD_PROPS.altarState, "reserved")}`;
}

function firstPlayer() {
  return world.getAllPlayers()[0];
}

function say(message) {
  const text = `[OBA][TEST] ${message}`;
  console.warn(text);
  try { world.sendMessage(`§d${text}`); } catch (error) {}
}

function playerSummary(player) {
  if (!player) return "player=none";
  const loc = player.location;
  return `player=${player.name} loc=${loc.x.toFixed(1)},${loc.y.toFixed(1)},${loc.z.toFixed(1)} balance=${getPlayerNumber(player, PLAYER_PROPS.balance, -1)}`;
}

export function runTestCommand(raw = "", source) {
  const parts = String(raw || "status").trim().split(/\s+/);
  const command = parts[0] || "status";
  const player = source?.typeId === "minecraft:player" ? source : firstPlayer();
  if (command === "help") {
    say("commands: status | core | refresh | tp | balance <n> | stage <n> | refreshes <n> | quiz | menu");
    return;
  }
  if (command === "status") {
    placeCoreIfMissing();
    let core = "unknown";
    try { core = world.getDimension("minecraft:overworld").getBlock(CORE_BLOCK_POS)?.typeId ?? "missing"; } catch (error) {}
    say(`${diagnosticSummary()} core=${core} ${playerSummary(player)}`);
    return;
  }
  if (command === "core") {
    initializeWorldIfNeeded();
    placeCoreIfMissing();
    say(`core repaired at ${CORE_BLOCK_POS.x},${CORE_BLOCK_POS.y},${CORE_BLOCK_POS.z}`);
    return;
  }
  if (command === "refresh") {
    placeCoreIfMissing();
    const result = debugRefreshCoreWithoutPlayer();
    say(`debug refresh ok total=${result.total} stage=${result.stage.name} block=${result.blockId} actual=${result.actualBlockId}`);
    return;
  }
  if (command === "tp") {
    if (!player) return say("no player to teleport");
    initializePlayerIfNeeded(player);
    teleportPlayerToStart(player);
    say(`teleported ${player.name} to ${PLAYER_SPAWN_POS.x},${PLAYER_SPAWN_POS.y},${PLAYER_SPAWN_POS.z}`);
    return;
  }
  if (command === "balance") {
    if (!player) return say("no player for balance");
    const value = Number(parts[1] ?? 20);
    setPlayerNumber(player, PLAYER_PROPS.balance, Number.isFinite(value) ? value : 20);
    say(`balance set: ${player.name}=${getPlayerNumber(player, PLAYER_PROPS.balance, 0)}`);
    return;
  }
  if (command === "stage") {
    const value = Number(parts[1] ?? 0);
    const stage = STAGES.find((item) => item.id === value) ?? STAGES[0];
    setWorldNumber(WORLD_PROPS.stageId, stage.id);
    setWorldNumber(WORLD_PROPS.totalRefreshes, Math.max(stage.min, 0));
    say(`stage set: ${stage.id} ${stage.name}, refreshes=${getWorldNumber(WORLD_PROPS.totalRefreshes, 0)}`);
    return;
  }
  if (command === "refreshes") {
    const value = Number(parts[1] ?? 0);
    setWorldNumber(WORLD_PROPS.totalRefreshes, Number.isFinite(value) ? value : 0);
    say(`refreshes set: ${getWorldNumber(WORLD_PROPS.totalRefreshes, 0)}`);
    return;
  }
  if (command === "quiz") {
    if (!player) return say("no player for quiz");
    startQuiz(player);
    say(`opened quiz for ${player.name}`);
    return;
  }
  if (command === "menu") {
    if (!player) return say("no player for menu");
    openTestMenu(player);
    say(`opened test menu for ${player.name}`);
    return;
  }
  say(`unknown command: ${command}`);
}

export async function openTestMenu(player) {
  const result = await new ActionFormData()
    .title("OneBlock 测试菜单")
    .body(`${diagnosticSummary()}\n${playerSummary(player)}`)
    .button("修复核心")
    .button("传送到核心")
    .button("余额设为 20")
    .button("开始 Anki 测试题")
    .button("输出状态到日志")
    .show(player);
  if (result.canceled) return;
  if (result.selection === 0) return runTestCommand("core", player);
  if (result.selection === 1) return runTestCommand("tp", player);
  if (result.selection === 2) return runTestCommand("balance 20", player);
  if (result.selection === 3) return runTestCommand("quiz", player);
  if (result.selection === 4) return runTestCommand("status", player);
}
