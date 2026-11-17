
/* Eyebrow de Trabalhos: variante curta pelo espaço e maior linha do H2. */
(() => {
 const eye=document.querySelector('.portfolio-eyebrow'),title=document.querySelector('#trabalhos-title');
 if(!eye||!title)return;
 const fit=()=>{
  const s=getComputedStyle(eye),probe=document.createElement('span');
  probe.textContent=eye.querySelector('.portfolio-eyebrow__full').textContent;
  Object.assign(probe.style,{position:'fixed',visibility:'hidden',width:'max-content',whiteSpace:'nowrap',font:s.font,letterSpacing:s.letterSpacing});
  document.body.append(probe);const width=probe.getBoundingClientRect().width+43;probe.remove();
  const range=document.createRange();range.selectNodeContents(title);
  const max=Math.max(0,...[...range.getClientRects()].map(r=>r.width));
  eye.classList.toggle('portfolio-eyebrow--full',width<=Math.min(280,eye.parentElement.clientWidth)&&width<max);
 };
 const observer=new ResizeObserver(fit);observer.observe(eye.parentElement);observer.observe(title);
 window.addEventListener('resize',fit,{passive:true});document.fonts.ready.then(fit);window.addEventListener('load',fit,{once:true});fit();
})();
/* CTAs: seleção pela largura útil real. */
(() => {
  document.querySelectorAll('.services-other__cta, .diagnostic__cta, .portfolio-closing__cta').forEach(cta => {
  const full = cta.querySelector('.volt-cta__full');
  const short = cta.querySelector('.volt-cta__short');
  const measure = text => {
    const s = getComputedStyle(cta);
    const probe = document.createElement('span');
    probe.textContent = text;
    Object.assign(probe.style, {position:'fixed',visibility:'hidden',width:'max-content',
      whiteSpace:'nowrap',font:s.font,letterSpacing:s.letterSpacing,textTransform:s.textTransform});
    document.body.append(probe);
    const width = probe.getBoundingClientRect().width;
    probe.remove();
    return width;
  };
  const fit = () => {
    cta.dataset.copyFit = 'full';
    const s = getComputedStyle(cta);
    const insets = parseFloat(s.paddingLeft) + parseFloat(s.paddingRight) + parseFloat(s.borderLeftWidth) + parseFloat(s.borderRightWidth);
    const fullFits = measure(full.textContent) + insets <= cta.getBoundingClientRect().width + 0.01;
    cta.dataset.copyFit = fullFits ? 'full' : 'short';
    const selected = fullFits ? full : short;
    cta.dataset.copyOverflow = String(measure(selected.textContent) + insets > cta.getBoundingClientRect().width + 0.01);
  };
  new ResizeObserver(fit).observe(cta.parentElement);
  window.addEventListener('resize', fit, {passive:true});
  window.addEventListener('load', fit, {once:true});
  document.fonts.ready.then(fit);
  fit();
  });
})();

