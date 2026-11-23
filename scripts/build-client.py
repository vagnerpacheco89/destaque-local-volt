#!/usr/bin/env python3
"""VOLT client builder. Private configuration -> isolated public site + private report.

Never publishes or overwrites a matrix/client folder. --check rebuilds and compares.
--release-check additionally requires a matching passing browser QA report.
"""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
from PIL import Image,ImageOps
from lxml import html,etree
from client.schema import validate,InvalidClient
from client.render import prepare_client,load_module
from client.colors import migrate

ROOT=Path(__file__).resolve().parent.parent

def sha(raw):return hashlib.sha256(raw).hexdigest()
def source_hash():
    files=['index.html','styles.css','volt-final.css','volt-final.js','copy/v1.json','copy/demo-data.json','assets.json','scripts/build-assets.py','scripts/build-theme.py','scripts/build-client.py']+[str(p.relative_to(ROOT)) for p in sorted((ROOT/'scripts/client').glob('*')) if p.is_file()]
    return sha(b''.join(name.encode()+b'\0'+(ROOT/name).read_bytes() for name in files))
def files_hash(path):return {str(p.relative_to(path)):sha(p.read_bytes()) for p in sorted(path.rglob('*')) if p.is_file()}
def artifact_id(files):return sha(json.dumps(files,sort_keys=True,separators=(',',':')).encode())

def source_image(source,dest,config_dir,role):
    p=Path(source);p=config_dir/p if not p.is_absolute() else p
    if p.is_symlink() or not p.is_file():raise ValueError('approved local regular image required: '+role)
    with Image.open(p) as opened:
        if opened.format not in ('PNG','JPEG','WEBP'):raise ValueError('PNG/JPEG/WebP source required: '+role)
        if opened.width*opened.height>24_000_000:raise ValueError('image source exceeds 24 megapixels; prepare an approved export: '+role)
        normalized=ImageOps.exif_transpose(opened).convert('RGBA')
        normalized.info.clear()
        dest.parent.mkdir(parents=True,exist_ok=True)
        normalized.save(dest,'PNG',optimize=True)


def prepare_assets(work,config,assets,theme_css,config_dir,dom_text):
    slots=assets['concepts'][assets['activeConcept']]
    if config['assets']['mode']=='template-illustrations':
        for slot,a in [('hero',slots['hero']),('about',slots['about'])]+[(g['id'],g) for g in slots['gallery']]:
            # Sources stay internal; the deployed artifact receives only derivatives.
            original=ROOT/a['source'];target=work/a['source'];target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(original,target)
            a['contentType']='illustration'
            a['alt']=a['alt'].replace('Ilustração demonstrativa:','Ilustração de serviço elétrico:')
            if '__EXPLICIT_STATE_PENDING__' in a['alt']:a['alt']=a['alt'].replace(' em __EXPLICIT_STATE_PENDING__','')
        # Template illustrations depict generic settings, not a real job in a client city.
        slots['gallery'][7]['alt']='Ilustração de serviço elétrico: eletricista realizando teste em pequeno comércio.'
    else:
        for role in ('hero','about'):
            image=config['assets'][role];a=slots[role]
            a['source']='assets/sources/'+role+'.png';source_image(image['file'],work/a['source'],config_dir,role)
            a['contentType']=image['contentType'];a['alt']=image['alt']
        samples=slots['gallery'];new=[]
        for i,image in enumerate(config['assets']['gallery'],1):
            a={'id':f'work-{i:02}','source':f'assets/sources/work-{i:02}.png','alt':image['alt'],'position':samples[i-1]['position'] if i<=len(samples) else 'center center','contentType':image['contentType']}
            prefix='Ilustração de serviço elétrico: ' if image['contentType']=='illustration' else 'Fotografia fornecida pelo cliente: '
            if not a['alt'].startswith(prefix.split(':')[0]):a['alt']=prefix+a['alt']
            source_image(image['file'],work/a['source'],config_dir,a['id']);new.append(a)
        slots['gallery']=new
    sheet=assets['characterSheet'];(work/sheet).parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(ROOT/sheet,work/sheet)
    accent=re.search(r'--accent-text: (#[0-9a-f]+);',theme_css).group(1)
    assets['favicon']={'kind':'volt-lightning','foreground':accent,'background':'#050606'}
    brand=config.get('brand',{})
    if brand.get('favicon'):
        source_image(brand['favicon'],work/'assets/brand/favicon.png',config_dir,'favicon')
        assets['favicon']={'kind':'client-raster','source':'assets/brand/favicon.png','background':'#050606'}
    if brand.get('logo'):
        source_image(brand['logo'],work/'assets/brand/logo.png',config_dir,'logo')
        p=work/'assets/brand/logo.png'
        with Image.open(p) as img:
            img.thumbnail((360,88),Image.Resampling.LANCZOS);img.save(p,'PNG',optimize=True);size=img.size
        dom=html.document_fromstring(dom_text)
        for mark in dom.cssselect('.wordmark'):
            for child in list(mark):mark.remove(child)
            mark.text=None;mark.set('class','wordmark wordmark--image')
            etree.SubElement(mark,'img',{'src':'assets/brand/logo.png','alt':config['identity']['businessName'],'width':str(size[0]),'height':str(size[1]),'decoding':'async'})
        dom_text=html.tostring(dom,encoding='unicode',method='html',doctype='<!doctype html>')+'\n'
        dom_text=re.sub(r'<(?:img|meta|link|source|input|br|hr)\b[^>]*>',lambda m:m[0] if m[0].endswith('/>') else m[0][:-1]+' />',dom_text)
    return assets,dom_text

