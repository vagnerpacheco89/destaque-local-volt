#!/usr/bin/env python3
"""VOLT: compile client colors without changing layout, images or copy.

Edit theme.json, run python3 scripts/build-theme.py, review the generated CSS.
--examples generates review fixtures; --check checks committed outputs.
Only explicit #RRGGBB colors are accepted. No dependencies or network access.
"""
import argparse
import json
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
DARK = (32, 39, 31)  # conservative dark text-bearing surface
EXAMPLES = {
    "azul": {"primary": "#164cba", "secondary": None},
    "vermelho": {"primary": "#8b1538", "secondary": None},
    "claro": {"primary": "#eeeeee", "secondary": None},
    "escuro": {"primary": "#101827", "secondary": None},
    "duas-cores": {"primary": "#164cba", "secondary": "#f47b20"},
}

def rgb(value):
    if not isinstance(value, str) or not re.fullmatch(r"#[0-9a-fA-F]{6}", value):
        raise ValueError("Use uma cor #RRGGBB; secondary pode ser null.")
    return tuple(int(value[i:i+2], 16) for i in (1, 3, 5))

def hx(color):
    return "#" + "".join(f"{v:02x}" for v in color)

def mix(a, b, weight):
    return tuple(round(x * (1-weight) + y * weight) for x, y in zip(a, b))

def luminance(color):
    values = [v/255 for v in color]
    linear = [v/12.92 if v <= .04045 else ((v+.055)/1.055)**2.4 for v in values]
    return sum(v*w for v, w in zip(linear, (.2126, .7152, .0722)))

def contrast(a, b):
    x, y = sorted((luminance(a), luminance(b)))
    return (y+.05)/(x+.05)

def readable(color, surface=DARK, minimum=4.5):
    for step in range(1001):
        candidate = mix(color, (255,255,255), step/1000)
        if contrast(candidate, surface) >= minimum + .02:
            return candidate
    raise ValueError("Não foi possível gerar uma variante legível.")

def ink_for(*surfaces):
    choices = ((9,10,8), (255,255,255), (0,0,0))
    valid = [c for c in choices if min(contrast(c, s) for s in surfaces) >= 4.5]
    if not valid:
        raise ValueError("A combinação exige revisão de contraste.")
    return valid[0]

def safe_gradient(color, ink, weight):
    # Move away from the foreground; never darken underneath dark ink.
    toward = (0,0,0) if ink == (255,255,255) else (255,255,255)
    return mix(color, toward, weight)

def compile_theme(config):
    if set(config) != {"primary", "secondary"}:
        raise ValueError("theme.json deve conter somente primary e secondary.")
    p = rgb(config["primary"])
    secondary = config["secondary"]
    if secondary is not None:
        rgb(secondary)
    s = rgb(secondary) if secondary is not None else p
    default = p == (244,196,0)
    ink = ink_for(p)
    hover = (255,214,51) if default else safe_gradient(p, ink, .12)
    end = (233,185,0) if default else safe_gradient(p, ink, .05)
    rating_end = (230,185,0) if default else safe_gradient(p, ink, .06)
    shield_top = (255,210,31) if default else safe_gradient(p, ink, .08)
    soft = (255,232,117) if default else mix(p, (255,255,255), .55)
    soft_hover = (255,240,157) if default else mix(p, (255,255,255), .7)
    soft_ink = ink_for(soft, soft_hover)
    soft_edge = (255,242,168) if default else mix(p, (255,255,255), .65)
    values = {
        "brand-primary": hx(p), "brand-primary-rgb": ",".join(map(str,p)),
        "brand-secondary": hx(s), "brand-secondary-rgb": ",".join(map(str,s)),
        "accent": hx(p), "accent-text": hx(readable(p)),
        "accent-hover": hx(hover), "accent-ink": hx(ink),
        "accent-ink-rgb": ",".join(map(str,ink)),
        "accent-fill-end": hx(end), "accent-rating-end": hx(rating_end),
        "accent-shield-top": hx(shield_top),
        "accent-soft": hx(soft), "accent-soft-hover": hx(soft_hover),
        "accent-soft-ink": hx(soft_ink), "accent-soft-edge": hx(soft_edge),
        "accent-control-edge": hx(readable(p)),
        "detail": hx(readable(s)),
        "accent-edge": "#d3aa00" if default else hx(mix(p,(0,0,0),.1)),
        "accent-rating-edge": "#e5b900" if default else hx(mix(p,(0,0,0),.07)),
        "accent-panel-end": "#efbb00" if default else hx(end),
        "accent-panel-edge": "#d1a300" if default else hx(mix(p,(0,0,0),.12)),
        "accent-border": "#75691c" if default else hx(mix(p,DARK,.55)),
        "accent-border-muted": "#6f651d" if default else hx(mix(p,DARK,.6)),
        "accent-border-soft": "#4a4420" if default else hx(mix(p,DARK,.73)),
        "accent-chip-edge": "#554d1f" if default else hx(mix(p,DARK,.67)),
        "accent-chip-ink": "#e2dfc9" if default else hx(mix(p,(255,255,255),.82)),
        "accent-coverage-edge": "#6d5d19" if default else hx(mix(p,DARK,.58)),
        "accent-panel-gloss": "rgba(0,0,0,.08)" if ink == (255,255,255) else "rgba(255,255,255,.08)",
    }
    # Keep low-emphasis copy readable on colored panels too.
    surfaces = [p,end,rating_end,shield_top]
    muted = next((mix(p,ink,i/100) for i in range(83,101)
                  if min(contrast(mix(p,ink,i/100),bg) for bg in surfaces) >= 4.52), ink)
    values["accent-ink-muted"] = hx(muted)
    checks = {
        "texto de destaque / escuro": contrast(rgb(values["accent-text"]),DARK),
        "detalhe / escuro": contrast(rgb(values["detail"]),DARK),
        "texto / primária e degradês": min(contrast(ink,c) for c in surfaces+[hover]),
        "apoio / painéis": min(contrast(muted,c) for c in surfaces),
        "texto / botão claro": min(contrast(soft_ink,c) for c in (soft,soft_hover)),
    }
    if min(checks.values()) < 4.5:
        raise ValueError("Falha de contraste: " + json.dumps(checks))
    declarations = "\n".join(f"  --{key}: {value};" for key,value in values.items())
    css = ("/* Gerado por scripts/build-theme.py a partir de theme.json. Não editar à mão. */\n"
           "/* Primária original nos fundos; variante legível nos textos. Base neutra fixa. */\n"
           "@layer volt-client-colors;\n:root {\n" + declarations + "\n}\n")
    return css, checks

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--examples", action="store_true")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    config = json.loads((ROOT/"theme.json").read_text())
    tasks = [(ROOT/"volt-theme.css",config)]
    if args.examples:
        tasks += [(ROOT/"theme-examples"/(name+".css"),cfg) for name,cfg in EXAMPLES.items()]
    for path,cfg in tasks:
        css, checks = compile_theme(cfg)
        if args.check:
            if not path.exists() or path.read_text() != css:
                raise ValueError(f"Regere o arquivo: {path.relative_to(ROOT)}")
        else:
            path.parent.mkdir(parents=True,exist_ok=True)
            path.write_text(css)
        print(path.relative_to(ROOT), json.dumps({k:round(v,3) for k,v in checks.items()},ensure_ascii=False))

if __name__ == "__main__":
    try:
        main()
    except (ValueError, TypeError, OSError, json.JSONDecodeError) as error:
        print("Tema não gerado:", error, file=sys.stderr)
        sys.exit(1)
