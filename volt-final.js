
/* Avaliações: H2 e Eyebrow selecionados pelo encaixe real. */
(() => {
 const section=document.querySelector('#avaliacoes');if(!section)return;
 const title=section.querySelector('h2'),eye=section.querySelector('.eyebrow');
 const visibleRows=e=>{
  const rows=[],w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);
  while(w.nextNode()){const n=w.currentNode;if(!n.textContent.trim())continue;const r=document.createRange();r.selectNodeContents(n);for(const b of r.getClientRects())if(b.width&&b.height){const row=rows.find(x=>Math.abs(x.y-b.y)<2);if(row){row.left=Math.min(row.left,b.left);row.right=Math.max(row.right,b.right);}else rows.push({y:b.y,left:b.left,right:b.right});}}return rows;
 };
 const fit=()=>{
  const full=title.querySelector('[data-review-copy="full"]'),short=title.querySelector('[data-review-copy="short"]');
  full.hidden=false;short.hidden=true;
  if(visibleRows(title).length>2){full.hidden=true;short.hidden=false;}
  const ef=eye.querySelector('[data-review-copy="full"]'),es=eye.querySelector('[data-review-copy="short"]');
  ef.hidden=false;es.hidden=true;
  const max=Math.max(0,...visibleRows(title).map(r=>r.right-r.left));
  if(eye.scrollWidth>Math.min(280,eye.parentElement.clientWidth)+.1||eye.getBoundingClientRect().width>=max){ef.hidden=true;es.hidden=false;}
  section.dataset.reviewTitleVariant=full.hidden?'short':'full';
  section.dataset.reviewEyebrowVariant=ef.hidden?'short':'full';

  const intro=section.querySelector('.reviews-intro'),variants=[...intro.querySelectorAll('[data-review-intro-variant]')];
  const maxLines=innerWidth<=620?5:3;
  if(variants.length){
  let selected=variants[variants.length-1];
  for(const candidate of variants){
   variants.forEach(e=>e.hidden=e!==candidate);
   selected=candidate;if(visibleRows(intro).length<=maxLines)break;
  }
  intro.dataset.copyVariant=selected.dataset.reviewIntroVariant;
  intro.dataset.copyOverflow=String(visibleRows(intro).length>maxLines);
  }
  window.dispatchEvent(new Event('volt-reviews-fit'));
 };
 let queued=false;const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;fit();});}};
 const observer=new ResizeObserver(schedule);observer.observe(title);observer.observe(eye.parentElement);
 window.addEventListener('resize',schedule,{passive:true});window.addEventListener('load',schedule,{once:true});document.fonts.ready.then(schedule);fit();
})();
/* Apresentação de Atendimento: uma variante acessível, até três linhas reais. */
(() => {
 'use strict';
 const intro=document.querySelector('#atendimento .process-intro');
 if(!intro)return;
 const variants=[...intro.querySelectorAll('[data-process-intro-variant]')];
 if(!variants.length)return;
 const fit=()=>{
  const s=getComputedStyle(intro),width=intro.getBoundingClientRect().width;
  if(!width)return;
  const probe=document.createElement('span');
  Object.assign(probe.style,{position:'fixed',visibility:'hidden',display:'block',left:'0',top:'0',width:width+'px',maxWidth:'none',margin:'0',padding:'0',border:'0',font:s.font,lineHeight:s.lineHeight,letterSpacing:s.letterSpacing,wordSpacing:s.wordSpacing,textTransform:s.textTransform,whiteSpace:'normal'});
  document.body.append(probe);
  let selected=variants[variants.length-1],count=0;
  for(const candidate of variants){
   probe.textContent=candidate.textContent;
   const range=document.createRange();range.selectNodeContents(probe);
   count=[...range.getClientRects()].filter(r=>r.width&&r.height).length;
   if(count<=3){selected=candidate;break;}
  }
  probe.remove();
  for(const variant of variants)variant.hidden=variant!==selected;
  intro.dataset.copyVariant=selected.dataset.processIntroVariant;
  intro.dataset.copyOverflow=String(count>3);
  window.dispatchEvent(new Event('volt-process-intro-fit'));
 };
 let pending=false;const schedule=()=>{if(!pending){pending=true;requestAnimationFrame(()=>{pending=false;fit();});}};
 new ResizeObserver(schedule).observe(intro);
 document.fonts.ready.then(schedule);window.addEventListener('load',schedule,{once:true});window.addEventListener('resize',schedule,{passive:true});fit();
})();

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
  document.querySelectorAll('.services-other__cta, .diagnostic__cta, .portfolio-closing__cta, .about__action .btn, .faq__cta').forEach(cta => {
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
        <a href="#servicos">Ir a Serviços</a><a href="#diagnostico">Ir a Diagnóstico</a><a href="#trabalhos">Ir a Trabalhos</a><a href="#atendimento">Ir a Atendimento</a><a href="#avaliacoes">Ir a Avaliações</a><a href="#sobre">Ir a Sobre</a><a href="#area-atendida">Ir a Área atendida</a><a href="#faq">Ir a Dúvidas frequentes</a>
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
  serviceDetails.open = !['#diagnostico','#trabalhos','#atendimento','#process-title','#avaliacoes','#reviews-title','#sobre','#sobre-title','#area-atendida','#area-title','#faq','#faq-title','#avaliar-no-google','#google-review-title'].includes(location.hash);
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

/* BEGIN PORTFOLIO REVIEW — marcações temporárias; regras aprovadas. */
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
 panel.innerHTML='<summary>Trabalhos · limites definidos</summary><div class="volt-analysis-body"><p class="volt-analysis-status">Seção inteira · aprovada</p><p>Regras aprovadas pelo Founder e aplicadas. Marcações não alteram o layout.</p><dl><dt class="volt-analysis-blue">Azul · Eyebrow</dt><dd data-pf="eye"></dd><dt class="volt-analysis-green">Verde · H2</dt><dd data-pf="title"></dd><dt class="volt-analysis-purple">Roxo · apresentação</dt><dd data-pf="intro"></dd><dt class="volt-analysis-amber">Amarelo · fotos sem sobreposição</dt><dd data-pf="photos"></dd><dt class="volt-analysis-green">Verde / roxo · fechamento</dt><dd data-pf="closing"></dd><dt class="volt-analysis-blue">Azul · Copy do CTA</dt><dd data-pf="cta"></dd><dt class="volt-analysis-amber">Amarelo · intervalos e composição</dt><dd data-pf="gaps"></dd></dl><p data-pf="fit"></p><p>Dez fotos demonstrativas (oito imagens distintas e duas repetições temporárias); padrão 10, permitido de 10 a 20 fotos; não apresentar como trabalhos reais de um cliente. Sem cortes, redução de fonte ou abreviações automáticas. Assets e biblioteca de copy continuam para depois.</p></div>';
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
  const hMax=Math.max(0,...rows(title).map(r=>r.r-r.l));
  if(lines(eye)!==1||er.width>280.1||er.width>=hMax)issues.push('Eyebrow');
  if(lines(title)<1||lines(title)>2||tr.width>620.1)issues.push('H2');
  if(lines(intro)<3||lines(intro)>(narrow?5:4)||pr.width>760.1)issues.push('apresentação');
  if(cards.length<10||cards.length>20)issues.push('quantidade de fotos');
  cards.forEach((card,i)=>{const a=R(card);if(a.bottom>gr.bottom+.2||a.right>gr.right+.2)issues.push('limite da grade');for(const other of cards.slice(i+1)){const b=R(other);if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>.2&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>.2)issues.push('sobreposição entre fotos');}});
  if(lines(closeTitle)<1||lines(closeTitle)>2||ct.width>620.1)issues.push('H3 do fechamento');
  if(lines(closeBody)<(narrow?2:1)||lines(closeBody)>(narrow?4:3)||cb.width>620.1)issues.push('apresentação do fechamento');
  if(lines(cta)!==1||cta.dataset.copyOverflow==='true'||cr.height<53.9)issues.push('CTA');
  const expected=stacked?32:40;
  if(Math.abs(tr.top-er.bottom-12)>.2||Math.abs(pr.top-tr.bottom-16)>.2||Math.abs(gr.top-pr.bottom-expected)>.2||Math.abs(ct.top-gr.bottom-expected)>.2||Math.abs(cb.top-ct.bottom-12)>.2||Math.abs(cr.top-cb.bottom-24)>.2)issues.push('intervalos');
  write('eye',px(er.width)+' · '+lines(eye)+' linha · teto 280 px com traço de 34 px; menor que a maior linha do H2. Copy '+(eye.classList.contains('portfolio-eyebrow--full')?'completa.':'curta: TRABALHOS.'));
  write('title',px(tr.width)+' · '+lines(title)+' linha(s), máximo 2 · teto 620 px. Reserva mínima: '+(narrow?'2 linhas.':'1 linha.'));
  write('intro',px(pr.width)+' · '+lines(intro)+' linhas · faixa '+(narrow?'3–5':'3–4')+' · teto 760 px · altura natural. Inter 16 px / 1,6.');
  write('photos',cards.length+' fotos · padrão 10, permitido de 10 a 20, sem títulos, legendas, selos, gradiente ou filtro de escurecimento. Arquivos originais preservados; alternativas textuais mantidas para acessibilidade.');
  write('closing','H3: '+px(ct.width)+' / '+lines(closeTitle)+' linha(s), máximo 2, teto 620 px. Apresentação: '+px(cb.width)+' / '+lines(closeBody)+' linha(s), faixa '+(narrow?'2–4':'1–3')+', teto 620 px. Alturas naturais, centralizados.');
  write('cta',px(cr.width)+' × '+px(cr.height)+' · '+lines(cta)+' linha · copy '+(cta.dataset.copyFit==='short'?'curta':'completa')+'. Mínimo 54 px de altura; recuos 25 px. '+(narrow?'Largura inteira da coluna.':'Natural de 320–440 px dentro da coluna.'));
  write('gaps','Eyebrow → H2: '+px(tr.top-er.bottom)+'; H2 → apresentação: '+px(pr.top-tr.bottom)+'; apresentação → fotos: '+px(gr.top-pr.bottom)+'; fotos → fechamento: '+px(ct.top-gr.bottom)+'; H3 → apresentação: '+px(cb.top-ct.bottom)+'; apresentação → CTA: '+px(cr.top-cb.bottom)+'. Grade: '+(innerWidth<=560?'1 coluna, primeira foto alta':innerWidth<=760?'2 colunas, primeira foto alta e foto 8 ampla':'mosaico AR: foto alta + quatro; faixa de três; faixa de duas; extensão 11–20 em faixas de três e duas')+', intervalo de 12 px. Divisórias dentro dos intervalos.');
  write('fit',issues.length?'Conferir nesta tela: '+[...new Set(issues)].join(', ')+'.':'Critérios medidos atendidos nesta tela. Regras aprovadas pelo Founder.');
  marks.replaceChildren();if(overlay.hidden)return;
  mark(eye,'volt-analysis-outline--heading');mark(title,'volt-analysis-outline--intro');mark(intro,'volt-analysis-outline--other-intro');
  cards.forEach(c=>mark(c,'volt-analysis-outline--dg-amber'));
  mark(closeTitle,'volt-analysis-outline--intro');mark(closeBody,'volt-analysis-outline--other-intro');mark(cta,'volt-analysis-outline--heading');
  gap(eye,title);gap(title,intro);gap(intro,grid);gap(grid,closeTitle);gap(closeTitle,closeBody);gap(closeBody,cta);
 };
 const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(render);}};
 const observer=new ResizeObserver(schedule);[section,eye,title,intro,grid,closing,...cards].forEach(e=>observer.observe(e));
 window.addEventListener('resize',schedule,{passive:true});window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('volt-analysis-toggle',schedule);window.addEventListener('load',schedule,{once:true});section.addEventListener('transitionend',schedule);document.fonts.ready.then(schedule);schedule();
})();
/* END PORTFOLIO REVIEW */

