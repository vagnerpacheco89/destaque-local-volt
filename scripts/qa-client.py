#!/usr/bin/env python3
"""Verify a generated client artifact locally or at its public preview URL.
Network contact/social destinations are intercepted during interaction tests.
Reports/snapshots stay outside site/. This tool never publishes or sends messages.
"""
import argparse
from datetime import datetime,timezone
import hashlib
import http.server
import json
import os
from pathlib import Path
import socketserver
import sys
import threading
from urllib.parse import urljoin,urlsplit
from playwright.sync_api import sync_playwright

WIDTHS=[320,390,560,561,620,621,680,681,760,761,860,861,1080,1081,1200,1201,1440]
FOOTER_MEASURE=r'''() => {
 const controls=[...document.querySelectorAll('#rodape .footer-social')];
 const failures=[],size=innerWidth<=680?46:48;
 const close=(a,b)=>Math.abs(a-b)<=1;
 const items=controls.map(e=>{const r=e.getBoundingClientRect(),svg=e.querySelector('svg')?.getBoundingClientRect(),s=getComputedStyle(e),iconSize=e.classList.contains('footer-social--facebook')?19:e.classList.contains('footer-social--whatsapp')?(innerWidth<=680?23:24):21;
  const item={display:s.display,color:s.color,width:r.width,height:r.height,marginBottom:parseFloat(s.marginBottom),x:r.x,y:r.y,svgWidth:svg?.width,svgHeight:svg?.height,dx:svg?svg.x+svg.width/2-r.x-r.width/2:null,dy:svg?svg.y+svg.height/2-r.y-r.height/2:null};
  if(s.color!==(e.matches(':hover')?'rgb(255, 255, 255)':'rgba(255, 255, 255, 0.9)'))failures.push('social control ink: '+e.className);
  if(s.display!=='grid'||!close(r.width,size)||!close(r.height,size)||!close(item.marginBottom,0)||!svg||!close(item.dx,0)||!close(item.dy,0)||!close(svg.width,iconSize)||!close(svg.height,iconSize))failures.push('social control geometry: '+e.className);
  return item;
 });
 const grid=document.querySelector('#rodape .footer-socials__icons'),gr=grid?.getBoundingClientRect(),gs=grid&&getComputedStyle(grid);
 if(controls.length!==6||!gr||!close(gr.height,size*2+16)||!close(gr.width,size*3+24)||!close(parseFloat(gs.rowGap),12)||!close(parseFloat(gs.columnGap),12))failures.push('social grid dimensions/gaps');
 if(items.length===6)for(let i=0;i<3;i++)if(!close(items[i].y,items[0].y)||!close(items[i+3].y,items[3].y)||!close(items[i+3].y-items[i].y,size+12)||!close(items[i].x,items[i+3].x))failures.push('social row alignment');
 const cta=document.querySelector('#rodape .footer-contact__cta'),cs=cta&&getComputedStyle(cta);
 if(!cs||cs.display!=='inline-flex'||!close(parseFloat(cs.marginBottom),0))failures.push('footer contact display/margin');
 return {width:innerWidth,items,grid:gr?{width:gr.width,height:gr.height,gap:gs.gap}:null,cta:cs?{display:cs.display,marginBottom:cs.marginBottom}:null,failures};
}'''
MEASURE=r'''() => {
 const visible=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(e).visibility!=='hidden'};
 const lines=e=>{const rows=[],w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){
  if(!/[\p{L}\p{N}]/u.test(n.textContent))continue;
  const r=document.createRange();r.selectNodeContents(n);for(const b of r.getClientRects())if(b.width&&b.height&&!rows.some(y=>Math.abs(y-(b.y+b.height/2))<b.height/2))rows.push(b.y+b.height/2);
 }return rows.length};
 const fit=e=>{const er=e.getBoundingClientRect(),w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){
  if(!n.textContent.trim())continue;const r=document.createRange();r.selectNodeContents(n);for(const b of r.getClientRects())if(b.width&&b.height&&(b.left<er.left-1||b.right>er.right+1))return false;
 }return true};
 const failures=[];const check=(e,max,label,min=0)=>{if(e&&visible(e)){const n=lines(e);if(n>max||n<min||!fit(e))failures.push({label,lines:n,min,max,inkInside:fit(e),text:e.innerText})}};
 for(const e of document.querySelectorAll('[data-typography="cta"],.hero__actions .btn,.nav-cta,.mobile-menu__cta,.service-card__cta,.footer-contact__cta'))check(e,1,'Copy do CTA',1);
 const rules=[['#hero h1',innerWidth<=620?3:2,'H1',2],['.hero__copy>.eyebrow',1,'Hero Eyebrow',1],['.hero__lead',innerWidth<=620?4:3,'Hero apresentação',1],['.hero__promise',innerWidth<=620?2:1,'Hero frase',1],['.hero__micro',1,'Hero Microcopy',1],['.hero__trust-title',3,'Hero atributo',1],['.service-card h3',2,'Serviço título',1],['.service-card__body>p',4,'Serviço descrição',0],['.process-intro',3,'Atendimento apresentação',1],['.review-marquee-message',3,'Depoimento',1],['.review-marquee-person strong',2,'Nome avaliação',1],['.review-marquee-person small',2,'Local avaliação',1],['.about-proof__text',3,'Atributo Sobre',1],['.about__copy>p:not(.eyebrow)',innerWidth<=620?5:3,'Parágrafo Sobre',1],['.about__image-label strong',2,'Identificação Sobre',1],['.service-area__coverage-head h3',2,'Cidade',1],['.service-area__coverage-neighborhoods span',1,'Bairro/cobertura',1],['.final-cta__intro',innerWidth<=620?5:3,'Chamada final apresentação',1],['#faq details[open]>p',innerWidth<=620?8:6,'Resposta FAQ',1]];
 for(const [selector,max,label,min] of rules)for(const e of document.querySelectorAll(selector))check(e,max,label,min);
 for(const e of document.querySelectorAll('h2,h3'))check(e,e.closest('#contato')&&innerWidth<=620?3:2,'Título '+e.id,1);
 const flags=[...document.querySelectorAll('[data-copy-overflow="true"],[data-paragraph-overflow="true"]')].filter(visible).map(e=>({class:e.className,text:e.innerText}));
 const cards=[...document.querySelectorAll('.service-card,.portfolio-card')].filter(visible).map(e=>{const r=e.getBoundingClientRect();return {kind:e.className,x:r.x,y:r.y,right:r.right,bottom:r.bottom}});
 for(let i=0;i<cards.length;i++)for(let j=i+1;j<cards.length;j++){const a=cards[i],b=cards[j];if(min(a.right,b.right)-max(a.x,b.x)>1&&min(a.bottom,b.bottom)-max(a.y,b.y)>1)failures.push({label:'cards overlap',i,j})}
 function min(a,b){return Math.min(a,b)}function max(a,b){return Math.max(a,b)}
 return {width:innerWidth,dpr:devicePixelRatio,overflow:document.documentElement.scrollWidth>innerWidth,failures,flags,h1:document.querySelectorAll('h1').length,h2:document.querySelectorAll('h2').length,lastH2:[...document.querySelectorAll('h2')].at(-1)?.id,fonts:[...new Set([...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family.replaceAll('"','')))],cityCards:document.querySelectorAll('.service-area__coverage-item').length,services:document.querySelectorAll('.service-card').length,contacts:[...document.querySelectorAll('[data-client-contact]')].map(a=>({href:a.href,tag:a.tagName})),demoControls:document.querySelectorAll('[data-demo-cta],[data-review-demo-cta],[data-social-demo],dialog').length,images:[...document.querySelectorAll('img')].filter(visible).map(i=>({slot:i.dataset.assetSlot,loaded:i.complete&&i.naturalWidth>0,filter:getComputedStyle(i).filter})),canonical:document.querySelector('link[rel="canonical"]').href,robots:document.querySelector('meta[name="robots"]').content,previewLabel:document.querySelector('.nav-demo-label')?.textContent||null};
}'''
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args):pass

