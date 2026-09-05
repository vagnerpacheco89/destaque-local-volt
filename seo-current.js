(() => {
  const siteUrl = 'https://vagnerpacheco89.github.io/destaque-local-volt/';
  const imageUrl = `${siteUrl}assets/asset-01-hero-quadro.webp`;

  document.documentElement.lang = 'pt-BR';
  document.title = 'Eletricista em Palhoça | Rafael Martins Elétrica';

  const upsertMeta = (selector, attrs) => {
    let meta = document.head.querySelector(selector);
    if (!meta) {
      meta = document.createElement('meta');
      document.head.appendChild(meta);
    }
    Object.entries(attrs).forEach(([key, value]) => meta.setAttribute(key, value));
    return meta;
  };

  upsertMeta('meta[name="description"]', {
    name: 'description',
    content: 'Eletricista em Palhoça para manutenção, instalações e reparos elétricos. Atendimento em Palhoça, São José e Florianópolis continental. Site demonstrativo.'
  });

  // O preview é fictício e não deve disputar busca local com negócios reais.
  // Em um cliente real, esta diretiva deve ser trocada por index,follow.
  upsertMeta('meta[name="robots"]', {
    name: 'robots',
    content: 'noindex,follow,max-image-preview:large'
  });

  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = siteUrl;

  upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
  upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'pt_BR' });
  upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'Rafael Martins Elétrica' });
  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: 'Eletricista em Palhoça | Rafael Martins Elétrica' });
  upsertMeta('meta[property="og:description"]', {
    property: 'og:description',
    content: 'Eletricista em Palhoça para manutenção, instalações e reparos elétricos, com atendimento também em São José e Florianópolis continental.'
  });
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: siteUrl });
  upsertMeta('meta[property="og:image"]', { property: 'og:image', content: imageUrl });
  upsertMeta('meta[property="og:image:alt"]', {
    property: 'og:image:alt',
    content: 'Eletricista trabalhando em quadro elétrico residencial em Palhoça.'
  });

  upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: 'Eletricista em Palhoça | Rafael Martins Elétrica' });
  upsertMeta('meta[name="twitter:description"]', {
    name: 'twitter:description',
    content: 'Manutenção, instalações e reparos elétricos em Palhoça e região.'
  });
  upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: imageUrl });

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Electrician',
    '@id': `${siteUrl}#eletricista`,
    name: 'Rafael Martins Elétrica',
    alternateName: 'Rafael Martins Eletricista',
    url: siteUrl,
    image: imageUrl,
    description: 'Eletricista em Palhoça para manutenção, instalações e reparos elétricos em residências e pequenos comércios, com atendimento também em São José e Florianópolis continental. Site demonstrativo.',
    areaServed: [
      { '@type': 'City', name: 'Palhoça' },
      { '@type': 'City', name: 'São José' },
      { '@type': 'Place', name: 'Florianópolis continental' }
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '08:00',
        closes: '13:00'
      }
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Serviços elétricos',
      itemListElement: [
        'Quadros elétricos e disjuntores',
        'Tomadas e novos pontos',
        'Iluminação',
        'Chuveiros e circuitos dedicados',
        'Manutenção e diagnóstico elétrico',
        'Fiação, aterramento, DR e DPS'
      ].map((name) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name }
      }))
    }
  };

  let schemaNode = document.head.querySelector('script[type="application/ld+json"]');
  if (!schemaNode) {
    schemaNode = document.createElement('script');
    schemaNode.type = 'application/ld+json';
    document.head.appendChild(schemaNode);
  }
  schemaNode.textContent = JSON.stringify(schema);

  // Reforço local natural dentro de uma introdução já existente, sem repetir palavras-chave artificialmente.
  const servicesIntro = document.querySelector('.services-heading__intro');
  if (servicesIntro) {
    servicesIntro.textContent = 'Em Palhoça e região, o atendimento vai do reparo pontual à instalação de novos pontos e circuitos, sempre começando pela avaliação do que realmente precisa ser corrigido ou instalado.';
  }

  // Os selos de confiança do hero não são subtítulos de seção. Corrige a hierarquia sem alterar o visual.
  document.querySelectorAll('.hero__trust-card h2').forEach((heading) => {
    const text = document.createElement('p');
    text.className = 'hero__trust-title';
    text.textContent = heading.textContent;
    heading.replaceWith(text);
  });

  const style = document.createElement('style');
  style.id = 'seo-current-style';
  style.textContent = `
    .hero__trust-card .hero__trust-title {
      margin:0;
      font-family:var(--font-body);
      font-size:10px;
      line-height:1.3;
      font-weight:800;
      letter-spacing:.03em;
      text-transform:uppercase;
      color:#e8e9e4;
    }

    @media (max-width:620px) {
      .hero__trust-grid--mobile .hero__trust-title {
        font-size:9px;
        line-height:1.28;
        overflow-wrap:anywhere;
      }
    }
  `;
  document.head.appendChild(style);
})();