/* Rodada 16: eyebrow do complemento; fallback curto sem JavaScript. */
(() => {
  const eyebrow = document.querySelector('.services-other__eyebrow');
  const title = eyebrow?.nextElementSibling;
  if (!eyebrow || !title) return;
  const full = eyebrow.querySelector('.services-other__eyebrow-full');
  const fit = () => {
    const style = getComputedStyle(eyebrow);
    const probe = document.createElement('span');
    probe.textContent = full.textContent;
    Object.assign(probe.style, {position:'fixed', visibility:'hidden', width:'max-content',
      whiteSpace:'nowrap', font:style.font, letterSpacing:style.letterSpacing});
    document.body.append(probe);
    const fullWidth = probe.getBoundingClientRect().width;
    probe.remove();
    const range = document.createRange();
    range.selectNodeContents(title);
    const titleWidth = Math.max(0, ...[...range.getClientRects()].map(rect => rect.width));
    const available = Math.min(280, eyebrow.parentElement.clientWidth);
    eyebrow.classList.toggle('services-other__eyebrow--full', fullWidth <= available && fullWidth < titleWidth);
  };
  const schedule = fit;
  const observer = new ResizeObserver(schedule);
  observer.observe(eyebrow.parentElement);
  observer.observe(title);
  window.addEventListener('resize', schedule, {passive:true});
  document.fonts.ready.then(schedule);
  window.addEventListener('load', schedule, {once:true});
  schedule();
})();
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
  if (new URLSearchParams(location.search).get('limites') !== '1') return;

  const heading = document.querySelector('#servicos-title');
  const intro = document.querySelector('#servicos .services-heading__intro');
  const grid = document.querySelector('#servicos .services-grid');
  const otherCTA = document.querySelector('.services-other__cta');
  const otherIntro = document.querySelector('.services-other__intro');
  const otherTitle = document.querySelector('.services-other__title');
  const otherEyebrow = document.querySelector('.services-other__eyebrow');
  const serviceCTAs = [...document.querySelectorAll('#servicos .service-card__cta')];
  if (!heading || !intro || !grid) return;

  const overlay = document.createElement('div');
  overlay.id = 'volt-analysis-marks';
  overlay.setAttribute('aria-hidden', 'true');
  const marks = document.createElement('div');
  marks.className = 'volt-analysis-group';
  marks.dataset.section = 'servicos';
  overlay.append(marks);
  const panel = document.createElement('details');
  panel.id = 'volt-analysis-panel';
  panel.open = !window.matchMedia('(max-width:620px)').matches;
  panel.innerHTML = `
    <summary>Análise visual · VOLT</summary>
    <div class="volt-analysis-body">
      <p class="volt-analysis-status">Rodadas 13–19 · limites definidos</p>
      <p>As marcações acompanham o conteúdo real, sem mudar seu encaixe.</p>
      <dl>
        <dt class="volt-analysis-blue">Azul · caixa do H2</dt>
        <dd><output data-analysis="heading"></output></dd>
        <dt class="volt-analysis-green">Verde · apresentação</dt>
        <dd><output data-analysis="intro"></output><br><span data-analysis="rule"></span><br><output data-analysis="fit"></output></dd>
        <dt class="volt-analysis-blue">Azul · CTAs dos cartões</dt>
        <dd><output data-analysis="cta"></output><br>Uma linha · teto de 240 px dentro da coluna.</dd>
        <dt class="volt-analysis-blue">Azul · eyebrow do complemento</dt><dd><output data-analysis="other"></output><br>Uma linha · teto de 280 px · menor que a maior linha do H3 · 8 px até o título.</dd>\n        <dt class="volt-analysis-green">Verde · H3 do complemento</dt>
        <dd><output data-analysis="other-title"></output><br>Até 2 linhas · teto de 620 px dentro da coluna · altura natural.<br><output data-analysis="other-title-gaps"></output><br><output data-analysis="other-title-fit"></output></dd>
        <dt class="volt-analysis-purple">Roxo · apresentação do complemento</dt>
        <dd><output data-analysis="other-intro"></output><br><output data-analysis="other-intro-rule"></output><br><output data-analysis="other-intro-gaps"></output><br><output data-analysis="other-intro-fit"></output></dd>
        <dt class="volt-analysis-blue">Azul · CTA do complemento</dt>
        <dd><output data-analysis="other-cta"></output><br>Uma linha · mínimo de 50 px de altura · recuos laterais de 22 px.<br>Acima de 620 px: natural, de 215 a 280 px dentro do espaço disponível. Até 620 px: toda a coluna.<br><output data-analysis="other-cta-fit"></output></dd>
        <dt class="volt-analysis-amber">Amarelo · intervalos medidos</dt>
        <dd><output data-analysis="gaps"></output></dd>
      </dl>
      <p>Apresentação com altura natural: menos linhas não deixam uma área vazia reservada.</p>
      <div class="volt-analysis-actions">
        <button type="button" aria-pressed="true">Ocultar marcas</button>
        <a href="#servicos">Ir a Serviços</a><a href="#diagnostico">Ir a Diagnóstico</a><a href="#trabalhos">Ir a Trabalhos</a>
        <a class="volt-analysis-exit">Sair da análise</a>
      </div>
    </div>`;
  const normalURL = new URL(window.location.href);
  normalURL.searchParams.delete('limites');
  normalURL.searchParams.delete('secao');
  normalURL.searchParams.delete('rev');
  panel.querySelector('.volt-analysis-exit').href = normalURL.href;
  const serviceDetails = document.createElement('details');
  serviceDetails.dataset.analysisSection = 'servicos';
  serviceDetails.open = !['#diagnostico','#trabalhos'].includes(location.hash);
  serviceDetails.innerHTML = '<summary>Serviços · limites definidos</summary>';
  const body = panel.querySelector('.volt-analysis-body');
  const actions = body.querySelector('.volt-analysis-actions');
  panel.append(actions, serviceDetails);
  serviceDetails.append(body);
  document.body.append(overlay, panel);
  panel.querySelectorAll('.volt-analysis-actions a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      panel.querySelectorAll('[data-analysis-section]').forEach(detail => {
        detail.open = '#' + detail.dataset.analysisSection === link.hash;
      });
    });
  });

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
    if (otherEyebrow) {
      const r = otherEyebrow.getBoundingClientRect();
      const title = otherEyebrow.nextElementSibling.getBoundingClientRect();
      write('other', pixels(r.width) + ' · ' + lineCount(otherEyebrow) + ' linha(s) · reserva: ' + pixels(r.height) + ' · intervalo: ' + pixels(title.top-r.bottom));
    }
    if (otherTitle) {
      const r = otherTitle.getBoundingClientRect();
      const count = lineCount(otherTitle);
      const before = r.top - otherEyebrow.getBoundingClientRect().bottom;
      const after = otherTitle.nextElementSibling.getBoundingClientRect().top - r.bottom;
      write('other-title', pixels(r.width) + ' · ' + count + ' linha(s) · altura natural: ' + pixels(r.height));
      write('other-title-gaps', pixels(before) + ' após a eyebrow · ' + pixels(after) + ' até a apresentação');
      write('other-title-fit', count >= 1 && count <= 2 ? 'Título atual dentro do limite de linhas.' : 'Pendência de copy: título fora do limite; confirmar nome de atendimento e alternativa aprovada.');
    }
    if (otherIntro) {
      const r = otherIntro.getBoundingClientRect();
      const column = otherIntro.parentElement.getBoundingClientRect();
      const cta = otherIntro.closest('.services-other').querySelector('.services-other__cta').getBoundingClientRect();
      const count = lineCount(otherIntro);
      const max = Number(window.innerWidth <= Number(otherIntro.dataset.compactBreakpoint) ? otherIntro.dataset.compactMaxLines : otherIntro.dataset.maxLines);
      const min = Number(otherIntro.dataset.minLines);
      const before = r.top - otherTitle.getBoundingClientRect().bottom;
      const gap = narrow ? cta.top-r.bottom : cta.left-column.right;
      write('other-intro', pixels(r.width) + ' · ' + count + ' linha(s) · altura natural: ' + pixels(r.height));
      write('other-intro-rule', 'Regra: ' + min + '–' + max + ' linhas · teto de 760 px dentro da coluna.');
      write('other-intro-gaps', pixels(before) + ' após o H3 · ' + pixels(gap) + (narrow ? ' até o botão abaixo.' : ' entre a coluna e o botão ao lado.'));
      write('other-intro-fit', count >= min && count <= max ? 'Texto atual dentro da faixa de linhas.' : 'Pendência de copy: apresentação fora da faixa aprovada.');
    }
    if (otherCTA) {
      const r = otherCTA.getBoundingClientRect();
      const count = lineCount(otherCTA);
      write('other-cta', pixels(r.width) + ' × ' + pixels(r.height) + ' · ' + count + ' linha(s)');
      write('other-cta-fit', count === 1 && otherCTA.dataset.copyOverflow !== 'true'
        ? 'Copy ' + (otherCTA.dataset.copyFit === 'short' ? 'curta' : 'completa') + ' dentro do espaço útil.'
        : 'Pendência: aprovar alternativa que caiba sem corte ou redução de fonte.');
    }
    marks.replaceChildren();
    if (overlay.hidden) return;
    const height = window.innerHeight;
    if (otherEyebrow) {
      const r = otherEyebrow.getBoundingClientRect();
      if (r.bottom >= 0 && r.top <= height) {
        box(r, 'volt-analysis-outline volt-analysis-outline--heading');
        label(r.left, r.top - 16, r.width, 'Eyebrow · 1 linha', 'volt-analysis-blue volt-analysis-label--small');
        const t = otherEyebrow.nextElementSibling.getBoundingClientRect();
        box({left:r.left,top:r.bottom,width:r.width,height:t.top-r.bottom}, 'volt-analysis-gap');
      }
    }
    if (otherTitle) {
      const r = otherTitle.getBoundingClientRect();
      if (r.bottom >= 0 && r.top <= height) {
        box(r, 'volt-analysis-outline volt-analysis-outline--intro');
        const p = otherTitle.nextElementSibling.getBoundingClientRect();
        box({left:r.left,top:r.bottom,width:r.width,height:p.top-r.bottom}, 'volt-analysis-gap');
      }
    }
    if (otherIntro) {
      const r = otherIntro.getBoundingClientRect();
      if (r.bottom >= 0 && r.top <= height) {
        box(r, 'volt-analysis-outline volt-analysis-outline--other-intro');
        const column = otherIntro.parentElement.getBoundingClientRect();
        const cta = otherIntro.closest('.services-other').querySelector('.services-other__cta').getBoundingClientRect();
        box(narrow
          ? {left:r.left,top:r.bottom,width:r.width,height:cta.top-r.bottom}
          : {left:column.right,top:column.top,width:cta.left-column.right,height:column.height}, 'volt-analysis-gap');
      }
    }
    if (otherCTA) {
      const r = otherCTA.getBoundingClientRect();
      if (r.bottom >= 0 && r.top <= height) {
        box(r, 'volt-analysis-outline volt-analysis-outline--heading');
      }
    }
    for (const cta of serviceCTAs) {
      const rect = cta.getBoundingClientRect();
      if (rect.width && rect.bottom >= 0 && rect.top <= height) {
        box(rect, 'volt-analysis-outline volt-analysis-outline--heading');
        label(rect.left, rect.top - 16, rect.width, rect.width < 180 ? 'CTA · 1 linha' : 'CTA · 1 linha · teto 240 px', 'volt-analysis-blue volt-analysis-label--small');
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
    overlay.hidden = !overlay.hidden;
    toggle.setAttribute('aria-pressed', String(!overlay.hidden));
    toggle.textContent = overlay.hidden ? 'Mostrar marcas' : 'Ocultar marcas';
    window.dispatchEvent(new Event('volt-analysis-toggle'));
    schedule();
  });
  const observer = new ResizeObserver(schedule);
  [heading, intro, grid, otherEyebrow, otherTitle, otherIntro, otherCTA, ...serviceCTAs].filter(Boolean).forEach(element => observer.observe(element));
  window.addEventListener('resize', schedule, {passive:true});
  window.addEventListener('scroll', schedule, {passive:true});
  window.addEventListener('load', schedule, {once:true});
  heading.parentElement.addEventListener('transitionend', schedule);
  otherTitle?.closest('.services-other')?.addEventListener('transitionend', schedule);
  document.fonts.ready.then(schedule);
  schedule();
})();
/* END VOLT TEMPORARY LIMITS MODE */

