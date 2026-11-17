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

  const reviewDialog = document.querySelector('#review-demo-dialog');
  document.querySelectorAll('[data-review-demo-cta]').forEach((button) => {
    button.addEventListener('click', () => {
      if (reviewDialog && typeof reviewDialog.showModal === 'function' && !reviewDialog.open) {
        reviewDialog.showModal();
      }
    });
  });

  if (reviewDialog) {
    reviewDialog.addEventListener('click', (event) => {
      const rect = reviewDialog.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (!inside) reviewDialog.close();
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

/* BEGIN VOLT TEMPORARY LIMITS MODE — remove this block after review. */
(() => {
  'use strict';
  if (new URLSearchParams(window.location.search).get('limites') !== '1') return;

  const heading = document.querySelector('#servicos-title');
  const intro = document.querySelector('#servicos .services-heading__intro');
  const grid = document.querySelector('#servicos .services-grid');
  const serviceCTAs = [...document.querySelectorAll('#servicos .service-card__cta')];
  if (!heading || !intro || !grid) return;

  const marks = document.createElement('div');
  marks.id = 'volt-analysis-marks';
  marks.setAttribute('aria-hidden', 'true');
  const panel = document.createElement('details');
  panel.id = 'volt-analysis-panel';
  panel.open = !window.matchMedia('(max-width:620px)').matches;
  panel.innerHTML = `
    <summary>Análise visual · Serviços</summary>
    <div class="volt-analysis-body">
      <p class="volt-analysis-status">Rodadas 13–15 · limites definidos</p>
      <p>As marcações acompanham o conteúdo real, sem mudar seu encaixe.</p>
      <dl>
        <dt class="volt-analysis-blue">Azul · caixa do H2</dt>
        <dd><output data-analysis="heading"></output></dd>
        <dt class="volt-analysis-green">Verde · apresentação</dt>
        <dd><output data-analysis="intro"></output><br><span data-analysis="rule"></span><br><output data-analysis="fit"></output></dd>
        <dt class="volt-analysis-blue">Azul · CTAs dos cartões</dt>
        <dd><output data-analysis="cta"></output><br>Uma linha · teto de 240 px dentro da coluna.</dd>
        <dt class="volt-analysis-amber">Amarelo · intervalos medidos</dt>
        <dd><output data-analysis="gaps"></output></dd>
      </dl>
      <p>Apresentação com altura natural: menos linhas não deixam uma área vazia reservada.</p>
      <div class="volt-analysis-actions">
        <button type="button" aria-pressed="true">Ocultar marcas</button>
        <a class="volt-analysis-exit">Sair da análise</a>
      </div>
    </div>`;
  const normalURL = new URL(window.location.href);
  normalURL.searchParams.delete('limites');
  panel.querySelector('.volt-analysis-exit').href = normalURL.href;
  document.body.append(marks, panel);

  const number = value => Math.round(value * 10) / 10;
  const pixels = value => number(value).toLocaleString('pt-BR') + ' px';
  const lineCount = element => {
    const ys = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.textContent.trim() || node.parentElement.closest('[aria-hidden="true"]')) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const rect of range.getClientRects()) {
        if (rect.width > 0 && rect.height > 0 && !ys.some(y => Math.abs(y - rect.top) < 2)) ys.push(rect.top);
      }
    }
    return ys.length;
  };
  const write = (key, value) => {
    const output = panel.querySelector('[data-analysis="' + key + '"]');
    if (output.textContent !== value) output.textContent = value;
  };
  const box = (rect, className) => {
    const element = document.createElement('div');
    element.className = className;
    Object.assign(element.style, {
      left: rect.left + 'px', top: rect.top + 'px',
      width: Math.max(0, rect.width) + 'px', height: Math.max(0, rect.height) + 'px'
    });
    marks.append(element);
    return element;
  };
  const label = (left, top, width, text, className = '') => {
    const element = box({left, top, width, height: 0}, 'volt-analysis-label ' + className);
    element.textContent = text;
    return element;
  };
  const render = () => {
    scheduled = false;
    const h = heading.getBoundingClientRect();
    const p = intro.getBoundingClientRect();
    const g = grid.getBoundingClientRect();
    const narrow = window.matchMedia('(max-width:620px)').matches;
    const before = p.top - h.bottom;
    const after = g.top - p.bottom;
    const hLines = lineCount(heading);
    const pLines = lineCount(intro);
    const hMax = Number(narrow ? heading.dataset.mobileMaxLines : heading.dataset.maxLines);
    const pMin = Number(narrow ? intro.dataset.mobileMinLines : intro.dataset.minLines);
    const pMax = Number(narrow ? intro.dataset.mobileMaxLines : intro.dataset.maxLines);
    const fits = pLines >= pMin && pLines <= pMax;
    write('heading', pixels(h.width) + ' · ' + hLines + ' linha(s) · máximo: ' + hMax + ' · teto: 620 px');
    write('intro', pixels(p.width) + ' · ' + pLines + ' linha(s) atuais');
    write('rule', 'Regra: até 760 px · ' + pMin + '–' + pMax + ' linhas, dentro da seção.');
    write('fit', fits ? 'Texto atual dentro da faixa de linhas.' : 'Pendência de copy: texto atual ' + (pLines < pMin ? 'abaixo do mínimo' : 'acima do máximo') + '.');
    write('gaps', pixels(before) + ' após o H2 · ' + pixels(after) + ' até os cartões');
    const counts = serviceCTAs.map(lineCount);
    write('cta', counts.every(n => n === 1) ? 'Todos os ' + counts.length + ' CTAs em uma linha.' : 'Pendência: há CTA fora de uma linha.');
    marks.replaceChildren();
    if (marks.hidden) return;
    const height = window.innerHeight;
    for (const cta of serviceCTAs) {
      const rect = cta.getBoundingClientRect();
      if (rect.width && rect.bottom >= 0 && rect.top <= height) {
        box(rect, 'volt-analysis-outline volt-analysis-outline--heading');
        label(rect.left, rect.top - 16, rect.width, 'CTA · 1 linha · teto 240 px', 'volt-analysis-blue volt-analysis-label--small');
      }
    }
    if (p.bottom < 0 || h.top > height) return;
    box(h, 'volt-analysis-outline volt-analysis-outline--heading');
    box(p, 'volt-analysis-outline volt-analysis-outline--intro');
    box({left:p.left, top:h.bottom, width:p.width, height:before}, 'volt-analysis-gap');
    box({left:p.left, top:p.bottom, width:p.width, height:after}, 'volt-analysis-gap');
    const room = document.documentElement.clientWidth - p.right - 30;
    if (room >= 235) {
      label(h.right + 16, h.top + 10, 235, 'H2 · até 2 linhas · teto: 620 px', 'volt-analysis-blue');
      label(p.right + 16, p.top - 19, room, pixels(before) + ' após o H2', 'volt-analysis-amber');
      label(p.right + 16, p.top + 4, room, 'Apresentação · teto: 760 px', 'volt-analysis-green');
      label(p.right + 16, p.top + 27, room, pLines + ' linhas atuais · regra: ' + pMin + '–' + pMax);
      label(p.right + 16, p.bottom + 14, room, pixels(after) + ' até os cartões', 'volt-analysis-amber');
    } else {
      if (before >= 13) label(p.left + 2, h.bottom, p.width - 4, pixels(before), 'volt-analysis-amber volt-analysis-label--small');
      if (after >= 22) label(p.left + 2, p.bottom + 3, p.width - 4, pixels(after) + ' até os cartões', 'volt-analysis-amber');
    }
  };
  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(render);
  };
  const toggle = panel.querySelector('button');
  toggle.addEventListener('click', () => {
    marks.hidden = !marks.hidden;
    toggle.setAttribute('aria-pressed', String(!marks.hidden));
    toggle.textContent = marks.hidden ? 'Mostrar marcas' : 'Ocultar marcas';
    schedule();
  });
  const observer = new ResizeObserver(schedule);
  [heading, intro, grid, ...serviceCTAs].forEach(element => observer.observe(element));
  window.addEventListener('resize', schedule, {passive:true});
  window.addEventListener('scroll', schedule, {passive:true});
  window.addEventListener('load', schedule, {once:true});
  heading.parentElement.addEventListener('transitionend', schedule);
  document.fonts.ready.then(schedule);
  schedule();
})();
/* END VOLT TEMPORARY LIMITS MODE */
