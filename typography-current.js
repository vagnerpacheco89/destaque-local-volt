(() => {
  if (document.querySelector('#volt-section-typography')) return;

  const style = document.createElement('style');
  style.id = 'volt-section-typography';
  style.textContent = `
    :root {
      --section-body-size: 16px;
      --section-intro-size: 17px;
      --section-meta-size: 12px;
      --section-button-size: 14px;
      --section-eyebrow-size: 12px;
    }

    /*
      Escala tipográfica padronizada após a Hero.
      Hero permanece intocada.
    */

    /* 1. Parágrafos principais — 16px */
    main > section:not(.hero) .service-card p,
    main > section:not(.hero) .services-other p,
    main > section:not(.hero) .diagnostic__body--second,
    main > section:not(.hero) .problem-panel li,
    main > section:not(.hero) .portfolio-closing p,
    main > section:not(.hero) .process-grid p,
    main > section:not(.hero) .differentials li,
    main > section:not(.hero) .review-marquee-message,
    main > section.about .about__copy > p:not(.eyebrow),
    main > section:not(.hero) .faq details p {
      font-size: var(--section-body-size) !important;
    }

    /* Sobre mim: todos os parágrafos com a mesma escala. */
    main > section.about .about__copy > p.about__lead {
      font-size: var(--section-body-size) !important;
    }

    /* 2. Introduções de seção — 17px */
    main > section:not(.hero) .services-heading__intro,
    main > section:not(.hero) .diagnostic__body:not(.diagnostic__body--second),
    main > section:not(.hero) .portfolio-intro,
    main > section:not(.hero) .process-intro,
    main > section:not(.hero) .reviews-intro,
    main > section:not(.hero) .service-area .lead-text,
    main > section:not(.hero) .faq__intro > p:not(.eyebrow),
    main > section:not(.hero) .final-cta__inner > div:first-child > p:not(.eyebrow),
    main > section:not(.hero) .section-heading > p:not(.eyebrow) {
      font-size: var(--section-intro-size) !important;
    }

    /* 3. Microtextos e metadados — 12px */
    main > section:not(.hero) small,
    main > section:not(.hero) .about__action-micro,
    main > section:not(.hero) .about__image-label span,
    main > section:not(.hero) .review-marquee-location,
    main > section:not(.hero) .portfolio-card figcaption span,
    main > section:not(.hero) .services-other__eyebrow,
    main > section:not(.hero) .problem-panel__label,
    main > section:not(.hero) .service-area .area-note {
      font-size: var(--section-meta-size) !important;
    }

    /* 4. Botões e CTAs — 14px */
    main > section:not(.hero) .btn,
    main > section:not(.hero) .service-card__cta,
    main > section:not(.hero) button {
      font-size: var(--section-button-size) !important;
    }

    /* 5. Eyebrows — 12px */
    main > section:not(.hero) .eyebrow {
      font-size: var(--section-eyebrow-size) !important;
    }
  `;

  document.head.appendChild(style);
})();