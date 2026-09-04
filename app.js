(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('#mobile-menu');
  const dialog = document.querySelector('#demo-dialog');

  // VOLT DEV — ajustes rápidos de polimento da seção Serviços.
  const servicesHeading = document.querySelector('.services-heading');
  if (servicesHeading && !servicesHeading.querySelector('.services-heading__intro')) {
    const intro = document.createElement('p');
    intro.className = 'services-heading__intro';
    intro.textContent = 'Do reparo pontual à instalação de novos pontos e circuitos, o atendimento começa pela avaliação do que realmente precisa ser corrigido ou instalado.';
    servicesHeading.appendChild(intro);
  }

  // VOLT DEV — primeira passada de polimento da seção Diagnóstico/Urgência.
  const diagnostic = document.querySelector('.diagnostic');
  if (diagnostic) {
    const lead = diagnostic.querySelector('.lead-text');
    const support = diagnostic.querySelector('.diagnostic__grid > div:first-child > p:not(.eyebrow):not(.lead-text)');
    const note = diagnostic.querySelector('.availability-note');
    const panelLabel = diagnostic.querySelector('.problem-panel__label');
    const problemList = diagnostic.querySelector('.problem-panel ul');

    if (lead) {
      lead.textContent = 'Falhas elétricas nem sempre mostram a causa de imediato. O diagnóstico ajuda a identificar o problema antes de definir a correção.';
    }

    if (support) {
      support.classList.add('diagnostic__support');
      support.textContent = 'No primeiro contato, Rafael pode pedir fotos ou vídeos para entender o cenário. Quando a avaliação presencial é necessária, o orçamento é apresentado antes da execução.';
    }

    if (note) {
      note.innerHTML = '<strong>Urgências:</strong> atendimento no horário de funcionamento e conforme disponibilidade. Não é atendimento 24h.';
    }

    if (panelLabel) panelLabel.textContent = 'SINAIS QUE MERECEM ATENÇÃO';

    if (problemList) {
      const problems = [
        'Disjuntor desarmando',
        'Parte do imóvel sem energia',
        'Tomada aquecendo',
        'Cheiro de queimado ou falha elétrica',
        'Chuveiro com problema',
        'Curto-circuito interno'
      ];
      problemList.innerHTML = problems.map((problem) => `<li>${problem}</li>`).join('');
    }
  }

  const voltDevPolish = document.createElement('style');
  voltDevPolish.textContent = `
    /* Serviços — aprovado */
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

    /* Diagnóstico / Urgência — em polimento */
    .diagnostic {
      background:
        radial-gradient(620px 360px at 86% 14%, rgba(244,196,0,.055), transparent 68%),
        linear-gradient(180deg, #0a0c0c 0%, #080a0a 100%) !important;
      border-block-color:#202424 !important;
    }
    .diagnostic__grid {
      grid-template-columns:minmax(0,1.05fr) minmax(420px,.95fr) !important;
      gap:56px !important;
      align-items:start !important;
    }
    .diagnostic__grid > div:first-child {
      padding-top:4px;
    }
    .diagnostic h2 {
      max-width:640px !important;
      font-size:clamp(3.1rem,4.5vw,4.25rem);
      margin-bottom:20px;
    }
    .diagnostic .lead-text {
      max-width:650px;
      color:#e2e4df;
      font-size:1rem;
      line-height:1.58;
      margin-bottom:14px;
    }
    .diagnostic__support {
      max-width:650px;
      color:#989e99;
      font-size:.9rem;
      line-height:1.6;
      margin-bottom:0;
    }
    .diagnostic .availability-note {
      margin:22px 0 18px;
      padding:13px 15px;
      border:1px solid #383820;
      border-left:3px solid var(--accent);
      background:#0e100c;
      color:#aeb3ae;
      font-size:.82rem;
      line-height:1.5;
    }
    .diagnostic .availability-note strong {
      color:#fff;
    }
    .diagnostic .btn--accent {
      min-height:48px;
      text-transform:uppercase;
    }
    .problem-panel {
      position:relative;
      overflow:hidden;
      border-color:#383d3b !important;
      background:linear-gradient(145deg,#0d1010 0%,#090b0b 78%) !important;
      box-shadow:0 22px 52px rgba(0,0,0,.22) !important;
    }
    .problem-panel::before {
      content:"";
      position:absolute;
      left:0; right:0; top:0;
      height:2px;
      background:var(--accent);
    }
    .problem-panel__label {
      padding:18px 18px 14px !important;
      border-bottom:1px solid #2d3230 !important;
      color:var(--accent) !important;
      font-size:10px !important;
      letter-spacing:.14em !important;
    }
    .problem-panel ul {
      display:grid;
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:10px;
      padding:14px !important;
    }
    .problem-panel li {
      min-height:76px;
      display:flex;
      align-items:center;
      padding:14px 14px 14px 31px !important;
      border:1px solid #2b302f !important;
      background:#0b0d0d;
      color:#d5d7d2 !important;
      font-size:.82rem !important;
      line-height:1.4;
    }
    .problem-panel li:last-child {
      border-bottom:1px solid #2b302f !important;
    }
    .problem-panel li::before {
      left:14px !important;
      top:50% !important;
      width:6px !important;
      height:6px !important;
      transform:translateY(-50%) rotate(45deg) !important;
      background:var(--accent) !important;
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

    @media (max-width: 860px) {
      .diagnostic__grid {
        grid-template-columns:1fr !important;
        gap:34px !important;
      }
      .problem-panel {
        max-width:none;
      }
    }

    @media (max-width: 620px) {
      .problem-panel ul {
        grid-template-columns:1fr;
      }
      .problem-panel li {
        min-height:62px;
      }
    }
  `;
  document.head.appendChild(voltDevPolish);

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