/* BEGIN PROCESS REVIEW — marcações temporárias; regras aprovadas. */
(() => {
 'use strict';
 if(new URLSearchParams(location.search).get('limites')!=='1')return;
 const section=document.querySelector('#atendimento'),overlay=document.querySelector('#volt-analysis-marks'),shared=document.querySelector('#volt-analysis-panel');
 if(!section||!overlay||!shared)return;
 document.documentElement.dataset.voltProcessAnalysis='true';
 const eye=section.querySelector('.section-heading .eyebrow'),title=section.querySelector('h2'),intro=section.querySelector('.process-intro'),grid=section.querySelector('.process-grid'),steps=[...grid.children];
 const diff=section.querySelector('.differentials'),de=diff.querySelector('.eyebrow'),dt=diff.querySelector('h3'),list=diff.querySelector('ul'),items=[...list.children];
 const marks=document.createElement('div');marks.className='volt-analysis-group';marks.dataset.section='atendimento';overlay.append(marks);
 const panel=document.createElement('details');panel.dataset.analysisSection='atendimento';panel.open=['#atendimento','#process-title'].includes(location.hash);
 panel.innerHTML='<summary>Atendimento e Diferenciais · limites definidos</summary><div class="volt-analysis-body"><p class="volt-analysis-status">Seção inteira · aprovada</p><p>Regras aprovadas pelo Founder e aplicadas. Marcações não alteram o layout.</p><dl><dt class="volt-analysis-blue">Azul · Eyebrows</dt><dd data-pr="eyes"></dd><dt class="volt-analysis-green">Verde · H2 e apresentação</dt><dd data-pr="opening"></dd><dt class="volt-analysis-amber">Amarelo · números e sequência</dt><dd data-pr="numbers"></dd><dt class="volt-analysis-green">Verde · H3 das etapas</dt><dd data-pr="titles"></dd><dt class="volt-analysis-purple">Roxo · descrições das etapas</dt><dd data-pr="descriptions"></dd><dt class="volt-analysis-green">Verde · H3 de Diferenciais</dt><dd data-pr="diffTitle"></dd><dt class="volt-analysis-purple">Roxo · seis diferenciais</dt><dd data-pr="items"></dd><dt class="volt-analysis-amber">Amarelo · intervalos e recuos</dt><dd data-pr="gaps"></dd></dl><p data-pr="fit"></p><p>Quatro etapas e seis diferenciais preservados. Conteúdo permitido: funcionamento e práticas confirmadas do profissional; avaliação conforme o caso, orçamento antes da execução e materiais combinados. Não prometer visita gratuita, prazo, disponibilidade ou garantia sem confirmação. Sem cortes, compressão ou redução de fonte. Biblioteca de copy continua adiada.</p></div>';
 shared.append(panel);
 const R=e=>e.getBoundingClientRect(),S=e=>getComputedStyle(e),px=n=>(Math.round(n*10)/10).toLocaleString('pt-BR')+' px';
 const rows=e=>{
  const ys=[],walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);
  while(walker.nextNode()){
   const n=walker.currentNode;if(!n.textContent.trim()||n.parentElement.closest('[aria-hidden="true"]'))continue;
   const range=document.createRange();range.selectNodeContents(n);
   for(const r of range.getClientRects())if(r.width&&r.height){const line=ys.find(x=>Math.abs(x.y-r.y)<2);if(line){line.l=Math.min(line.l,r.left);line.r=Math.max(line.r,r.right);}else ys.push({y:r.y,l:r.left,r:r.right});}
  }return ys;
 };
 const lines=e=>rows(e).length;
 const write=(k,v)=>{const e=panel.querySelector('[data-pr="'+k+'"]');if(e.textContent!==v)e.textContent=v;};
 const box=(r,cls)=>{if(r.bottom<0||r.top>innerHeight)return;const e=document.createElement('div');e.className=cls;Object.assign(e.style,{left:r.left+'px',top:r.top+'px',width:Math.max(0,r.width)+'px',height:Math.max(0,r.height)+'px'});marks.append(e);};
 const mark=(e,cls)=>box(R(e),'volt-analysis-outline '+cls);
 const gap=(a,b)=>{const x=R(a),y=R(b);box({left:y.left,top:x.bottom,bottom:y.top,width:Math.min(x.width,y.width),height:Math.max(0,y.top-x.bottom)},'volt-analysis-gap');};
 const inside=(e,host)=>{const a=R(e),b=R(host);return a.left>=b.left-.2&&a.right<=b.right+.2&&a.top>=b.top-.2&&a.bottom<=b.bottom+.2;};
 let queued=false;
 const render=()=>{
  queued=false;const narrow=innerWidth<=620,vertical=innerWidth<=1080,issues=[];
  const titles=steps.map(x=>x.querySelector('h3')),ps=steps.map(x=>x.querySelector('p')),numbers=steps.map(x=>x.querySelector('span'));
  const tl=titles.map(lines),pl=ps.map(lines),il=items.map(lines);
  for(const [e,t] of [[eye,title],[de,dt]]){const r=R(e),max=Math.max(0,...rows(t).map(x=>x.r-x.l));if(lines(e)!==1||r.width>280.1||r.width>=max)issues.push('Eyebrow');}
  if(lines(title)<1||lines(title)>2||R(title).width>(vertical?620:section.querySelector('.container').clientWidth)+.1)issues.push('H2');
  if(lines(intro)<1||lines(intro)>3||R(intro).width>760.1||intro.dataset.copyOverflow==='true')issues.push('apresentação');
  titles.forEach((t,i)=>{if(tl[i]<1||tl[i]>2||!inside(t,steps[i])||R(t).width>(vertical?620:220)+.1)issues.push('H3 das etapas');if(Math.abs(R(ps[i]).top-R(t).bottom-12)>.2)issues.push('intervalo H3 → descrição');});
  ps.forEach((p,i)=>{if(pl[i]<(vertical?1:3)||pl[i]>6||!inside(p,steps[i])||R(p).width>(vertical?620:235)+.1)issues.push('descrições');});
  if(!vertical){if([...titles,...ps].some(e=>S(e).textAlign!=='center'))issues.push('centralização das etapas');if(ps.some(e=>R(e).height<parseFloat(S(e).lineHeight)*6-.2))issues.push('reserva das descrições');}
  if([...titles,...items].some(e=>parseFloat(S(e).minHeight)>.1))issues.push('reserva indevida');
  numbers.forEach((n,i)=>{const r=R(n);if(lines(n)!==1||Math.abs(r.width-40)>.2||Math.abs(r.height-30)>.2||!inside(n,steps[i]))issues.push('numeração');});
  if(lines(dt)<1||lines(dt)>2||R(dt).width>620.1||!inside(dt,diff))issues.push('H3 de Diferenciais');
  items.forEach((e,i)=>{if(il[i]<1||il[i]>(narrow?3:2)||!inside(e,list))issues.push('lista de diferenciais');});
  if(Math.abs(R(title).top-R(eye).bottom-12)>.2||Math.abs(R(intro).top-R(title).bottom-16)>.2||Math.abs(R(grid).top-R(intro).bottom-(innerWidth<=860?32:40))>.2||Math.abs(R(diff).top-R(grid).bottom-32)>.2||Math.abs(R(dt).top-R(de).bottom-12)>.2)issues.push('intervalos');
  for(let i=0;i<steps.length;i++)for(let j=i+1;j<steps.length;j++){const a=R(steps[i]),b=R(steps[j]);if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>.2&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>.2)issues.push('sobreposição entre etapas');}
  write('eyes','Abertura: '+px(R(eye).width)+' / '+lines(eye)+' linha; Diferenciais: '+px(R(de).width)+' / '+lines(de)+' linha. Uma linha e teto 280 px incluindo traço de 34 px; menor que a maior linha do título seguinte. Reserva de uma linha.');
  write('opening','H2: '+px(R(title).width)+' / '+lines(title)+' linha(s), máximo 2, '+(vertical?'teto 620 px':'toda a coluna interna no computador, sem quebra forçada')+'. Reserva mínima '+(narrow?'2 linhas':'1 linha')+'. Apresentação: '+px(R(intro).width)+' / '+lines(intro)+' linha(s), máximo 3 em todas as telas, teto 760 px, altura natural sem reserva; Inter 16 px / 1,6. Variante '+(intro.dataset.copyVariant||'compact')+' selecionada pelo espaço real.');
  write('numbers','01 → 02 → 03 → 04; caixas 40 × 30 px, uma linha, preservando tipografia. '+(vertical?'Sequência vertical até 1080 px.':'Quatro colunas acima de 1080 px.')+' Linhas e conectores decorativos preservados.');
  write('titles',tl.join(' / ')+' linha(s). De 1 a 2 por H3; teto '+(vertical?'620':'220')+' px dentro da etapa. '+(vertical?'Altura natural, à esquerda.':'Altura natural, sem reserva de segunda linha; centralizados.')+' Barlow Condensed 800, '+(narrow?'24':'28')+' px / 1,05.');
  write('descriptions',pl.join(' / ')+' linha(s). Faixa '+(vertical?'1–6':'3–6')+'; teto '+(vertical?'620':'235')+' px. '+(vertical?'Altura natural, à esquerda.':'Reserva de 6 linhas mantida; textos centralizados.')+' Inter 16 px / 1,55; texto preservado.');
  write('diffTitle',px(R(dt).width)+' / '+lines(dt)+' linha(s), máximo 2, teto 620 px dentro do painel. Altura natural; texto preto sobre amarelo. Painéis '+(vertical?'empilhados.':'lado a lado.'));
  write('items',il.join(' / ')+' linha(s); seis itens, máximo '+(narrow?'3':'2')+' por item. '+(narrow?'Uma coluna.':'Duas colunas.')+' Altura natural em cada item, sem reserva de segunda linha.'+' Inter 16 px / 1,45; marcas de confirmação com 19 px de área lateral; intervalos 14 px entre linhas e 28 px entre colunas.');
  write('gaps','Eyebrow → H2: '+px(R(title).top-R(eye).bottom)+'; H2 → apresentação: '+px(R(intro).top-R(title).bottom)+'; apresentação → etapas: '+px(R(grid).top-R(intro).bottom)+'; etapas → Diferenciais: '+px(R(diff).top-R(grid).bottom)+'; Eyebrow → H3 do painel: '+px(R(dt).top-R(de).bottom)+'. Etapas: '+S(steps[0]).padding+'; painéis de Diferenciais: '+S(de.parentElement).padding+'. Títulos e diferenciais com altura natural. Somente as descrições das quatro colunas reservam seis linhas.');
  write('fit',issues.length?'Conferir nesta tela: '+[...new Set(issues)].join(', ')+'.':'Critérios medidos atendidos nesta tela. Regras aprovadas pelo Founder.');
  marks.replaceChildren();if(overlay.hidden)return;
  [eye,de].forEach(e=>mark(e,'volt-analysis-outline--heading'));
  [title,...titles,dt].forEach(e=>mark(e,'volt-analysis-outline--intro'));
  [intro,...ps,...items].forEach(e=>mark(e,'volt-analysis-outline--other-intro'));
  numbers.forEach(e=>mark(e,'volt-analysis-outline--dg-amber'));
  gap(eye,title);gap(title,intro);gap(intro,grid);gap(grid,diff);gap(de,dt);titles.forEach((t,i)=>gap(t,ps[i]));
 };
 const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(render);}};
 const observer=new ResizeObserver(schedule);[section,eye,title,intro,grid,...steps,diff,de,dt,list,...items].forEach(e=>observer.observe(e));
 window.addEventListener('resize',schedule,{passive:true});window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('volt-analysis-toggle',schedule);window.addEventListener('volt-process-intro-fit',schedule);window.addEventListener('load',schedule,{once:true});section.addEventListener('transitionend',schedule);document.fonts.ready.then(schedule);schedule();
})();
/* END PROCESS REVIEW */

