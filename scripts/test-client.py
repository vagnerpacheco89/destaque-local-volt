#!/usr/bin/env python3
"""Client contract checks. All people, sources and contacts are synthetic."""
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from lxml import html
from client.schema import validate,InvalidClient
from client.render import prepare_client

ROOT=Path(__file__).resolve().parent.parent
def fixture(name='a'):return json.loads((ROOT/f'tests/fixtures/client-{name}.synthetic.json').read_text())
spec=importlib.util.spec_from_file_location('builder',ROOT/'scripts/build-client.py');builder=importlib.util.module_from_spec(spec);spec.loader.exec_module(builder)

class ClientContract(unittest.TestCase):
 def test_visual_approval_requires_exact_artifact_and_composition(self):
  report={'artifactId':'synthetic-hash','sourceHash':'synthetic-source','composition':{'cities':1,'reviews':'invitation'}}
  approval={**report,'reviewer':'SYNTHETIC TEST','approvalReference':'SYNTHETIC TEST ONLY'}
  builder.check_visual_approval(approval,report)
  for key in ('artifactId','sourceHash','composition','reviewer','approvalReference'):
   changed=copy.deepcopy(approval);changed.pop(key)
   with self.assertRaisesRegex(ValueError,'visual approval'):builder.check_visual_approval(changed,report)
  changed=copy.deepcopy(approval);changed['composition']['cities']=3
  with self.assertRaisesRegex(ValueError,'visual approval'):builder.check_visual_approval(changed,report)
 def test_invitation_does_not_duplicate_google_complement(self):
  text,_,_=prepare_client(ROOT,fixture('b'));dom=html.document_fromstring(text)
  intros=dom.cssselect('#avaliacoes .reviews-intro > span')
  complement=dom.cssselect('.google-review__description')[0].text_content().strip()
  self.assertTrue(intros)
  self.assertTrue(all(e.text_content().strip()!=complement for e in intros))
  self.assertFalse(dom.cssselect('#avaliacoes .review-marquee-card,#avaliacoes .rating-badge'))
 def test_explicit_states_valid(self):
  for n in ('a','b'):self.assertEqual(validate(fixture(n),ROOT),fixture(n))
 def test_missing_contact_never_inherits_demo(self):
  c=fixture();del c['contacts']['whatsapp']
  with self.assertRaisesRegex(InvalidClient,'contacts.whatsapp'):validate(c,ROOT)
 def test_missing_confirmation_stops(self):
  c=fixture();del c['confirmations']['coverage']
  with self.assertRaisesRegex(InvalidClient,'confirmations.coverage'):validate(c,ROOT)
 def test_unknown_config_key_stops(self):
  c=fixture();c['apiKey']='SYNTHETIC_NOT_A_SECRET'
  with self.assertRaisesRegex(InvalidClient,'unknown field'):validate(c,ROOT)
 def test_preview_cannot_index(self):
  c=fixture();c['publication']['indexable']=True
  with self.assertRaisesRegex(InvalidClient,'noindex'):validate(c,ROOT)
 def test_production_needs_approval_reference(self):
  c=fixture();c['stage']='production'
  with self.assertRaisesRegex(InvalidClient,'publication.approval'):validate(c,ROOT)
 def test_fact_incompatible_with_v1_stops(self):
  c=fixture();c['policies']['quoteBeforeWork']=False
  with self.assertRaisesRegex(InvalidClient,'incompatible facts'):validate(c,ROOT)
 def test_no_coverage_inference(self):
  c=fixture('b');c['coverage']['cities'][0]['scope']='neighborhoods'
  with self.assertRaisesRegex(InvalidClient,'10-15'):validate(c,ROOT)
 def test_fake_or_incomplete_reviews_stops(self):
  c=fixture();c['reviews']['items'].pop()
  with self.assertRaisesRegex(InvalidClient,'six distinct'):validate(c,ROOT)
 def test_no_hidden_review_mode_switch(self):
  c=fixture();c['reviews']['presentation']='invitation'
  with self.assertRaisesRegex(InvalidClient,'explicit empty'):validate(c,ROOT)
 def test_plain_text_and_destination_hosts(self):
  c=fixture();c['identity']['displayName']='<script>'
  with self.assertRaisesRegex(InvalidClient,'plain text'):validate(c,ROOT)
  c=fixture();c['contacts']['socials']['instagram']='https://unrelated.invalid/'
  with self.assertRaisesRegex(InvalidClient,'host'):validate(c,ROOT)
 def test_source_does_not_change_during_render(self):
  names=['index.html','styles.css','volt-final.css','volt-final.js','assets.json']
  before={n:hashlib.sha256((ROOT/n).read_bytes()).hexdigest() for n in names}
  for n in ('a','b'):prepare_client(ROOT,fixture(n))
  self.assertEqual(before,{n:hashlib.sha256((ROOT/n).read_bytes()).hexdigest() for n in names})
 def test_one_city_no_experience_no_urgency(self):
  text,js,_=prepare_client(ROOT,fixture('b'));dom=html.document_fromstring(text)
  self.assertEqual(len(dom.cssselect('.service-area__coverage-item')),1)
  self.assertNotIn('Rafael',text+js);self.assertNotIn('Palhoça',text+js)
  self.assertNotIn('Site demonstrativo.',text);self.assertNotIn('também em Curitiba',text)
  self.assertNotIn('Curitiba e região',text);self.assertNotIn('CURITIBA E REGIÃO',text)
  self.assertNotIn('Experiência desde',text);self.assertNotIn('2017',text)
  self.assertEqual(len(dom.cssselect('#avaliacoes .reviews-marquee')),0)
  self.assertIn('SUA EXPERIÊNCIA CONTA',text)
  self.assertEqual(len(dom.cssselect('.footer-socials__icons a')),6)
  self.assertEqual(len(dom.cssselect('dialog,[data-demo-cta],[data-review-demo-cta]')),0)
  self.assertEqual('Pague no Pix ou cartão',dom.cssselect('.hero__trust-card')[2].text_content().strip())
  self.assertIn('agendamento',dom.cssselect('#faq details')[4].text_content())
 def test_single_audience_does_not_inherit_the_other(self):
  for audience,forbidden in [(['residences'],'pequenos comércios e demandas'),(['small-businesses'],'residências, pequenos comércios')]:
   c=fixture('b');c['audiences']=audience
   text,_,_=prepare_client(ROOT,validate(c,ROOT));self.assertNotIn(forbidden,text)
 def test_contacts_metadata_and_hours_share_facts(self):
  c=fixture();c['hours']={k:{'opens':'00:00','closes':'00:00'} for k in c['hours']}
  text,_,_=prepare_client(ROOT,validate(c,ROOT));dom=html.document_fromstring(text)
  self.assertTrue(all(c['contacts']['whatsapp'] in a.get('href') for a in dom.cssselect('[data-client-contact]')))
  ld=json.loads(dom.cssselect('script[type="application/ld+json"]')[0].text)
  business=next(n for n in ld['@graph'] if n.get('@type')=='Electrician')
  self.assertEqual(business['telephone'],'+'+c['contacts']['whatsapp'])
  self.assertEqual(len(business['areaServed']),2)
  self.assertEqual(business['openingHoursSpecification'][0]['closes'],'23:59')
  self.assertNotIn('aggregateRating',business)
  self.assertIn('24 horas, todos os dias',text)
 def test_factual_overrides_cannot_diverge(self):
  c=fixture();cat=json.loads((ROOT/'copy/v1.json').read_text());e=next(e for e in cat['entries'] if e['variables'])
  c['copyOverrides']={e['id']:{'text':'Outra identidade','approval':'SYNTHETIC'}}
  with self.assertRaisesRegex(ValueError,'shared factual'):prepare_client(ROOT,c)
 def test_optional_sources_symlinks_rejected(self):
  with tempfile.TemporaryDirectory() as d:
   p=Path(d);(p/'real.png').write_bytes(b'fixture');(p/'link.png').symlink_to(p/'real.png')
   c=fixture();c['brand']={'logo':str(p/'link.png')}
   with self.assertRaisesRegex(InvalidClient,'symlink'):validate(c,p)
 def test_normalized_client_image_strips_metadata(self):
  from PIL import Image
  with tempfile.TemporaryDirectory() as d:
   p=Path(d);exif=Image.Exif();exif[0x010E]='PRIVATE SYNTHETIC SOURCE NOTE'
   Image.new('RGB',(200,180),'white').save(p/'source.jpg',exif=exif)
   builder.source_image('source.jpg',p/'normalized.png',p,'logo')
   with Image.open(p/'normalized.png') as normalized:
    self.assertEqual(normalized.size,(200,180));self.assertFalse(normalized.getexif());self.assertNotIn('PRIVATE',str(normalized.info))
 def test_client_favicon_adapter_preserves_square_contract(self):
  from PIL import Image
  assets=builder.load_module('assets_icon_test',ROOT/'scripts/build-assets.py')
  with tempfile.TemporaryDirectory() as d:
   p=Path(d);(p/'assets').mkdir();Image.new('RGB',(180,180),'blue').save(p/'assets/approved.png');Image.new('RGB',(200,180),'blue').save(p/'assets/wide.png')
   old=assets.ROOT;assets.ROOT=p
   try:
    outputs={};assets.favicons({'kind':'client-raster','source':'assets/approved.png','background':'#050606'},outputs)
    self.assertEqual(set(outputs),{'favicon.svg','favicon.ico','favicon-32x32.png','apple-touch-icon.png'})
    self.assertIn(b'data:image/png;base64,',outputs['favicon.svg'])
    with self.assertRaisesRegex(ValueError,'square PNG'):assets.favicons({'kind':'client-raster','source':'assets/wide.png','background':'#050606'}, {})
   finally:assets.ROOT=old
 def test_client_file_dimensions_and_duplicates_are_checked(self):
  from PIL import Image
  assets=builder.load_module('assets_test',ROOT/'scripts/build-assets.py')
  with tempfile.TemporaryDirectory() as d:
   p=Path(d);(p/'assets').mkdir();Image.new('RGB',(100,100),'red').save(p/'assets/small.png')
   old=assets.ROOT;assets.ROOT=p
   try:
    with self.assertRaisesRegex(ValueError,'minimum 1600x900'):assets.checked_source({'source':'assets/small.png','kind':'background','position':'right center','alt':'Fotografia fornecida pelo cliente: teste','contentType':'photograph'},'hero')
   finally:assets.ROOT=old

 def test_hero_benefits_require_four_confirmed_nonredundant_choices(self):
  for change in ('missing','short','duplicate','unknown','unconfirmed','extra_param','redundant'):
   c=fixture()
   if change=='missing':c.pop('heroBenefits')
   elif change=='short':c['heroBenefits'].pop()
   elif change=='duplicate':c['heroBenefits'][1]=copy.deepcopy(c['heroBenefits'][0])
   elif change=='unknown':c['heroBenefits'][0]['id']='promessa_inventada'
   elif change=='unconfirmed':c['heroBenefits'][2]['confirmation']=''
   elif change=='extra_param':c['heroBenefits'][0]['parameters']={'texto':'garantido'}
   else:c['heroBenefits'][1]={'id':'aprovacao_previa','parameters':{},'confirmation':'SYNTHETIC'}
   with self.subTest(change=change):
    with self.assertRaisesRegex(InvalidClient,'heroBenefits'):validate(c,ROOT)
 def test_benefits_have_parameters_icons_and_no_demo_defaults(self):
  from client.benefits import bank,validate_selection
  c=fixture();c['heroBenefits']=[{'id':'orcamento_previo','parameters':{},'confirmation':'SYNTHETIC'},{'id':'experiencia','parameters':{'ano':c['experience']['since']},'confirmation':'SYNTHETIC'},{'id':'parcelamento','parameters':{'parcelas':3},'confirmation':'SYNTHETIC'},{'id':'nota_fiscal','parameters':{},'confirmation':'SYNTHETIC'}]
  text,_,_=prepare_client(ROOT,validate(c,ROOT));dom=html.document_fromstring(text)
  expected=[t for _,t in validate_selection(c,ROOT)]
  for grid in dom.cssselect('.hero__trust-grid'):
   self.assertEqual([p.text_content() for p in grid.cssselect('.hero__trust-title')],expected)
   self.assertEqual([a.get('data-hero-benefit') for a in grid.cssselect('article')],[x['id'] for x in c['heroBenefits']])
  self.assertNotIn('Pague no Pix ou cartão',[p.text_content() for p in dom.cssselect('.hero__trust-title')])
  c['heroBenefits'][1]['parameters']['ano']=1901
  with self.assertRaisesRegex(InvalidClient,'heroBenefits'):validate(c,ROOT)
 def test_matrix_benefits_match_the_approved_bank_in_both_grids(self):
  from client.benefits import bank
  from lxml import etree
  b=bank(ROOT);entries={e['id']:e for e in b['entries']};dom=html.document_fromstring((ROOT/'index.html').read_text())
  for grid in dom.cssselect('.hero__trust-grid'):
   for card,choice in zip(grid.cssselect('article'),b['demoSelection']):
    e=entries[choice['id']];self.assertEqual(card.get('data-hero-benefit'),e['id']);self.assertEqual(card.cssselect('p')[0].text_content(),e['text'])
    expected=etree.fromstring(('<svg>'+b['icons'][e['icon']]+'</svg>').encode())
    shape=lambda svg:[(n.tag,dict(n.attrib)) for n in svg]
    self.assertEqual(shape(card.cssselect('svg')[0]),shape(expected))

if __name__=='__main__':unittest.main()
