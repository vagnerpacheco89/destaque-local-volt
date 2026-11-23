"""Strict public-site inputs. Unknown/missing facts are errors, never defaults."""
from pathlib import Path
import re
from urllib.parse import urlsplit

DOMAINS=['identity','coverage','services','hours','policies','contacts','colors','reviews','publication','assets']
SOCIALS={'instagram':{'www.instagram.com','instagram.com'},'facebook':{'www.facebook.com','facebook.com','fb.com'},'youtube':{'www.youtube.com','youtube.com','youtu.be'},'tiktok':{'www.tiktok.com','tiktok.com'}}
class InvalidClient(ValueError):pass

def validate(data,base):
    errors=[]
    def err(path,message):errors.append(path+': '+message)
    def obj(value,path,keys,optional=()):
        if not isinstance(value,dict):err(path,'expected object');return {}
        for key in set(keys)-set(value):err(path+'.'+key,'missing confirmed input')
        for key in set(value)-set(keys)-set(optional):err(path+'.'+key,'unknown field')
        return value
    def text(v,path):
        if not isinstance(v,str) or not v.strip() or any(x in v for x in ['<','>','{{','}}']) or any(ord(x)<32 for x in v):err(path,'expected nonempty plain text');return ''
        return v
    def url(value,path,hosts=None):
        value=text(value,path);u=urlsplit(value)
        if u.scheme!='https' or not u.hostname or u.username or u.password:err(path,'confirmed HTTPS URL required')
        if hosts and u.hostname not in hosts:err(path,'unexpected destination host')
        return value
    def source(v,path,dimensions=False):
        v=text(v,path);raw=base/v if not Path(v).is_absolute() else Path(v);p=raw.resolve()
        if raw.is_symlink():err(path,'symlink sources are not accepted')
        if not p.is_file() or p.is_symlink():err(path,'source must be an existing regular local file')
        return p
    obj(data,'client',['schemaVersion','copyId','stage','identity','publication','colors','coverage','services','audiences','experience','hours','policies','contacts','google','reviews','assets','confirmations'],['copyOverrides','brand'])
    if data.get('schemaVersion')!=1 or data.get('copyId')!='volt-copy-v1':err('schema','expected client schema 1 / volt-copy-v1')
    if data.get('stage') not in ('preview','production'):err('stage','preview or production required')
    identity=obj(data.get('identity'),'identity',['businessName','displayName','contactName'])
    for k,v in identity.items():text(v,'identity.'+k)
    pub=obj(data.get('publication'),'publication',['url','copyrightYear','authorization'],['indexable','approval','kind'])
    if pub.get('kind','client') not in ('client','synthetic-test'):err('publication.kind','client or synthetic-test required')
    origin=url(pub.get('url'),'publication.url');u=urlsplit(origin)
    if u.path!='/' or u.query or u.fragment:err('publication.url','origin ending in /, without path/query/fragment')
    text(pub.get('authorization'),'publication.authorization')
    if not isinstance(pub.get('copyrightYear'),int) or not 2000<=pub.get('copyrightYear',0)<=2100:err('publication.copyrightYear','year required')
    if data.get('stage')=='preview' and pub.get('indexable',False):err('publication.indexable','previews must remain noindex')
    if data.get('stage')=='production':text(pub.get('approval'),'publication.approval')
    if 'indexable' in pub and not isinstance(pub['indexable'],bool):err('publication.indexable','confirmed boolean required')
    colors=obj(data.get('colors'),'colors',['primary','secondary'])
    for key in ('primary','secondary'):
        v=colors.get(key)
        if key=='secondary' and v is None:continue
        if not isinstance(v,str) or not re.fullmatch(r'#[0-9a-fA-F]{6}',v):err('colors.'+key,'confirmed #RRGGBB required')
    coverage=obj(data.get('coverage'),'coverage',['cities','map'])
    cities=coverage.get('cities',[])
    if not isinstance(cities,list) or not 1<=len(cities)<=3:err('coverage.cities','1-3 confirmed cities required');cities=[]
    for i,c in enumerate(cities):
        path=f'coverage.cities[{i}]';obj(c,path,['name','label','scope','neighborhoods'])
        for k in ('name','label'):text(c.get(k),path+'.'+k)
        if c.get('scope') not in ('neighborhoods','citywide'):err(path+'.scope','choose neighborhoods or explicitly confirmed citywide')
        ns=c.get('neighborhoods')
        if c.get('scope')=='neighborhoods':
            if not isinstance(ns,list) or not 10<=len(ns)<=15:err(path+'.neighborhoods','10-15 confirmed names required')
            elif len(set(ns))!=len(ns):err(path+'.neighborhoods','duplicate names')
            else:
                for n in ns:text(n,path+'.neighborhoods')
        elif ns!=[]:err(path+'.neighborhoods','citywide mode uses an explicit empty list; do not infer coverage from missing names')
    if len({c.get('name') for c in cities})!=len(cities):err('coverage.cities','duplicate cities')
    mp=obj(coverage.get('map'),'coverage.map',['latitude','longitude','desktopZoom','mobileZoom'])
    for k,limit in [('latitude',90),('longitude',180)]:
        if not isinstance(mp.get(k),(int,float)) or isinstance(mp.get(k),bool) or not -limit<=mp[k]<=limit:err('coverage.map.'+k,'confirmed numeric coordinate required')
    for k in ('desktopZoom','mobileZoom'):
        if not isinstance(mp.get(k),int) or not 1<=mp.get(k,0)<=20:err('coverage.map.'+k,'zoom 1-20 required')
    services=data.get('services',[])
    if not isinstance(services,list) or not 6<=len(services)<=12:err('services','6-12 confirmed services required; do not invent services to fill the grid');services=[]
    ids=[]
    for i,s in enumerate(services):
        if isinstance(s,str):ids.append(s)
        elif isinstance(s,dict):
            obj(s,f'services[{i}]',['id','title','variants','icon','approval']);ids.append(s.get('id'));text(s.get('title'),f'services[{i}].title');text(s.get('approval'),f'services[{i}].approval')
            v=obj(s.get('variants'),f'services[{i}].variants',['compact','medium','regular','large'])
            for k,value in v.items():text(value,f'services[{i}].variants.'+k)
        else:err(f'services[{i}]','approved library id or approved custom service object required')
    for value in ids:
        if not isinstance(value,str) or not re.fullmatch(r'[a-z][a-z0-9-]*',value):err('services','plain unique service ids required')
    if len(set(ids))!=len(ids):err('services','duplicate service identifiers')
    if data.get('audiences') not in (['residences'],['small-businesses'],['residences','small-businesses']):err('audiences','explicit supported audience list required')
    exp=obj(data.get('experience'),'experience',['since'])
    if exp.get('since') is not None and (not isinstance(exp['since'],int) or not 1950<=exp['since']<=pub.get('copyrightYear',0)):err('experience.since','confirmed start year or explicit null required')
    hours=obj(data.get('hours'),'hours',['weekdays','saturday','sundayHolidays'])
    for group,h in hours.items():
        if h is None:continue
        obj(h,'hours.'+group,['opens','closes'])
        for k,v in h.items():
            if not isinstance(v,str) or not re.fullmatch(r'(?:[01]\d|2[0-3]):[0-5]\d',v):err('hours.'+group+'.'+k,'HH:MM required')
        if h.get('opens')==h.get('closes') and h.get('opens')!='00:00':err('hours.'+group,'equal hours only allowed for explicit 00:00/00:00 (24h)')
    policies=obj(data.get('policies'),'policies',['urgent','quoteBeforeWork','materialsBeforeWork','warrantyAnswer','invoiceAnswer','paymentAnswer','approval'])
    for k in ('urgent','quoteBeforeWork','materialsBeforeWork'):
        if not isinstance(policies.get(k),bool):err('policies.'+k,'confirmed boolean required')
    for k in ('warrantyAnswer','invoiceAnswer','paymentAnswer','approval'):text(policies.get(k),'policies.'+k)
    if policies.get('quoteBeforeWork') is not True or policies.get('materialsBeforeWork') is not True:err('policies','V1 requires quote/materials agreed before execution; incompatible facts require a separately approved copy version')
    contacts=obj(data.get('contacts'),'contacts',['whatsapp','socials','whatsappMessage'])
    if not isinstance(contacts.get('whatsapp'),str) or not re.fullmatch(r'[1-9]\d{7,14}',contacts['whatsapp']):err('contacts.whatsapp','8-15 international digits required')
    text(contacts.get('whatsappMessage'),'contacts.whatsappMessage')
    socials=obj(contacts.get('socials'),'contacts.socials',['instagram','facebook','youtube','tiktok'])
    for k,value in socials.items():
        if value is not None:url(value,'contacts.socials.'+k,SOCIALS.get(k))
    google=obj(data.get('google'),'google',['profileUrl','reviewAction'])
    if google.get('profileUrl') is not None:url(google['profileUrl'],'google.profileUrl',{'www.google.com','google.com','maps.google.com','maps.app.goo.gl','g.page'})
    action=obj(google.get('reviewAction'),'google.reviewAction',['kind','url'])
    if action.get('kind') not in ('direct','profile','request-link'):err('google.reviewAction.kind','direct, profile, or explicit request-link required')
    if action.get('kind')=='request-link':
        if action.get('url') is not None:err('google.reviewAction.url','request-link uses confirmed WhatsApp, not an inferred Google URL')
    else:url(action.get('url'),'google.reviewAction.url',{'www.google.com','google.com','search.google.com','maps.google.com','maps.app.goo.gl','g.page'})
    reviews=obj(data.get('reviews'),'reviews',['presentation','items','rating','source','approval'])
    if reviews.get('presentation') not in ('verified','invitation'):err('reviews.presentation','explicit verified or invitation mode required; no automatic removal')
    items=reviews.get('items',[])
    if reviews.get('presentation')=='verified':
        if not isinstance(items,list) or len(items)!=6:err('reviews.items','six distinct verified reports required for this approved composition')
        else:
            for i,item in enumerate(items):
                obj(item,f'reviews.items[{i}]',['message','name','initials','location','source'])
                for k,v in item.items():text(v,f'reviews.items[{i}].'+k)
            if len({i.get('message') for i in items})!=6:err('reviews.items','reports must be distinct')
        text(reviews.get('source'),'reviews.source')
    elif items!=[] or reviews.get('rating') is not None:err('reviews','invitation uses explicit empty reports and null rating; never fictional social proof')
    text(reviews.get('approval'),'reviews.approval')
    rating=reviews.get('rating')
    if rating is not None:
        obj(rating,'reviews.rating',['score','count','source'])
        if not isinstance(rating.get('score'),(int,float)) or not 1<=rating['score']<=5:err('reviews.rating.score','1-5 required')
        if not isinstance(rating.get('count'),int) or rating['count']<len(items):err('reviews.rating.count','confirmed count >= supplied reports required')
        text(rating.get('source'),'reviews.rating.source')
    assets=obj(data.get('assets'),'assets',['mode','hero','about','gallery'])
    if assets.get('mode') not in ('template-illustrations','client-files'):err('assets.mode','explicit template-illustrations or client-files required')
    if assets.get('mode')=='template-illustrations':
        if any(assets.get(k) is not None for k in ('hero','about','gallery')):err('assets','template illustration mode must not contain ambiguous client file overrides')
    else:
        all_images=[('hero',assets.get('hero')),('about',assets.get('about'))]
        gallery=assets.get('gallery')
        if not isinstance(gallery,list) or not 10<=len(gallery)<=20:err('assets.gallery','10-20 approved distinct images required');gallery=[]
        all_images +=[(f'gallery[{i}]',v) for i,v in enumerate(gallery)]
        for key,image in all_images:
            obj(image,'assets.'+key,['file','contentType','alt','approval'])
            if not isinstance(image,dict):continue
            source(image.get('file'),'assets.'+key+'.file');text(image.get('alt'),'assets.'+key+'.alt');text(image.get('approval'),'assets.'+key+'.approval')
            if image.get('contentType') not in ('illustration','photograph'):err('assets.'+key+'.contentType','explicit illustration or photograph required')
    brand=obj(data.get('brand',{}),'brand',[],['logo','favicon'])
    for k,v in brand.items():
        if v is not None:source(v,'brand.'+k)
    for key,v in data.get('copyOverrides',{}).items():
        obj(v,'copyOverrides.'+key,['text','approval']);text(v.get('text'),'copyOverrides.'+key+'.text');text(v.get('approval'),'copyOverrides.'+key+'.approval')
    conf=obj(data.get('confirmations'),'confirmations',DOMAINS)
    for k,v in conf.items():text(v,'confirmations.'+k)
    if errors:raise InvalidClient('\n'.join(errors))
    return data
