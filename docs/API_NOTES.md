# API Notes

Official references checked:

1. Microsoft Pack Manifest Documentation.
2. Microsoft Add-Ons manifest examples.
3. Microsoft Data Driven Overworld Height and Void Generation.
4. Microsoft Script API World, Entity, server-ui ActionFormData, PlayerBreakBlock events, Explosion events, and multiplayer scripting notes.

## Decisions

1. `dimensions/overworld.json` uses `generator_type: "void"` only for Overworld. No Nether or The End dimension files are included.
2. `ActionFormData` is used for quiz forms because it is the stable simple button UI.
3. Dynamic properties are read and written only through `storage.js`.
4. `playerBreakBlock` uses before-event cancellation when available and after-event repair fallback.
5. `explosion` uses before-event impacted block filtering when available and after-event core repair fallback.
6. Blaze proof uses item-use observation as a best-effort first version. If a runtime cannot detect blaze rod or blaze powder reliably, altar unlock can be changed to total refreshes plus Nether entry plus quiz count in a future patch.