/* Recuos externos aprovados — marcações no painel único. */
(() => {
 if(new URLSearchParams(location.search).get('limites')!=='1')return;
 const overlay=document.querySelector('#volt-analysis-marks'),shared=document.querySelector('#volt-analysis-panel');
 if(!overlay||!shared)return;
 const sections=[...document.querySelectorAll('main>section:not([data-section-complement])')];
 const marks=document.createElement('div');marks.className='volt-analysis-group';marks.dataset.section='espacamentos';overlay.append(marks);
 const panel=document.createElement('details');panel.dataset.analysisSection='espacamentos';
 panel.innerHTML='<summary>Espaçamento entre seções · aprovado</summary><div class="volt-analysis-body"><p>Redução de aproximadamente 30% nos recuos externos de todas as seções, com arredondamento para pixels inteiros. Medidas de cada lado da divisória; bordas à parte. As marcações amarelas mostram somente esses recuos.</p><ul data-section-spaces></ul><p>Regra comum: 67 px acima de 860 px, 50 px entre 621 e 860 px e 45 px até 620 px. Hero e chamada final preservam suas proporções. O convite para avaliar integra Avaliações: 32 px dos cards ao painel amarelo, sem somar recuos externos.</p></div>';
 shared.append(panel);
 const output=panel.querySelector('[data-section-spaces]');
 const px=n=>n.toLocaleString('pt-BR')+' px';
 let queued=false;
 const render=()=>{
  queued=false;marks.replaceChildren();const labels=[];
  for(const section of sections){
   const complement=document.querySelector('[data-section-complement="'+section.id+'"]'),s=getComputedStyle(section),end=complement||section,startRect=section.getBoundingClientRect(),endRect=end.getBoundingClientRect(),r={top:startRect.top,bottom:endRect.bottom},container=section.querySelector(':scope>.container'),c=container?.getBoundingClientRect();
   const top=parseFloat(s.paddingTop),bottom=parseFloat(getComputedStyle(end).paddingBottom);
   const name=section.classList.contains('hero')?'Hero':section.querySelector('h2')?.innerText.trim()||section.id;
   labels.push(name+(complement?' + convite para avaliar (complemento)':'')+': '+px(top)+' acima / '+px(bottom)+' abaixo.');
   if(overlay.hidden||!c||r.bottom<0||r.top>innerHeight)continue;
   for(const [y,h]of [[r.top+parseFloat(s.borderTopWidth),top],[r.bottom-parseFloat(s.borderBottomWidth)-bottom,bottom]]){
    if(y+h<0||y>innerHeight)continue;
    const box=document.createElement('div');box.className='volt-analysis-gap';
    Object.assign(box.style,{left:c.left+'px',top:y+'px',width:c.width+'px',height:h+'px'});marks.append(box);
    const label=document.createElement('div');label.className='volt-analysis-label volt-analysis-amber volt-analysis-label--small';
    Object.assign(label.style,{left:c.left+'px',top:(y+Math.max(0,(h-16)/2))+'px',width:Math.min(c.width,200)+'px'});label.textContent=px(h)+' · recuo externo';marks.append(label);
   }
  }
  const invite=document.querySelector('[data-section-complement="avaliacoes"] .google-review__inner'),lastRow=document.querySelector('#avaliacoes .review-marquee-row:last-child');
  if(invite&&lastRow){
   const rowRect=lastRow.getBoundingClientRect(),panelRect=invite.getBoundingClientRect(),y=rowRect.bottom-parseFloat(getComputedStyle(lastRow).paddingBottom),h=panelRect.top-y;
   labels.push('Cards → convite para avaliar: '+px(h)+' · intervalo interno, aprovado 32 px.');
   if(!overlay.hidden&&panelRect.top>0&&y<innerHeight){
    const box=document.createElement('div');box.className='volt-analysis-gap';Object.assign(box.style,{left:panelRect.left+'px',top:y+'px',width:panelRect.width+'px',height:h+'px'});marks.append(box);
    const label=document.createElement('div');label.className='volt-analysis-label volt-analysis-amber volt-analysis-label--small';Object.assign(label.style,{left:panelRect.left+'px',top:(y+8)+'px',width:'260px'});label.textContent=px(h)+' · intervalo do complemento';marks.append(label);
   }
  }
  const text=labels.join('\n');if(output.dataset.value!==text){output.replaceChildren(...labels.map(t=>{const li=document.createElement('li');li.textContent=t;return li;}));output.dataset.value=text;}
 };
 const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(render);}};
 const observer=new ResizeObserver(schedule);sections.forEach(e=>observer.observe(e));document.querySelectorAll('[data-section-complement]').forEach(e=>observer.observe(e));
 window.addEventListener('resize',schedule,{passive:true});window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('volt-analysis-toggle',schedule);document.fonts.ready.then(schedule);schedule();
})();

