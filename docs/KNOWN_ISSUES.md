# Known Issues

## ISSUE-001 Player-client UI verification pending

状态：open
影响：medium
模块：anki_ui / multiplayer_sync / other

### Description
BDS command-line smoke testing passes for clean world startup, core placement, refresh, stage progression, and basic explosion survival. Player-client form UI, first-person spawn feel, two-player simultaneous mining, and long-form progression still need manual in-game verification.

### Reproduction
Join `127.0.0.1:19172` or import `OneBlockAnki_Addon.mcaddon` into a local Minecraft world, then run through Anki quiz, zero-balance prompt, test menu, and two-player core mining.

### Expected
Player starts on the core, UI opens correctly, quiz rewards balance, and multiplayer state remains separated per player/shared per world.

### Actual
BDS path verified; player-client UI path pending.

### Notes
Use `scriptevent oba:test_menu` from an operator player to open the quick test menu.

## ISSUE-002 Old 0.1.0 pack cache may remain after import

状态：open
影响：low
模块：other

### Description
Minecraft may keep the earlier 0.1.0 import in storage even after a new 0.1.1 package is imported.

### Reproduction
Import 0.1.0, then import 0.1.1 without deleting old pack entries.

### Expected
Only the 0.1.1 behavior/resource pack pair is visible.

### Actual
Older pack entries may still appear until manually deleted from Minecraft storage.

### Notes
0.1.1 rotates UUIDs and includes both BP/RP in the `.mcaddon`; deleting stale 0.1.0 entries is recommended before re-importing.
