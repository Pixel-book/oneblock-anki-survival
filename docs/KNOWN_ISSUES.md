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