/* Diagnóstico aprovado — marcações temporárias de análise visual. */
(() => {
 'use strict';
 const params=new URLSearchParams(location.search);
 if(params.get('limites')!=='1')return;
 document.documentElement.dataset.voltDiagnosticAnalysis='true';
 const section=document.querySelector('#diagnostico');
 const copy=section.querySelector('.diagnostic__copy'),eye=copy.querySelector('.eyebrow'),title=copy.querySelector('h2');
 const ps=[...copy.querySelectorAll('.diagnostic__body')],panelBox=section.querySelector('.problem-panel');
 const labelText=section.querySelector('.diagnostic__panel-title'),cells=[...section.querySelectorAll('.problem-panel li')];
 const cta=section.querySelector('.diagnostic__cta'),row=cta.parentElement;
 const overlay=document.querySelector('#volt-analysis-marks'),sharedPanel=document.querySelector('#volt-analysis-panel');
 if(!overlay||!sharedPanel)return;
 const marks=document.createElement('div');marks.className='volt-analysis-group';marks.dataset.section='diagnostico';overlay.append(marks);
 const panel=document.createElement('details');panel.dataset.analysisSection='diagnostico';panel.open=location.hash==='#diagnostico';
 panel.innerHTML=`<summary>Diagnóstico · limites definidos</summary><div class="volt-analysis-body">
 <p class="volt-analysis-status">Seção inteira · aprovada</p><p>Regras aprovadas pelo Founder e aplicadas. Marcações não alteram o layout.</p><dl>
 <dt class="volt-analysis-blue">Azul · eyebrow</dt><dd data-dg="eye"></dd>
 <dt class="volt-analysis-green">Verde · H2</dt><dd data-dg="title"></dd>
 <dt class="volt-analysis-purple">Roxo · apresentação e orientação</dt><dd data-dg="body"></dd>
 <dt class="volt-analysis-amber">Amarelo · cabeçalho do painel</dt><dd data-dg="label"></dd>
 <dt class="volt-analysis-blue">Azul · seis situações atendidas</dt><dd data-dg="cells"></dd>
 <dt class="volt-analysis-blue">Azul · Copy do CTA</dt><dd data-dg="cta"></dd>
 <dt class="volt-analysis-amber">Amarelo · intervalos e composição</dt><dd data-dg="gaps"></dd>
 </dl><p data-dg="fit"></p><p>Sem cortes ou redução de fonte para caber. As variantes compactas preservam avaliação, orçamento antes do serviço e limites das urgências.</p>
 </div>`;
 sharedPanel.append(panel);
 const px=n=>(Math.round(n*10)/10).toLocaleString('pt-BR')+' px';
 const R=e=>e.getBoundingClientRect(),S=e=>getComputedStyle(e);
 const textRows=e=>{
  const rows=[],walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);
  while(walker.nextNode()){
   const n=walker.currentNode;if(!n.textContent.trim()||n.parentElement.closest('[aria-hidden=true]'))continue;
   const range=document.createRange();range.selectNodeContents(n);
   for(const r of range.getClientRects())if(r.width&&r.height){
    const line=rows.find(x=>Math.abs(x.y-r.y)<2);
    if(line){line.l=Math.min(line.l,r.left);line.r=Math.max(line.r,r.right);}else rows.push({y:r.y,l:r.left,r:r.right});
   }
  }return rows;
 };
 const lines=e=>textRows(e).length;
 const write=(key,value)=>{const e=panel.querySelector('[data-dg="'+key+'"]');if(e.textContent!==value)e.textContent=value;};
 const box=(r,cls)=>{const e=document.createElement('div');e.className=cls;Object.assign(e.style,{left:r.left+'px',top:r.top+'px',width:Math.max(0,r.width)+'px',height:Math.max(0,r.height)+'px'});marks.append(e);};
 const visible=r=>r.width&&r.bottom>=0&&r.top<=innerHeight;
 const mark=(e,cls)=>{const r=R(e);if(visible(r))box(r,'volt-analysis-outline '+cls);};
 const gap=(a,b,width)=>{if(b>a)box({left:R(copy).left,top:a,width,height:b-a},'volt-analysis-gap');};
 let queued=false;
 const render=()=>{
  queued=false;const narrow=innerWidth<=620,stacked=innerWidth<=860,compact=S(ps[0].querySelector('.diagnostic-copy__compact')).display!=='none';
  const e=R(eye),t=R(title),p=ps.map(R),pb=R(panelBox),cr=R(cta),co=R(copy);
  const eLines=lines(eye),tLines=lines(title),pLines=ps.map(lines),lLines=lines(labelText),cLines=cells.map(lines);
  const limit=compact?6:5,itemMax=narrow?2:3,after=cr.top-Math.max(co.bottom,pb.bottom);
  const maxLine=Math.max(0,...textRows(title).map(x=>x.r-x.l));
  const issues=[];
  if(eLines!==1||e.width>280.1||e.width>=maxLine)issues.push('eyebrow');
  if(tLines<1||tLines>2||t.width>620.1)issues.push('H2');
  if(pLines.some(n=>n<3||n>limit)||p.some(r=>r.width>760.1))issues.push('parágrafos');
  if(lLines!==1)issues.push('cabeçalho do painel');
  if(cLines.some(n=>n<1||n>itemMax))issues.push('situações atendidas');
  if(lines(cta)!==1||cta.dataset.copyOverflow==='true')issues.push('CTA');
  if(Math.abs(t.top-e.bottom-12)>.2||Math.abs(p[0].top-t.bottom-16)>.2||Math.abs(p[1].top-p[0].bottom-12)>.2||Math.abs(after-(stacked?32:40))>.2)issues.push('intervalos');
  write('eye',px(e.width)+' · '+eLines+' linha · teto 280 px com traço de 34 px; menor que a maior linha do H2.');
  write('title',px(t.width)+' · '+tLines+' linha(s) · máximo 2 · teto 620 px. Reserva mínima: '+(narrow?'2 linhas':'1 linha')+'.');
  write('body','P1: '+pLines[0]+' linhas / '+px(p[0].width)+'; P2: '+pLines[1]+' linhas / '+px(p[1].width)+'. Formato '+(compact?'compacto: 3–6':'regular: 3–5')+' linhas por parágrafo; teto 760 px dentro da coluna; altura natural. Inter 16 px / 1,6.');
  write('label',lLines+' linha · Inter 14 px, peso 700, texto preto · teto do texto 280 px; dentro da faixa amarela. Recuos '+(narrow?'16':'20')+' px.');
  write('cells',cLines.length+' itens · linhas: '+cLines.join(' / ')+'. Máximo '+itemMax+' por item; reserva '+itemMax+' linhas. '+(narrow?'1 coluna':'2 colunas')+'; intervalo 12 px; texto Inter 16 px / 1,4.');
  write('cta',px(cr.width)+' × '+px(cr.height)+' · '+lines(cta)+' linha · copy '+(cta.dataset.copyFit==='short'?'curta':'completa')+'. Altura mínima 54 px, recuos laterais 30 px. '+(narrow?'Toda a coluna.':'Natural: 360–440 px dentro do espaço disponível.'));
  write('gaps','Eyebrow → H2: '+px(t.top-e.bottom)+'; H2 → P1: '+px(p[0].top-t.bottom)+'; P1 → P2: '+px(p[1].top-p[0].bottom)+'. '+(stacked?'Textos → painel: '+px(pb.top-co.bottom):'Coluna → painel: '+px(pb.left-co.right))+'. Blocos → CTA: '+px(after)+'; divisória dentro desse intervalo.');
  write('fit',issues.length?'Conferir nesta tela: '+issues.join(', ')+'.':'Critérios medidos atendidos nesta tela. Regras aprovadas pelo Founder.');
  marks.replaceChildren();if(overlay.hidden)return;
  mark(eye,'volt-analysis-outline--heading');mark(title,'volt-analysis-outline--intro');
  ps.forEach(x=>mark(x,'volt-analysis-outline--other-intro'));mark(labelText,'volt-analysis-outline--dg-amber');
  cells.forEach(x=>mark(x,'volt-analysis-outline--heading'));mark(cta,'volt-analysis-outline--heading');
  if(visible({top:e.top,bottom:p[1].bottom,width:co.width})){gap(e.bottom,t.top,Math.min(co.width,280));gap(t.bottom,p[0].top,p[0].width);gap(p[0].bottom,p[1].top,p[1].width);}
  if(stacked){if(pb.top>=0&&co.bottom<=innerHeight)gap(co.bottom,pb.top,Math.min(co.width,pb.width));}
  else if(visible(pb))box({left:co.right,top:Math.min(co.top,pb.top),width:pb.left-co.right,height:Math.max(co.height,pb.height)},'volt-analysis-gap');
  if(cr.top>=0&&Math.max(co.bottom,pb.bottom)<=innerHeight)box({left:R(row).left,top:Math.max(co.bottom,pb.bottom),width:R(row).width,height:after},'volt-analysis-gap');
 };
 const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(render);}};
 window.addEventListener('volt-analysis-toggle',schedule);
 const observer=new ResizeObserver(schedule);[copy,eye,title,...ps,panelBox,labelText,...cells,cta,row].forEach(e=>observer.observe(e));
 window.addEventListener('resize',schedule,{passive:true});window.addEventListener('scroll',schedule,{passive:true});section.addEventListener('transitionend',schedule);window.addEventListener('load',schedule,{once:true});document.fonts.ready.then(schedule);schedule();
})();
/* END DIAGNOSTIC REVIEW */

