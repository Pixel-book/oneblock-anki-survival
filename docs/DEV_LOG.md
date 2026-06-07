# Dev Log

## 2026-06-06 08:30

### Changed
1. Created OneBlock Anki Survival 0.1.0 project skeleton.
2. Added void Overworld behavior pack, modular scripts, Anki quiz UI, refresh balance, stage pools, guarantee manager, safe spawn, explosion guard, and altar zone.
3. Added build, validation, release, and documentation files.

### Why
1. The project must be independent from MCAnki2.0 and follow the OneBlock specification strictly.

### Files
1. `packs/OneBlockAnki_BP`
2. `tools`
3. `docs`

### Risk
1. Real Bedrock event shape may vary by stable runtime; fallback paths are documented in API notes.

### Test
1. Static structure and package validation planned.
2. Real Bedrock world import still needs manual in-game verification.

## 2026-06-06 09:20

### Changed
1. Rotated all OneBlock behavior/resource pack UUIDs for 0.1.1.
2. Added `OneBlockAnki_RP` and made the behavior pack depend on its header UUID.
3. Updated the build so `OneBlockAnki_Addon.mcaddon` contains both BP and RP folders.
4. Extended validation to reject missing RP files or missing BP to RP dependency.

### Why
1. The first package could conflict with previously imported UUIDs and did not automatically import a resource pack.

### Files
1. `packs/OneBlockAnki_BP/manifest.json`
2. `packs/OneBlockAnki_RP`
3. `tools/build_pack.py`
4. `tools/validate_structure.py`
5. `README.md`
6. `README_DEV.md`
7. `CHANGELOG.md`
8. `docs/RELEASE_CHECKLIST.md`

### Risk
1. Existing 0.1.0 imports may remain cached in Minecraft storage until the user deletes the old pack entries.

### Test
1. Structure validation and package contents will be checked before release.
2. Real Bedrock import still needs manual in-game verification.

## 2026-06-06 10:10

### Changed
1. Fixed initial spawn safety so players are teleported to the core after first load.
2. Added early repeated core repair checks after script startup.
3. Updated package version to 0.1.2.

### Why
1. A void world can spawn the player near origin but without support; the previous safety check treated that as safe.

### Files
1. `packs/OneBlockAnki_BP/scripts/main.js`
2. `packs/OneBlockAnki_BP/scripts/world_init.js`
3. `packs/OneBlockAnki_BP/scripts/constants.js`

### Risk
1. During the first few seconds after import, players near the start area may be snapped to the core to prevent falling.

### Test
1. Static structure validation passed.
2. Script syntax checks passed.
3. Real Bedrock import still needs manual in-game verification.

## 2026-06-07 10:45

### Changed
1. Added BDS test harness support through `oba:test` and `oba:test_menu` script events.
2. Made world startup create the core ticking area and world spawn through the available stable command API.
3. Removed repeated background player teleports after startup so void deaths are not silently prevented.
4. Filtered gravity-affected blocks out of direct core generation and moved gravel/sand/flint access to safe chest and guarantee paths.
5. Updated package version to 0.1.3.

### Why
1. Clean BDS worlds were able to load the script while the origin chunk stayed unavailable, causing the initial core to be missing.
2. Sand and gravel generated as a one-block core can fall into the void before the player can collect them.
3. The earlier rescue loop made testing easier but made survival behavior feel wrong.

### Files
1. `packs/OneBlockAnki_BP/scripts/world_init.js`
2. `packs/OneBlockAnki_BP/scripts/oneblock_core.js`
3. `packs/OneBlockAnki_BP/scripts/diagnostics.js`
4. `packs/OneBlockAnki_BP/scripts/main.js`
5. `packs/OneBlockAnki_BP/scripts/loot_tables.js`
6. `packs/OneBlockAnki_BP/scripts/guarantee_manager.js`
7. `packs/OneBlockAnki_BP/manifest.json`
8. `packs/OneBlockAnki_RP/manifest.json`

### Risk
1. Player-client UI flows still need a human join to confirm form rendering and first-person feel.
2. Existing imported 0.1.0 packs may still need manual deletion from Minecraft storage.

### Test
1. `node --check` passed for all behavior-pack scripts.
2. `tools/validate_structure.py` passed.
3. Clean BDS world created `oba_core` ticking area automatically.
4. Clean BDS world reported `core=minecraft:grass_block`.
5. Debug refresh reached plains and ocean stages with actual core blocks staying in place.
6. Nearby TNT and creeper summons did not remove the core during BDS smoke testing.
