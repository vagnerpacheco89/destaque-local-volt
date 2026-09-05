(() => {
  if (document.querySelector('#volt-section-typography')) return;

  const style = document.createElement('style');
  style.id = 'volt-section-typography';
  style.textContent = `
    :root {
      --section-body-size: 1.02rem;
    }

    /*
      Padronização de corpo de texto após a Hero.
      Mantém títulos, eyebrows, botões, nomes, badges e metadados com
      suas próprias escalas para preservar a hierarquia visual.
    */
    main > section:not(.hero) .services-heading__intro,
    main > section:not(.hero) .service-card p,
    main > section:not(.hero) .services-other p,
    main > section:not(.hero) .diagnostic__body,
    main > section:not(.hero) .problem-panel li,
    main > section:not(.hero) .portfolio-intro,
    main > section:not(.hero) .portfolio-closing p,
    main > section:not(.hero) .process-intro,
    main > section:not(.hero) .process-grid p,
    main > section:not(.hero) .differentials li,
    main > section:not(.hero) .reviews-intro,
    main > section:not(.hero) .review-marquee-message,
    main > section:not(.hero) .about__copy > p:not(.eyebrow),
    main > section:not(.hero) .service-area .lead-text,
    main > section:not(.hero) .service-area .area-note,
    main > section:not(.hero) .faq__intro > p:not(.eyebrow),
    main > section:not(.hero) .faq details p,
    main > section:not(.hero) .final-cta__inner > div:first-child > p:not(.eyebrow),
    main > section:not(.hero) .section-heading > p:not(.eyebrow) {
      font-size: var(--section-body-size) !important;
    }

    /* A seção Sobre não tem mais diferença de escala entre os parágrafos. */
    main > section.about .about__copy > p.about__lead {
      font-size: var(--section-body-size) !important;
    }
  `;

  document.head.appendChild(style);
})();