(() => {
  'use strict';

  const menuButton = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('#mobile-menu');
  const dialog = document.querySelector('#demo-dialog');
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      menuButton.setAttribute('aria-label', expanded ? 'Abrir menu' : 'Fechar menu');
      mobileMenu.hidden = expanded;
    });

    mobileMenu.addEventListener('click', (event) => {
      if (!event.target.closest('a')) return;
      mobileMenu.hidden = true;
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menu');
    });
  }

  const faqDetails = [...document.querySelectorAll('.faq details')];
  faqDetails.forEach((details) => {
    details.addEventListener('toggle', () => {
      if (!details.open) return;
      faqDetails.forEach((other) => {
        if (other !== details) other.open = false;
      });
    });
  });

  const demoSelectors = [
    '[data-demo-cta]',
    '.service-card__cta',
    '.services-other__cta'
  ].join(',');

  document.addEventListener('click', (event) => {
    const cta = event.target.closest(demoSelectors);
    if (!cta) return;

    if (cta.tagName === 'A') event.preventDefault();

    if (dialog && typeof dialog.showModal === 'function' && !dialog.open) {
      dialog.showModal();
    }
  });

  if (dialog) {
    dialog.addEventListener('click', (event) => {
      const rect = dialog.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (!inside) dialog.close();
    });
  }

  const backToTop = document.querySelector('.site-footer .footer-demo a[href="#topo"]');
  backToTop?.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll([
      '.section-heading',
      '.services-heading',
      '.service-card',
      '.services-other',
      '.diagnostic__grid > *',
      '.portfolio-card',
      '.portfolio-closing',
      '.process-grid > li',
      '.differentials > *',
      '.reviews-head > *',
      '.review-marquee-card',
      '.about__grid > *',
      '.service-area__grid > *',
      '.faq__grid > *',
      '.final-cta__inner > *'
    ].join(','));

    revealTargets.forEach((element, index) => {
      element.classList.add('reveal-item');
      element.style.setProperty('--reveal-delay', `${(index % 4) * 55}ms`);
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });

    revealTargets.forEach((element) => revealObserver.observe(element));
  }
})();
