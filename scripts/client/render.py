"""Apply approved V1 text to an isolated DOM, then explicit client states."""
import copy
import importlib.util
import json
from pathlib import Path
import re
from urllib.parse import urlencode
from lxml import html,etree
from tree_sitter import Language,Parser
import tree_sitter_javascript
from .colors import migrate
from .benefits import apply as apply_benefits,SLOTS,validate_selection

SERVICE_IDS=['panels','outlets','lighting','showers','diagnostics','wiring-protection']

def load_module(name,path):
    spec=importlib.util.spec_from_file_location(name,path);module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module);return module

def select(root,selector):
    found=root.cssselect(selector)
    if len(found)!=1:raise ValueError(f'exactly one element required: {selector}; got {len(found)}')
    return found[0]

def set_text(element,text):
    for child in list(element):element.remove(child)
    element.text=str(text)

def pointer_set(obj,path,value):
    bits=[p.replace('~1','/').replace('~0','~') for p in path.strip('/').split('/')]
    for bit in bits[:-1]:obj=obj[int(bit)] if isinstance(obj,list) else obj[bit]
    if isinstance(obj,list):obj[int(bits[-1])]=value
    else:obj[bits[-1]]=value

def join_names(names,separator=None):
    if separator:return separator.join(names)
    return names[0] if len(names)==1 else ', '.join(names[:-1])+' e '+names[-1]

def display_hours(group):
    if group is None:return 'Não atende'
    return '24 horas' if group['opens']==group['closes']=='00:00' else group['opens']+'–'+group['closes']

def whatsapp(config,message=None):
    return 'https://wa.me/'+config['contacts']['whatsapp']+'?'+urlencode({'text':message or config['contacts']['whatsappMessage']})

def text_values(config,demo):
    values=dict(demo['values']);identity=config['identity'];cities=config['coverage']['cities'];hours=config['hours']
    values.update({'identity.business_name':identity['businessName'],'identity.display_name':identity['displayName'],'identity.contact_name':identity['contactName'],'coverage.base_city':cities[0]['name'],'coverage.city_2':cities[1]['label'] if len(cities)>1 else '', 'coverage.city_3_name':cities[2]['name'] if len(cities)>2 else '', 'coverage.city_3_scope':cities[2]['label'] if len(cities)>2 else '', 'experience.start_year':str(config['experience']['since'] or ''),'site.origin':config['publication']['url'],'site.copyright_year':str(config['publication']['copyrightYear']),'contact.whatsapp_digits':config['contacts']['whatsapp'],'hours.sunday_holidays':display_hours(hours['sundayHolidays'])})
    for label,key in [('weekdays','weekdays'),('saturday','saturday')]:
        for part in ('opens','closes'):values['hours.'+label+'_'+part]=(hours[key] or {}).get(part,'00:00')
    for field,key in [('policy.faq_answer_07','warrantyAnswer'),('policy.faq_answer_08','invoiceAnswer'),('policy.faq_answer_09','paymentAnswer')]:values[field]=config['policies'][key]
    for i,city in enumerate(cities,1):
        for j,n in enumerate(city['neighborhoods'],1):values[f'coverage.card_{i}.neighborhood_{j:02}']=n
    if config['reviews']['presentation']=='verified':
        for i,review in enumerate(config['reviews']['items'],1):
            for key in ('message','initials','name','location'):values[f'reviews.{i:02}.{key}']=review[key]
        if config['reviews']['rating']:
            values['rating.score_pt']=f"{config['reviews']['rating']['score']:.1f}".replace('.',',');values['rating.count']=str(config['reviews']['rating']['count'])
    mp=config['coverage']['map']
    values['map.embed_src']='https://www.google.com/maps?'+urlencode({'q':cities[0]['name'],'ll':f"{mp['latitude']},{mp['longitude']}",'z':mp['desktopZoom'],'output':'embed'})
    return values

