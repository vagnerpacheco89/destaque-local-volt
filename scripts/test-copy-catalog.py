#!/usr/bin/env python3
"""Copy contract regression checks. All synthetic inputs/outputs are temporary."""
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
ROOT=Path(__file__).resolve().parent.parent
spec=importlib.util.spec_from_file_location('copycat',ROOT/'scripts/copy-catalog.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
C=json.loads((ROOT/'copy/v1.json').read_text());D=json.loads((ROOT/'copy/demo-data.json').read_text())

class CopyContract(unittest.TestCase):
 def test_source_round_trip(self):
  paths=['index.html','volt-final.js','styles.css','volt-final.css','assets.json']
  before={p:hashlib.sha256((ROOT/p).read_bytes()).hexdigest() for p in paths}
  m.check(C,D)
  self.assertEqual(before,{p:hashlib.sha256((ROOT/p).read_bytes()).hexdigest() for p in paths})
 def test_unresolved_field_stops(self):
  with self.assertRaisesRegex(ValueError,'missing value'):m.render('{{missing}}',{})
 def test_missing_field_stops(self):
  d=copy.deepcopy(D);d['values'].pop('identity.contact_name')
  with self.assertRaisesRegex(ValueError,'fields differ'):m.check(C,d)
 def test_missing_occurrence_stops(self):
  c=copy.deepcopy(C);c['entries'].pop()
  with self.assertRaisesRegex(ValueError,'coverage differs'):m.check(c,D)
 def test_responsive_js_copy_is_checked(self):
  c=copy.deepcopy(C);next(e for e in c['entries'] if e['binding']['file']=='volt-final.js')['template']='Changed title'
  with self.assertRaisesRegex(ValueError,'source differs'):m.check(c,D)
 def test_six_unique_reviews_shared_by_copies(self):
  keys={key for e in C['entries'] for key in e['variables'] if key.startswith('reviews.') and key.endswith('.message')}
  self.assertEqual(len(keys),6)
  self.assertTrue(all(sum(key in e['variables'] for e in C['entries'])==4 for key in keys))
 def test_neighborhoods_scoped_to_three_cities(self):
  for city in range(1,4):self.assertEqual(len([k for k in C['fields'] if k.startswith(f'coverage.card_{city}.neighborhood_')]),10)
 def test_review_only_export_and_no_overwrite(self):
  with tempfile.TemporaryDirectory(prefix='volt-copy-test-') as folder:
   path=Path(folder);source=path/'input.json';output=path/'filled.json'
   data={'schemaVersion':1,'copyId':C['id'],'mode':'review-only','values':dict(D['values']),'confirmedFields':list(C['fields']),'confirmedDomains':C['requiredConfirmations'],'evidence':{'reviews':'SYNTHETIC QA fixture; not real client evidence','rating':'SYNTHETIC QA fixture; not real client evidence'},'approvedChanges':[]}
   data['values'].update({'identity.display_name':'PROFISSIONAL EXEMPLO QA','identity.business_name':'NEGÓCIO EXEMPLO QA','identity.contact_name':'EXEMPLO QA'})
   source.write_text(json.dumps(data))
   cmd=[sys.executable,str(ROOT/'scripts/copy-catalog.py'),'--data',str(source),'--output',str(output)]
   r=subprocess.run(cmd,capture_output=True,text=True);self.assertEqual(r.returncode,0,r.stdout+r.stderr)
   result=json.loads(output.read_text());self.assertEqual(result['status'],'filled-for-review-not-published');self.assertEqual(len(result['entries']),622)
   self.assertTrue(result['requiresInstanceAdaptation'])
   self.assertFalse(any('Rafael' in e['text'] or 'RAFAEL' in e['text'] for e in result['entries']))
   before=output.read_bytes();r=subprocess.run(cmd,capture_output=True,text=True);self.assertNotEqual(r.returncode,0);self.assertEqual(output.read_bytes(),before)
   output.unlink();data['evidence']={};source.write_text(json.dumps(data));r=subprocess.run(cmd,capture_output=True,text=True);self.assertNotEqual(r.returncode,0);self.assertFalse(output.exists())

if __name__=='__main__':unittest.main()
