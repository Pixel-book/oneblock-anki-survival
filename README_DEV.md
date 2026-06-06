# Developer Notes

This project targets Minecraft Bedrock stable Script API with a behavior pack.

## Build

```bash
python tools/validate_structure.py
python tools/build_pack.py
```

Outputs:

```text
releases/OneBlockAnki_BP.mcpack
releases/OneBlockAnki_RP.mcpack
releases/OneBlockAnki_Addon.mcaddon
releases/oneblock-anki-survival-0.1.2-source.zip
```

## Architecture

`packs/OneBlockAnki_BP/scripts/main.js` is only the entrypoint. Game systems live in separate modules:

- `storage.js`: dynamic properties
- `world_init.js`: world/player setup
- `oneblock_core.js`: core refresh
- `anki_ui.js`: quiz UI
- `stage_manager.js`: stage calculation
- `guarantee_manager.js`: soft/hard pity
- `spawn_manager.js`: safe mob spawning
- `explosion_guard.js`: core explosion protection
- `altar_zone.js`: reserved end altar area

`packs/OneBlockAnki_RP` is packaged into the `.mcaddon` alongside the behavior pack. The behavior pack manifest depends on the resource pack header UUID so Bedrock imports them together.