/* BEGIN REVIEWS REVIEW — marcações temporárias; regras aprovadas pelo Founder. */
(() => {
 if(new URLSearchParams(location.search).get('limites')!=='1')return;
 const section=document.querySelector('#avaliacoes'),overlay=document.querySelector('#volt-analysis-marks'),shared=document.querySelector('#volt-analysis-panel');
 if(!section||!overlay||!shared)return;
 document.documentElement.dataset.voltReviewsAnalysis='true';
 const head=section.querySelector('.reviews-head'),copy=head.firstElementChild,eye=copy.querySelector('.eyebrow'),title=copy.querySelector('h2'),intro=copy.querySelector('.reviews-intro'),badge=head.querySelector('.rating-badge'),marquee=section.querySelector('.reviews-marquee'),rows=[...section.querySelectorAll('.review-marquee-row')],cards=[...section.querySelectorAll('.review-marquee-card')];
 const panel=document.createElement('details');panel.dataset.analysisSection='avaliacoes';panel.open=['#avaliacoes','#reviews-title','#avaliar-no-google','#google-review-title'].includes(location.hash);
 panel.innerHTML='<summary>Avaliações · limites definidos</summary><div class="volt-analysis-body"><p class="volt-analysis-status">Avaliações e complemento · aprovados</p><p>Regras aprovadas pelo Founder e aplicadas. O convite para avaliar integra a seção como complemento; sua parametrização interna está aprovada e consolidada no detalhamento abaixo. O selo e os seis relatos são demonstrativos; as repetições da animação não representam novos clientes. A animação fica pausada neste modo para acompanhar as caixas; no acesso normal, o movimento é preservado.</p><dl><dt class="volt-analysis-blue">Azul · Eyebrow</dt><dd data-rv="eye"></dd><dt class="volt-analysis-green">Verde · H2</dt><dd data-rv="title"></dd><dt class="volt-analysis-purple">Roxo · apresentação</dt><dd data-rv="intro"></dd><dt class="volt-analysis-amber">Amarelo · selo gráfico</dt><dd data-rv="badge"></dd><dt class="volt-analysis-purple">Roxo · depoimentos</dt><dd data-rv="messages"></dd><dt class="volt-analysis-blue">Azul · identificação e legenda</dt><dd data-rv="people"></dd><dt class="volt-analysis-amber">Amarelo · composição e intervalos</dt><dd data-rv="gaps"></dd></dl><p data-rv="fit"></p><p>Sem cortar depoimentos ou abreviar pessoas e localidades automaticamente. Na produção, usar relatos, autores, notas e quantidades reais, fiéis às fontes confirmadas. Se não couberem, resolver a seleção do conteúdo com aprovação; não inventar avaliações nem reescrever o sentido de um relato.</p></div>';
 shared.append(panel);
 const marks=document.createElement('div');marks.className='volt-analysis-group';marks.dataset.section='avaliacoes';overlay.append(marks);
 const R=e=>e.getBoundingClientRect(),S=e=>getComputedStyle(e),px=n=>(Math.round(n*10)/10).toLocaleString('pt-BR')+' px';
 const textRows=e=>{
  const result=[],w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);
  while(w.nextNode()){const n=w.currentNode;if(!n.textContent.trim()||n.parentElement.closest('.review-marquee-mark'))continue;const r=document.createRange();r.selectNodeContents(n);for(const b of r.getClientRects())if(b.width&&b.height){const found=result.find(x=>Math.abs(x.y-b.y)<2);if(found){found.left=Math.min(found.left,b.left);found.right=Math.max(found.right,b.right);}else result.push({y:b.y,left:b.left,right:b.right});}}return result;
 };
 const lines=e=>textRows(e).length;
 const write=(key,value)=>{const e=panel.querySelector('[data-rv="'+key+'"]');if(e.textContent!==value)e.textContent=value;};
 const inside=(a,b)=>{const x=R(a),y=R(b);return x.left>=y.left-.2&&x.right<=y.right+.2&&x.top>=y.top-.2&&x.bottom<=y.bottom+.2;};
 const box=(r,cls,clip)=>{
  let left=r.left,right=r.right??r.left+r.width,top=r.top,bottom=r.bottom??r.top+r.height;
  if(clip){const c=R(clip);left=Math.max(left,c.left);right=Math.min(right,c.right);top=Math.max(top,c.top);bottom=Math.min(bottom,c.bottom);}
  if(right<=left||bottom<=top||right<0||left>innerWidth||bottom<0||top>innerHeight)return;
  const e=document.createElement('div');e.className=cls;Object.assign(e.style,{left:left+'px',top:top+'px',width:(right-left)+'px',height:(bottom-top)+'px'});marks.append(e);
 };
 const mark=(e,cls,clip)=>box(R(e),'volt-analysis-outline '+cls,clip);
 const gap=(a,b)=>{const x=R(a),y=R(b);box({left:x.left,top:x.bottom,width:Math.min(x.width,y.width),height:y.top-x.bottom},'volt-analysis-gap');};
 let queued=false;
 const render=()=>{
  queued=false;const narrow=innerWidth<=620,stacked=innerWidth<=860,issues=[],visible=cards.filter(e=>R(e).width>0);
  const messages=visible.map(c=>c.querySelector('.review-marquee-message')),names=visible.map(c=>c.querySelector('strong')),places=visible.map(c=>c.querySelector('small'));
  const ml=messages.map(lines),nl=names.map(lines),pl=places.map(lines),er=R(eye),tr=R(title),ir=R(intro),br=R(badge),hr=R(head),mr=R(marquee),maxLine=Math.max(0,...textRows(title).map(r=>r.right-r.left));
  if(lines(eye)!==1||er.width>280.1||er.width>=maxLine)issues.push('Eyebrow');
  if(lines(title)<1||lines(title)>2||tr.width>620.1)issues.push('H2');
  if(lines(intro)<1||lines(intro)>(narrow?5:3)||ir.width>760.1||intro.dataset.copyOverflow==='true')issues.push('apresentação');
  if(ir.width>=759&&intro.dataset.copyVariant==='full'){const actual=textRows(intro);const last=actual.at(-1);if(actual.length!==3||(last.right-last.left)/ir.width<.5||(last.right-last.left)/ir.width>.65)issues.push('preenchimento da apresentação');}
  if(Math.abs(br.width-268)>.2||Math.abs(br.height-br.width*324/280)>.2||!inside(badge,head))issues.push('selo');
  for(const e of badge.querySelectorAll('.rating-badge__google,.rating-badge__stars,.rating-badge__text,.rating-badge__score'))if(!inside(e,badge))issues.push('conteúdo do selo');
  if(lines(badge.querySelector('.rating-badge__text'))!==3||lines(badge.querySelector('.rating-badge__score'))!==1)issues.push('linhas do selo');
  if(ml.some(n=>n<1||n>3))issues.push('linhas dos depoimentos');
  if(nl.some(n=>n<1||n>2)||pl.some(n=>n<1||n>2))issues.push('identificações/legendas');
  visible.forEach((c,i)=>{
   const p=messages[i],person=c.querySelector('.review-marquee-person'),row=c.closest('.review-marquee-row'),closing=c.querySelector('.review-marquee-mark--closing');
   if(!inside(p,c)||!inside(person,c)||R(c).width>R(row).width+.2)issues.push('conteúdo do cartão');
   if(S(p).webkitLineClamp!=='none'||S(p).overflow==='hidden')issues.push('corte de depoimento');
   const opening=c.querySelector('.review-marquee-mark:not(.review-marquee-mark--closing)');
   if(!opening||!closing||opening.parentElement!==p||closing.parentElement!==p||!inside(opening,c)||!inside(closing,c)||R(person).top-R(p).bottom<15.8)issues.push('aspas e intervalos');
   if(Math.abs(R(c).height-(narrow?168:172))>.2)issues.push('altura do cartão');
   const quote=c.querySelector('.review-marquee-quote');
   if(!quote||Math.abs(R(person).top-R(quote).bottom-16)>.2||Math.abs((R(p).top-R(quote).top)-(R(quote).bottom-R(p).bottom))>.2)issues.push('centralização vertical e intervalo');
   if(S(p).textAlign!=='center')issues.push('centralização dos relatos');
  });
  if(section.scrollWidth>section.clientWidth+.2)issues.push('transbordamento da seção');
  if(Math.abs(tr.top-er.bottom-12)>.2||Math.abs(ir.top-tr.bottom-16)>.2||Math.abs(mr.top-hr.bottom-(stacked?32:40))>.2)issues.push('intervalos da abertura');
  if(stacked){if(Math.abs(br.top-R(copy).bottom-32)>.2)issues.push('intervalo até o selo');}
  else if(Math.abs(br.left-R(copy).right-48)>.2)issues.push('intervalo entre colunas');
  const unique=new Set(cards.map(c=>c.querySelector('.review-marquee-message').textContent.trim())).size;
  const accessible=cards.filter(c=>!c.closest('[aria-hidden="true"]')).length;
  write('eye',px(er.width)+' / '+lines(eye)+' linha. Teto 280 px incluindo traço de 34 px; menor que a maior linha do H2. Variante '+(section.dataset.reviewEyebrowVariant==='short'?'curta: AVALIAÇÕES.':'completa.'));
  write('title',px(tr.width)+' / '+lines(title)+' linha(s), máximo 2; teto 620 px. Reserva mínima '+(narrow?'2 linhas':'1 linha')+'. Variante '+(section.dataset.reviewTitleVariant==='short'?'curta: O QUE DIZEM SOBRE RAFAEL.':'completa.'));
  write('intro',px(ir.width)+' / '+lines(intro)+' linha(s); máximo '+(narrow?'5':'3')+', teto 760 px, altura natural sem reserva. Copy remodelada com a AR como referência; Inter 16 px / 1,6. Variante '+(intro.dataset.copyVariant||'compact')+'. '+(lines(intro)===3?'Terceira linha: '+Math.round((textRows(intro)[2].right-textRows(intro)[2].left)/ir.width*100)+'% da largura.':'No computador com caixa de 760 px: três linhas, última pouco além da metade.')+'');
  write('badge',px(br.width)+' × '+px(br.height)+'; proporção 280:324. '+(stacked?'Abaixo do texto e centralizado até 860 px.':'À direita, alinhado ao topo acima de 860 px.')+' Texto preto, três linhas no selo e uma na nota. Valores demonstrativos preservados: 4,9/5 e 38 avaliações no rótulo acessível.');
  write('messages',unique+' relatos distintos; '+cards.length+' cartões no HTML para o movimento, '+accessible+' relatos acessíveis. Linhas atuais visíveis: '+[...new Set(ml)].sort().join(' / ')+', máximo 3. Textos centralizados; aspas junto ao início e ao fim do relato, na mesma linha das palavras. Sem line-clamp ou cortes. Cartão compacto: '+(narrow?'168':'172')+' px. Relato centralizado verticalmente na área acima do autor, inclusive quando ocupa duas linhas; área mínima de 72 px, sem linhas vazias no texto. Inter 16 px / 1,5; larguras até '+(narrow?'282':innerWidth<=900?'306':'322')+' px, sempre dentro da faixa. Acabamento visual aprovado: degradê grafite, borda discreta, traço amarelo no topo e avatar suave; dimensões preservadas.');
  write('people','Nomes: '+[...new Set(nl)].sort().join(' / ')+' linha(s); localidades: '+[...new Set(pl)].sort().join(' / ')+'. Máximo 2 por elemento, alturas naturais. Identificação de pessoa: 14 px / 700 / 1,5; legenda: 12 px / 500 / 1,5. Avatar 36 × 36 px, intervalo 10 px; nome → localidade 4 px. Repetições decorativas ocultas dos leitores de tela.');
  write('gaps','Eyebrow → H2: '+px(tr.top-er.bottom)+'; H2 → apresentação: '+px(ir.top-tr.bottom)+'; abertura completa → faixas: '+px(mr.top-hr.bottom)+'. '+(stacked?'Texto → selo: '+px(br.top-R(copy).bottom):'Texto → selo: '+px(br.left-R(copy).right))+'. Faixas: '+(narrow?'12':'16')+' px entre linhas; 7 px acima/abaixo para hover. Cartões: recuos verticais '+(narrow?'16':'18')+' px e laterais '+(innerWidth<=360?'12':narrow?'16':'18')+' px; aspas inline, junto à primeira e à última palavra; área do relato → autor 16 px, com autor alinhado ao rodapé. O texto fica centralizado verticalmente nessa área. Convite para avaliar: complemento, 32 px após os cards. Recuos externos do conjunto seguem a escala global de 67 / 50 / 45 px.');
  write('fit',issues.length?'Conferir nesta tela: '+[...new Set(issues)].join(', ')+'.':'Critérios medidos atendidos nesta tela. Regras aprovadas pelo Founder.');
  marks.replaceChildren();if(overlay.hidden)return;
  mark(eye,'volt-analysis-outline--heading');mark(title,'volt-analysis-outline--intro');mark(intro,'volt-analysis-outline--other-intro');mark(badge,'volt-analysis-outline--dg-amber');
  visible.forEach((c,i)=>{const row=c.closest('.review-marquee-row');mark(messages[i],'volt-analysis-outline--other-intro',row);c.querySelectorAll('.review-marquee-mark').forEach(e=>mark(e,'volt-analysis-outline--dg-amber',row));mark(names[i],'volt-analysis-outline--heading',row);mark(places[i],'volt-analysis-outline--heading',row);});
  gap(eye,title);gap(title,intro);gap(head,marquee);
  if(stacked)gap(copy,badge);else box({left:R(copy).right,top:hr.top,width:br.left-R(copy).right,height:hr.height},'volt-analysis-gap');
 };
 const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(render);}};
 const observer=new ResizeObserver(schedule);[section,head,copy,eye,title,intro,badge,marquee,...cards].forEach(e=>observer.observe(e));
 window.addEventListener('resize',schedule,{passive:true});window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('volt-analysis-toggle',schedule);window.addEventListener('volt-reviews-fit',schedule);section.addEventListener('transitionend',schedule);document.fonts.ready.then(schedule);schedule();
})();
/* END REVIEWS REVIEW */

/* Sobre — variantes pelo espaço real; textos completos preservados. */
(() => {
 const s=document.querySelector('#sobre');if(!s)return;
 const title=s.querySelector('h2'),eye=s.querySelector('.eyebrow');
 const rows=e=>{const out=[],w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);while(w.nextNode()){if(!w.currentNode.textContent.trim())continue;const r=document.createRange();r.selectNodeContents(w.currentNode);for(const b of r.getClientRects())if(b.width&&b.height){let q=out.find(x=>Math.abs(x.y-b.y)<2);if(q){q.left=Math.min(q.left,b.left);q.right=Math.max(q.right,b.right);}else out.push({y:b.y,left:b.left,right:b.right});}}return out;};
 const choose=(e,kind)=>{e.querySelectorAll('[data-about-copy]').forEach(n=>n.hidden=n.dataset.aboutCopy!==kind);};
 let pending=false;const fit=()=>{pending=false;choose(title,'full');if(rows(title).length>2)choose(title,'short');choose(eye,'full');const largest=Math.max(0,...rows(title).map(r=>r.right-r.left));if(eye.getBoundingClientRect().width>280||eye.getBoundingClientRect().width>=largest)choose(eye,'short');const maxLines=innerWidth<=620?5:3;s.querySelectorAll('.about__copy>p:not(.eyebrow)').forEach(p=>{const variants=[...p.querySelectorAll('[data-about-paragraph]')];let chosen=variants.at(-1);for(const candidate of variants){variants.forEach(e=>e.hidden=e!==candidate);chosen=candidate;if(rows(p).length>=2&&rows(p).length<=maxLines)break;}p.dataset.paragraphVariant=chosen.dataset.aboutParagraph;p.dataset.paragraphOverflow=String(rows(p).length<2||rows(p).length>maxLines);});s.dataset.aboutTitleVariant=title.querySelector('[data-about-copy]:not([hidden])').dataset.aboutCopy;s.dataset.aboutEyebrowVariant=eye.querySelector('[data-about-copy]:not([hidden])').dataset.aboutCopy;s.dispatchEvent(new Event('volt-about-fit'));};
 const schedule=()=>{if(!pending){pending=true;requestAnimationFrame(fit)}};new ResizeObserver(schedule).observe(s.querySelector('.about__copy'));window.addEventListener('resize',schedule,{passive:true});document.fonts.ready.then(schedule);window.addEventListener('load',schedule,{once:true});fit();
})();

