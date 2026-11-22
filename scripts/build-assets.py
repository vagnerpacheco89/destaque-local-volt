#!/usr/bin/env python3
"""Approved asset selection. Configure assets.json, run, then --check.

Concepts use the same fixed layout. Hero requires a complete landscape scene,
with large character on the right and quiet left for HTML copy. About uses a
transparent portrait. Never substitute a portrait for the hero background.
No baked-in text. Missing concepts stop the build.
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


def dimensions(raw):
    if raw[:8] == b'\x89PNG\r\n\x1a\n':
        return struct.unpack('>II', raw[16:24])
    if raw[:4] == b'RIFF' and raw[8:12] == b'WEBP':
        kind = raw[12:16]
        if kind == b'VP8 ' and raw[23:26] == b'\x9d\x01\x2a':
            w, h = struct.unpack('<HH', raw[26:30])
            return w & 16383, h & 16383
        if kind == b'VP8X':
            return (int.from_bytes(raw[24:27], 'little') + 1,
                    int.from_bytes(raw[27:30], 'little') + 1)
    raise ValueError('Expected PNG or VP8/VP8X WebP')


def build(check):
    config = json.loads((ROOT / 'assets.json').read_text())
    if config.get('schemaVersion') != 2:
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
        width, height = dimensions(raw)
        if slot == 'hero':
            if asset.get('kind') != 'background' or width < 1600 or height < 900 or width / height < 1.5:
                raise ValueError('hero: complete landscape background required, minimum 1600 x 900; no portrait')
        elif asset.get('kind') != 'portrait' or width < 1000 or height < 1200:
            raise ValueError('about: portrait required, minimum 1000 x 1200')
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
    css = ':root { --volt-hero-background: url(' + json.dumps(slots['hero']['src']) + '); }\n'
    css_path = ROOT / 'volt-assets.css'
    if check and (output != current or not css_path.exists() or css_path.read_text() != css):
        raise ValueError('HTML/CSS differs from assets.json; run scripts/build-assets.py')
    if not check:
        (ROOT / 'index.html').write_text(output)
        css_path.write_text(css)
    print(f'OK: {name}; hero + about; {"verified" if check else "generated"}')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    try:
        build(args.check)
    except (KeyError, ValueError, OSError, struct.error) as exc:
        sys.exit(f'STOP: {exc}')
