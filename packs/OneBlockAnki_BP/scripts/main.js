import { system, world } from "@minecraft/server";
import { VERSION } from "./constants.js";
import { handleAltarPlaceBefore, handleAltarProximityTick, noteDimensionChange, noteEntityDie, noteInventoryItem } from "./altar_zone.js";
import { handleExplosionAfter, handleExplosionBefore } from "./explosion_guard.js";
import { handleCoreBreakAfter, handleCoreBreakBefore } from "./oneblock_core.js";
import { sendStatus } from "./multiplayer_sync.js";
import { initializePlayerIfNeeded, initializeWorldIfNeeded, placeCoreIfMissing, teleportPlayerToStart, teleportPlayerToStartIfUnsafe } from "./world_init.js";

world.afterEvents.playerSpawn.subscribe((event) => {
  initializeWorldIfNeeded();
  initializePlayerIfNeeded(event.player);
  placeCoreIfMissing();
  if (event.initialSpawn) teleportPlayerToStart(event.player);
  else teleportPlayerToStartIfUnsafe(event.player);
});

system.run(() => {
  initializeWorldIfNeeded();
  placeCoreIfMissing();
  for (const player of world.getAllPlayers()) {
    initializePlayerIfNeeded(player);
    teleportPlayerToStart(player);
  }
});

for (const delay of [2, 10, 40, 100]) {
  system.runTimeout(() => {
    placeCoreIfMissing();
    for (const player of world.getAllPlayers()) teleportPlayerToStart(player);
  }, delay);
}

world.beforeEvents.playerBreakBlock?.subscribe(handleCoreBreakBefore);
world.afterEvents.playerBreakBlock?.subscribe(handleCoreBreakAfter);
world.beforeEvents.explosion?.subscribe(handleExplosionBefore);
world.afterEvents.explosion?.subscribe(handleExplosionAfter);
world.beforeEvents.playerPlaceBlock?.subscribe(handleAltarPlaceBefore);
world.afterEvents.playerDimensionChange?.subscribe(noteDimensionChange);
world.afterEvents.entityDie?.subscribe(noteEntityDie);
world.afterEvents.itemCompleteUse?.subscribe((event) => noteInventoryItem(event.source, event.itemStack));

system.runInterval(() => {
  placeCoreIfMissing();
  handleAltarProximityTick();
  for (const player of world.getAllPlayers()) {
    teleportPlayerToStartIfUnsafe(player);
    sendStatus(player);
  }
}, 20);

console.warn(`[OBA][INFO][Main] OneBlock Anki Survival ${VERSION} loaded.`);
