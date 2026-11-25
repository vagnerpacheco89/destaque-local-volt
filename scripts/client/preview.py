"""Five supplied facts personalize a demonstrative VOLT, never a production site."""
import copy
import json
import re
from urllib.parse import urlencode, urlsplit
from lxml import html, etree
from tree_sitter import Language, Parser
import tree_sitter_javascript
from .render import load_module, pointer_set, render_entry, set_text, select
from .colors import migrate

MODE = 'personalized-template-preview'
KEYS = {'businessName', 'services', 'region', 'whatsapp', 'primaryColor'}


def validate_brief(data, origin, authorization):
    if not isinstance(data, dict) or set(data) != KEYS:
        raise ValueError('preview brief requires only businessName, services, region, whatsapp, primaryColor')
    def text(value):
        if not isinstance(value, str) or not value.strip() or any(c in value for c in '<>{}') or any(ord(c) < 32 for c in value):
            raise ValueError('preview inputs must be nonempty plain text')
        return value.strip()
    result = copy.deepcopy(data)
    for key in ('businessName', 'whatsapp', 'primaryColor'):
        result[key] = text(result[key])
    for key in ('services', 'region'):
        values = result[key] if isinstance(result[key], list) else [result[key]]
        if not values or len(values) > (12 if key == 'services' else 3):
            raise ValueError(key + ': 1–12 services / 1–3 named regions supported by VOLT')
        result[key] = [text(v) for v in values]
        if len(set(v.casefold() for v in result[key])) != len(values):
            raise ValueError(key + ': duplicate entries')
    if not re.fullmatch(r'[1-9]\d{7,14}', result['whatsapp']):
        raise ValueError('whatsapp: 8–15 international digits, without punctuation')
    if not re.fullmatch(r'#[0-9a-fA-F]{6}', result['primaryColor']):
        raise ValueError('primaryColor: approved #RRGGBB required')
    u = urlsplit(origin)
    if u.scheme != 'https' or not u.hostname or u.username or u.password or u.port or u.path != '/' or u.query or u.fragment:
        raise ValueError('preview URL: HTTPS origin ending in / required')
    text(authorization)
    return result