def render_entry(entry,values,config,render):
    template=entry['template'];cities=config['coverage']['cities']
    if len(cities)==1:
        template=template.replace(', com atendimento também em {{coverage.city_2}} e {{coverage.city_3_scope}}','')
        template=template.replace('{{coverage.base_city}} e região','{{coverage.base_city}}').replace('{{coverage.base_city|upper}} E REGIÃO','{{coverage.base_city|upper}}')
    patterns={
      '{{coverage.base_city}}, {{coverage.city_2}} e {{coverage.city_3_scope}}':join_names([c['label'] for c in cities]),
      '{{coverage.base_city}} • {{coverage.city_2}} • {{coverage.city_3_name}}':join_names([c['name'] for c in cities],' • '),
      '{{coverage.city_2}} e {{coverage.city_3_scope}}':join_names([c['label'] for c in cities[1:]] or [cities[0]['label']]),
      '{{coverage.base_city|upper}} • {{coverage.city_2|upper}} • {{coverage.city_3_name|upper}}':join_names([c['name'].upper() for c in cities],' • ')}
    for old,new in sorted(patterns.items(),key=lambda x:len(x[0]),reverse=True):template=template.replace(old,new)
    # Full groups are replaced before ordinary variable rendering to avoid dangling commas.
    variables=dict(values)
    for key in entry['variables']:
        if variables.get(key)=='':variables[key]='__EXPLICIT_STATE_PENDING__'
    if config['experience']['since'] is None:
        template=template.replace('Experiência desde {{experience.start_year}}','Orçamento antes da execução').replace(' desde {{experience.start_year}}','')
    overrides=config.get('copyOverrides',{})
    if entry['id'] in overrides:return overrides[entry['id']]['text']
    result=render(template,variables)
    audience='residências e pequenos comércios' if len(config['audiences'])==2 else 'residências' if config['audiences']==['residences'] else 'pequenos comércios'
    result=result.replace('residências e pequenos comércios',audience).replace('Residências e pequenos comércios',audience[0].upper()+audience[1:])
    if len(config['audiences'])==1:
        result=result.replace('Residencial e comércios','Residencial' if config['audiences']==['residences'] else 'Pequenos comércios')
        result=result.replace('residências, pequenos comércios e demandas do dia a dia',audience+' e demandas do dia a dia')
    if len(cities)==1:
        city=cities[0]['name'];result=result.replace('atende também '+city,'atende no município')
        places=list(re.finditer(re.escape('em '+city),result))
        if len(places)>1:
            for place in reversed(places[1:]):result=result[:place.start()]+'no município'+result[place.end():]
    return result

def client_runtime(source,headings,config):
    # Retain fitting prefixes; discard only the diagnostic suffix after the limits guard.
    raw=source.encode();tree=Parser(Language(tree_sitter_javascript.language())).parse(raw)
    if tree.root_node.has_error:raise ValueError('invalid source JavaScript')
    parts=[]
    for node in tree.root_node.named_children:
        if node.type=='comment':continue
        text=raw[node.start_byte:node.end_byte].decode()
        if 'const voltHeadingCopies' in text:
            parts.append('const voltHeadingCopies = '+json.dumps(headings,ensure_ascii=False).replace('<','\\u003c')+';');continue
        if "const dialog=document.querySelector('#social-demo-dialog')" in text:continue
        def find_arrow(n):
            if n.type=='arrow_function':return n
            for c in n.named_children:
                found=find_arrow(c)
                if found:return found
        arrow=find_arrow(node) if node.type=='expression_statement' else None
        if arrow:
            body=arrow.child_by_field_name('body')
            if body and body.type=='statement_block':
                guard=next((c for c in body.named_children if c.type=='if_statement' and 'limites' in raw[c.start_byte:c.end_byte].decode() and 'return' in raw[c.start_byte:c.end_byte].decode()),None)
                if guard:text=raw[node.start_byte:guard.start_byte].decode()+raw[body.end_byte-1:node.end_byte].decode()
        # Remove only the demonstrative action setup; keep navigation/FAQ behavior.
        if '/* Demo safety:' in text:
            a=text.index('  /* Demo safety:');b=text.index('  if (menuButton && mobileMenu)',a)
            text=text[:a]+text[b:]
        text=text.replace("mobileMenu.querySelectorAll('a').forEach(link", "mobileMenu.querySelectorAll('a[href^=\"#\"]').forEach(link")
        text=text.replace("'residências e pequenos comércios'",json.dumps('residências e pequenos comércios' if len(config['audiences'])==2 else 'residências' if config['audiences']==['residences'] else 'pequenos comércios',ensure_ascii=False))
        if "const frame=document.querySelector('[data-base-city-map]')" in text:
            mp=config['coverage']['map'];text=text.replace("mobile.matches?'10':'11'",f"mobile.matches?'{mp['mobileZoom']}':'{mp['desktopZoom']}'")
        parts.append(text)
    result='\n'.join(parts)+'\n'
    if Parser(Language(tree_sitter_javascript.language())).parse(result.encode()).root_node.has_error:raise ValueError('invalid generated JavaScript')
    return result

