#!/usr/bin/env python3
"""Regression checks for failure conditions and read-only --check.
Run with the same pinned environment as build-assets.py. Fixtures are temporary.
"""
import copy
import importlib.util
import json
from pathlib import Path
import shutil
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('assets_builder', Path(__file__).with_name('build-assets.py'))
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)


class AssetContract(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory(prefix='volt-assets-contract-')
        cls.original_root = builder.ROOT
        builder.ROOT = Path(cls.temp.name)
        for name in ('assets', 'assets.json', 'assets-manifest.json', 'index.html', 'volt-assets.css', 'favicon.svg', 'favicon.ico', 'favicon-32x32.png', 'apple-touch-icon.png'):
            src, dst = cls.original_root/name, builder.ROOT/name
            shutil.copytree(src, dst) if src.is_dir() else shutil.copy2(src,dst)
        cls.base = json.loads((builder.ROOT/'assets.json').read_text())

    @classmethod
    def tearDownClass(cls):
        builder.ROOT = cls.original_root
        cls.temp.cleanup()

    def setUp(self):
        self.config = copy.deepcopy(self.base)

    def reject(self, expected):
        (builder.ROOT/'assets.json').write_text(json.dumps(self.config))
        before = {p.relative_to(builder.ROOT):p.stat().st_mtime_ns for p in builder.ROOT.rglob('*') if p.is_file()}
        with self.assertRaisesRegex(ValueError, expected):
            builder.build(True)
        self.assertEqual(before, {p.relative_to(builder.ROOT):p.stat().st_mtime_ns for p in builder.ROOT.rglob('*') if p.is_file()})

    def test_01_duplicate_gallery_image(self):
        source = self.config['concepts']['cartoon']['gallery'][0]['source']
        shutil.copy2(builder.ROOT/source,builder.ROOT/'assets/test-duplicate.png')
        self.config['concepts']['cartoon']['gallery'][1]['source'] = 'assets/test-duplicate.png'
        self.reject('repeated image content')

    def test_02_missing_source(self):
        self.config['concepts']['cartoon']['hero']['source']='assets/missing.png'
        self.reject('missing/unsafe')

    def test_03_path_traversal(self):
        self.config['concepts']['cartoon']['hero']['source']='assets/../../etc/passwd'
        self.reject('missing/unsafe')

    def test_04_wrong_hero_role(self):
        self.config['concepts']['cartoon']['hero']['kind']='portrait'
        self.reject('complete background')

    def test_05_old_transparent_about_contract(self):
        self.config['concepts']['cartoon']['about']['kind']='portrait'
        self.reject('portrait-scene')

    def test_06_missing_gallery_position(self):
        self.config['concepts']['cartoon']['gallery'].pop()
        self.reject('10 to 20')

    def test_07_unlabelled_illustration(self):
        self.config['concepts']['cartoon']['gallery'][0]['alt']='Trabalho real do cliente'
        self.reject('label illustrative')

    def test_08_unapproved_position(self):
        self.config['concepts']['cartoon']['gallery'][0]['position']='0;display:none'
        self.reject('unapproved object position')

    def test_09_origin_mismatch(self):
        self.config['siteUrl']='https://other.example/'
        self.reject('differs from canonical')

    def test_10_read_only_full_check(self):
        (builder.ROOT/'assets.json').write_text(json.dumps(self.base))
        before = {p.relative_to(builder.ROOT):p.stat().st_mtime_ns for p in builder.ROOT.rglob('*') if p.is_file()}
        builder.build(True)
        self.assertEqual(before, {p.relative_to(builder.ROOT):p.stat().st_mtime_ns for p in builder.ROOT.rglob('*') if p.is_file()})

    def test_11_stale_generated_html(self):
        (builder.ROOT/'assets.json').write_text(json.dumps(self.base))
        path=builder.ROOT/'index.html'
        original=path.read_bytes()
        try:
            path.write_bytes(original.replace(b'height="941"',b'height="940"',1))
            with self.assertRaisesRegex(ValueError,'outputs differ/missing'):
                builder.build(True)
        finally:
            path.write_bytes(original)

    def test_12_transparent_scene_rejected(self):
        builder.Image.new('RGBA',(1672,941),(0,0,0,0)).save(builder.ROOT/'assets/transparent.png')
        self.config['concepts']['cartoon']['hero']['source']='assets/transparent.png'
        self.reject('full scene must be opaque')

    def test_13_corrupt_favicon_output(self):
        (builder.ROOT/'assets.json').write_text(json.dumps(self.base))
        path=builder.ROOT/'favicon.ico';original=path.read_bytes()
        try:
            path.write_bytes(b'corrupt test fixture')
            with self.assertRaisesRegex(ValueError,'outputs differ/missing'):
                builder.build(True)
            self.assertEqual(path.read_bytes(),b'corrupt test fixture')
        finally:
            path.write_bytes(original)

    def test_14_invisible_favicon_rejected(self):
        self.config['favicon']['foreground']='#070707'
        self.reject('contrast must be at least 3:1')


if __name__=='__main__':
    unittest.main()