def render_preview(root, brief, origin):
    """Keep uncollected content as labelled examples, not fabricated confirmations."""
    cat = load_module('volt_preview_catalog', root / 'scripts/copy-catalog.py')
    catalog = json.loads((root / 'copy/v1.json').read_text())
    demo = json.loads((root / 'copy/demo-data.json').read_text())
    cat.check(catalog, demo)
    dom = html.document_fromstring((root / 'index.html').read_text())
    source_js = (root / 'volt-final.js').read_text()
    match = re.search(r'const voltHeadingCopies = (\{.*?\n\});', source_js, re.S)
    headings = json.loads(match[1])
    ld_element = select(dom, 'script[type="application/ld+json"]')
    ld = json.loads(ld_element.text)
    cities = [{'name': n, 'label': n} for n in brief['region']]
    context = {'coverage': {'cities': cities}, 'experience': {'since': int(demo['values']['experience.start_year'])}, 'audiences': ['residences', 'small-businesses']}
    values = dict(demo['values'])
    # No guessing a person's name: all identity slots use the supplied business name.
    values.update({
        'identity.business_name': brief['businessName'],
        'identity.display_name': brief['businessName'],
        'identity.contact_name': brief['businessName'],
        'contact.whatsapp_digits': brief['whatsapp'],
        'coverage.base_city': cities[0]['name'],
        'coverage.city_2': cities[1]['name'] if len(cities) > 1 else '',
        'coverage.city_3_name': cities[2]['name'] if len(cities) > 2 else '',
        'coverage.city_3_scope': cities[2]['name'] if len(cities) > 2 else '',
        'site.origin': origin,
        'policy.faq_answer_03': '; '.join(brief['services']) + '.',
        'map.embed_src': 'https://www.google.com/maps?' + urlencode({'q': cities[0]['name'], 'z': 11, 'output': 'embed'}),
    })
    allowed = ('identity.', 'coverage.base_city', 'coverage.city_2', 'coverage.city_3', 'contact.whatsapp_digits', 'site.origin', 'policy.faq_answer_03', 'map.embed_src')
    for entry in catalog['entries']:
        if not any(v.startswith(allowed) for v in entry['variables']):
            continue
        binding = entry['binding']
        if binding['kind'] == 'json':
            continue  # Matrix illustrations/alt descriptions remain demonstrative.
        text = render_entry(entry, values, context, cat.render)
        if binding['kind'] in ('text', 'attribute'):
            found = dom.xpath(binding['path'])
            if len(found) != 1:
                raise ValueError('preview binding not unique: ' + entry['id'])
            element = found[0]
            if binding['kind'] == 'attribute':
                element.set(binding['key'], text)
            else:
                nodes = [n for n in element.xpath('text()') if str(n).strip()]
                node = nodes[int(binding['key']) - 1]
                if node.is_text:
                    node.getparent().text = text
                else:
                    node.getparent().tail = text
        elif binding['kind'] == 'responsive-heading':
            pointer_set(headings, binding['path'], text)
        elif binding['kind'] == 'jsonld':
            pointer_set(ld, binding['path'], text)
    # Reuse existing cards and copy. Descriptions/icons remain template examples.
    grid = select(dom, '#servicos .services-grid')
    samples = [copy.deepcopy(c) for c in grid.cssselect('.service-card')]
    for card in list(grid):
        grid.remove(card)
    for i, name in enumerate(brief['services']):
        card = copy.deepcopy(samples[i % len(samples)])
        set_text(select(card, 'h3'), name)
        grid.append(card)
    coverage = select(dom, '.service-area__coverage')
    examples = [copy.deepcopy(c) for c in coverage.cssselect('.service-area__coverage-item')]
    for card in list(coverage):
        coverage.remove(card)
    for i, city in enumerate(cities):
        card = copy.deepcopy(examples[i])
        set_text(select(card, 'h3'), city['name'])
        coverage.append(card)
    map_frame = select(dom, '[data-base-city-map]')
    map_frame.set('src', values['map.embed_src'])
    # The matrix's demo label, fictitious review warning and illustrative images stay.
    dom.set('data-volt-mode', 'preview')
    dom.set('data-volt-preview-kind', MODE)
    select(dom, 'meta[name="robots"]').set('content', 'noindex,nofollow,max-image-preview:large')
    business = next((v for v in ld.get('@graph', []) if v.get('@type') == 'Electrician'), None)
    if business:
        business['telephone'] = '+' + brief['whatsapp']
        business['areaServed'] = [{'@type': 'Place', 'name': c['name']} for c in cities]
        business['hasOfferCatalog']['itemListElement'] = [{'@type': 'Offer', 'itemOffered': {'@type': 'Service', 'name': n}} for n in brief['services']]
    ld_element.text = '\n' + json.dumps(ld, ensure_ascii=False, indent=2).replace('<', '\\u003c') + '\n'
    # Activate only the supplied WhatsApp. Google/social actions keep demo dialogs.
    wa = 'https://wa.me/' + brief['whatsapp']
    for el in dom.cssselect('[data-demo-cta]'):
        el.tag = 'a'
        el.set('href', wa)
        el.set('target', '_blank')
        el.set('rel', 'noopener noreferrer')
        el.set('data-client-contact', 'whatsapp')
        for key in ('type', 'data-demo-cta', 'aria-controls', 'aria-haspopup'):
            el.attrib.pop(key, None)
    source_js = source_js[:match.start()] + 'const voltHeadingCopies = ' + json.dumps(headings, ensure_ascii=False).replace('<', '\\u003c') + ';' + source_js[match.end():]
    start = source_js.index('  /* Demo safety:')
    end = source_js.index('  if (menuButton && mobileMenu)', start)
    source_js = source_js[:start] + source_js[end:]
    source_js = source_js.replace("mobileMenu.querySelectorAll('a').forEach(link", "mobileMenu.querySelectorAll('a[href^=\"#\"]').forEach(link")
    # Do not alter the template's fitting, menu, FAQ, review or social runtime.
    if Parser(Language(tree_sitter_javascript.language())).parse(source_js.encode()).root_node.has_error:
        raise ValueError('invalid preview JavaScript')
    theme = html.Element('link', {'id': 'volt-client-theme', 'rel': 'stylesheet', 'href': 'volt-theme.css'})
    select(dom, 'link[href^="styles.css"]').addprevious(theme)
    text = html.tostring(dom, encoding='unicode', method='html', doctype='<!doctype html>') + '\n'
    text = re.sub(r'<(?:img|meta|link|source|input|br|hr)\b[^>]*>', lambda m: m[0] if m[0].endswith('/>') else m[0][:-1] + ' />', text)
    return text, source_js