/* Sobre — marcações temporárias no painel único; regras aprovadas. */
(() => {
 if(new URLSearchParams(location.search).get('limites')!=='1')return;
 const section=document.querySelector('#sobre'),overlay=document.querySelector('#volt-analysis-marks'),shared=document.querySelector('#volt-analysis-panel');if(!section||!overlay||!shared)return;
 document.documentElement.dataset.voltAboutAnalysis='true';
 const copy=section.querySelector('.about__copy'),eye=copy.querySelector('.eyebrow'),title=copy.querySelector('h2'),paras=[...copy.querySelectorAll(':scope>p:not(.eyebrow)')],proofs=section.querySelector('.about__proofs'),items=[...proofs.children],action=section.querySelector('.about__action'),cta=action.querySelector('.btn'),micro=action.querySelector('p'),photo=section.querySelector('.about__image'),label=photo.querySelector('.about__image-label'),portrait=photo.querySelector('.about__portrait'),img=photo.querySelector('img');
 const panel=document.createElement('details');panel.dataset.analysisSection='sobre';panel.open=['#sobre','#sobre-title'].includes(location.hash);panel.innerHTML='<summary>Sobre · limites definidos</summary><div class="volt-analysis-body"><p class="volt-analysis-status">Seção inteira · aprovada</p><p>Regras aprovadas pelo Founder e aplicadas. Marcações não alteram o layout. Retrato e informações demonstrativos preservados; atributos com uma informação por cartão e identificação fora da imagem; não atribuir experiência, atuação ou qualificações fictícias a um cliente real.</p><dl><dt class="volt-analysis-blue">Azul · Eyebrow</dt><dd data-ab="eye"></dd><dt class="volt-analysis-green">Verde · H2</dt><dd data-ab="title"></dd><dt class="volt-analysis-purple">Roxo · três parágrafos</dt><dd data-ab="body"></dd><dt class="volt-analysis-amber">Amarelo · retrato e identificação</dt><dd data-ab="photo"></dd><dt class="volt-analysis-blue">Azul · quatro atributos</dt><dd data-ab="proofs"></dd><dt class="volt-analysis-green">Verde · Copy do CTA e Microcopy</dt><dd data-ab="cta"></dd><dt class="volt-analysis-amber">Amarelo · composição e intervalos</dt><dd data-ab="gaps"></dd></dl><p data-ab="fit"></p><p>Sem cortes, abreviações automáticas ou redução de fonte para caber. Na produção, confirmar nome, atividade, cidade, ano de início e público atendido. Assets e biblioteca de cinco versões de copy permanecem para depois.</p></div>';shared.append(panel);
 const marks=document.createElement('div');marks.className='volt-analysis-group';marks.dataset.section='sobre';overlay.append(marks);
 const R=e=>e.getBoundingClientRect(),S=e=>getComputedStyle(e),px=n=>(Math.round(n*10)/10).toLocaleString('pt-BR')+' px';
 const rows=e=>{const out=[],w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);while(w.nextNode()){if(!w.currentNode.textContent.trim())continue;const r=document.createRange();r.selectNodeContents(w.currentNode);for(const b of r.getClientRects())if(b.width&&b.height){let q=out.find(x=>Math.abs(x.y-b.y)<2);if(q){q.left=Math.min(q.left,b.left);q.right=Math.max(q.right,b.right);}else out.push({y:b.y,left:b.left,right:b.right});}}return out;};const lines=e=>rows(e).length;
 const ctaLayout=()=>{const r=R(cta),t=S(cta).transform,m=t==='none'?{m41:0,m42:0}:new DOMMatrixReadOnly(t);return {left:r.left-m.m41,right:r.right-m.m41,top:r.top-m.m42,bottom:r.bottom-m.m42,width:r.width,height:r.height};};
 const inside=(a,b)=>{a=a===cta?ctaLayout():R(a);b=R(b);return a.left>=b.left-.2&&a.right<=b.right+.2&&a.top>=b.top-.2&&a.bottom<=b.bottom+.2;};
 const write=(k,t)=>{let e=panel.querySelector('[data-ab="'+k+'"]');if(e.textContent!==t)e.textContent=t};
 const box=(r,cls)=>{if(r.width<=0||r.height<=0||r.bottom<0||r.top>innerHeight)return;const e=document.createElement('div');e.className=cls;Object.assign(e.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'});marks.append(e);};
 const mark=(e,cls)=>box(R(e),'volt-analysis-outline '+cls);const gap=(a,b)=>{const x=R(a),y=R(b);box({left:y.left,top:x.bottom,width:y.width,height:y.top-x.bottom,bottom:y.top},'volt-analysis-gap')};
 let pending=false;const render=()=>{pending=false;const mobile=innerWidth<=620,stacked=innerWidth<=1080,compactSpace=innerWidth<=860,issues=[],pl=paras.map(lines),er=R(eye),tr=R(title),pr=R(photo),last=paras.at(-1),cols=S(proofs).gridTemplateColumns.split(' ').length;
  if(lines(eye)!==1||er.width>280.2||er.width>=Math.max(...rows(title).map(r=>r.right-r.left)))issues.push('Eyebrow');
  if(lines(title)<1||lines(title)>2||tr.width>620.2)issues.push('H2');
  if(pl.some(n=>n<2||n>(mobile?5:3))||paras.some(p=>p.dataset.paragraphOverflow==='true')||paras.some(p=>R(p).width>760.2||!inside(p,copy)))issues.push('parágrafos');
  if(items.length!==4||items.some(e=>lines(e.querySelector('.about-proof__text'))<1||lines(e.querySelector('.about-proof__text'))>3||!inside(e.querySelector('.about-proof__text'),e)))issues.push('atributos');
  if([...label.children].some(e=>lines(e)>2||!inside(e,label)))issues.push('identificação da foto');
  if(lines(cta)!==1||R(cta).height<53.8||cta.dataset.copyOverflow==='true'||!inside(cta,action))issues.push('Copy do CTA');
  if(lines(micro)<1||lines(micro)>3||!inside(micro,action))issues.push('Microcopy');
  const mid=e=>{const r=e===cta?ctaLayout():R(e);return r.left+r.width/2;};if(Math.abs(mid(cta)-mid(copy))>.3||Math.abs(mid(micro)-mid(copy))>.3||S(micro).textAlign!=='center')issues.push('centralização da ação');
  if(proofs.querySelector('.about-proof__icon')||items.some(e=>R(e).height<87.8))issues.push('atributos compactos');
  if(Math.abs(tr.top-er.bottom-12)>.2||Math.abs(R(paras[0]).top-tr.bottom-16)>.2||paras.slice(1).some((p,i)=>Math.abs(R(p).top-R(paras[i]).bottom-12)>.2)||Math.abs(R(proofs).top-R(last).bottom-(compactSpace?32:40))>.2||Math.abs(R(action).top-R(proofs).bottom-24)>.2||Math.abs(R(micro).top-ctaLayout().bottom-12)>.2)issues.push('intervalos internos');
  if(!inside(label,photo)||R(label).top<R(portrait).bottom-.2||!inside(portrait,photo))issues.push('moldura e identificação');
  if(stacked&&Math.abs(R(portrait).height-R(portrait).width*1.25)>.3)issues.push('proporção do retrato');
  if(stacked?Math.abs(pr.top-R(copy).bottom-32)>.2:Math.abs(R(copy).left-pr.right-48)>.2||Math.abs(R(copy).top-pr.top)>.2||Math.abs(R(copy).bottom-pr.bottom)>.2)issues.push('composição');
  if(section.scrollWidth>section.clientWidth+.2)issues.push('transbordamento');
  write('eye',px(er.width)+' / '+lines(eye)+' linha. Teto 280 px incluindo traço de 34 px; menor que a maior linha do H2. Variante '+section.dataset.aboutEyebrowVariant+'.');
  write('title',px(tr.width)+' / '+lines(title)+' linha(s), máximo 2. Teto 620 px; reserva mínima '+(mobile?'2 linhas':'1 linha')+'. Variante '+section.dataset.aboutTitleVariant+'; fonte preservada.');
  write('body','Três parágrafos, '+pl.join(' / ')+' linha(s). Faixa 2–'+(mobile?'5':'3')+' por parágrafo, teto 760 px dentro da coluna. Inter 16 px / 1,6; alturas naturais sem reservas. Variantes por encaixe: '+paras.map(p=>p.dataset.paragraphVariant).join(' / ')+'. Preservados ano de início, serviços, região, público, explicação e execução combinada.');
  write('photo',px(pr.width)+' × '+px(pr.height)+' incluindo moldura. Borda em grafite, dois detalhes amarelos nos cantos externos e retrato sem gradiente ou filtro sobre o profissional. Identificação em faixa abaixo da imagem: até duas linhas por elemento. '+(stacked?'Foto com proporção original 4:5 e moldura de até 420 px.':'Moldura acompanha a altura natural da coluna de texto, alinhando topo e base.')+' Arquivo original preservado. '+(img.complete&&img.naturalWidth?'Imagem carregada.':'Imagem aguardando carregamento.'));
  write('proofs',items.length+' atributos, uma informação por cartão: '+items.map(e=>e.querySelector('.about-proof__text').textContent).join('; ')+'. '+cols+' colunas: quatro com coluna de texto de pelo menos 600 px, duas abaixo disso. Sem ícones, texto centralizado em Inter 16 px / 1,4, até 3 linhas; recuos 12 / 10 px, mínimo 88 px, intervalo 8 px. Borda superior amarela e fundo grafite. Sem título e legenda separados.');
  write('cta','Copy do CTA: '+lines(cta)+' linha, '+px(R(cta).width)+' × '+px(R(cta).height)+', mínimo 54 px. Variante '+cta.dataset.copyFit+' pelo espaço útil. Até 620 px: coluna inteira; demais telas: largura natural de 300–440 px dentro da coluna. CTA e Microcopy centralizados na coluna. Microcopy abaixo: '+lines(micro)+' linha(s), máximo 3, teto 440 px, altura natural; Inter 14 px / 1,5.');
  write('gaps','Eyebrow → H2: 12 px; H2 → primeiro parágrafo: 16 px; entre parágrafos: 12 px; texto → atributos: '+(compactSpace?'32':'40')+' px; atributos → ação: 24 px; CTA → Microcopy: 12 px. '+(stacked?'Texto antes da foto até 1080 px, com 32 px entre blocos.':'Foto à esquerda e texto à direita, alinhados pelo topo e pela base, com 48 px entre colunas.')+' Recuos externos: escala comum 67 / 50 / 45 px.');
  write('fit',issues.length?'Conferir nesta tela: '+[...new Set(issues)].join(', ')+'.':'Critérios medidos atendidos nesta tela. Regras aprovadas pelo Founder.');
  marks.replaceChildren();if(overlay.hidden)return;mark(eye,'volt-analysis-outline--heading');mark(title,'volt-analysis-outline--intro');paras.forEach(p=>mark(p,'volt-analysis-outline--other-intro'));mark(photo,'volt-analysis-outline--dg-amber');[...label.children].forEach(e=>mark(e,'volt-analysis-outline--heading'));items.forEach(e=>{mark(e,'volt-analysis-outline--dg-amber');mark(e.querySelector('.about-proof__text'),'volt-analysis-outline--intro')});mark(cta,'volt-analysis-outline--heading');mark(micro,'volt-analysis-outline--other-intro');gap(eye,title);gap(title,paras[0]);paras.slice(1).forEach((p,i)=>gap(paras[i],p));gap(last,proofs);gap(proofs,action);gap(cta,micro);if(stacked)gap(copy,photo);
 };
 const schedule=()=>{if(!pending){pending=true;requestAnimationFrame(render)}};const o=new ResizeObserver(schedule);[section,copy,eye,title,photo,portrait,label,proofs,action,cta,...paras].forEach(e=>o.observe(e));window.addEventListener('resize',schedule,{passive:true});window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('volt-analysis-toggle',schedule);section.addEventListener('volt-about-fit',schedule);section.addEventListener('transitionend',schedule);section.addEventListener('focusin',schedule);section.addEventListener('focusout',schedule);img.addEventListener('load',schedule);document.fonts.ready.then(schedule);schedule();
})();

/* Complemento Google — variantes pelo encaixe real. */
(() => {
 const section=document.querySelector('#avaliar-no-google');if(!section)return;
 const panel=section.querySelector('.google-review__inner'),title=panel.querySelector('#google-review-title'),eye=panel.querySelector('.eyebrow');
 const rows=e=>{const out=[],w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);while(w.nextNode()){if(!w.currentNode.textContent.trim())continue;const r=document.createRange();r.selectNodeContents(w.currentNode);for(const b of r.getClientRects())if(b.width&&b.height){const q=out.find(x=>Math.abs(x.y-b.y)<2);if(q){q.left=Math.min(q.left,b.left);q.right=Math.max(q.right,b.right);}else out.push({y:b.y,left:b.left,right:b.right});}}return out;};
 const choose=(e,kind)=>e.querySelectorAll('[data-google-copy]').forEach(n=>n.hidden=n.dataset.googleCopy!==kind);
 let queued=false;const fit=()=>{queued=false;choose(title,'full');if(rows(title).length>2)choose(title,'short');choose(eye,'full');if(eye.getBoundingClientRect().width>280||eye.getBoundingClientRect().width>=Math.max(...rows(title).map(r=>r.right-r.left)))choose(eye,'short');section.dataset.googleTitleVariant=title.querySelector('[data-google-copy]:not([hidden])').dataset.googleCopy;section.dataset.googleEyebrowVariant=eye.querySelector('[data-google-copy]:not([hidden])').dataset.googleCopy;section.dispatchEvent(new Event('volt-google-fit'));};
 const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(fit)}};new ResizeObserver(schedule).observe(panel);window.addEventListener('resize',schedule,{passive:true});window.addEventListener('load',schedule,{once:true});document.fonts.ready.then(schedule);fit();
})();

