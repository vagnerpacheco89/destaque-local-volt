#!/usr/bin/env python3
"""Review-only asset selection. Configure assets.json, run, then --check.

Concepts use the same fixed layout. Supply transparent PNGs without baked-in
text or backdrops for both named slots. Missing concepts stop the build.
No changes to copy, colors, gallery, layout limits or the official manual.
"""
import argparse
import html
import json
from pathlib import Path
import re
import struct
import sys

ROOT = Path(__file__).resolve().parent.parent


def build(check):
    config = json.loads((ROOT / 'assets.json').read_text())
    if config.get('schemaVersion') != 1:
        raise ValueError('Unsupported schemaVersion')
    name = config['activeConcept']
    slots = config['concepts'].get(name)
    if not slots or set(slots) != {'hero', 'about'}:
        raise ValueError(f'Concept {name!r} needs exactly hero and about; no fallback')
    output = (ROOT / 'index.html').read_text()
    for slot, asset in slots.items():
        path = (ROOT / asset['src']).resolve()
        if not path.is_relative_to(ROOT / 'assets') or not path.is_file():
            raise ValueError(f'{slot}: expected existing local asset under assets/')
        raw = path.read_bytes()
        if raw[:8] != b'\x89PNG\r\n\x1a\n' or raw[25] != 6:
            raise ValueError(f'{slot}: this review requires RGBA PNG with transparency')
        width, height = struct.unpack('>II', raw[16:24])
        if width < 1000 or height < 1200:
            raise ValueError(f'{slot}: source too small; minimum 1000 x 1200 px')
        if not asset.get('alt', '').strip():
            raise ValueError(f'{slot}: alt must describe the illustration')
        pattern = rf'<img\b[^>]*data-asset-slot="{slot}"[^>]*>'
        if len(re.findall(pattern, output)) != 1:
            raise ValueError(f'{slot}: expected exactly one HTML slot')
        extra = 'fetchpriority="high"' if slot == 'hero' else 'loading="lazy"'
        tag = (f'<img data-asset-slot="{slot}" src="{html.escape(asset["src"], quote=True)}" '
               f'width="{width}" height="{height}" alt="{html.escape(asset["alt"], quote=True)}" '
               f'{extra} decoding="async" />')
        output = re.sub(pattern, lambda _: tag, output)
    current = (ROOT / 'index.html').read_text()
    if check and output != current:
        raise ValueError('HTML differs from assets.json; run scripts/build-assets.py')
    if not check:
        (ROOT / 'index.html').write_text(output)
    print(f'OK: {name}; hero + about; {"verified" if check else "generated"}')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    try:
        build(args.check)
    except (KeyError, ValueError, OSError, struct.error) as exc:
        sys.exit(f'STOP: {exc}')
