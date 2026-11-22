#!/usr/bin/env python3
"""Integrated asset QA on an explicit local/preview/published URL.

Requires requirements-qa.txt and Playwright Firefox/WebKit with their system
libraries. Writes evidence only to --output and optional --screenshots.
Does not publish, mutate the page's code, or replace human visual review.
"""
import argparse
from datetime import datetime, timezone
import hashlib
import json
import os
from pathlib import Path
from urllib.parse import urljoin, urlparse
from playwright.sync_api import sync_playwright

WIDTHS=[320,390,560,561,620,621,760,761,860,861,1080,1081,1440]

MEASURE=r'''() => {
 const images=[...document.querySelectorAll('main img[data-asset-slot]')].map(i=>{
  const r=i.getBoundingClientRect(),s=getComputedStyle(i);
  return {slot:i.dataset.assetSlot,src:i.currentSrc,w:r.width,h:r.height,complete:i.complete&&i.naturalWidth>0,filter:s.filter,position:s.objectPosition,widthAttr:Number(i.getAttribute('width')),heightAttr:Number(i.getAttribute('height'))};
 });
 const lines=e=>{
  const ys=[];const walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let n;
  while(n=walker.nextNode()){
   if(!/[\p{L}\p{N}]/u.test(n.textContent)||n.parentElement.closest('[aria-hidden="true"]'))continue;
   const range=document.createRange();range.selectNodeContents(n);
   for(const r of range.getClientRects())if(r.width>0&&r.height>0&&!ys.some(y=>Math.abs(y-(r.y+r.height/2))<r.height/2))ys.push(r.y+r.height/2);
  }
  return ys.length;
 };
 const ctas=[...document.querySelectorAll('[data-typography="cta"]')].filter(e=>e.getClientRects().length&&e.getBoundingClientRect().height>0).map(e=>({text:e.innerText,lines:lines(e),overflow:e.scrollWidth>e.clientWidth+1}));
 const cards=[...document.querySelectorAll('.portfolio-card')].map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,w:r.width,h:r.height}});
 return {width:innerWidth,dpr:devicePixelRatio,overflow:document.documentElement.scrollWidth>innerWidth,images,ctas,cards,h1:document.querySelectorAll('h1').length,h2:document.querySelectorAll('h2').length,lastH2:[...document.querySelectorAll('h2')].at(-1)?.closest('section')?.id,heroBackground:getComputedStyle(document.querySelector('.hero')).backgroundImage,resources:performance.getEntriesByType('resource').filter(e=>e.name.includes('/assets/generated/')).map(e=>e.name)};
}'''


def smoke(page):
    page.evaluate('scrollTo(0,0)')
    menu=page.locator('.menu-toggle')
    if menu.is_visible():
        menu.focus();page.keyboard.press('Enter')
        assert menu.get_attribute('aria-expanded')=='true','menu did not open by keyboard'
        page.keyboard.press('Escape')
        assert menu.get_attribute('aria-expanded')=='false','menu did not close with Escape'
    faq=page.locator('.faq details')
    faq.nth(0).locator('summary').click()
    faq.nth(1).locator('summary').click()
    assert page.locator('.faq details[open]').count()==1,'FAQ exclusive opening failed'
    page.locator('.hero__actions .btn--accent').click()
    assert page.locator('#demo-dialog').evaluate('(e)=>e.open'),'demo dialog did not open'
    page.keyboard.press('Escape')
    assert not page.locator('#demo-dialog').evaluate('(e)=>e.open'),'demo dialog did not close'
    assert page.evaluate('document.activeElement.matches(".hero__actions .btn--accent")'),'CTA focus did not return'
    review=page.locator('[data-review-demo]')
    # Social controls are demo buttons and must remain functional after image loading.
    social=page.locator('.footer-socials__icons button')
    assert social.count()==6,'six social icons required'
    social.first.click()
    assert page.locator('#social-demo-dialog').evaluate('(e)=>e.open'),'social demo did not open'
    page.keyboard.press('Escape')
    page.evaluate('scrollTo(0,0)')
    return {'keyboardMenu':menu.is_visible(),'faq':True,'ctaDialogAndFocus':True,'socialIcons':6}