/* Complemento Google — medidas internas no painel de Avaliações. */
(() => {
 if(new URLSearchParams(location.search).get('limites')!=='1')return;
 const section=document.querySelector('#avaliar-no-google'),overlay=document.querySelector('#volt-analysis-marks'),parent=document.querySelector('[data-analysis-section="avaliacoes"]');if(!section||!overlay||!parent)return;
 const inner=section.querySelector('.google-review__inner'),eye=inner.querySelector('.eyebrow'),title=inner.querySelector('#google-review-title'),intro=inner.querySelector('.google-review__description'),cta=inner.querySelector('button'),steps=inner.querySelector('ol'),items=[...steps.children];
 const panel=document.createElement('details');panel.dataset.googleReviewAnalysis='true';panel.open=true;panel.innerHTML='<summary>Complemento Google · limites definidos</summary><div class="volt-analysis-body"><p class="volt-analysis-status">Parametrização interna · aprovada</p><dl><dt class="volt-analysis-blue">Azul · Eyebrow</dt><dd data-gr="eye"></dd><dt class="volt-analysis-green">Verde · H3</dt><dd data-gr="title"></dd><dt class="volt-analysis-purple">Roxo · apresentação</dt><dd data-gr="intro"></dd><dt class="volt-analysis-blue">Azul · Copy do CTA</dt><dd data-gr="cta"></dd><dt class="volt-analysis-purple">Roxo · Microcopy dos passos</dt><dd data-gr="steps"></dd><dt class="volt-analysis-amber">Amarelo · recuos e intervalos internos</dt><dd data-gr="gaps"></dd></dl><p data-gr="fit"></p><p>Três passos com os textos da AR; apresentação preservada. Título e Eyebrow usam alternativas curtas quando necessário, sem reduzir a fonte. A mensagem abaixo dos passos permanece removida; o botão demonstrativo continua abrindo seu diálogo. Na instância do cliente, usar somente o perfil confirmado e passos coerentes com o destino.</p></div>';parent.querySelector('.volt-analysis-body').append(panel);
 const marks=document.createElement('div');marks.className='volt-analysis-group';marks.dataset.section='google-interno';overlay.append(marks);
 const R=e=>e.getBoundingClientRect(),S=e=>getComputedStyle(e),px=n=>(Math.round(n*10)/10).toLocaleString('pt-BR')+' px';
 const rows=e=>{const out=[],w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);while(w.nextNode()){const n=w.currentNode;if(!n.textContent.trim()||n.parentElement.closest('[aria-hidden="true"]'))continue;const r=document.createRange();r.selectNodeContents(n);for(const b of r.getClientRects())if(b.width&&b.height){const q=out.find(x=>Math.abs(x.y-b.y)<2);if(q){q.left=Math.min(q.left,b.left);q.right=Math.max(q.right,b.right);}else out.push({y:b.y,left:b.left,right:b.right});}}return out;};const lines=e=>rows(e).length;
 const buttonLayout=()=>{const r=R(cta),m=S(cta).transform==='none'?{m41:0,m42:0}:new DOMMatrixReadOnly(S(cta).transform);return {left:r.left-m.m41,right:r.right-m.m41,top:r.top-m.m42,bottom:r.bottom-m.m42,width:r.width,height:r.height};};
 const inside=(a,b)=>{a=a===cta?buttonLayout():R(a);b=R(b);return a.left>=b.left-.2&&a.right<=b.right+.2&&a.top>=b.top-.2&&a.bottom<=b.bottom+.2;};
 const write=(k,t)=>{const e=panel.querySelector('[data-gr="'+k+'"]');if(e.textContent!==t)e.textContent=t};
 const box=(r,cls)=>{if(r.height<=0||r.bottom<0||r.top>innerHeight)return;const e=document.createElement('div');e.className=cls;Object.assign(e.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'});marks.append(e)};const mark=(e,cls)=>box(R(e),'volt-analysis-outline '+cls);const gap=(a,b)=>{const x=a===cta?buttonLayout():R(a),y=R(b);box({left:y.left,top:x.bottom,width:y.width,height:y.top-x.bottom,bottom:y.top},'volt-analysis-gap')};
 let queued=false;const render=()=>{queued=false;const mobile=innerWidth<=620,mid=innerWidth<=860,issues=[],er=R(eye),tr=R(title),ir=R(intro),br=buttonLayout(),sr=R(steps),pr=R(inner),ps=S(inner),stepRows=[...new Set(items.map(e=>Math.round(R(e).top)))].length,padTop=mobile?28:mid?32:40,padSide=mobile?18:mid?32:48;
  if(lines(eye)!==1||er.width>280.2||er.width>=Math.max(...rows(title).map(r=>r.right-r.left)))issues.push('Eyebrow');
  if(lines(title)<1||lines(title)>2||tr.width>620.2)issues.push('H3');
  if(lines(intro)<2||lines(intro)>(mobile?5:3)||ir.width>760.2||!inside(intro,inner))issues.push('apresentação');
  if(lines(cta)!==1||br.height<53.8||br.width>365.2||!inside(cta,inner)||!inside(cta.querySelector('[aria-hidden]'),cta))issues.push('Copy do CTA');
  if(items.length!==3||items.some(e=>lines(e.querySelector('[data-google-step-text]'))>2||!inside(e,steps)))issues.push('passos');
  if(Math.abs(tr.top-er.bottom-12)>.2||Math.abs(ir.top-tr.bottom-16)>.2||Math.abs(br.top-ir.bottom-24)>.2||Math.abs(sr.top-br.bottom-(innerWidth<=480?17:21))>.2)issues.push('intervalos internos');
  if(Math.abs(er.top-pr.top-padTop)>.2||Math.abs(pr.bottom-sr.bottom-padTop)>.2||Math.abs(parseFloat(ps.paddingLeft)-padSide)>.2||Math.abs(parseFloat(ps.paddingRight)-padSide)>.2)issues.push('recuos do painel');
  if(section.scrollWidth>section.clientWidth+.2||!inside(title,inner))issues.push('transbordamento');
  write('eye',px(er.width)+' / '+lines(eye)+' linha. Teto 280 px com traço de 34 px; menor que a maior linha do H2. Variante '+section.dataset.googleEyebrowVariant+'.');
  write('title',px(tr.width)+' / '+lines(title)+' linha(s), máximo 2; teto 620 px, altura natural sem reserva. Variante '+section.dataset.googleTitleVariant+'; fonte preservada.');
  write('intro',px(ir.width)+' / '+lines(intro)+' linha(s); faixa 2–'+(mobile?'5':'3')+', teto 760 px. Texto completo, Inter 16 px / 1,6, centralizado e com altura natural.');
  write('cta',lines(cta)+' linha; '+px(br.width)+' × '+px(br.height)+', altura mínima 54 px e largura até 365 px dentro do painel. Recuos 13 / 24 px; seta decorativa e intervalo de 13 px preservados. Copy: AVALIAR NO GOOGLE.');
  write('steps',items.length+' passos completos, com os textos da AR. Agrupamento centralizado por largura natural, em '+stepRows+' linha(s) de itens, sem três colunas distribuídas. Inter 14 px / 1,5 preservado; 4 px entre número e texto. Separadores e proximidade da AR: margens 14 / 12 px (9 / 8 px até 480 px), 7 px entre linhas (6 px até 480 px). Até duas linhas por texto; sem cortes.');
  write('gaps','Recuos do painel: '+padTop+' px acima/abaixo e '+padSide+' px nas laterais. Eyebrow → H3: '+px(tr.top-er.bottom)+'; H3 → apresentação: '+px(ir.top-tr.bottom)+'; apresentação → CTA: '+px(br.top-ir.bottom)+'; CTA → passos: '+px(sr.top-br.bottom)+'. O intervalo externo dos cards ao painel continua 32 px; não faz parte dos recuos internos.');
  write('fit',issues.length?'Conferir nesta tela: '+[...new Set(issues)].join(', ')+'.':'Critérios internos medidos atendidos nesta tela. Regras aprovadas pelo Founder.');
  marks.replaceChildren();if(overlay.hidden)return;mark(eye,'volt-analysis-outline--heading');mark(title,'volt-analysis-outline--intro');mark(intro,'volt-analysis-outline--other-intro');mark(cta,'volt-analysis-outline--heading');items.forEach(e=>mark(e,'volt-analysis-outline--other-intro'));gap(eye,title);gap(title,intro);gap(intro,cta);gap(cta,steps);box({left:pr.left,top:pr.top,width:pr.width,height:padTop,bottom:pr.top+padTop},'volt-analysis-gap');box({left:pr.left,top:sr.bottom,width:pr.width,height:padTop,bottom:pr.bottom},'volt-analysis-gap');
 };
 const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(render)}};const observer=new ResizeObserver(schedule);[section,inner,eye,title,intro,cta,steps].forEach(e=>observer.observe(e));section.addEventListener('volt-google-fit',schedule);section.addEventListener('transitionend',schedule);section.addEventListener('focusin',schedule);section.addEventListener('focusout',schedule);window.addEventListener('resize',schedule,{passive:true});window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('volt-analysis-toggle',schedule);document.fonts.ready.then(schedule);schedule();
})();

