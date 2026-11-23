"""Approved color roles, applied only to generated client artifacts."""
from pathlib import Path
import re
TOKENS={'#e9b900':'accent-fill-end','#e6b900':'accent-rating-end','#d3aa00':'accent-edge','#e5b900':'accent-rating-edge','#ffe875':'accent-soft','#fff09d':'accent-soft-hover','#fff2a8':'accent-soft-edge','#d1a300':'accent-panel-edge','#efbb00':'accent-panel-end','#75691c':'accent-border','#6f651d':'accent-border-muted','#68601e':'accent-border-muted','#5f571e':'accent-border-muted','#5c5520':'accent-border-muted','#4a4420':'accent-border-soft','#554d1f':'accent-chip-edge','#6d5d19':'accent-coverage-edge','#e2dfc9':'accent-chip-ink'}
def migrate(css,final=False):
    css=re.sub(r'^  --accent(?:-hover|-ink)?:[^;]+;\n','',css,flags=re.M)
    css=re.sub(r'rgba\(244,\s*196,\s*0,\s*([^)]*)\)',r'rgba(var(--brand-primary-rgb),\1)',css)
    for raw,token in TOKENS.items():css=re.sub(re.escape(raw)+r'\b',f'var(--{token})',css,flags=re.I)
    css=re.sub(r'#f4c400\b','var(--accent)',css,flags=re.I)
    css=re.sub(r'(?<![\w-])color\s*:\s*var\(--accent\)','color:var(--accent-text)',css)
    if final:
        css=css.replace('linear-gradient(115deg,rgba(255,255,255,.08),transparent 42%),var(--accent)','linear-gradient(115deg,var(--accent-panel-gloss),transparent 42%),var(--accent)')
        css+='\n'+Path(__file__).with_name('color-layer.css').read_text()
    return css
