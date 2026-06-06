#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BP = ROOT / "packs" / "OneBlockAnki_BP"

REQUIRED = [
    "README.md",
    "README_DEV.md",
    "CHANGELOG.md",
    "LICENSE",
    "docs/DEV_LOG.md",
    "docs/TODO.md",
    "docs/KNOWN_ISSUES.md",
    "docs/API_NOTES.md",
    "docs/TEST_REPORT.md",
    "docs/BALANCE_TABLE.md",
    "docs/STAGE_DESIGN.md",
    "docs/ANKI_SCHEMA.md",
    "docs/RELEASE_CHECKLIST.md",
    "packs/OneBlockAnki_BP/manifest.json",
    "packs/OneBlockAnki_BP/pack_icon.png",
    "packs/OneBlockAnki_BP/dimensions/overworld.json",
    "packs/OneBlockAnki_BP/scripts/main.js",
    "packs/OneBlockAnki_BP/scripts/constants.js",
    "packs/OneBlockAnki_BP/scripts/storage.js",
    "packs/OneBlockAnki_BP/scripts/oneblock_core.js",
    "packs/OneBlockAnki_BP/scripts/anki_ui.js",
    "packs/OneBlockAnki_BP/texts/en_US.lang",
    "packs/OneBlockAnki_BP/texts/zh_CN.lang",
]

def fail(message: str) -> None:
    print(f"[VALIDATE] FAIL: {message}")
    sys.exit(1)

def main() -> None:
    for rel in REQUIRED:
        if not (ROOT / rel).exists():
            fail(f"missing {rel}")
    if (BP / "dimensions" / "nether.json").exists() or (BP / "dimensions" / "the_end.json").exists():
        fail("nether/the_end dimension files must not exist")
    manifest = json.loads((BP / "manifest.json").read_text(encoding="utf-8"))
    uuids = [manifest["header"]["uuid"]] + [module["uuid"] for module in manifest["modules"]]
    if any(not re.fullmatch(r"[0-9a-fA-F-]{36}", value) for value in uuids):
        fail("manifest contains invalid UUID")
    if len(set(uuids)) != len(uuids):
        fail("manifest UUIDs must be unique")
    overworld = json.loads((BP / "dimensions" / "overworld.json").read_text(encoding="utf-8"))
    generation = overworld["minecraft:dimension"]["components"]["minecraft:generation"]
    if generation.get("generator_type") != "void":
        fail("overworld generator_type must be void")
    main_js = (BP / "scripts" / "main.js").read_text(encoding="utf-8")
    if len(main_js.splitlines()) > 120:
        fail("scripts/main.js must not exceed 120 lines")
    print("[VALIDATE] Structure checks passed.")

if __name__ == "__main__":
    main()