CLIENT_CSS='''
/* Client state composition: shared dimensions and typography remain in base CSS. */
@layer volt-nav-review {
 @media(min-width:861px) {
  html[data-volt-mode="production"] #topo .nav-wrap {grid-template-columns:auto minmax(0,1fr) auto !important;}
 }
}
/* Single-city coverage: center text inside its existing allocated area. */
#hero .hero__trust-card:nth-child(4) .hero__trust-title[data-single-city="true"] {display:flex !important;align-items:center !important;justify-content:center !important;text-align:center !important;}
/* Anchor activation must not inherit generic footer-link layout. */
#rodape a.footer-social {display:grid !important;place-items:center !important;margin:0 !important;font-size:16px !important;line-height:1.6 !important;color:rgba(255,255,255,.90) !important;}
#rodape a.footer-social:hover {color:#fff !important;}
#rodape a.footer-social:focus-visible {outline:2px solid var(--accent-text) !important;outline-offset:4px !important;}
#rodape a.footer-contact__cta {display:inline-flex !important;margin-bottom:0 !important;}
#rodape a.footer-contact__cta:focus-visible {outline:2px solid var(--accent-text) !important;outline-offset:3px !important;}
.wordmark.wordmark--image {display:flex !important;align-items:center;justify-content:center;min-height:44px;width:max-content;max-width:180px;}
.wordmark.wordmark--image::before {content:none !important;}
.wordmark--image img {display:block;max-width:180px;max-height:44px;width:auto;height:auto;object-fit:contain;}
'''

