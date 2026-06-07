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
releases/oneblock-anki-survival-0.1.3-source.zip
```

## BDS Quick Acceptance

本地专用测试服默认地址：

```text
127.0.0.1:19172
```

常用验收命令：

```text
scriptevent oba:test status
scriptevent oba:test refresh
scriptevent oba:test refreshes 29
scriptevent oba:test stage 4
scriptevent oba:test_menu
```

`oba:test_menu` 需要玩家实体触发；没有玩家在线时，可用 `oba:test status/refresh/stage` 做专服命令行冒烟测试。

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