/* BEGIN PORTFOLIO REVIEW — marcações temporárias; regras em revisão. */
(() => {
 'use strict';
 if(new URLSearchParams(location.search).get('limites')!=='1')return;
 const section=document.querySelector('#trabalhos'),overlay=document.querySelector('#volt-analysis-marks'),shared=document.querySelector('#volt-analysis-panel');
 if(!section||!overlay||!shared)return;
 document.documentElement.dataset.voltPortfolioAnalysis='true';
 const eye=section.querySelector('.eyebrow'),title=section.querySelector('h2'),intro=section.querySelector('.portfolio-intro'),grid=section.querySelector('.portfolio-grid');
 const cards=[...grid.querySelectorAll('figure')],closing=section.querySelector('.portfolio-closing'),closeTitle=closing.querySelector('h3'),closeBody=closing.querySelector('p'),cta=closing.querySelector('button');
 const marks=document.createElement('div');marks.className='volt-analysis-group';marks.dataset.section='trabalhos';overlay.append(marks);
 const panel=document.createElement('details');panel.dataset.analysisSection='trabalhos';panel.open=location.hash==='#trabalhos';
 panel.innerHTML='<summary>Trabalhos · EM REVISÃO</summary><div class="volt-analysis-body"><p class="volt-analysis-status">Seção inteira · EM REVISÃO</p><p>Recomendações aplicadas para avaliação do Founder. Marcações não alteram o layout.</p><dl><dt class="volt-analysis-blue">Azul · Eyebrow</dt><dd data-pf="eye"></dd><dt class="volt-analysis-green">Verde · H2</dt><dd data-pf="title"></dd><dt class="volt-analysis-purple">Roxo · apresentação</dt><dd data-pf="intro"></dd><dt class="volt-analysis-blue">Azul · títulos das fotos</dt><dd data-pf="titles"></dd><dt class="volt-analysis-amber">Amarelo · legendas de localização</dt><dd data-pf="captions"></dd><dt class="volt-analysis-green">Verde / roxo · fechamento</dt><dd data-pf="closing"></dd><dt class="volt-analysis-blue">Azul · Copy do CTA</dt><dd data-pf="cta"></dd><dt class="volt-analysis-amber">Amarelo · intervalos e composição</dt><dd data-pf="gaps"></dd></dl><p data-pf="fit"></p><p>Oito imagens demonstrativas preservadas; não apresentar como trabalhos reais de um cliente. Sem cortes, redução de fonte ou abreviações automáticas. Assets e biblioteca de copy continuam para depois.</p></div>';
 shared.append(panel);
 const R=e=>e.getBoundingClientRect(),px=n=>(Math.round(n*10)/10).toLocaleString('pt-BR')+' px';
 const rows=e=>{
  const ys=[],walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);
  while(walker.nextNode()){
   const n=walker.currentNode;if(!n.textContent.trim()||n.parentElement.closest('[aria-hidden="true"]'))continue;
   const range=document.createRange();range.selectNodeContents(n);
   for(const r of range.getClientRects())if(r.width&&r.height){
    const line=ys.find(x=>Math.abs(x.y-r.y)<2);
    if(line){line.l=Math.min(line.l,r.left);line.r=Math.max(line.r,r.right);}else ys.push({y:r.y,l:r.left,r:r.right});
   }
  }return ys;
 };
 const lines=e=>rows(e).length;
 const write=(k,v)=>{const e=panel.querySelector('[data-pf="'+k+'"]');if(e.textContent!==v)e.textContent=v;};
 const box=(r,cls)=>{if(r.bottom<0||r.top>innerHeight)return;const e=document.createElement('div');e.className=cls;Object.assign(e.style,{left:r.left+'px',top:r.top+'px',width:Math.max(0,r.width)+'px',height:Math.max(0,r.height)+'px'});marks.append(e);};
 const mark=(e,cls)=>box(R(e),'volt-analysis-outline '+cls);
 const gap=(a,b)=>{const x=R(a),y=R(b);box({left:x.left,top:x.bottom,bottom:y.top,width:Math.min(x.width,y.width),height:y.top-x.bottom},'volt-analysis-gap');};
 let queued=false;
 const render=()=>{
  queued=false;
  const narrow=innerWidth<=620,stacked=innerWidth<=860,issues=[];
  const er=R(eye),tr=R(title),pr=R(intro),gr=R(grid),ct=R(closeTitle),cb=R(closeBody),cr=R(cta);
  const hLines=cards.map(c=>lines(c.querySelector('h3'))),cLines=cards.map(c=>lines(c.querySelector('figcaption span')));
  const hMax=Math.max(0,...rows(title).map(r=>r.r-r.l));
  if(lines(eye)!==1||er.width>280.1||er.width>=hMax)issues.push('Eyebrow');
  if(lines(title)<1||lines(title)>2||tr.width>620.1)issues.push('H2');
  if(lines(intro)<2||lines(intro)>(narrow?5:4)||pr.width>760.1)issues.push('apresentação');
  if(hLines.some(n=>n<1||n>2))issues.push('H3 das fotos');
  cards.forEach((card,i)=>{const a=R(card);if(a.bottom>gr.bottom+.2||a.right>gr.right+.2)issues.push('limite da grade');for(const other of cards.slice(i+1)){const b=R(other);if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>.2&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>.2)issues.push('sobreposição entre fotos');}});
  if(cLines.some(n=>n<1||n>2))issues.push('legendas');
  cards.forEach((c,i)=>{const cap=c.querySelector('figcaption'),capr=R(cap),r=R(c);if(capr.top<r.top-.2||capr.right>r.right+.2||capr.bottom>r.bottom+.2)issues.push('encaixe foto '+(i+1));for(const e of cap.children){const b=R(e);if(b.left<r.left||b.right>r.right||rows(e).some(x=>x.l<b.left-.2||x.r>b.right+.2))issues.push('texto foto '+(i+1));}});
  if(lines(closeTitle)<1||lines(closeTitle)>2||ct.width>620.1)issues.push('H3 do fechamento');
  if(lines(closeBody)<(narrow?2:1)||lines(closeBody)>(narrow?4:3)||cb.width>620.1)issues.push('apresentação do fechamento');
  if(lines(cta)!==1||cta.dataset.copyOverflow==='true'||cr.height<53.9)issues.push('CTA');
  const expected=stacked?32:40;
  if(Math.abs(tr.top-er.bottom-12)>.2||Math.abs(pr.top-tr.bottom-16)>.2||Math.abs(gr.top-pr.bottom-expected)>.2||Math.abs(ct.top-gr.bottom-expected)>.2||Math.abs(cb.top-ct.bottom-12)>.2||Math.abs(cr.top-cb.bottom-24)>.2)issues.push('intervalos');
  write('eye',px(er.width)+' · '+lines(eye)+' linha · teto 280 px com traço de 34 px; menor que a maior linha do H2. Copy '+(eye.classList.contains('portfolio-eyebrow--full')?'completa.':'curta: TRABALHOS.'));
  write('title',px(tr.width)+' · '+lines(title)+' linha(s), máximo 2 · teto 620 px. Reserva mínima: '+(narrow?'2 linhas.':'1 linha.'));
  write('intro',px(pr.width)+' · '+lines(intro)+' linhas · faixa '+(narrow?'2–5':'2–4')+' · teto 760 px · altura natural. Inter 16 px / 1,6.');
  write('titles','Linhas nos 8 H3: '+hLines.join(' / ')+'. Máximo e reserva de 2 linhas por foto; Barlow Condensed 800, '+(narrow?'24':'28')+' px / 1,05. Texto na base da reserva.');
  write('captions','Linhas nas 8 legendas: '+cLines.join(' / ')+'. Até 2, altura natural, Inter 12 px / 700 / 1,5. Título → legenda: 12 px. Recuos da foto: '+(narrow?'16':'20')+' px; selo amarelo dentro da coluna, recuos 8 / 11 px e borda de 1 px.');
  write('closing','H3: '+px(ct.width)+' / '+lines(closeTitle)+' linha(s), máximo 2, teto 620 px. Apresentação: '+px(cb.width)+' / '+lines(closeBody)+' linha(s), faixa '+(narrow?'2–4':'1–3')+', teto 620 px. Alturas naturais, centralizados.');
  write('cta',px(cr.width)+' × '+px(cr.height)+' · '+lines(cta)+' linha · copy '+(cta.dataset.copyFit==='short'?'curta':'completa')+'. Mínimo 54 px de altura; recuos 25 px. '+(narrow?'Largura inteira da coluna.':'Natural de 320–440 px dentro da coluna.'));
  write('gaps','Eyebrow → H2: '+px(tr.top-er.bottom)+'; H2 → apresentação: '+px(pr.top-tr.bottom)+'; apresentação → fotos: '+px(gr.top-pr.bottom)+'; fotos → fechamento: '+px(ct.top-gr.bottom)+'; H3 → apresentação: '+px(cb.top-ct.bottom)+'; apresentação → CTA: '+px(cr.top-cb.bottom)+'. Grade: '+(narrow?'1 coluna':innerWidth<=1080?'2 colunas com primeira foto ampla':'mosaico original')+', intervalo de 12 px. Divisórias dentro dos intervalos.');
  write('fit',issues.length?'Conferir nesta tela: '+[...new Set(issues)].join(', ')+'.':'Critérios medidos atendidos nesta tela. Regras em revisão pelo Founder.');
  marks.replaceChildren();if(overlay.hidden)return;
  mark(eye,'volt-analysis-outline--heading');mark(title,'volt-analysis-outline--intro');mark(intro,'volt-analysis-outline--other-intro');
  cards.forEach(c=>{mark(c.querySelector('h3'),'volt-analysis-outline--heading');mark(c.querySelector('figcaption span'),'volt-analysis-outline--dg-amber');gap(c.querySelector('h3'),c.querySelector('figcaption span'));});
  mark(closeTitle,'volt-analysis-outline--intro');mark(closeBody,'volt-analysis-outline--other-intro');mark(cta,'volt-analysis-outline--heading');
  gap(eye,title);gap(title,intro);gap(intro,grid);gap(grid,closeTitle);gap(closeTitle,closeBody);gap(closeBody,cta);
 };
 const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(render);}};
 const observer=new ResizeObserver(schedule);[section,eye,title,intro,grid,closing,...cards].forEach(e=>observer.observe(e));
 window.addEventListener('resize',schedule,{passive:true});window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('volt-analysis-toggle',schedule);window.addEventListener('load',schedule,{once:true});section.addEventListener('transitionend',schedule);document.fonts.ready.then(schedule);schedule();
})();
/* END PORTFOLIO REVIEW */
