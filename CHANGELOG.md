# Changelog

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
