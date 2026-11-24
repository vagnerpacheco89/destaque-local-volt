"""Explicit approved Hero benefits, with client-specific factual confirmation."""
import json,re
from pathlib import Path
from lxml import etree

SLOTS={'hero.content.'+str(n).zfill(3) for n in range(4,12)}

def bank(root=None):
    root=Path(root) if root else Path(__file__).resolve().parents[2]
    return json.loads((root/'copy/hero-benefits.json').read_text())

def validate_selection(config,root=None):
    library=bank(root);entries={x['id']:x for x in library['entries']};selected=config.get('heroBenefits')
    if not isinstance(selected,list) or len(selected)!=4:raise ValueError('heroBenefits: select exactly four confirmed benefits; demonstration values are never defaults')
    ids=[];resolved=[]
    for choice in selected:
        if not isinstance(choice,dict) or set(choice)!={'id','parameters','confirmation'}:raise ValueError('heroBenefits: id, parameters and confirmation required')
        identifier=choice['id']
        if not isinstance(identifier,str) or identifier not in entries:raise ValueError('heroBenefits: unknown approved ID')
        if identifier in ids:raise ValueError('heroBenefits: duplicate benefit')
        source=choice['confirmation']
        if not isinstance(source,str) or not source.strip() or any(ord(c)<32 for c in source):raise ValueError('heroBenefits: factual confirmation source required for each selected benefit')
        entry=entries[identifier];params=choice['parameters'];expected=entry['parameters']
        if not isinstance(params,dict) or set(params)!=set(expected):raise ValueError('heroBenefits: missing or unknown parameters for '+identifier)
        text=entry['text']
        for key,kind in expected.items():
            value=params[key]
            if isinstance(value,bool) or not re.fullmatch(r'\d{1,4}',str(value)):raise ValueError('heroBenefits: confirmed integer required for '+key)
            n=int(value)
            if kind=='integer-year' and (n!=config.get('experience',{}).get('since') or not 1900<=n<=config.get('publication',{}).get('copyrightYear',0)):raise ValueError('heroBenefits: year must match confirmed experience.since')
            if kind=='integer-installments' and not 2<=n<=99:raise ValueError('heroBenefits: confirmed installment count 2-99 required')
            text=text.replace('{{'+key+'}}',str(n))
        if identifier in ('orcamento_previo','aprovacao_previa') and config.get('policies',{}).get('quoteBeforeWork') is not True:raise ValueError('heroBenefits: prior quote/approval policy required')
        if identifier=='materiais_combinados' and config.get('policies',{}).get('materialsBeforeWork') is not True:raise ValueError('heroBenefits: materials policy required')
        if identifier=='sabados' and config.get('hours',{}).get('saturday') is None:raise ValueError('heroBenefits: confirmed Saturday hours required')
        ids.append(identifier);resolved.append((entry,text))
    if any(set(entries[i]['excludes'])&set(ids) for i in ids):raise ValueError('heroBenefits: redundant alternatives cannot occupy two slots')
    if SLOTS&set(config.get('copyOverrides',{})):raise ValueError('heroBenefits: use approved selections, not copyOverrides for these slots')
    return resolved

def apply(dom,config,root):
    resolved=validate_selection(config,root);icons=bank(root)['icons'];grids=dom.cssselect('.hero__trust-grid')
    if len(grids)!=2:raise ValueError('heroBenefits: both responsive grids required')
    for grid in grids:
        cards=grid.cssselect('.hero__trust-card')
        if len(cards)!=4:raise ValueError('heroBenefits: four existing cards required')
        for card,(entry,text) in zip(cards,resolved):
            card.set('data-hero-benefit',entry['id']);p=card.cssselect('.hero__trust-title')[0]
            for node in list(p):p.remove(node)
            p.text=text;svg=card.cssselect('svg')[0]
            for node in list(svg):svg.remove(node)
            fragment=etree.fromstring(('<svg>'+icons[entry['icon']]+'</svg>').encode())
            for node in fragment:svg.append(node)
