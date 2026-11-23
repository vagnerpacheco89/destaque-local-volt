#!/usr/bin/env python3
"""Build/check every configurable VOLT image from assets.json.

Hero is a complete landscape scene; About is a portrait WITH its setting.
Gallery preserves the approved mosaic and focal points. All variants retain
source proportions, never upscale, and contain no baked-in page copy.
See the single official implementation manual linked from README.md.
"""
import argparse
import base64
import hashlib
import html
import io
import json
from pathlib import Path
import re
import sys
from urllib.parse import urlparse

try:
    import PIL
    from PIL import Image, ImageDraw, ImageOps
except ImportError:
    sys.exit('STOP: install scripts/requirements-assets.txt in a virtual environment first')

ROOT = Path(__file__).resolve().parent.parent
WIDTHS = (480, 768, 1120, 1280)
QUALITY = 88
GENERATOR_VERSION = 3
TRANSPARENT = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
POSITIONS = {'center center', 'center 10%', '65% 10%', 'right center', 'center top'}
CLASSES = ('square', 'wide', 'wide', 'portrait', 'wide', 'wide', 'square', 'wide', 'wide', 'wide')
POINTS = ((34, 6), (16.8, 33.56), (29.2, 33.56), (22.8, 58), (47.2, 25.76), (34.8, 25.76))


def digest(raw):
    return hashlib.sha256(raw).hexdigest()


def local_file(name):
    if not isinstance(name, str) or not re.fullmatch(r'assets/[A-Za-z0-9_./-]+', name):
        raise ValueError(f'invalid local source: {name!r}')
    path = ROOT / name
    if path.is_symlink() or not path.resolve().is_relative_to((ROOT / 'assets').resolve()) or not path.is_file():
        raise ValueError(f'missing/unsafe local source: {name}')
    return path


def checked_source(asset, role):
    if set(asset)-{'contentType'} != ({'id', 'source', 'alt', 'position'} if role == 'gallery' else {'kind', 'source', 'alt', 'position'}):
        raise ValueError(f'{role}: unexpected/missing configuration keys')
    if not isinstance(asset['alt'], str) or not asset['alt'].strip():
        raise ValueError(f'{role}: descriptive alt is required')
    if asset['position'] not in POSITIONS:
        raise ValueError(f'{role}: unapproved object position')
    path = local_file(asset['source'])
    with Image.open(path) as opened:
        if opened.format != 'PNG':
            raise ValueError(f'{role}: use the approved PNG master, not a screenshot/WebP')
        if opened.convert('RGBA').getextrema()[3][0] != 255:
            raise ValueError(f'{role}: full scene must be opaque; no transparent avatar cutout')
        image = ImageOps.exif_transpose(opened).convert('RGB')
    w, h = image.size
    content_type=asset.get('contentType','illustration')
    if content_type not in ('illustration','photograph'):
        raise ValueError(f'{role}: contentType must be illustration or photograph')
    if role == 'hero' and (asset['kind'] != 'background' or w < 1600 or h < 900 or w / h < 1.5 or asset['position'] != 'right center'):
        raise ValueError('hero: complete background, minimum 1600x900, character right; never a cutout')
    if role == 'about' and (asset['kind'] != 'portrait-scene' or w < 1000 or h < 1200 or not .65 <= w/h <= .9 or asset['position'] != 'center top'):
        raise ValueError('about: portrait-scene with setting, minimum 1000x1200, center top')
    prefix='Ilustração' if content_type=='illustration' else 'Fotografia fornecida pelo cliente:'
    if role == 'gallery' and (max(w, h) < 1000 or min(w, h) < 720 or not asset['alt'].startswith(prefix)):
        raise ValueError('gallery: master >=1000px long edge / >=720px short edge; label illustrative content or client photograph accurately')
    if role == 'gallery' and not re.fullmatch(r'work-\d{2}', asset['id']):
        raise ValueError('gallery: stable id must match work-NN')
    return image, path.read_bytes()


