import { CORE_BLOCK_POS } from "./constants.js";
import { recordResource } from "./guarantee_manager.js";
import { logError } from "./logger.js";
import { overworld } from "./world_init.js";

const SPAWN_OFFSETS = [
  { x: 5, z: 0 },
  { x: -5, z: 0 },
  { x: 0, z: 5 },
  { x: 0, z: -5 }
];

export function maybeSpawnMob(mobs, stage) {
  if (!mobs.length || Math.random() > 0.16) return;
  const filtered = stage.id < 5 ? mobs.filter((mob) => mob !== "minecraft:creeper") : mobs;
  if (!filtered.length) return;
  const mobId = filtered[Math.floor(Math.random() * filtered.length)];
  const offset = SPAWN_OFFSETS[Math.floor(Math.random() * SPAWN_OFFSETS.length)];
  const base = { x: CORE_BLOCK_POS.x + offset.x, y: CORE_BLOCK_POS.y - 1, z: CORE_BLOCK_POS.z + offset.z };
  try {
    const dim = overworld();
    for (let dx = -1; dx <= 1; dx += 1) {
      for (let dz = -1; dz <= 1; dz += 1) dim.getBlock({ x: base.x + dx, y: base.y, z: base.z + dz })?.setType("minecraft:stone");
    }
    dim.spawnEntity(mobId, { x: base.x + 0.5, y: base.y + 1, z: base.z + 0.5 });
    recordResource(mobId);
  } catch (error) {
    logError("SpawnManager", `failed to spawn ${mobId}`, error);
  }
}