def build(config,config_dir,work):
    text,runtime,assets=prepare_client(ROOT,config)
    theme=load_module('volt_theme',ROOT/'scripts/build-theme.py');theme_css,contrasts=theme.compile_theme(config['colors'])
    assets,text=prepare_assets(work,config,assets,theme_css,config_dir,text)
    (work/'index.html').write_text(text)
    (work/'assets.json').write_text(json.dumps(assets,ensure_ascii=False,indent=2)+'\n')
    (work/'volt-final.js').write_text(runtime)
    (work/'styles.css').write_text(migrate((ROOT/'styles.css').read_text()))
    (work/'volt-final.css').write_text(migrate((ROOT/'volt-final.css').read_text(),True)+CLIENT_CSS)
    (work/'theme.json').write_text(json.dumps(config['colors']))
    (work/'volt-theme.css').write_text(theme_css)
    asset_builder=load_module('volt_assets',ROOT/'scripts/build-assets.py');asset_builder.ROOT=work
    asset_builder.build(False);asset_builder.build(True)
    # Content-derived cache versions for all generated styles and runtime.
    text=(work/'index.html').read_text()
    for filename in ('styles.css','volt-final.css','volt-theme.css','volt-final.js'):
        version=sha((work/filename).read_bytes())[:12]
        text=re.sub(r'(href|src)="'+re.escape(filename)+r'(?:\?[^\"]*)?"',lambda m:m[1]+'="'+filename+'?v='+version+'"',text)
    (work/'index.html').write_text(text)
    origin=config['publication']['url'];indexable=config['stage']=='production' and config['publication'].get('indexable',True)
    (work/'robots.txt').write_text('User-agent: *\n'+('Allow: /\n' if indexable else 'Disallow: /\n')+'Sitemap: '+origin+'sitemap.xml\n')
    sitemap=etree.Element('urlset',nsmap={None:'http://www.sitemaps.org/schemas/sitemap/0.9'});url=etree.SubElement(sitemap,'url');etree.SubElement(url,'loc').text=origin
    (work/'sitemap.xml').write_bytes(etree.tostring(sitemap,encoding='UTF-8',xml_declaration=True))
    site=work/'site';site.mkdir()
    for name in ('index.html','styles.css','volt-final.css','volt-final.js','volt-theme.css','volt-assets.css','robots.txt','sitemap.xml','favicon.svg','favicon.ico','favicon-32x32.png','apple-touch-icon.png','assets-manifest.json'):
        shutil.copyfile(work/name,site/name)
    for folder in ('assets/generated','assets/brand'):
        src=work/folder
        if src.exists():shutil.copytree(src,site/folder)
    files=files_hash(site)
    forbidden=['Rafael','RAFAEL','Martins','MARTINS','Palhoça','PALHOÇA','São José','SÃO JOSÉ','Florianópolis','FLORIANÓPOLIS','2017','5548999999999','SITE DEMONSTRAÇÃO','Site demonstrativo.','relatos demonstrativos','nota fictícia','__EXPLICIT_STATE_PENDING__','{{']
    public_text=(site/'index.html').read_text()+(site/'volt-final.js').read_text()
    config_text=json.dumps(config,ensure_ascii=False)
    residual=[v for v in forbidden if v in public_text and v not in config_text and v.lower() not in config_text.lower()]
    if residual:raise ValueError('demonstration residue in client output: '+', '.join(residual))
    dom=html.document_fromstring((site/'index.html').read_text())
    if dom.cssselect('[data-demo-cta],[data-review-demo-cta],[data-social-demo],dialog'):raise ValueError('demonstration interactions remain in client output')
    if len(dom.cssselect('h1'))!=1 or len(dom.cssselect('h2'))!=9:raise ValueError('heading hierarchy changed')
    if not dom.cssselect('h2')[-1].getparent().getparent().getparent().get('id')=='contato':
        if dom.cssselect('h2')[-1].get('id')!='cta-title':raise ValueError('last H2 must remain final CTA')
    return {'schemaVersion':1,'status':'generated-awaiting-browser-qa','stage':config['stage'],'sourceHash':source_hash(),'configHash':sha(json.dumps(config,sort_keys=True,ensure_ascii=False).encode()),'artifactId':artifact_id(files),'files':files,'contrasts':{k:round(v,3) for k,v in contrasts.items()},'visualStatus':'awaiting-human-review','composition':{'cities':len(config['coverage']['cities']),'coverageScopes':[c['scope'] for c in config['coverage']['cities']],'services':len(config['services']),'gallery':len(assets['concepts'][assets['activeConcept']]['gallery']),'reviews':config['reviews']['presentation'],'ratingBadge':config['reviews']['rating'] is not None,'assets':config['assets']['mode'],'logo':bool(config.get('brand',{}).get('logo'))},'notice':'Publish site/ only. This private report is not a publication approval.'}

