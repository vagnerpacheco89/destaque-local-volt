(() => {
  'use strict';

  const menuButton = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('#mobile-menu');
  const dialog = document.querySelector('#demo-dialog');
  const header = document.querySelector('.site-header');
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  /* Demo safety: service CTAs never retain an external WhatsApp destination. */
  document.querySelectorAll('.service-card__cta, .services-other__cta').forEach((anchor) => {
    anchor.setAttribute('href', '#contato');
    anchor.removeAttribute('target');
    anchor.removeAttribute('rel');
    anchor.setAttribute('data-demo-cta', '');
  });

  document.querySelectorAll('[data-demo-cta]').forEach((cta) => {
    cta.setAttribute('aria-haspopup', 'dialog');
    cta.setAttribute('aria-controls', 'demo-dialog');
  });

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

  document.addEventListener('click', (event) => {
    const cta = event.target.closest('[data-demo-cta]');
    if (!cta) return;

    if (dialog && typeof dialog.showModal === 'function') {
      event.preventDefault();
      if (!dialog.open) dialog.showModal();
      return;
    }

    if (cta.tagName === 'BUTTON') {
      const fallbackTarget = document.querySelector('#contato');
      fallbackTarget?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  });

  if (dialog) {
    dialog.addEventListener('click', (event) => {
      const rect = dialog.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (!inside) dialog.close();
    });
  }

  /* Internal navigation accounts for the sticky header on desktop and mobile. */
  document.querySelectorAll('a[href^="#"]:not([data-demo-cta])').forEach((anchor) => {
    const hash = anchor.getAttribute('href');
    if (!hash || hash === '#') return;

    anchor.addEventListener('click', (event) => {
      const target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      const headerOffset = (header?.getBoundingClientRect().height || 0) + 12;
      const top = hash === '#topo'
        ? 0
        : Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerOffset);

      window.scrollTo({ top, left: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      if (history.replaceState) history.replaceState(null, '', hash);
    });
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
