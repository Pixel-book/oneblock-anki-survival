import { CORE_BLOCK_POS, CORE_EXPLOSION_GUARD_RADIUS } from "./constants.js";
import { logError, logWarn } from "./logger.js";
import { placeCoreIfMissing } from "./world_init.js";

export function isInsideCoreProtectedArea(location) {
  const dx = location.x - CORE_BLOCK_POS.x;
  const dy = location.y - CORE_BLOCK_POS.y;
  const dz = location.z - CORE_BLOCK_POS.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz) <= CORE_EXPLOSION_GUARD_RADIUS;
}

export function handleExplosionBefore(event) {
  try {
    const impacted = event.getImpactedBlocks();
    event.setImpactedBlocks(impacted.filter((block) => !isInsideCoreProtectedArea(block.location)));
  } catch (error) {
    logWarn("ExplosionGuard", "Explosion filtering failed; scheduling core repair.");
    placeCoreIfMissing();
  }
}

export function handleExplosionAfter() {
  try { placeCoreIfMissing(); } catch (error) { logError("ExplosionGuard", "post explosion repair failed", error); }
}

