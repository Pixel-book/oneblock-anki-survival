#!/usr/bin/env python3
from __future__ import annotations

import shutil
import subprocess
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BP = ROOT / "packs" / "OneBlockAnki_BP"
RP = ROOT / "packs" / "OneBlockAnki_RP"
RELEASES = ROOT / "releases"
VERSION = "0.1.1"

def zip_dir(source: Path, target: Path, prefix: str = "") -> None:
    with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED) as archive:
        for file in source.rglob("*"):
            if file.is_file():
                name = Path(prefix) / file.relative_to(source)
                archive.write(file, name.as_posix())

def source_zip(target: Path) -> None:
    with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED) as archive:
        for file in ROOT.rglob("*"):
            rel = file.relative_to(ROOT)
            if file.is_dir() or rel.parts[0] in {".git", "releases"}:
                continue
            archive.write(file, rel.as_posix())

def addon_zip(target: Path) -> None:
    with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED) as archive:
        for pack, prefix in ((BP, "OneBlockAnki_BP"), (RP, "OneBlockAnki_RP")):
            for file in pack.rglob("*"):
                if file.is_file():
                    name = Path(prefix) / file.relative_to(pack)
                    archive.write(file, name.as_posix())

def main() -> None:
    print("[BUILD] Checking pack structure...")
    subprocess.run([sys.executable, str(ROOT / "tools" / "validate_structure.py")], check=True)
    print("[BUILD] Creating releases directory...")
    RELEASES.mkdir(exist_ok=True)
    for file in RELEASES.glob("*"):
        if file.name != ".gitkeep":
            if file.is_dir():
                shutil.rmtree(file)
            else:
                file.unlink()
    print("[BUILD] Creating OneBlockAnki_BP.mcpack...")
    zip_dir(BP, RELEASES / "OneBlockAnki_BP.mcpack")
    print("[BUILD] Creating OneBlockAnki_RP.mcpack...")
    zip_dir(RP, RELEASES / "OneBlockAnki_RP.mcpack")
    print("[BUILD] Creating OneBlockAnki_Addon.mcaddon...")
    addon_zip(RELEASES / "OneBlockAnki_Addon.mcaddon")
    print("[BUILD] Creating source zip...")
    source_zip(RELEASES / f"oneblock-anki-survival-{VERSION}-source.zip")
    print("[BUILD] Done.")

if __name__ == "__main__":
    main()