def main(args):
    report={'testedAt':datetime.now(timezone.utc).isoformat(),'url':args.base_url,'kind':'headless engine tests; WebKit is not a physical Safari/iPhone test','runs':[],'errors':[]}
    with sync_playwright() as pw:
        for engine in args.engines:
            browser_type=getattr(pw,engine)
            options={'headless':True}
            if engine=='webkit' and os.environ.get('VOLT_WEBKIT_EXECUTABLE'):
                options.update(executable_path=os.environ['VOLT_WEBKIT_EXECUTABLE'],env=dict(os.environ))
            try:
                browser=browser_type.launch(**options)
            except Exception as exc:
                report['errors'].append({'engine':engine,'launch':str(exc)})
                continue
            samples=[(w,1) for w in args.widths]+[(390,2),(1440,2)]
            for width,dpr in samples:
                run={'engine':engine,'version':browser.version,'width':width,'dpr':dpr,'errors':[]}
                context=browser.new_context(viewport={'width':width,'height':1000},device_scale_factor=dpr,reduced_motion='reduce')
                page=context.new_page()
                js_errors=[]
                page.on('pageerror',lambda e:js_errors.append(str(e)))
                try:
                    page.goto(args.base_url,wait_until='networkidle')
                    page.evaluate('document.fonts.ready')
                    manifest_response=page.request.get(urljoin(args.base_url,'assets-manifest.json'))
                    assert manifest_response.ok,'manifest unavailable'
                    manifest=manifest_response.json()
                    for image in page.locator('main img[data-asset-slot]').all():
                        if image.is_visible():
                            image.scroll_into_view_if_needed()
                            page.wait_for_function('(i)=>i.complete&&i.naturalWidth>0',arg=image.element_handle())
                            image.evaluate('(i)=>i.decode()')
                    state=page.evaluate(MEASURE)
                    run['measurements']=state
                    assert not state['overflow'],'horizontal overflow'
                    assert state['h1']==1 and state['h2']==9 and state['lastH2']=='contato','heading structure changed'
                    assert len(state['images'])==len(manifest['images']),'wrong slot count'
                    assert len(state['cards'])==len(manifest['images'])-2,'wrong gallery count'
                    for a in state['images']:
                        m=manifest['images'][a['slot']]
                        assert a['widthAttr']==m['width'] and a['heightAttr']==m['height'],f"{a['slot']}: intrinsic attributes differ"
                        if a['slot']=='hero' and width>860:
                            assert a['src'].startswith('data:'),'desktop hero downloads hidden mobile image'
                            continue
                        assert a['complete'],f"{a['slot']}: image failed to load"
                        assert a['filter']=='none',f"{a['slot']}: darkening filter returned"
                        path=urlparse(a['src']).path.lstrip('/')
                        selected=next((v for v in m['variants'] if path.endswith(v['src'])),None)
                        assert selected,f"{a['slot']}: selected file absent from manifest"
                        needed=max(a['w'],a['h']*m['width']/m['height'])*dpr
                        # Never upscale a source. Density is bounded by its native resolution.
                        assert selected['width']+2>=min(needed,m['width']),f"{a['slot']}: undersized responsive candidate ({selected['width']}<{needed:.1f})"
                    assert all(c['lines']==1 and not c['overflow'] for c in state['ctas']),'Copy do CTA wraps/overflows'
                    cards=state['cards']
                    for i,a in enumerate(cards):
                        for c in cards[i+1:]:
                            assert not (min(a['right'],c['right'])-max(a['x'],c['x'])>1 and min(a['bottom'],c['bottom'])-max(a['y'],c['y'])>1),'gallery cards overlap'
                    assert not js_errors,f'page JavaScript errors: {js_errors}'
                    run['measurements']=state
                    if width in (390,1440) and dpr==1:
                        run['interactions']=smoke(page)
                        if args.screenshots:
                            dest=Path(args.screenshots);dest.mkdir(parents=True,exist_ok=True)
                            for name,selector in [('hero','#hero'),('gallery','#trabalhos'),('about','#sobre')]:
                                page.locator(selector).scroll_into_view_if_needed()
                                page.screenshot(path=str(dest/f'{engine}-{width}-{name}.png'))
                    if width==1440 and dpr==1:
                        # Verify every generated image and icon against recorded content hashes.
                        verified=0
                        for image in manifest['images'].values():
                            for variant in image['variants']:
                                response=page.request.get(urljoin(args.base_url,variant['src']))
                                assert response.ok and response.headers.get('content-type','').startswith('image/'),f"bad image response: {variant['src']}"
                                assert hashlib.sha256(response.body()).hexdigest()==variant['sha256'],'published image hash mismatch'
                                verified+=1
                        for name,data in manifest['favicon']['files'].items():
                            response=page.request.get(urljoin(args.base_url,name))
                            assert response.ok and response.headers.get('content-type','').startswith('image/'),'favicon response error'
                            assert hashlib.sha256(response.body()).hexdigest()==data['sha256'],'favicon hash mismatch'
                        run['filesVerified']=verified+4
                except Exception as exc:
                    run['errors'].append(str(exc))
                finally:
                    context.close()
                report['runs'].append(run)
                print(json.dumps({k:run[k] for k in ('engine','width','dpr','errors')}),flush=True)
            browser.close()
    report['passed']=not report['errors'] and all(not r['errors'] for r in report['runs'])
    Path(args.output).write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    return 0 if report['passed'] else 1


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base-url',required=True)
    parser.add_argument('--output',required=True)
    parser.add_argument('--screenshots')
    parser.add_argument('--engines',nargs='+',choices=['firefox','webkit'],default=['firefox','webkit'])
    parser.add_argument('--widths',nargs='+',type=int,default=WIDTHS)
    raise SystemExit(main(parser.parse_args()))
