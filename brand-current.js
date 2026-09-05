(() => {
  const wordmarks = document.querySelectorAll('.wordmark');

  wordmarks.forEach((wordmark) => {
    const main = wordmark.querySelector('.wordmark__main');
    const sub = wordmark.querySelector('.wordmark__sub');

    if (main) main.textContent = 'RAFAEL MARTINS';
    if (sub) sub.textContent = 'ELETRICISTA';

    if (wordmark.closest('.site-header')) {
      wordmark.setAttribute('aria-label', 'Rafael Martins — eletricista — início');
    } else if (wordmark.closest('.site-footer')) {
      wordmark.setAttribute('aria-label', 'Rafael Martins — eletricista — voltar ao início');
    }
  });

  const backToTop = document.querySelector('.site-footer .footer-demo a[href="#topo"]');
  if (backToTop) {
    backToTop.addEventListener('click', (event) => {
      event.preventDefault();
      const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    });
  }

  const style = document.createElement('style');
  style.id = 'brand-current-style';
  style.textContent = `
    .site-header .wordmark,
    .site-footer .footer-brand--polished .wordmark {
      grid-template-columns:auto max-content !important;
    }

    .site-header .wordmark__main,
    .site-footer .footer-brand--polished .wordmark__main {
      white-space:nowrap;
    }

    .site-header .wordmark__sub,
    .site-footer .footer-brand--polished .wordmark__sub {
      grid-column:2 !important;
      width:100% !important;
      justify-self:stretch !important;
      text-align:center !important;
      letter-spacing:.17em !important;
    }
  `;

  document.head.appendChild(style);
})();