/* Área atendida — variantes de encaixe sem alterar os locais atendidos. */
(() => {
 const s=document.querySelector('#area-atendida');if(!s)return;
 const eye=s.querySelector('.eyebrow'),title=s.querySelector('h2'),intro=s.querySelector('.section-intro'),paragraphs=[...s.querySelectorAll('[data-area-paragraph]')];
 const rows=e=>{const out=[],w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);while(w.nextNode()){if(!w.currentNode.textContent.trim())continue;const r=document.createRange();r.selectNodeContents(w.currentNode);for(const b of r.getClientRects())if(b.width&&b.height){let q=out.find(x=>Math.abs(x.y-b.y)<2);if(q){q.left=Math.min(q.left,b.left);q.right=Math.max(q.right,b.right);}else out.push({y:b.y,left:b.left,right:b.right});}}return out;};
 const choose=(e,kind)=>e.querySelectorAll('[data-area-copy]').forEach(n=>n.hidden=n.dataset.areaCopy!==kind);
 let pending=false;const fit=()=>{pending=false;choose(title,'full');if(rows(title).length>2)choose(title,'short');paragraphs.forEach((p,i)=>{const variants=[...p.querySelectorAll('[data-area-copy]')];let valid=false;for(const v of variants){if(i===1&&!paragraphs[0].querySelector('[data-area-copy]:not([hidden])').textContent.includes('residências e pequenos comércios')&&!v.textContent.includes('residências e pequenos comércios'))continue;choose(p,v.dataset.areaCopy);const n=rows(p).length;if(n>= (i===0?3:2)&&n<=3){valid=true;break;}}p.dataset.copyOverflow=String(!valid);});s.dispatchEvent(new Event('volt-area-fit'));};
 const schedule=()=>{if(!pending){pending=true;requestAnimationFrame(fit)}};new ResizeObserver(schedule).observe(s.querySelector('.service-area__grid'));window.addEventListener('resize',schedule,{passive:true});document.fonts.ready.then(schedule);fit();
 if(new URLSearchParams(location.search).get('limites')!=='1')return;
 const overlay=document.querySelector('#volt-analysis-marks'),shared=document.querySelector('#volt-analysis-panel');if(!overlay||!shared)return;
 document.documentElement.dataset.voltAreaAnalysis='true';
 const coverage=s.querySelector('.service-area__coverage'),cards=[...coverage.children],map=s.querySelector('.service-area__map'),mapHead=map.querySelector('.service-area__map-head'),mapEye=map.querySelector('.service-area__map-kicker'),mapTitle=map.querySelector('strong'),frame=map.querySelector('.service-area__map-frame'),opening=s.querySelector('.service-area__grid>div:first-child');
 const panel=document.createElement('details');panel.dataset.analysisSection='area-atendida';panel.open=['#area-atendida','#area-title'].includes(location.hash);panel.innerHTML='<summary>Área atendida · limites definidos</summary><div class="volt-analysis-body"><p class="volt-analysis-status">Seção inteira · aprovada</p><p>Regras aprovadas pelo Founder e aplicadas. Três cidades com dez bairros por cidade. Em Florianópolis, mantida a cobertura continental. Mapa simples do Google, como na AR: Palhoça selecionada como cidade-base e vista regional incluindo São José e Florianópolis. A referência é a cidade, não um endereço comercial nem promessa de atendimento imediato.</p><dl><dt class="volt-analysis-blue">Azul · Eyebrow</dt><dd data-ar="eye"></dd><dt class="volt-analysis-green">Verde · H2</dt><dd data-ar="title"></dd><dt class="volt-analysis-purple">Roxo · apresentação</dt><dd data-ar="intro"></dd><dt class="volt-analysis-green">Verde · cidades no painel amarelo</dt><dd data-ar="cities"></dd><dt class="volt-analysis-blue">Azul · bairros</dt><dd data-ar="places"></dd><dt class="volt-analysis-amber">Amarelo · mapa e cabeçalho</dt><dd data-ar="map"></dd><dt class="volt-analysis-amber">Amarelo · composição e intervalos</dt><dd data-ar="gaps"></dd></dl><p data-ar="fit"></p><p>Sem cortes, fonte reduzida ou abreviação automática de localidades. Na personalização, confirmar cidade-base, regiões e bairros. Não ampliar a área atendida por conta própria. Regras consolidadas no manual de implementação.</p></div>';shared.append(panel);
 const marks=document.createElement('div');marks.className='volt-analysis-group';marks.dataset.section='area-atendida';overlay.append(marks);
 const R=e=>e.getBoundingClientRect(),S=e=>getComputedStyle(e),lines=e=>rows(e).length,px=n=>(Math.round(n*10)/10).toLocaleString('pt-BR')+' px',inside=(a,b)=>{a=R(a);b=R(b);return a.left>=b.left-.3&&a.right<=b.right+.3&&a.top>=b.top-.3&&a.bottom<=b.bottom+.3;};
 const write=(k,t)=>{const e=panel.querySelector('[data-ar="'+k+'"]');if(e.textContent!==t)e.textContent=t};
 const box=(r,cls)=>{if(r.width<=0||r.height<=0||r.bottom<0||r.top>innerHeight)return;const e=document.createElement('div');e.className=cls;Object.assign(e.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'});marks.append(e)};
 const mark=(e,cls)=>box(R(e),'volt-analysis-outline '+cls),gap=(a,b)=>{const x=R(a),y=R(b);if(y.top>=x.bottom)box({left:y.left,top:x.bottom,width:y.width,height:y.top-x.bottom,bottom:y.top},'volt-analysis-gap')};
 let rendering=false;const render=()=>{rendering=false;const mobile=innerWidth<=620,stacked=innerWidth<=1080,issues=[],titles=cards.map(c=>c.querySelector('h3')),labels=cards.map(c=>c.querySelector('small')).filter(Boolean),badges=[...coverage.querySelectorAll('.service-area__coverage-neighborhoods span')],er=R(eye),tr=R(title);
  if(lines(eye)!==1||er.width>280.3||er.width>=Math.max(...rows(title).map(r=>r.right-r.left)))issues.push('Eyebrow');
  if(lines(title)<1||lines(title)>2||tr.width>620.3)issues.push('H2');
  if(paragraphs.length!==2||lines(paragraphs[0])!==3||lines(paragraphs[1])<2||lines(paragraphs[1])>3||paragraphs.some(p=>p.dataset.copyOverflow==='true'||!inside(p,opening)))issues.push('apresentação');
  if(titles.some(e=>lines(e)<1||lines(e)>2||rows(e).some(r=>r.right>R(e).right+.3||r.left<R(e).left-.3))||labels.length)issues.push('cidades');
  if(cards.some(c=>{const list=c.querySelector('.service-area__coverage-neighborhoods');return list.querySelectorAll('span').length<10||lines(list)!==3;})||badges.some(e=>lines(e)!==1||!inside(e,e.parentElement)))issues.push('bairros');
  if(cards.some(c=>[c.querySelector('.service-area__coverage-head'),c.querySelector('.service-area__coverage-neighborhoods')].some(e=>!inside(e,c))))issues.push('limites dos cartões');
  if(lines(mapEye)!==1||lines(mapTitle)>2||!inside(mapEye,mapHead)||!inside(mapTitle,mapHead)||Math.abs(R(frame).height-(mobile?300:340))>.3)issues.push('mapa');
  if(Math.abs(tr.top-er.bottom-12)>.3||Math.abs(R(intro).top-tr.bottom-16)>.3||Math.abs(R(paragraphs[1]).top-R(paragraphs[0]).bottom-12)>.3||Math.abs(R(map).top-Math.max(R(opening).bottom,R(coverage).bottom)-(stacked?32:40))>.3)issues.push('intervalos');
  if(stacked?Math.abs(R(coverage).top-R(opening).bottom-32)>.3:Math.abs(R(coverage).left-R(opening).right-48)>.3||Math.abs((R(coverage).top+R(coverage).bottom-R(opening).top-R(opening).bottom)/2)>.3)issues.push('composição');
  if(s.scrollWidth>s.clientWidth+.3)issues.push('transbordamento');
  write('eye',px(er.width)+' / '+lines(eye)+' linha. Uma linha, teto 280 px com traço de 34 px; menor que a maior linha do H2.');
  write('title',px(tr.width)+' / '+lines(title)+' linha(s), máximo 2. Teto 620 px dentro da coluna; altura natural, sem reserva. Variante '+title.querySelector('[data-area-copy]:not([hidden])').dataset.areaCopy+'.');
  write('intro','Dois parágrafos: '+paragraphs.map(lines).join(' / ')+' linha(s). Primeiro: exatamente 3 linhas; segundo: 2–3, em todas as telas. Teto 760 px dentro da coluna; Inter 16 px / 1,6, alturas naturais, sem reservas ou cortes. Variantes por encaixe: '+paragraphs.map(p=>p.querySelector('[data-area-copy]:not([hidden])').dataset.areaCopy).join(' / ')+'. 12 px entre parágrafos. Preservados base, regiões e público; orientação de contato sem promessa de atendimento imediato.');
  write('cities',titles.map(e=>e.textContent+': '+lines(e)+' linha(s)').join('; ')+'. Até 2 linhas, sem reserva. Palhoça, São José e Florianópolis, sem frases abaixo dos nomes. Fundo amarelo do site, nome preto centralizado horizontal e verticalmente, sem numerador; H3 de '+(mobile?'24':'26')+' px.');
  write('places',badges.length+' bairros, '+cards.map(c=>c.querySelector('.service-area__coverage-neighborhoods').querySelectorAll('span').length).join(' / ')+' por cidade. Mínimo 10 em cada card, distribuídos em exatamente 3 linhas no conjunto de bairros; linhas atuais: '+cards.map(c=>lines(c.querySelector('.service-area__coverage-neighborhoods'))).join(' / ')+'. Cada nome em uma linha, sem cortes ou abreviações. Inter 12 px / 1,35, título e minúsculas; etiquetas com mínimo 20 px, recuos 1 / 3 px e intervalo fixo de 4 px. Três grupos de nomes completos, centralizados em cada linha e juntos, sem distribuição de ponta a ponta. Fundo escuro. Florianópolis mantém bairros continentais.');
  write('map','Eyebrow ÁREAS DE ATENDIMENTO: '+lines(mapEye)+' linha; cidades PALHOÇA • SÃO JOSÉ • FLORIANÓPOLIS: '+lines(mapTitle)+' linha(s), máximo 2. Intervalo interno 6 px. Cabeçalho com recuos '+(mobile?'14 / 18':'17 / 24')+' px e mínimo '+(mobile?'70':'78')+' px. Mapa '+px(R(frame).height)+' de altura, largura inteira; Google Maps simples, sem barra do My Maps; Palhoça como cidade-base, zoom '+(mobile?'10 até 620 px':'11 acima de 620 px')+' e centro regional para incluir São José e Florianópolis na vista inicial. Na personalização, substituir a cidade-base e conferir novamente o enquadramento. Iframe com título acessível e carregamento adiado. O conteúdo do Google é externo e não segue a contagem de linhas do template.');
  write('gaps','Eyebrow → H2: 12 px; H2 → primeiro parágrafo: 16 px; entre parágrafos: 12 px. '+(stacked?'Abertura → cidades: 32 px; cidades → mapa: 32 px. Uma coluna até 1080 px.':'Conjunto dos três cartões centralizado verticalmente com a coluna inteira de texto; 48 px entre colunas e 40 px até o mapa abaixo de ambas.')+' Cartões: intervalo 12 px, contorno contínuo de 1 px, cantos de 12 px, sem faixa lateral. '+(mobile?'Cidade centralizada em faixa amarela, sem número, acima dos bairros; recuos 10 / 12 px na cidade e 12 px nos bairros.':'Cidade centralizada no painel amarelo à esquerda, sem número; bairros no fundo escuro à direita. Recuos internos de 12 px, altura natural compacta e sem intervalo entre as superfícies.')+' Recuos externos globais 67 / 50 / 45 px.');
  write('fit',issues.length?'Conferir nesta tela: '+[...new Set(issues)].join(', ')+'.':'Critérios medidos atendidos nesta tela. Regras aprovadas pelo Founder.');
  marks.replaceChildren();if(overlay.hidden)return;mark(eye,'volt-analysis-outline--heading');mark(title,'volt-analysis-outline--intro');paragraphs.forEach(p=>mark(p,'volt-analysis-outline--other-intro'));titles.forEach(e=>mark(e,'volt-analysis-outline--intro'));labels.forEach(e=>mark(e,'volt-analysis-outline--other-intro'));badges.forEach(e=>mark(e,'volt-analysis-outline--heading'));mark(mapHead,'volt-analysis-outline--dg-amber');mark(frame,'volt-analysis-outline--dg-amber');gap(eye,title);gap(title,intro);gap(paragraphs[0],paragraphs[1]);if(stacked)gap(opening,coverage);gap(R(opening).bottom>R(coverage).bottom?opening:coverage,map);
 };
 const redraw=()=>{if(!rendering){rendering=true;requestAnimationFrame(render)}};const o=new ResizeObserver(redraw);[s,opening,coverage,map,...cards].forEach(e=>o.observe(e));window.addEventListener('scroll',redraw,{passive:true});window.addEventListener('resize',redraw,{passive:true});window.addEventListener('volt-analysis-toggle',redraw);s.addEventListener('volt-area-fit',redraw);document.fonts.ready.then(redraw);redraw();
})();

/* Enquadramento regional do mapa simples; cidade-base preservada. */
(() => {
 const frame=document.querySelector('[data-base-city-map]');if(!frame)return;
 const mobile=matchMedia('(max-width:620px)');
 const fit=()=>{const url=new URL(frame.src),zoom=mobile.matches?'10':'11';if(url.searchParams.get('z')===zoom)return;url.searchParams.set('z',zoom);frame.src=url.href;};
 mobile.addEventListener('change',fit);fit();
})();

/* Dúvidas frequentes — marcações da seção inteira em revisão. */
(() => {
 if(new URLSearchParams(location.search).get('limites')!=='1')return;
 const s=document.querySelector('#faq'),shared=document.querySelector('#volt-analysis-panel'),overlay=document.querySelector('#volt-analysis-marks');if(!s||!shared||!overlay)return;
 document.documentElement.setAttribute('data-volt-faq-analysis','');
 const eye=s.querySelector('.eyebrow'),title=s.querySelector('h2'),intro=s.querySelector('.section-intro'),opening=s.querySelector('.faq__intro'),list=s.querySelector('.faq__list'),items=[...s.querySelectorAll('.faq__column details')],questions=items.map(d=>d.querySelector('.faq__question')),action=s.querySelector('.faq__cta-wrap'),micro=action.querySelector('p'),cta=action.querySelector('button');
 const rows=e=>{const out=[],w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);while(w.nextNode()){const n=w.currentNode;if(!n.textContent.trim())continue;const r=document.createRange();r.selectNodeContents(n);for(const b of r.getClientRects())if(b.width&&b.height){const v=out.find(x=>Math.abs(x.y-b.y)<2);if(v){v.left=Math.min(v.left,b.left);v.right=Math.max(v.right,b.right);}else out.push({y:b.y,left:b.left,right:b.right});}}return out;};
 const R=e=>e.getBoundingClientRect(),lines=e=>rows(e).length,px=n=>(Math.round(n*10)/10).toLocaleString('pt-BR')+' px';
 const within=e=>rows(e).every(r=>r.left>=R(e).left-.4&&r.right<=R(e).right+.4);
 const panel=document.createElement('details');panel.dataset.analysisSection='faq';panel.open=['#faq','#faq-title'].includes(location.hash);
 panel.innerHTML='<summary>Dúvidas frequentes · EM REVISÃO</summary><div class="volt-analysis-body"><p class="volt-analysis-status">Seção inteira · EM REVISÃO</p><p>Dez perguntas e respostas completas preservadas. Regras aplicadas para revisão do Founder; novas definições ainda não consolidadas no manual.</p><dl><dt class="volt-analysis-blue">Azul · Eyebrow</dt><dd data-fq="eye"></dd><dt class="volt-analysis-green">Verde · H2</dt><dd data-fq="title"></dd><dt class="volt-analysis-purple">Roxo · apresentação</dt><dd data-fq="intro"></dd><dt class="volt-analysis-green">Verde · perguntas</dt><dd data-fq="questions"></dd><dt class="volt-analysis-purple">Roxo · respostas abertas</dt><dd data-fq="answers"></dd><dt class="volt-analysis-blue">Azul · Copy do CTA e Microcopy</dt><dd data-fq="action"></dd><dt class="volt-analysis-amber">Amarelo · composição e intervalos</dt><dd data-fq="gaps"></dd></dl><p data-fq="fit"></p><p>Na personalização, confirmar orçamento, serviços, regiões, horários, urgências, materiais, pagamentos, nota fiscal e condições de garantia. Não ampliar promessas. Conteúdo sem cortes, reticências ou redução de fonte para caber. Resposta fechada não tem linhas ocupadas nem reserva.</p></div>';shared.append(panel);
 const marks=document.createElement('div');marks.className='volt-analysis-group';marks.dataset.section='faq';overlay.append(marks);
 const write=(k,t)=>{const e=panel.querySelector('[data-fq="'+k+'"]');if(e.textContent!==t)e.textContent=t;};
 const box=(r,cls)=>{if(r.width<=0||r.height<=0||r.bottom<0||r.top>innerHeight)return;const e=document.createElement('div');e.className=cls;Object.assign(e.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'});marks.append(e);};
 const mark=(e,cls)=>box(R(e),'volt-analysis-outline '+cls),gap=(a,b)=>{const x=R(a),y=R(b);if(y.top>=x.bottom)box({left:y.left,top:x.bottom,width:y.width,height:y.top-x.bottom,bottom:y.top},'volt-analysis-gap');};
 let pending=false;const render=()=>{pending=false;const mobile=innerWidth<=620,stacked=innerWidth<=900,compact=innerWidth<=860,issues=[],open=items.filter(d=>d.open),questionMax=mobile?3:2,answerMax=mobile?12:7,qs=questions.map(lines),er=R(eye),tr=R(title),cr=R(cta),cs=getComputedStyle(cta);
  if(lines(eye)!==1||er.width>280.4||er.width>=Math.max(...rows(title).map(r=>r.right-r.left)))issues.push('Eyebrow');
  if(lines(title)<1||lines(title)>2||tr.width>620.4||!within(title))issues.push('H2');
  if(lines(intro)<1||lines(intro)>(mobile?5:3)||R(intro).width>760.4||!within(intro))issues.push('apresentação');
  if(qs.some(n=>n<1||n>questionMax)||questions.some(e=>!within(e)))issues.push('perguntas');
  if(open.length>1)issues.push('uma resposta por vez');
  if(open.some(d=>lines(d.querySelector('p'))>answerMax||!within(d.querySelector('p'))))issues.push('respostas');
  const crows=rows(cta);if(crows.length!==1||cr.height<53.7||crows.some(r=>r.left<cr.left+parseFloat(cs.paddingLeft)-.4||r.right>cr.right-parseFloat(cs.paddingRight)+.4))issues.push('Copy do CTA');
  if(lines(micro)>3||!within(micro))issues.push('Microcopy');
  const columns=getComputedStyle(list).gridTemplateColumns.split(' ').length;
  if(columns!==(stacked?1:2)||Math.abs(R(list).top-R(intro).bottom-(compact?32:40))>.4||Math.abs(R(cta).top-R(micro).bottom-12)>.4||Math.abs(R(micro).top-R(list).bottom-(compact?32:40))>.4)issues.push('composição e intervalos');
  if(s.scrollWidth>s.clientWidth+.4)issues.push('transbordamento');
  write('eye',px(er.width)+' / '+lines(eye)+' linha. Teto 280 px incluindo traço de 34 px; menor que a maior linha do H2.');
  write('title',px(tr.width)+' / '+lines(title)+' linha(s), máximo 2. Teto 620 px dentro da coluna, altura natural, fonte preservada.');
  write('intro',px(R(intro).width)+' / '+lines(intro)+' linha(s). Teto 760 px; até 3 linhas acima de 620 px e 5 no celular. Inter 16 px / 1,6, copy completa e altura natural, sem reserva.');
  write('questions',items.length+' perguntas; linhas atuais: '+qs.join(' / ')+'. Até '+questionMax+' por pergunta; Inter 16 px / 750 / 1,4, altura natural. Número em uma linha. Resumo com mínimo '+(mobile?'66':'72')+' px, recuos verticais '+(mobile?'14':'16')+' px, número de '+(mobile?'22':'30')+' px e controle de '+(mobile?'30':'34')+' px; intervalos '+(mobile?'10':'12')+' px. Foco visível e abertura por teclado.');
  write('answers',open.length?open.map(d=>'Pergunta '+d.querySelector('.faq__number').textContent+': '+lines(d.querySelector('p'))+' linha(s)').join('; ')+'. Máximo '+answerMax+' nesta tela.':'Todas fechadas: nenhuma linha ocupada de resposta. Abrir uma pergunta para medir. Máximo '+answerMax+' por resposta nesta tela.');
  const answerInfo=' Inter 16 px / 1,6; texto completo e altura natural. Alinhadas ao início da pergunta, com recuo de '+(mobile?'32':'42')+' px; '+(mobile?'sem recuo direito':'46 px à direita')+' e 20 px abaixo. Sem corte ou reserva. Uma resposta aberta por vez, preservando a sequência 01–10.';
  panel.querySelector('[data-fq="answers"]').textContent+=answerInfo;
  write('action','Copy do CTA: '+lines(cta)+' linha / '+px(cr.width)+' × '+px(cr.height)+'. Exatamente uma linha, mínimo 54 px; largura natural de 300–440 px dentro do espaço disponível, inteira até 620 px. Alternativa curta por largura útil real. Microcopy: '+lines(micro)+' linha(s), até 3; teto 440 px, Inter 14 px / 1,5. Ambos centralizados, Microcopy acima do botão, intervalo 12 px. Diálogo demonstrativo preservado.');
  write('gaps','Eyebrow → H2: '+px(tr.top-er.bottom)+'; H2 → apresentação: '+px(R(intro).top-tr.bottom)+'; apresentação → lista: '+px(R(list).top-R(intro).bottom)+'; lista → Microcopy: '+px(R(micro).top-R(list).bottom)+'. Divisória dentro desse último intervalo. '+(stacked?'Uma coluna até 900 px, sequência 01–10; 32 px entre os dois grupos.':'Duas colunas acima de 900 px: 01–05 e 06–10, alinhadas pelo topo e separadas por 48 px.')+' Recuos externos comuns 67 / 50 / 45 px.');
  write('fit',issues.length?'Conferir nesta tela: '+[...new Set(issues)].join(', ')+'.':'Critérios medidos atendidos nesta tela. Regras em revisão pelo Founder.');
  marks.replaceChildren();if(overlay.hidden)return;mark(eye,'volt-analysis-outline--heading');mark(title,'volt-analysis-outline--intro');mark(intro,'volt-analysis-outline--other-intro');questions.forEach(e=>mark(e,'volt-analysis-outline--intro'));open.forEach(d=>mark(d.querySelector('p'),'volt-analysis-outline--other-intro'));mark(micro,'volt-analysis-outline--other-intro');mark(cta,'volt-analysis-outline--heading');gap(eye,title);gap(title,intro);gap(intro,list);gap(list,micro);gap(micro,cta);
 };
 const redraw=()=>{if(!pending){pending=true;requestAnimationFrame(render)}};
 new ResizeObserver(redraw).observe(s);items.forEach(d=>d.addEventListener('toggle',redraw));window.addEventListener('scroll',redraw,{passive:true});window.addEventListener('resize',redraw,{passive:true});window.addEventListener('volt-analysis-toggle',redraw);document.fonts.ready.then(redraw);redraw();
})();