def variants(image, slot, outputs):
    w, h = image.size
    result = []
    for width in sorted({x for x in WIDTHS if x < w} | {w}):
        scaled = image if width == w else image.resize((width, round(h * width / w)), Image.Resampling.LANCZOS)
        out = io.BytesIO()
        scaled.save(out, 'WEBP', quality=QUALITY, method=6, exact=True)
        raw = out.getvalue()
        name = f'assets/generated/{slot}-{width}-{digest(raw)[:12]}.webp'
        outputs[name] = raw
        result.append({'src': name, 'width': width, 'height': scaled.height, 'bytes': len(raw), 'sha256': digest(raw)})
    return result


def gallery_sizes(index, ratio):
    # sizes describes pixels needed BEFORE object-fit:cover, not just box width.
    # ceil/rounding and borders are conservatively covered by using outer boxes.
    def cover(width, height):
        return f'max({width}, {height * ratio:.2f}px)'
    first = index == 1
    phone = cover('calc(100vw - 32px)', 452 if first else 220)
    tablet_width = 'calc(100vw - 40px)' if first or index == 8 else 'calc((100vw - 52px) / 2)'
    tablet = cover(tablet_width, 392 if first else 190)
    if index >= 11:
        # Approved 11-20-card completion rules can expand final cards to full width.
        desktop = cover('min(1180px, calc(100vw - 40px))', 326)
    else:
        spans = (5, 4, 3, 4, 3, 4, 4, 4, 6, 6)
        desktop = cover(f'calc((min(1180px, calc(100vw - 40px)) - 132px) * {spans[index-1]} / 12 + {(spans[index-1]-1)*12}px)', 668 if first else 328)
    return f'(max-width:560px) {phone}, (max-width:760px) {tablet}, {desktop}'


def image_tag(slot, asset, items, sizes, hero=False):
    native = items[-1]
    attrs = {
        'data-asset-slot': slot, 'src': native['src'],
        'srcset': ', '.join(f'{v["src"]} {v["width"]}w' for v in items),
        'sizes': sizes, 'width': str(native['width']), 'height': str(native['height']),
        'alt': asset['alt'], 'style': f'object-position:{asset["position"]}',
        ('fetchpriority' if hero else 'loading'): ('high' if hero else 'lazy'), 'decoding': 'async'
    }
    return '<img ' + ' '.join(f'{k}="{html.escape(v, quote=True)}"' for k, v in attrs.items()) + ' />'


def replace_once(pattern, replacement, text, label):
    updated, count = re.subn(pattern, lambda _: replacement, text, flags=re.S)
    if count != 1:
        raise ValueError(f'{label}: expected exactly one target, found {count}')
    return updated


