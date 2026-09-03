(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('#mobile-menu');
  const dialog = document.querySelector('#demo-dialog');

  // VOLT DEV — ajustes rápidos de polimento da seção Serviços.
  // Quando a seção for aprovada, estes ajustes serão consolidados no HTML/CSS canônico.
  const servicesHeading = document.querySelector('.services-heading');
  if (servicesHeading && !servicesHeading.querySelector('.services-heading__intro')) {
    const intro = document.createElement('p');
    intro.className = 'services-heading__intro';
    intro.textContent = 'Do reparo pontual à instalação de novos pontos e circuitos, o atendimento começa pela avaliação do que realmente precisa ser corrigido ou instalado.';
    servicesHeading.appendChild(intro);
  }

  const servicesPolish = document.createElement('style');
  servicesPolish.textContent = `
    .services-heading__intro {
      max-width: 760px;
      margin: 20px 0 0;
      color: #9da39f;
      font-size: .92rem;
      line-height: 1.6;
    }
    .services-other {
      border-left-color: #202422 !important;
    }
    .service-card {
      min-height: 238px !important;
    }
    .service-card__body {
      min-height: 220px !important;
      padding-bottom: 14px !important;
    }
    .service-card__cta {
      margin-top: 14px !important;
    }
    @media (max-width: 980px) {
      .service-card {
        min-height: 218px !important;
      }
      .service-card__body {
        min-height: 206px !important;
        padding-bottom: 12px !important;
      }
    }
  `;
  document.head.appendChild(servicesPolish);

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      mobileMenu.hidden = expanded;
      menuButton.setAttribute('aria-label', expanded ? 'Abrir menu' : 'Fechar menu');
    });

    mobileMenu.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        mobileMenu.hidden = true;
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Abrir menu');
      }
    });
  }

  const mobileCta = document.querySelector('.mobile-cta');
  const heroPrimaryCta = document.querySelector('.hero__actions [data-demo-cta]');
  if (mobileCta && heroPrimaryCta && 'IntersectionObserver' in window) {
    const ctaObserver = new IntersectionObserver((entries) => {
      const heroCtaVisible = entries[0]?.isIntersecting;
      mobileCta.classList.toggle('is-visible', !heroCtaVisible);
    }, { threshold: 0.2 });
    ctaObserver.observe(heroPrimaryCta);
  } else if (mobileCta) {
    mobileCta.classList.add('is-visible');
  }

  // VOLT v0.22 — progressive reveal. Mantém o conteúdo visível sem JS e
  // respeita prefers-reduced-motion.
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll([
      '.section-heading',
      '.services-heading',
      '.service-card',
      '.services-other',
      '.diagnostic__grid > *',
      '.portfolio-card',
      '.process-grid > li',
      '.differentials > *',
      '.reviews-head > *',
      '.reviews-grid > blockquote',
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

  document.querySelectorAll('[data-demo-cta]').forEach((button) => {
    button.addEventListener('click', () => {
      if (dialog && typeof dialog.showModal === 'function') dialog.showModal();
    });
  });

  if (dialog) {
    dialog.addEventListener('click', (event) => {
      const rect = dialog.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (!inside) dialog.close();
    });
  }
})();
