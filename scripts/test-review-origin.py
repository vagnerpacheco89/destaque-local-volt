import copy,json,unittest
from pathlib import Path
from lxml import html
from client.render import prepare_client
from client.schema import validate,InvalidClient
ROOT=Path(__file__).resolve().parent.parent
BASE=ROOT/'tests/fixtures'
class Origins(unittest.TestCase):
 def config(self,n):return json.loads((BASE/('persona-'+n+'.synthetic.json')).read_text())
 def test_four_explicit_origins(self):
  for n in ('caio','marina','bruno','ana'):self.assertEqual(validate(self.config(n),BASE),self.config(n))
 def test_direct_cannot_claim_google_rating(self):
  c=self.config('marina');c['reviews']['rating']=self.config('caio')['reviews']['rating']
  with self.assertRaisesRegex(InvalidClient,'direct testimonials'):validate(c,BASE)
 def test_unknown_origin_rejected(self):
  c=self.config('marina');c['reviews']['origin']='invented'
  with self.assertRaisesRegex(InvalidClient,'google or direct'):validate(c,BASE)
 def test_direct_keeps_cards_without_badge_or_replacement(self):
  for n in ('marina','ana'):
   t,j,a=prepare_client(ROOT,self.config(n));d=html.document_fromstring(t)
   self.assertEqual(len(d.cssselect('.review-marquee-card')),24)
   self.assertFalse(d.cssselect('.rating-badge,.reviews-head > a'))
   self.assertIn('DEPOIMENTOS DE CLIENTES',d.cssselect('#avaliacoes .eyebrow')[0].text_content())
   self.assertNotIn('AVALIAÇÕES NO GOOGLE',d.cssselect('#avaliacoes .eyebrow')[0].text_content())
   self.assertEqual(len(d.cssselect('#avaliar-no-google [data-client-review]')),1)
 def test_google_keeps_badge(self):
  for n in ('caio','bruno'):
   t,_,_=prepare_client(ROOT,self.config(n));d=html.document_fromstring(t)
   self.assertEqual(len(d.cssselect('.rating-badge')),1)
   self.assertEqual(len(d.cssselect('.review-marquee-card')),24)
 def test_all_testimonials_explicitly_synthetic(self):
  for n in ('caio','marina','bruno','ana'):
   t,_,_=prepare_client(ROOT,self.config(n));d=html.document_fromstring(t)
   self.assertTrue(all('Teste fictício' in s.text_content() or 'Cenário fictício' in s.text_content() for s in d.cssselect('.reviews-intro > span')))
   self.assertIn('TESTE FICTÍCIO',t)
 def test_actual_direct_copy_does_not_inherit_google_origin(self):
  c=self.config('marina');c['publication']['kind']='client'
  t,_,_=prepare_client(ROOT,c);d=html.document_fromstring(t)
  self.assertIn('recebidos diretamente',d.cssselect('.reviews-intro')[0].text_content())
  self.assertFalse(d.cssselect('.rating-badge'))
if __name__=='__main__':unittest.main()