def all_hashes(root):return {str(p.relative_to(root)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(root.rglob('*')) if p.is_file()}

def run(args):
    folder=Path(args.output).resolve();report_path=Path(args.report).resolve();site=folder/'site'
    if report_path.is_relative_to(site):raise ValueError('QA evidence must stay outside site/')
    info=json.loads((folder/'production-report.json').read_text())
    if all_hashes(site)!=info['files']:raise ValueError('public files changed since generation')
    server=None
    if args.url:base=args.url
    else:
        handler=lambda *a,**kw:Quiet(*a,directory=site,**kw)
        server=socketserver.TCPServer(('127.0.0.1',0),handler);threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_address[1]}/'
    result={'schemaVersion':1,'artifactId':info['artifactId'],'sourceHash':info['sourceHash'],'testedAt':datetime.now(timezone.utc).isoformat(),'url':base,'runs':[],'errors':[],'checkerHash':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'passed':False,'status':'running','limits':['Headless WebKit is not physical Safari/iPhone','Visual review of images and real factual provenance remains required','No external messages submitted; destination requests intercepted']}
    report_path.parent.mkdir(parents=True,exist_ok=True)
    try:
      with sync_playwright() as pw:
        for name in args.engines:
            opts={'headless':True}
            if name=='webkit' and os.environ.get('VOLT_WEBKIT_EXECUTABLE'):opts.update(executable_path=os.environ['VOLT_WEBKIT_EXECUTABLE'],env=dict(os.environ))
            try:browser=getattr(pw,name).launch(**opts)
            except Exception as exc:result['errors'].append({'engine':name,'error':str(exc)});continue
            samples=[(w,1) for w in args.widths]+([(390,2),(1440,2)] if not args.no_density else [])
            for width,dpr in samples:
                sample={'engine':name,'version':browser.version,'width':width,'dpr':dpr,'errors':[],'thirdPartyErrors':[]};context=browser.new_context(viewport={'width':width,'height':1000},device_scale_factor=dpr,reduced_motion='reduce');page=context.new_page();js_errors=[]
                def on_error(error):
                    message=str(error)
                    # WebKit also reports errors from cross-origin embedded documents.
                    # Keep this specific Google Maps RPC CORS failure in the evidence;
                    # do not misattribute it to client runtime or disable browser security.
                    if message.startswith('/maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/GetViewportInfo') and message.endswith('due to access control checks.'):
                        sample['thirdPartyErrors'].append(message)
                    else:js_errors.append(message)
                page.on('pageerror',on_error)
                # Block side-effect destinations while still exercising the actual handlers/default actions.
                blocked=[]
                def block(route):blocked.append(route.request.url);route.abort()
                context.route('https://wa.me/**',block)
                try:
                    page.goto(base,wait_until='networkidle');page.evaluate('document.fonts.ready')
                    for img in page.locator('img').all():
                        if img.is_visible():
                            img.scroll_into_view_if_needed();page.wait_for_function('(i)=>i.complete&&i.naturalWidth>0',arg=img.element_handle());img.evaluate('(i)=>i.decode()')
                    # Measure full FAQ answers as well as the closed layout.
                    faq_failures=[]
                    for details in page.locator('#faq details').all():
                        details.locator('summary').click();state=page.evaluate(MEASURE)
                        faq_failures.extend([f for f in state['failures'] if f['label']=='Resposta FAQ'])
                    state=page.evaluate(MEASURE);sample['measurements']=state
                    sample['footerGeometry']=page.evaluate(FOOTER_MEASURE)
                    assert not sample['footerGeometry']['failures'],'footer geometry: '+str(sample['footerGeometry']['failures'])
                    # Prove the checker rejects the actual inheritance regression,
                    # then remove only this temporary test style and verify recovery.
                    if width==390 and dpr==1:
                        regression=page.add_style_tag(content='#rodape a.footer-social{display:block!important;margin-bottom:7px!important;color:#838883!important}#rodape a.footer-contact__cta{margin-bottom:7px!important}')
                        page.wait_for_function("[...document.querySelectorAll('#rodape .footer-social')].every(e=>getComputedStyle(e).color==='rgb(131, 136, 131)')")
                        negative=page.evaluate(FOOTER_MEASURE)
                        regression.evaluate('(e)=>e.remove()')
                        page.wait_for_function("[...document.querySelectorAll('#rodape .footer-social')].every(e=>getComputedStyle(e).color===(e.matches(':hover')?'rgb(255, 255, 255)':'rgba(255, 255, 255, 0.9)'))")
                        recovered=page.evaluate(FOOTER_MEASURE)
                        assert any('social control geometry' in f for f in negative['failures']) and any('social control ink' in f for f in negative['failures']) and 'footer contact display/margin' in negative['failures'],'negative footer regression was not detected'
                        assert not recovered['failures'],'footer regression test did not restore layout'
                        sample['footerRegressionTest']={'detected':True,'restored':True}
                    assert not state['overflow'],'horizontal overflow'
                    assert not state['failures'],json.dumps(state['failures'],ensure_ascii=False)
                    assert not state['flags'],json.dumps(state['flags'],ensure_ascii=False)
                    assert not faq_failures,json.dumps(faq_failures,ensure_ascii=False)
                    assert state['h1']==1 and state['h2']==9 and state['lastH2']=='cta-title','heading hierarchy'
                    assert state['cityCards']==info['composition']['cities'] and state['services']==info['composition']['services'],'collection composition'
                    assert not state['demoControls'],'demo interaction remains'
                    assert 'Inter' in state['fonts'] and 'Barlow Condensed' in state['fonts'],'webfonts did not load'
                    assert all(i['loaded'] for i in state['images']),'image failed to load'
                    assert all(a['tag']=='A' and a['href'].startswith('https://wa.me/') for a in state['contacts']),'contact destination'
                    assert not js_errors,'JavaScript errors: '+str(js_errors)
                    map_frame=page.locator('[data-base-city-map]')
                    assert map_frame.count()==1 and map_frame.get_attribute('src').startswith('https://www.google.com/maps?'),'configured Google map missing'
                    sample['map']={'src':map_frame.get_attribute('src'),'embedded':True,'externalServiceVisualCheckRequired':True}
                    if width in (390,1440) and dpr==1:
                        menu=page.locator('.menu-toggle')
                        if menu.is_visible():
                            menu.focus();page.keyboard.press('Enter');assert menu.get_attribute('aria-expanded')=='true';page.keyboard.press('Escape');assert menu.get_attribute('aria-expanded')=='false'
                            menu.click();page.locator('#mobile-menu a[href="#servicos"]').click();assert menu.get_attribute('aria-expanded')=='false';assert page.evaluate('document.activeElement.id==="servicos-title"')
                        assert page.locator('#faq details[open]').count()==1
                        cta=page.locator('.hero__actions [data-client-contact]');href=cta.get_attribute('href')
                        with context.expect_event('request',predicate=lambda r:r.url.startswith('https://wa.me/')) as contact_request:
                            with page.expect_popup() as popup:cta.click()
                        external=popup.value
                        assert contact_request.value.url==href,'WhatsApp destination was intercepted/rewritten by old demo runtime'
                        external.close()
                        assert page.locator('dialog[open]').count()==0
                        assert page.locator('.footer-socials__icons a').count()==6
                        sample['interactions']={'mobileMenu':menu.is_visible(),'faq':True,'whatsappRequestBlockedAfterCorrectDestination':True,'socialControls':6}
                        if args.screenshots:
                            dest=Path(args.screenshots).resolve()
                            if dest.is_relative_to(site):raise ValueError('screenshots must stay outside site/')
                            dest.mkdir(parents=True,exist_ok=True)
                            # WebKit's screenshot viewport restoration follows a live
                            # fragment. Navigation was already tested above; clear only
                            # the test tab fragment so each capture retains its own scroll.
                            page.evaluate('document.activeElement.blur();history.replaceState(null,"",location.pathname+location.search)')
                            for label,selector in [('hero','#hero'),('reviews','#avaliacoes'),('about','#sobre'),('coverage','#area-atendida'),('footer','#rodape')]:
                                page.locator(selector).evaluate('(e)=>window.scrollTo({top:Math.max(0,e.getBoundingClientRect().top+scrollY-document.querySelector("#topo").getBoundingClientRect().height),behavior:"instant"})')
                                page.evaluate('()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))')
                                page.screenshot(path=str(dest/f'{name}-{width}-{label}.png'))
                    if args.url and width==1440 and dpr==1:
                        for file,expected in info['files'].items():
                            response=page.request.get(urljoin(base,file));assert response.ok,f'HTTP error for {file}'
                            assert hashlib.sha256(response.body()).hexdigest()==expected,'public hash mismatch: '+file
                        sample['publishedFilesVerified']=len(info['files'])
                except Exception as exc:sample['errors'].append(str(exc))
                finally:context.close()
                result['runs'].append(sample);print(json.dumps({k:sample[k] for k in ('engine','width','dpr','errors')},ensure_ascii=False),flush=True)
                report_path.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
            browser.close()
    finally:
        if server:server.shutdown();server.server_close()
    result['passed']=not result['errors'] and bool(result['runs']) and all(not s['errors'] for s in result['runs'])
    result['status']='complete'
    report_path.parent.mkdir(parents=True,exist_ok=True);report_path.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    return 0 if result['passed'] else 1

if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--output',required=True);p.add_argument('--report',required=True);p.add_argument('--url');p.add_argument('--engines',nargs='+',choices=['firefox','webkit'],default=['firefox','webkit']);p.add_argument('--widths',nargs='+',type=int,default=WIDTHS);p.add_argument('--no-density',action='store_true');p.add_argument('--screenshots')
    try:sys.exit(run(p.parse_args()))
    except (ValueError,OSError,KeyError) as e:sys.exit('STOP: '+str(e))