def check_visual_approval(approval,report):
    if not isinstance(approval,dict) or approval.get('artifactId')!=report['artifactId'] or approval.get('sourceHash')!=report['sourceHash'] or approval.get('composition')!=report['composition']:
        raise ValueError('visual approval missing or stale for this exact artifact/composition')
    for key in ('reviewer','approvalReference'):
        if not isinstance(approval.get(key),str) or not approval[key].strip():raise ValueError('visual approval requires reviewer and approvalReference')

def main(args):
    config_file=Path(args.config).resolve();raw=config_file.read_text();config=validate(json.loads(raw),config_file.parent)
    dest=Path(args.output).resolve()
    if dest==ROOT or dest.is_relative_to(ROOT) or ROOT.is_relative_to(dest):raise ValueError('output must be an isolated external folder, never the matrix or its parent')
    if not args.check and not args.release_check and dest.exists():raise ValueError('output already exists; never overwrite a client or evidence')
    if args.check or args.release_check:
        if not (dest/'site').is_dir() or not (dest/'production-report.json').is_file():raise ValueError('existing complete artifact required for check')
    dest.parent.mkdir(parents=True,exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='.volt-client-build-',dir=dest.parent) as folder:
        work=Path(folder);report=build(config,config_file.parent,work)
        if args.check or args.release_check:
            existing=json.loads((dest/'production-report.json').read_text());actual=files_hash(dest/'site')
            if existing!=report or actual!=report['files']:raise ValueError('artifact differs from configuration/source or contains extra/missing files; generate a fresh folder')
            if args.release_check:
                if config['stage']=='production' and config['publication'].get('kind')=='synthetic-test':raise ValueError('synthetic test artifacts cannot be released as production')
                if config['stage']=='production':
                    if not args.visual_approval:raise ValueError('production release requires --visual-approval for the exact artifact; browser QA is not visual approval')
                    check_visual_approval(json.loads(Path(args.visual_approval).read_text()),report)
                if not args.qa:raise ValueError('--release-check requires an explicit --qa evidence file')
                qa=json.loads(Path(args.qa).read_text())
                if not qa.get('passed') or qa.get('artifactId')!=report['artifactId'] or qa.get('sourceHash')!=report['sourceHash'] or qa.get('checkerHash')!=sha((ROOT/'scripts/qa-client.py').read_bytes()):raise ValueError('QA missing, failed, or stale for this artifact/checker')
                for engine in ('firefox','webkit'):
                    sizes={(s.get('width'),s.get('dpr')) for s in qa.get('runs',[]) if s.get('engine')==engine and not s.get('errors')}
                    if not ({(w,1) for w in (320,390,560,561,620,621,680,681,760,761,860,861,1080,1081,1200,1201,1440)}|{(390,2),(1440,2)}).issubset(sizes):raise ValueError('complete Firefox/WebKit viewport QA required before release')
            print('OK: release check' if args.release_check else 'OK: artifact verified; public files unchanged')
        else:
            (work/'production-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
            dest.mkdir();shutil.move(work/'site',dest/'site');shutil.move(work/'production-report.json',dest/'production-report.json')
            print('OK: isolated client generated at '+str(dest/'site')+'; browser QA required')

if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--config',required=True);p.add_argument('--output',required=True);p.add_argument('--check',action='store_true');p.add_argument('--release-check',action='store_true');p.add_argument('--qa');p.add_argument('--visual-approval')
    try:main(p.parse_args())
    except (ValueError,KeyError,TypeError,OSError,AttributeError,IndexError) as e:sys.exit('STOP: '+str(e))
