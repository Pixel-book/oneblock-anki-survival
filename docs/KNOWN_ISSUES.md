# Known Issues

## ISSUE-001 Real Bedrock runtime verification pending

状态：open
影响：medium
模块：other

### Description
Static package validation and build pass locally, but a new Bedrock world import/playthrough must still be verified manually.

### Reproduction
Import `OneBlockAnki_Addon.mcaddon` into a new world and run through T001-T022.

### Expected
World loads as void Overworld with one block survival loop.

### Actual
Pending manual test.

### Notes
Stable Script API event availability can vary by Minecraft version.

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
