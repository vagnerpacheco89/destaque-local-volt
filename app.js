(() => {
  const VERSION = '20260905-final-seo-1';

  const loadScript = (src) => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `${src}?v=${VERSION}`;
    script.async = true;
    script.addEventListener('load', resolve, { once: true });
    script.addEventListener('error', reject, { once: true });
    document.head.appendChild(script);
  });

  const loadSequence = async (...files) => {
    for (const file of files) await loadScript(file);
  };

  const init = async () => {
    try {
      // Base comum primeiro; depois cada seção é carregada em paralelo,
      // preservando apenas as dependências internas de cada grupo.
      await loadScript('dev-current.js');

      await Promise.all([
        loadSequence('diagnostic-current.js', 'mobile-diagnostic-current.js'),
        loadSequence('portfolio-current.js'),
        loadSequence('process-current.js'),
        loadSequence('reviews-current.js', 'reviews-badge-current.js', 'reviews-marquee-current.js'),
        loadSequence('about-current.js'),
        loadSequence('service-area-current.js', 'service-area-simple-current.js', 'service-area-map-current.js'),
        loadSequence('faq-current.js', 'faq-controls-current.js'),
        loadSequence('final-cta-current.js'),
        loadSequence('footer-current.js', 'brand-current.js', 'footer-bottom-current.js')
      ]);

      // Ajustes globais devem rodar depois que todas as seções já existem no DOM final.
      await loadScript('cta-standard-current.js');
      await loadScript('seo-current.js');
      await loadScript('typography-current.js');
    } catch (error) {
      console.error('VOLT: falha ao carregar os ajustes finais.', error);
    }
  };

  init();
})();
