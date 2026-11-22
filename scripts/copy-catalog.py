#!/usr/bin/env python3
"""Read-only catalogue validation or export of a filled V1 copy for review.
Never rewrites HTML/JS, activates contacts, or publishes a client site.
"""
import argparse
from collections import Counter
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
from urllib.parse import quote

ROOT=Path(__file__).resolve().parent.parent
VOID={'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
TOKEN=re.compile(r'\{\{([a-zA-Z0-9_.]+)(?:\|(upper|url))?\}\}')

class Inventory(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack=[];self.counts=[Counter()];self.texts=Counter();self.out=[]
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs);self.counts[-1][tag]+=1
        part=f'{tag}[{self.counts[-1][tag]}]'
        parent=self.stack[-1]['path'] if self.stack else ''
        path=f'{parent}/{part}'
        section=self.stack[-1]['section'] if self.stack else 'metadata'
        if tag in {'section','header','footer','dialog'} and attrs.get('id'):section=attrs['id']
        node={'tag':tag,'attrs':attrs,'path':path,'section':section}
        ancestors=self.stack+[node]
        classes=' '.join(n['attrs'].get('class','') for n in ancestors)
        if tag not in {'script','style','svg','path','stop'}:
            for key in ('aria-label','title'):
                if attrs.get(key):self.add(node,'attribute',key,attrs[key],classes)
            if tag=='meta' and attrs.get('content') and attrs.get('property') not in {'og:image','og:image:alt'} and attrs.get('name')!='twitter:image':
                if (attrs.get('name') in {'description','twitter:title','twitter:description'} or attrs.get('property') in {'og:site_name','og:title','og:description','og:url'}):self.add(node,'attribute','content',attrs['content'],classes)
            if tag=='link' and attrs.get('rel')=='canonical':self.add(node,'attribute','href',attrs['href'],classes)
            if tag=='a' and 'wa.me/' in attrs.get('href','') and 'footer-bottom__developer-link' not in classes:self.add(node,'attribute','href',attrs['href'],classes)
            if tag=='iframe':self.add(node,'attribute','src',attrs['src'],classes)
        if tag not in VOID:self.stack.append(node);self.counts.append(Counter())
    def handle_startendtag(self,tag,attrs):
        self.handle_starttag(tag,attrs)
        if tag not in VOID:self.handle_endtag(tag)
    def handle_endtag(self,tag):
        for i in range(len(self.stack)-1,-1,-1):
            if self.stack[i]['tag']==tag:
                del self.stack[i:];del self.counts[i+1:];break
    def handle_data(self,value):
        if not self.stack or not value.strip() or any(n['tag'] in {'script','style'} for n in self.stack):return
        node=self.stack[-1];classes=' '.join(n['attrs'].get('class','') for n in self.stack)
        self.texts[node['path']]+=1
        self.add(node,'text',str(self.texts[node['path']]),value,classes)
    def add(self,node,kind,key,value,classes):
        attrs=node['attrs'];tag=node['tag']
        role='content'
        if 'eyebrow' in classes:role='Eyebrow'
        elif tag in {'h1','h2','h3','h4','h5','h6'} or any(n['tag'] in {'h1','h2','h3','h4','h5','h6'} for n in self.stack):role='heading'
        elif 'volt-cta__' in classes or 'data-typography' in attrs and attrs['data-typography']=='cta' or 'btn' in classes:role='Copy do CTA'
        elif 'micro' in classes or attrs.get('data-typography')=='microcopy':role='Microcopy'
        elif 'review-marquee' in classes:role='testimonial-demonstration'
        elif kind=='attribute':role='accessibility-or-metadata'
        heading=next((n['tag'].upper() for n in reversed(self.stack+[node]) if n['tag'] in {'h1','h2','h3','h4','h5','h6'}),None)
        if heading and kind=='text':role=heading
        variants=[v for n in self.stack+[node] for k,v in n['attrs'].items() if k.endswith(('-copy','-variant'))]
        variant=variants[-1] if variants else ('short' if any(x in classes for x in ('__short','--compact','--short')) else 'regular')
        limits={k:v for n in self.stack+[node] for k,v in n['attrs'].items() if k.startswith(('data-min-','data-max-','data-mobile-','data-reserved-'))}
        self.out.append({'binding':{'file':'index.html','kind':kind,'path':node['path'],'key':key},'section':node['section'],'role':role,'variant':variant,'limits':limits,'context':classes,'text':value})

def leaves(value,path=''):
    if isinstance(value,dict):
        for k,v in value.items():yield from leaves(v,path+'/'+str(k).replace('~','~0').replace('/','~1'))
    elif isinstance(value,list):
        for k,v in enumerate(value):yield from leaves(v,path+'/'+str(k))
    elif isinstance(value,str):yield path,value

def inventory():
    raw=(ROOT/'index.html').read_text();p=Inventory();p.feed(raw);out=p.out
    ld=json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>',raw,re.S).group(1))
    for path,value in leaves(ld):
        if path.endswith('/image'):continue # owned by the asset generator
        out.append({'binding':{'file':'index.html','kind':'jsonld','path':path},'section':'metadata','role':'structured-data','variant':'regular','limits':{},'text':value})
    script=(ROOT/'volt-final.js').read_text()
    headings=json.loads(re.search(r'const voltHeadingCopies = (\{.*?\n\});',script,re.S).group(1))
    for path,value in leaves(headings):
        if '/variants/' not in path:continue
        out.append({'binding':{'file':'volt-final.js','kind':'responsive-heading','path':path},'section':path.split('/')[1],'role':'H2','variant':path.rsplit('/',1)[1],'limits':{'manual':'chapter 4'},'text':value})
    assets=json.loads((ROOT/'assets.json').read_text())
    for path,value in leaves(assets):
        if path.endswith('/alt') or path=='/siteUrl':out.append({'binding':{'file':'assets.json','kind':'json','path':path},'section':'assets','role':'asset-description-or-origin','variant':'regular','limits':{},'text':value})
    return out

def render(template,values):
    def sub(m):
        if m[1] not in values:raise ValueError('missing value: '+m[1])
        text=values[m[1]]
        if not isinstance(text,str) or not text.strip():raise ValueError('empty/non-string field: '+m[1])
        return text.upper() if m[2]=='upper' else quote(text,safe='') if m[2]=='url' else text
    result=TOKEN.sub(sub,template)
    if '{{' in result or '}}' in result:raise ValueError('unresolved/invalid token')
    return result

def check(catalog,data):
    if catalog['schemaVersion']!=1 or catalog['id']!='volt-copy-v1':raise ValueError('unknown copy contract')
    actual=inventory();entries=catalog['entries']
    if len(entries)!=len(actual):raise ValueError('catalogue coverage differs; inspect source changes before updating bindings')
    if set(data['values'])!=set(catalog['fields']):raise ValueError('data fields differ from the V1 registry')
    for expected,current in zip(entries,actual):
        variables=sorted({m[0] for m in TOKEN.findall(expected['template'])})
        if expected['variables']!=variables or not set(variables)<=set(catalog['fields']):raise ValueError('variable registry mismatch: '+expected['id'])
        for key in ('binding','section','role','variant','limits'):
            if expected[key]!=current[key]:raise ValueError('binding/role mismatch: '+expected['id'])
        if render(expected['template'],data['values'])!=current['text']:raise ValueError('source differs from V1: '+expected['id'])
    ids=[e['id'] for e in entries]
    if len(set(ids))!=len(ids):raise ValueError('duplicate slot id')
    return actual

def main(args):
    catalog=json.loads((ROOT/'copy/v1.json').read_text());demo=json.loads((ROOT/'copy/demo-data.json').read_text())
    check(catalog,demo)
    if args.data:
        if not args.output:raise ValueError('--data requires an explicit --output outside the repository')
        dest=Path(args.output).resolve()
        if dest.is_relative_to(ROOT):raise ValueError('store client output outside the reusable template repository')
        if dest.exists():raise ValueError('output exists; choose another path, do not overwrite evidence')
        data=json.loads(Path(args.data).read_text())
        allowed={'schemaVersion','copyId','mode','values','confirmedFields','confirmedDomains','evidence','approvedChanges'}
        if set(data)-allowed or data.get('schemaVersion')!=1:raise ValueError('unknown input schema/keys')
        if data.get('copyId')!=catalog['id'] or data.get('mode')!='review-only':raise ValueError('client data requires copyId and mode review-only')
        values=data.get('values',{})
        if set(values)!=set(catalog['fields']):raise ValueError('all registered fields required; no silent defaults or extras')
        if set(data.get('confirmedFields',[]))!=set(values):raise ValueError('confirm every supplied factual field; never inherit demonstration values silently')
        required=set(catalog['requiredConfirmations'])
        if set(data.get('confirmedDomains',[]))!=required:raise ValueError('confirm factual/commercial domains before preparing the review copy')
        evidence=data.get('evidence',{})
        for domain in ('reviews','rating'):
            if not isinstance(evidence.get(domain),str) or not evidence[domain].strip():raise ValueError('real source evidence is required for '+domain)
        for key,spec in catalog['fields'].items():
            value=values[key]
            if not isinstance(value,str) or not value.strip() or '{{' in value or '}}' in value:raise ValueError('invalid factual field: '+key)
            if spec.get('reviewRequiredOnChange') and value!=demo['values'][key] and key not in data.get('approvedChanges',[]):raise ValueError('changed policy/testimonial requires approvedChanges record: '+key)
        if not re.fullmatch(r'[1-9]\d{7,14}',values['contact.whatsapp_digits']):raise ValueError('WhatsApp must use 8-15 international digits, without punctuation')
        if not re.fullmatch(r'https://[^/?#\s]+/',values['site.origin']):raise ValueError('site.origin must be a confirmed HTTPS origin ending in /')
        for key in ('hours.weekdays_opens','hours.weekdays_closes','hours.saturday_opens','hours.saturday_closes'):
            if not re.fullmatch(r'(?:[01]\d|2[0-3]):[0-5]\d',values[key]):raise ValueError('time must be HH:MM: '+key)
        result={'copyId':catalog['id'],'status':'filled-for-review-not-published','notice':'Not an HTML/site generator. Review grammar, claims, responsive fit, demo states, real destinations and SEO before applying to a client. No visual limits may be changed to fit data.','requiresInstanceAdaptation':[e['id'] for e in catalog['entries'] if e['requiresInstanceAdaptation']],'entries':[dict(id=e['id'],section=e['section'],role=e['role'],variant=e['variant'],text=render(e['template'],values),binding=e['binding'],limits=e['limits']) for e in catalog['entries']]}
        dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
        print('OK: V1 filled for review; site and publication untouched')
    else:print(f'OK: V1; {len(catalog["entries"])} bindings; {len(catalog["fields"])} fields; current copy preserved')

if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--check',action='store_true');p.add_argument('--data');p.add_argument('--output')
    try:main(p.parse_args())
    except (ValueError,KeyError,TypeError,OSError) as e:sys.exit('STOP: '+str(e))