def favicons(config, outputs):
    if config.get('kind')=='client-raster':
        if set(config)!={'kind','source','background'} or not re.fullmatch(r'#[0-9a-fA-F]{6}',config['background']):
            raise ValueError('client favicon: kind/source/background required')
        with Image.open(local_file(config['source'])) as opened:
            if opened.format!='PNG' or opened.width!=opened.height or opened.width<180:
                raise ValueError('client favicon: approved square PNG >=180px required; no automatic crop')
            icon=opened.convert('RGBA').resize((180,180),Image.Resampling.LANCZOS)
        opaque=Image.new('RGBA',(180,180),config['background']);opaque.alpha_composite(icon)
        buf=io.BytesIO();opaque.convert('RGB').save(buf,'PNG',optimize=True)
        outputs['apple-touch-icon.png']=buf.getvalue()
        encoded=base64.b64encode(buf.getvalue()).decode()
        outputs['favicon.svg']=(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><image width="180" height="180" href="data:image/png;base64,{encoded}"/></svg>\n').encode()
        buf=io.BytesIO();opaque.resize((32,32),Image.Resampling.LANCZOS).save(buf,'PNG',optimize=True);outputs['favicon-32x32.png']=buf.getvalue()
        buf=io.BytesIO();opaque.resize((48,48),Image.Resampling.LANCZOS).save(buf,'ICO',sizes=[(16,16),(32,32),(48,48)]);outputs['favicon.ico']=buf.getvalue()
        return digest(b''.join(outputs[n] for n in ('favicon.svg','favicon.ico','favicon-32x32.png','apple-touch-icon.png')))[:12]
    if set(config) != {'kind', 'foreground', 'background'} or config['kind'] != 'volt-lightning':
        raise ValueError('favicon: only approved volt-lightning geometry; a different brand needs its own approved adapter')
    for key in ('foreground', 'background'):
        if not re.fullmatch(r'#[0-9a-fA-F]{6}', config[key]):
            raise ValueError('favicon: foreground/background must be #RRGGBB')
    if config['foreground'].lower() == config['background'].lower():
        raise ValueError('favicon: foreground must differ from background')
    def luminance(color):
        channels = [int(color[i:i+2],16)/255 for i in (1,3,5)]
        linear = [c/12.92 if c<=.04045 else ((c+.055)/1.055)**2.4 for c in channels]
        return sum(c*k for c,k in zip(linear,(.2126,.7152,.0722)))
    light,dark = sorted((luminance(config['foreground']),luminance(config['background'])),reverse=True)
    if (light+.05)/(dark+.05)<3:
        raise ValueError('favicon: symbol/background contrast must be at least 3:1; use an approved legible brand variant')
    fg, bg = config['foreground'], config['background']
    points = ' '.join(f'{x:g},{y:g}' for x, y in POINTS)
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="{bg}"/><polygon fill="{fg}" points="{points}"/></svg>\n'
    outputs['favicon.svg'] = svg.encode()
    im = Image.new('RGBA', (1024, 1024))
    draw = ImageDraw.Draw(im)
    draw.rounded_rectangle((0, 0, 1023, 1023), radius=192, fill=bg)
    draw.polygon([(x*16, y*16) for x, y in POINTS], fill=fg)
    ico = io.BytesIO()
    im.resize((48, 48), Image.Resampling.LANCZOS).save(ico, 'ICO', sizes=[(16,16), (32,32), (48,48)])
    outputs['favicon.ico'] = ico.getvalue()
    for name, size, base in [('favicon-32x32.png', 32, im), ('apple-touch-icon.png', 180, None)]:
        if base is None:
            base = Image.new('RGB', (1024,1024), bg)
            ImageDraw.Draw(base).polygon([(x*16, y*16) for x,y in POINTS], fill=fg)
        out = io.BytesIO()
        base.resize((size,size), Image.Resampling.LANCZOS).save(out, 'PNG', optimize=True)
        outputs[name] = out.getvalue()
    return digest(b''.join(outputs[n] for n in ('favicon.svg','favicon.ico','favicon-32x32.png','apple-touch-icon.png')))[:12]


def build(check=False):
    if PIL.__version__ != '13.0.0':
        raise ValueError('install the pinned Pillow version from scripts/requirements-assets.txt')
    config = json.loads((ROOT / 'assets.json').read_text())
    if set(config) != {'schemaVersion','activeConcept','concepts','favicon','siteUrl','characterSheet'} or config['schemaVersion'] != 3:
        raise ValueError('unsupported assets.json schema/keys; expected schemaVersion 3')
    origin = config['siteUrl']
    u = urlparse(origin)
    if u.scheme != 'https' or not u.netloc or u.username or u.password or u.query or u.fragment or u.path != '/':
        raise ValueError('siteUrl: confirmed HTTPS origin ending in / is required')
    sheet = local_file(config['characterSheet'])
    with Image.open(sheet) as image:
        if image.format != 'PNG':
            raise ValueError('characterSheet: approved PNG reference required')
        image.verify()
    slots = config['concepts'].get(config['activeConcept'])
    if not slots or set(slots) != {'hero', 'about', 'gallery'}:
        raise ValueError('active concept requires hero, about and gallery; no fallback')
    gallery = slots['gallery']
    if not isinstance(gallery, list) or not 10 <= len(gallery) <= 20:
        raise ValueError('gallery: approved mosaic requires 10 to 20 distinct entries')
    if len({a['id'] for a in gallery}) != len(gallery):
        raise ValueError('gallery: duplicate stable ids')
    all_assets = [('hero', slots['hero'], 'hero'), ('about', slots['about'], 'about')] + [(a['id'],a,'gallery') for a in gallery]
    # Validate all inputs before building or writing any output.
    checked, gallery_hashes = [], set()
    for slot, asset, role in all_assets:
        image, source_raw = checked_source(asset, role)
        pixel_hash = digest(image.tobytes())
        if role == 'gallery':
            if pixel_hash in gallery_hashes:
                raise ValueError('gallery: repeated image content (including differently named copies)')
            gallery_hashes.add(pixel_hash)
        checked.append((slot, asset, role, image, digest(source_raw)))
    outputs, manifest = {}, {'schemaVersion':3,'generatorVersion':GENERATOR_VERSION,'pillow':PIL.__version__,'concept':config['activeConcept'],'images':{}}
    icon_version = favicons(config['favicon'], outputs)
    for slot, asset, role, image, sha in checked:
        items = variants(image, slot, outputs)
        manifest['images'][slot] = {'source':asset['source'],'sourceSha256':sha,'width':image.width,'height':image.height,'position':asset['position'],'variants':items}
    text = (ROOT / 'index.html').read_text()
    canonical = re.search(r'<link rel="canonical" href="([^"]+)"', text)
    if not canonical or html.unescape(canonical.group(1)) != origin:
        raise ValueError('siteUrl differs from canonical; confirm the publication origin before generating assets')
    # Remove only our prior hero picture wrapper; no other page structure is managed here.
    text = re.sub(r'<picture data-asset-picture="hero">.*?</picture>', lambda m: re.search(r'<img\b[^>]*>',m.group()).group(), text, flags=re.S)
    hero = manifest['images']['hero']['variants']
    hero_sizes = '(max-width:620px) max(100vw, 640px), max(100vw, 782px)'
    tag = image_tag('hero',slots['hero'],hero,hero_sizes,True)
    picture = f'<picture data-asset-picture="hero"><source media="(min-width:861px)" srcset="{TRANSPARENT}" />{tag}</picture>'
    text = replace_once(r'<img\b[^>]*data-asset-slot="hero"[^>]*>',picture,text,'hero')
    about = manifest['images']['about']['variants']
    about_tag = image_tag('about',slots['about'],about,'(max-width:480px) calc(100vw - 48px), (max-width:1080px) 404px, 500px')
    text = replace_once(r'<img\b[^>]*data-asset-slot="about"[^>]*>',about_tag,text,'about')
    figures = []
    for n,a in enumerate(gallery,1):
        image = manifest['images'][a['id']]
        tag = image_tag(a['id'],a,image['variants'],gallery_sizes(n,image['width']/image['height']))
        cls = CLASSES[n-1] if n <= len(CLASSES) else 'wide'
        figures.append(f'          <figure class="portfolio-card portfolio-card--{cls}">{tag}</figure>')
    text = replace_once(r'<div class="portfolio-grid">.*?\n        </div>', '<div class="portfolio-grid">\n'+'\n'.join(figures)+'\n        </div>', text,'gallery')
    # Synchronize share images, their descriptive alt, and the Electrician JSON-LD image.
    hero_url = origin + hero[-1]['src']
    for name in ('og:image','twitter:image'):
        attr = 'property' if name.startswith('og:') else 'name'
        text = replace_once(rf'<meta {attr}="{name}" content="[^"]*"\s*/>',f'<meta {attr}="{name}" content="{html.escape(hero_url,quote=True)}" />',text,name)
    text = replace_once(r'<meta property="og:image:alt" content="[^"]*"\s*/>', f'<meta property="og:image:alt" content="{html.escape(slots["hero"]["alt"],quote=True)}" />',text,'og alt')
    text = replace_once(r'"image":\s*"[^"]*"', '"image": '+json.dumps(hero_url), text,'JSON-LD image')
    icon_links = '\n'.join([
        f'  <link rel="icon" href="favicon.ico?v={icon_version}" sizes="16x16 32x32 48x48" />',
        f'  <link rel="icon" type="image/png" href="favicon-32x32.png?v={icon_version}" sizes="32x32" />',
        f'  <link rel="icon" type="image/svg+xml" href="favicon.svg?v={icon_version}" sizes="any" />',
        f'  <link rel="apple-touch-icon" href="apple-touch-icon.png?v={icon_version}" sizes="180x180" />'])
    text = replace_once(r'  <link rel="icon" href=.*?<link rel="apple-touch-icon"[^>]*>',icon_links,text,'favicon links')
    bg1 = next((v for v in hero if v['width']>=1280),hero[-1])['src']
    bg2 = hero[-1]['src']
    preload = f'<link data-asset-preload="hero" rel="preload" as="image" media="(min-width:861px)" href="{bg1}" imagesrcset="{bg1} 1x, {bg2} 2x" fetchpriority="high" />'
    text = re.sub(r'\s*<link data-asset-preload="hero"[^>]*>', '', text)
    text = text.replace('</head>', '  '+preload+'\n</head>')
    css = ('/* Generated from assets.json; do not edit. Desktop composition stays in styles.css. */\n'
           f':root {{ --volt-hero-background: url("{bg2}"); }}\n'
           '@supports (background-image: image-set(url("x.webp") 1x)) {\n'
           f'  :root {{ --volt-hero-background: image-set(url("{bg1}") 1x, url("{bg2}") 2x); }}\n'
           '}\n.hero__frame picture { display:contents; }\n')
    outputs['volt-assets.css'] = css.encode()
    text = replace_once(r'<link rel="stylesheet" href="volt-assets.css\?v=[^"]*"\s*/>',f'<link rel="stylesheet" href="volt-assets.css?v={digest(css.encode())[:12]}" />',text,'asset css')
    outputs['index.html'] = text.encode()
    manifest['favicon'] = {'version':icon_version,'files':{n:{'bytes':len(outputs[n]),'sha256':digest(outputs[n])} for n in ('favicon.svg','favicon.ico','favicon-32x32.png','apple-touch-icon.png')}}
    outputs['assets-manifest.json'] = (json.dumps(manifest,ensure_ascii=False,indent=2)+'\n').encode()
    differences = [name for name,raw in outputs.items() if not (ROOT/name).is_file() or (ROOT/name).read_bytes()!=raw]
    if check and differences:
        raise ValueError('generated outputs differ/missing: '+', '.join(differences[:8])+'; run build-assets.py')
    if not check:
        for name,raw in outputs.items():
            dest = ROOT/name
            dest.parent.mkdir(parents=True,exist_ok=True)
            dest.write_bytes(raw)
    total = sum(v['bytes'] for a in manifest['images'].values() for v in a['variants'])
    print(f'OK: {config["activeConcept"]}; hero + about + {len(gallery)} gallery + 4 favicons; {len(outputs)} outputs; {total} image bytes; '+('verified' if check else 'generated'))
    return manifest


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check',action='store_true',help='read-only rebuild and byte comparison of ALL generated assets')
    args = parser.parse_args()
    try:
        build(args.check)
    except (KeyError,TypeError,ValueError,OSError) as exc:
        sys.exit(f'STOP: {exc}')