def build_preview(root, brief, origin, authorization, work, builder):
    brief = validate_brief(brief, origin, authorization)
    site = work / 'site'
    site.mkdir()
    for name in ('volt-assets.css', 'robots.txt', 'sitemap.xml'):
        (site / name).write_bytes((root / name).read_bytes())
    import shutil
    shutil.copytree(root / 'assets/generated', site / 'assets/generated')
    manifest = json.loads((root / 'assets-manifest.json').read_text())
    theme = load_module('volt_preview_theme', root / 'scripts/build-theme.py')
    css, contrasts = theme.compile_theme({'primary': brief['primaryColor'], 'secondary': None})
    (site / 'volt-theme.css').write_text(css)
    (site / 'styles.css').write_text(migrate((root / 'styles.css').read_text()))
    (site / 'volt-final.css').write_text(migrate((root / 'volt-final.css').read_text(), True) + builder.CLIENT_CSS)
    assets = load_module('volt_preview_assets', root / 'scripts/build-assets.py')
    accent = re.search(r'--accent-text: (#[0-9a-f]+);', css)[1]
    icons = {}
    assets.favicons({'kind': 'volt-lightning', 'foreground': accent, 'background': '#050606'}, icons)
    for name, raw in icons.items():
        (site / name).write_bytes(raw)
    manifest['favicon'] = {'version': builder.sha(b''.join(icons[n] for n in sorted(icons)))[:12], 'files': {n: {'bytes': len(raw), 'sha256': builder.sha(raw)} for n, raw in icons.items()}}
    (site / 'assets-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    text, runtime = render_preview(root, brief, origin)
    (site / 'volt-final.js').write_text(runtime)
    for name in ('styles.css', 'volt-final.css', 'volt-final.js', 'volt-theme.css', *icons):
        text = re.sub(r'(href|src)="' + re.escape(name) + r'(?:\?[^\"]*)?"', lambda m: m[1] + '="' + name + '?v=' + builder.sha((site / name).read_bytes())[:12] + '"', text)
    (site / 'index.html').write_text(text)
    (site / 'robots.txt').write_text('User-agent: *\nDisallow: /\n')
    sitemap = etree.Element('urlset', nsmap={None: 'http://www.sitemaps.org/schemas/sitemap/0.9'})
    etree.SubElement(etree.SubElement(sitemap, 'url'), 'loc').text = origin
    (site / 'sitemap.xml').write_bytes(etree.tostring(sitemap, encoding='UTF-8', xml_declaration=True))
    files = builder.files_hash(site)
    matrix_dom = html.document_fromstring((root / 'index.html').read_text())
    return {'schemaVersion': 1, 'mode': MODE, 'stage': 'preview', 'status': 'generated-awaiting-browser-qa', 'sourceHash': builder.source_hash(), 'configHash': builder.sha(json.dumps({'brief': brief, 'url': origin, 'authorization': authorization}, sort_keys=True, ensure_ascii=False).encode()), 'artifactId': builder.artifact_id(files), 'files': files, 'contrasts': {k: round(v, 3) for k, v in contrasts.items()}, 'visualStatus': 'awaiting-human-review', 'composition': {'heroBenefits': [c.get('data-hero-benefit') for c in matrix_dom.cssselect('.hero__trust-card')[:4]], 'cities': len(brief['region']), 'coverageScopes': ['template-example'] * len(brief['region']), 'services': len(brief['services']), 'gallery': len(matrix_dom.cssselect('.portfolio-card')), 'reviews': 'demonstration', 'ratingBadge': True, 'assets': 'template-illustrations', 'logo': False}, 'confirmedDomains': sorted(KEYS), 'inheritedContent': 'Uncollected texts, service descriptions/icons, neighborhoods, schedule, conditions, benefits and reviews are unchanged demonstrative template examples. Not confirmed client facts. Production requires a new complete schema-2 configuration and new artifact.', 'notice': 'PREVIEW ONLY. Publish site/ only. Not production or publication approval.'}
