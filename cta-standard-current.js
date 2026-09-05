(() => {
  if (document.querySelector('#cta-standard-current-style')) return;

  const selectors = [
    '.nav-cta',
    '.hero__actions .btn',
    '.service-card__cta',
    '.services-other__cta',
    '.diagnostic .btn--accent',
    '.portfolio-closing__cta',
    '.about__action .btn',
    '.service-area .btn--accent',
    '.faq__cta',
    '.final-cta__action .btn',
    '.footer-contact__cta',
    '.footer-cta',
    '.mobile-cta .btn'
  ];

  const ctas = document.querySelectorAll(selectors.join(','));

  ctas.forEach((cta) => {
    cta.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.nodeValue?.trim()) {
        node.nodeValue = node.nodeValue.toUpperCase();
      }
    });
  });

  const style = document.createElement('style');
  style.id = 'cta-standard-current-style';
  style.textContent = `
    ${selectors.join(',\n    ')} {
      text-transform: uppercase !important;
    }
  `;

  document.head.appendChild(style);
})();