def render_dom(rootdir,config):
    cat=load_module('volt_copy_catalog',rootdir/'scripts/copy-catalog.py')
    catalog=json.loads((rootdir/'copy/v1.json').read_text());demo=json.loads((rootdir/'copy/demo-data.json').read_text());cat.check(catalog,demo)
    validate_selection(config,rootdir)
    known_ids={e['id'] for e in catalog['entries']}
    if set(config.get('copyOverrides',{}))-known_ids:raise ValueError('unknown copy override id')
    for entry in catalog['entries']:
        if entry['id'] in config.get('copyOverrides',{}) and (entry['variables'] or entry['binding']['kind'] not in ('text','responsive-heading')):
            raise ValueError('copy override cannot bypass shared factual fields, metadata or asset configuration: '+entry['id'])
    source=(rootdir/'index.html').read_text();dom=html.document_fromstring(source)
    heads=json.loads(re.search(r'const voltHeadingCopies = (\{.*?\n\});',(rootdir/'volt-final.js').read_text(),re.S).group(1))
    ldscript=dom.xpath('//script[@type="application/ld+json"]')[0];ld=json.loads(ldscript.text)
    assets=json.loads((rootdir/'assets.json').read_text());values=text_values(config,demo)
    for entry in catalog['entries']:
        binding=entry['binding'];text=render_entry(entry,values,config,cat.render)
        if binding['kind'] in ('text','attribute'):
            target=dom.xpath(binding['path'])
            if len(target)!=1:raise ValueError('copy binding not unique: '+entry['id'])
            element=target[0]
            if binding['kind']=='attribute':element.set(binding['key'],text)
            else:
                nodes=[t for t in element.xpath('text()') if str(t).strip()]
                node=nodes[int(binding['key'])-1]
                if node.is_text:node.getparent().text=text
                else:node.getparent().tail=text
        elif binding['kind']=='responsive-heading':pointer_set(heads,binding['path'],text)
        elif binding['kind']=='jsonld':pointer_set(ld,binding['path'],text)
        elif binding['kind']=='json':pointer_set(assets,binding['path'],text)
    return dom,heads,ld,assets


