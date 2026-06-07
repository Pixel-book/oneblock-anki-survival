# Changelog

## 0.1.3

- Added BDS-focused `/scriptevent` diagnostics and a lightweight in-game test menu entry.
- Fixed clean dedicated-server startup so the core ticking area and initial core block are created without manual commands.
- Stopped repeated background teleports so falling into the void can behave normally after the first safe spawn.
- Removed gravity-affected blocks from direct core generation and moved gravel/sand/flint access into safe chest/guarantee paths.
- Verified clean BDS startup, core refresh, stage progression, ocean/plains core stability, and core survival after nearby TNT/creeper summon.

## 0.1.2

- Fixed first spawn safety: the core block is repaired immediately after script load.
- Initial players are teleported to the core block instead of being treated as safe while falling in the void.
- Added repeated early repair checks for slow Bedrock world initialization.

## 0.1.1

- Rotated OneBlock behavior/resource pack UUIDs to avoid import conflicts with the first test build.
- Added `OneBlockAnki_RP` resource pack.
- Updated `.mcaddon` packaging so the behavior pack and resource pack import together.

## 0.1.0

- Added void overworld behavior pack.
- Added one block core refresh balance.
- Added Anki 5-card quiz reward loop.
- Added staged block/chest/mob pools.
- Added basic invisible guarantee system.
- Added safe mob spawn, explosion guard, and end altar reserved zone.