def prepare_client(rootdir,config):
    dom,headings,ld,assets=render_dom(rootdir,config)
    cities=config['coverage']['cities'];identity=config['identity'];stage=config['stage'];action=config['google']['reviewAction'];wa=whatsapp(config)
    q=lambda css:select(dom,css)
    library={}
    for key,card in zip(SERVICE_IDS,dom.cssselect('#servicos .service-card')):library[key]=copy.deepcopy(card)
    grid=q('#servicos .services-grid');grid.clear()
    grid.set('class','services-grid');grid.set('data-description-min-lines','3');grid.set('data-description-max-lines','4');grid.set('data-title-max-lines','2')
    for service in config['services']:
        if isinstance(service,str):
            if service not in library:raise ValueError('unknown approved service: '+service)
            card=copy.deepcopy(library[service])
        else:
            if service['icon'] not in library:raise ValueError('unknown approved service icon')
            card=copy.deepcopy(library[service['icon']]);set_text(select(card,'h3'),service['title'])
            for variant,text in service['variants'].items():set_text(select(card,'.service-card__description--'+variant),text)
        grid.append(card)
    # One to three explicitly confirmed cities; do not fabricate extra cards.
    coverage=q('.service-area__coverage');card_template=copy.deepcopy(coverage[0]);coverage.clear();coverage.set('class','service-area__coverage');coverage.set('aria-label','Cidades e regiões atendidas')
    for i,city in enumerate(cities):
        card=copy.deepcopy(card_template);card.set('class','service-area__coverage-item'+(' service-area__coverage-item--primary' if i==0 else ''))
        set_text(select(card,'h3'),city['label'].upper());neighborhoods=select(card,'.service-area__coverage-neighborhoods');neighborhoods.clear();neighborhoods.set('class','service-area__coverage-neighborhoods');neighborhoods.set('aria-label','Cobertura em '+city['label'])
        if city['scope']=='citywide':
            group=etree.SubElement(neighborhoods,'div',{'class':'service-area__neighborhood-row'});span=etree.SubElement(group,'span',{'data-typography':'label','data-ink':'primary'});span.text='Atendimento em toda a cidade'
        else:
            names=city['neighborhoods'];at=0
            for n in range(3):
                size=len(names)//3+(1 if n>=3-len(names)%3 and len(names)%3 else 0)
                group=etree.SubElement(neighborhoods,'div',{'class':'service-area__neighborhood-row'})
                for name in names[at:at+size]:etree.SubElement(group,'span',{'data-typography':'label','data-ink':'primary'}).text=name
                at+=size
        coverage.append(card)
    q('[data-base-city-map]').set('title','Mapa de '+cities[0]['name']+', com vista da região atendida')
    # Footer city facts share the same authoritative list.
    footer_block=dom.cssselect('#rodape .footer-block')[0];label=copy.deepcopy(footer_block[0]);footer_block.clear();footer_block.set('class','footer-block');footer_block.append(label)
    for city in cities:etree.SubElement(footer_block,'p',{'data-typography':'content','data-ink':'muted'}).text=city['label']
    faq=dom.cssselect('#faq details');answers=[select(d,'p') for d in faq]
    set_text(answers[1],'O atendimento é realizado em '+join_names([c['label'] for c in cities])+', com base em '+cities[0]['name']+' e conforme disponibilidade.')
    titles=[select(card,'h3').text_content() for card in grid]
    set_text(answers[2],join_names(titles)+'.')
    audience='residências e pequenos comércios' if len(config['audiences'])==2 else 'residências' if config['audiences']==['residences'] else 'pequenos comércios'
    set_text(answers[3],'Sim. O atendimento contempla '+audience+', de acordo com o tipo e a complexidade do serviço.')
    urgent=config['policies']['urgent']
    if urgent:set_text(answers[4],'Sim, dentro do horário de atendimento e conforme disponibilidade. Não há promessa de atendimento imediato ou de chegada em um prazo fixo.')
    else:
        set_text(answers[4],'O atendimento é realizado com agendamento. Consulte os horários e a disponibilidade pelo WhatsApp.')
        for el in dom.cssselect('#diagnostico p'):
            for node in el.iter():
                if node.text:node.text=node.text.replace('Urgências são atendidas conforme disponibilidade dentro do horário de funcionamento.','O atendimento é realizado com agendamento.').replace('Urgências dependem da disponibilidade e do horário de atendimento.','O atendimento é realizado com agendamento.')
    hours=config['hours'];all_day=all(v and v['opens']==v['closes']=='00:00' for v in hours.values())
    schedule='; '.join(label+': '+display_hours(hours[key]) for key,label in [('weekdays','segunda a sexta'),('saturday','sábado'),('sundayHolidays','domingos e feriados')])
    set_text(answers[5],('Sim. O horário é de 24 horas, todos os dias.' if all_day else 'O horário de atendimento é '+schedule+'.')+' A disponibilidade do atendimento é confirmada pelo WhatsApp.')
    for el,key in zip(dom.cssselect('.footer-hours strong'),('weekdays','saturday','sundayHolidays')):set_text(el,display_hours(hours[key]))
    electrician=next(item for item in ld['@graph'] if item.get('@type')=='Electrician')
    electrician['telephone']='+'+config['contacts']['whatsapp'];electrician['areaServed']=[{'@type':'Place','name':city['label']} for city in cities]
    days=[('weekdays',['Monday','Tuesday','Wednesday','Thursday','Friday']),('saturday',['Saturday']),('sundayHolidays',['Sunday'])]
    electrician['openingHoursSpecification']=[{'@type':'OpeningHoursSpecification','dayOfWeek':[f'https://schema.org/{d}' for d in daynames],'opens':hours[key]['opens'],'closes':('23:59' if hours[key]['opens']==hours[key]['closes']=='00:00' else hours[key]['closes'])} for key,daynames in days if hours[key] is not None]
    electrician['hasOfferCatalog']['itemListElement']=[{'@type':'Offer','itemOffered':{'@type':'Service','name':title}} for title in titles]
    # No synthetic AggregateRating/Review structured data is emitted.
    electrician.pop('aggregateRating',None);electrician.pop('review',None)
    if config['experience']['since'] is None:
        for el in dom.cssselect('.about-proof__text'):
            if 'EXPLICIT_STATE_PENDING' in el.text_content() or 'Experiência desde' in el.text_content():set_text(el,'Orçamento antes da execução')
    # Configured action destinations replace all demo-only controls.
    for el in dom.cssselect('[data-demo-cta]'):
        el.tag='a';el.set('href',wa);el.set('target','_blank');el.set('rel','noopener noreferrer');el.set('data-client-contact','whatsapp')
        for key in ('type','data-demo-cta','aria-controls','aria-haspopup','data-review-demo-cta','data-social-demo'):el.attrib.pop(key,None)
    review_url=whatsapp(config,'Olá! Gostaria do link para avaliar o atendimento de '+identity['businessName']+' no Google.') if action['kind']=='request-link' else action['url']
    for el in dom.cssselect('[data-review-demo-cta]'):
        el.tag='a';el.set('href',review_url);el.set('target','_blank');el.set('rel','noopener noreferrer');el.set('data-client-review',action['kind'])
        for key in ('type','data-review-demo-cta','aria-controls','aria-haspopup'):el.attrib.pop(key,None)
    google_button=q('.google-review__button')
    if action['kind']=='request-link':
        # Text nodes remain inside the existing button, with the decorative arrow preserved.
        text_nodes=google_button.xpath('text()')
        if text_nodes:google_button.text='PEDIR LINK DE AVALIAÇÃO '
        else:set_text(google_button,'PEDIR LINK DE AVALIAÇÃO')
        step_texts=['Peça o link pelo WhatsApp','Receba a orientação para avaliar','Escreva uma avaliação sincera']
    else:step_texts=['Clique em Avaliar no Google','Abra a página e acesse Avaliações' if action['kind']=='profile' else 'Abra a tela de avaliação','Escreva uma avaliação sincera']
    for el,text in zip(dom.cssselect('[data-google-step-text]'),step_texts):set_text(el,text)
    for name in ('instagram','facebook','youtube','tiktok','google'):
        el=q('.footer-social--'+name);destination=config['google']['profileUrl'] if name=='google' else config['contacts']['socials'][name]
        el.tag='a';el.attrib.pop('type',None)
        for key in ('data-social-demo','data-review-demo-cta','aria-controls','aria-haspopup'):el.attrib.pop(key,None)
        label=el.get('title') or name.capitalize()
        if destination:
            el.set('href',destination);el.set('target','_blank');el.set('rel','noopener noreferrer');el.set('aria-label',label)
        else:
            # Explicit null retains the control and offers the real contact, not a fictional profile.
            el.set('href',whatsapp(config,'Olá! Gostaria do link de '+label+' de '+identity['businessName']+'.'));el.set('target','_blank');el.set('rel','noopener noreferrer');el.set('aria-label','Consultar '+label+' pelo WhatsApp');el.set('title','Consultar '+label)
    reviews=config['reviews'];intro=q('#avaliacoes .reviews-intro')
    for span in intro:span.text=(span.text or '').replace('relatos demonstrativos','relatos de clientes').replace('relatos demonstrativos','relatos de clientes')
    for row in dom.cssselect('.review-marquee-row'):row.set('aria-label','Avaliações de clientes: seis relatos distintos')
    badge=q('#avaliacoes .rating-badge')
    if reviews['presentation']=='invitation':
        # Consulting reviews and inviting a past customer are distinct messages.
        # This explicit alternative remains subject to its own visual approval.
        for key in headings['reviews-title']['variants']:headings['reviews-title']['variants'][key]='AVALIAÇÕES DO ATENDIMENTO'
        set_text(q('#reviews-title span'),'AVALIAÇÕES DO ATENDIMENTO')
        for span in intro:set_text(span,'Antes de contratar, tire suas dúvidas sobre o atendimento pelo WhatsApp. Para consultar avaliações no Google, peça o link do negócio.')
        q('#avaliacoes .reviews-marquee').getparent().remove(q('#avaliacoes .reviews-marquee'))
    if reviews['rating'] is None:
        link=html.Element('a',{'class':'btn','href':review_url,'target':'_blank','rel':'noopener noreferrer','data-typography':'cta','data-max-lines':'1','data-client-review':action['kind']});link.text='PEDIR LINK' if action['kind']=='request-link' else 'AVALIAR NO GOOGLE';badge.getparent().replace(badge,link)
    else:
        badge.set('aria-label',f"Nota de {reviews['rating']['score']:.1f} de 5, com {reviews['rating']['count']} avaliações no Google.".replace('.',',',1))
    # Explicit preview/live states; no demo event interception or fictitious dialogs remain.
    dom.set('data-volt-mode',stage)
    notice=q('#topo .nav-demo-label')
    if stage=='preview':set_text(notice,'TESTE FICTÍCIO' if config['publication'].get('kind')=='synthetic-test' else 'PRÉVIA');notice.set('aria-label','Exemplo fictício para testes' if config['publication'].get('kind')=='synthetic-test' else 'Prévia em revisão; publicação definitiva depende de aprovação')
    else:notice.getparent().remove(notice)
    for dialog in dom.xpath('//dialog'):dialog.getparent().remove(dialog)
    for el in dom.xpath('//*[@aria-label]'):
        el.set('aria-label',el.get('aria-label').replace(' — demonstração','').replace(' demonstrativas',''))
    # Describe illustrative assets honestly; never label the avatar as a real portrait.
    if config['assets']['mode']=='template-illustrations' or config['assets']['about']['contentType']=='illustration':
        set_text(q('.about__image-label > span'),'Imagem ilustrativa · elétrica')
    # Search/structured data share the same public identity and URL.
    for meta in dom.xpath('//meta[@name="description" or @property="og:description" or @name="twitter:description"]'):
        meta.set('content',meta.get('content').replace(' Site demonstrativo.','').replace('Site demonstrativo.',''))
    def clean_demo(value):
        if isinstance(value,str):return value.replace(' Site demonstrativo.','').replace('Site demonstrativo.','')
        if isinstance(value,list):return [clean_demo(item) for item in value]
        if isinstance(value,dict):return {key:clean_demo(item) for key,item in value.items()}
        return value
    ld=clean_demo(ld)
    robot=q('meta[name="robots"]');robot.set('content','index,follow,max-image-preview:large' if stage=='production' and config['publication'].get('indexable',True) else 'noindex,follow,max-image-preview:large')
    ldscript=dom.xpath('//script[@type="application/ld+json"]')[0];ldscript.text='\n'+json.dumps(ld,ensure_ascii=False,indent=2).replace('<','\\u003c')+'\n'
    for stop in dom.cssselect('#rating-badge-paper stop'):
        stop.set('stop-color','var(--accent-shield-top)' if stop.get('offset')=='0' else 'var(--accent)')
    csslink=html.Element('link',{'id':'volt-client-theme','rel':'stylesheet','href':'volt-theme.css'});q('link[href^="styles.css"]').addprevious(csslink)
    apply_benefits(dom,config,rootdir)
    runtime=client_runtime((rootdir/'volt-final.js').read_text(),headings,config)
    html_text=html.tostring(dom,encoding='unicode',method='html',doctype='<!doctype html>')+'\n'
    html_text=re.sub(r'<(?:img|meta|link|source|input|br|hr)\b[^>]*>',lambda m:m[0] if m[0].endswith('/>') else m[0][:-1]+' />',html_text)
    if '__EXPLICIT_STATE_PENDING__' in html_text or '{{' in html_text:raise ValueError('unresolved client state/token in generated HTML')
    return html_text,runtime,assets
