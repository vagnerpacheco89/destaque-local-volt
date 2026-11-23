const voltHeadingCopies = {"reviews-title": {"attribute": "data-review-copy", "variants": {"full": "O QUE DIZEM SOBRE BRUNO EXEMPLO", "short": "O QUE DIZEM SOBRE BRUNO"}}, "google-review-title": {"attribute": "data-google-copy", "variants": {"full": "JÁ FOI ATENDIDO POR BRUNO EXEMPLO?", "short": "JÁ FOI ATENDIDO?"}}, "sobre-title": {"attribute": "data-about-copy", "variants": {"full": "BRUNO EXEMPLO, ELETRICISTA EM SÃO JOSÉ", "short": "BRUNO EXEMPLO, ELETRICISTA"}}, "area-title": {"attribute": "data-area-copy", "variants": {"full": "ATENDIMENTO EM SÃO JOSÉ E REGIÃO", "short": "SÃO JOSÉ E REGIÃO"}}, "cta-title": {"attribute": "data-final-copy", "variants": {"full": "FALE DIRETAMENTE COM BRUNO EXEMPLO", "compact": "FALE COM BRUNO EXEMPLO", "short": "FALE COM BRUNO"}}};
function voltSelectHeading(element, variant) {
 const config=voltHeadingCopies[element.id];
 if(!element.matches('h1,h2,h3,h4,h5,h6')||!config)return false;
 const text=config.variants[variant];if(text===undefined)throw new Error('Variante de heading inexistente: '+element.id);
 const active=element.firstElementChild;
 if(active.textContent!==text)active.textContent=text;
 active.setAttribute(config.attribute,variant);active.hidden=false;
 element.dataset.headingVariant=variant;
 return true;
}
(() => {
 const section=document.querySelector('#avaliacoes');if(!section)return;
 const title=section.querySelector('h2'),eye=section.querySelector('.eyebrow');
 const visibleRows=e=>{
  const rows=[],w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);
  while(w.nextNode()){const n=w.currentNode;if(!n.textContent.trim())continue;const r=document.createRange();r.selectNodeContents(n);for(const b of r.getClientRects())if(b.width&&b.height){const row=rows.find(x=>Math.abs(x.y-b.y)<2);if(row){row.left=Math.min(row.left,b.left);row.right=Math.max(row.right,b.right);}else rows.push({y:b.y,left:b.left,right:b.right});}}return rows;
 };
 const fit=()=>{
  voltSelectHeading(title,'full');
  if(visibleRows(title).length>2)voltSelectHeading(title,'short');
  const ef=eye.querySelector('[data-review-copy="full"]'),es=eye.querySelector('[data-review-copy="short"]');
  ef.hidden=false;es.hidden=true;
  const max=Math.max(0,...visibleRows(title).map(r=>r.right-r.left));
  if(eye.scrollWidth>Math.min(280,eye.parentElement.clientWidth)+.1||eye.getBoundingClientRect().width>=max){ef.hidden=true;es.hidden=false;}
  section.dataset.reviewTitleVariant=title.dataset.headingVariant;
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
(() => {
  document.querySelectorAll('.nav-cta, .mobile-menu__cta, .services-other__cta, .diagnostic__cta, .portfolio-closing__cta, .about__action .btn, .faq__cta, .final-cta__action .btn, .footer-contact__cta').forEach(cta => {
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
    const arrow = cta.matches('.footer-contact__cta') ? cta.querySelector('[aria-hidden="true"]') : null;
    const decoration = arrow ? arrow.getBoundingClientRect().width + (parseFloat(s.columnGap)||0) : 0;
    const fullFits = measure(full.textContent) + insets + decoration <= cta.getBoundingClientRect().width + 0.01;
    cta.dataset.copyFit = fullFits ? 'full' : 'short';
    const selected = fullFits ? full : short;
    cta.dataset.copyOverflow = String(measure(selected.textContent) + insets + decoration > cta.getBoundingClientRect().width + 0.01);
  };
  new ResizeObserver(fit).observe(cta.parentElement);
  window.addEventListener('resize', fit, {passive:true});
  window.addEventListener('load', fit, {once:true});
  document.fonts.ready.then(fit);
  fit();
  });
})();
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
    }, {capture:true});
  }

  if (menuButton && mobileMenu) {
    const closeMenu = (restoreFocus=false) => {
      if (mobileMenu.hidden) return;
      mobileMenu.hidden=true;
      menuButton.setAttribute('aria-expanded','false');
      menuButton.setAttribute('aria-label','Abrir menu');
      if(restoreFocus) menuButton.focus({preventScroll:true});
    };
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!mobileMenu.hidden){event.preventDefault();closeMenu(true);}});
    document.addEventListener('click',event=>{if(!header.contains(event.target))closeMenu();});
    mobileMenu.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',()=>{const target=document.querySelector(link.hash);if(target){const heading=target.querySelector('h2')||target;heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}}));
    const desktop=matchMedia('(min-width:861px)');
    desktop.addEventListener('change',event=>{if(event.matches)closeMenu(mobileMenu.contains(document.activeElement));});
    mobileMenu.querySelector('.mobile-menu__cta')?.addEventListener('click',()=>closeMenu());
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
(() => {
  'use strict';
  })();
(() => {
 'use strict';
 const params=new URLSearchParams(location.search);
 })();
(() => {
 'use strict';
 })();
(() => {
 'use strict';
 })();
(() => {
 })();
(() => {
 })();
(() => {
 const s=document.querySelector('#sobre');if(!s)return;
 const title=s.querySelector('h2'),eye=s.querySelector('.eyebrow');
 const rows=e=>{const out=[],w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);while(w.nextNode()){if(!w.currentNode.textContent.trim())continue;const r=document.createRange();r.selectNodeContents(w.currentNode);for(const b of r.getClientRects())if(b.width&&b.height){let q=out.find(x=>Math.abs(x.y-b.y)<2);if(q){q.left=Math.min(q.left,b.left);q.right=Math.max(q.right,b.right);}else out.push({y:b.y,left:b.left,right:b.right});}}return out;};
 const choose=(e,kind)=>{if(voltSelectHeading(e,kind))return;e.querySelectorAll('[data-about-copy]').forEach(n=>n.hidden=n.dataset.aboutCopy!==kind);};
 let pending=false;const fit=()=>{pending=false;choose(title,'full');if(rows(title).length>2)choose(title,'short');choose(eye,'full');const largest=Math.max(0,...rows(title).map(r=>r.right-r.left));if(eye.getBoundingClientRect().width>280||eye.getBoundingClientRect().width>=largest)choose(eye,'short');const maxLines=innerWidth<=620?5:3;s.querySelectorAll('.about__copy>p:not(.eyebrow)').forEach(p=>{const variants=[...p.querySelectorAll('[data-about-paragraph]')];let chosen=variants.at(-1);for(const candidate of variants){variants.forEach(e=>e.hidden=e!==candidate);chosen=candidate;if(rows(p).length>=2&&rows(p).length<=maxLines)break;}p.dataset.paragraphVariant=chosen.dataset.aboutParagraph;p.dataset.paragraphOverflow=String(rows(p).length<2||rows(p).length>maxLines);});s.dataset.aboutTitleVariant=title.querySelector('[data-about-copy]:not([hidden])').dataset.aboutCopy;s.dataset.aboutEyebrowVariant=eye.querySelector('[data-about-copy]:not([hidden])').dataset.aboutCopy;s.dispatchEvent(new Event('volt-about-fit'));};
 const schedule=()=>{if(!pending){pending=true;requestAnimationFrame(fit)}};new ResizeObserver(schedule).observe(s.querySelector('.about__copy'));window.addEventListener('resize',schedule,{passive:true});document.fonts.ready.then(schedule);window.addEventListener('load',schedule,{once:true});fit();
})();
(() => {
 })();
(() => {
 const section=document.querySelector('#avaliar-no-google');if(!section)return;
 const panel=section.querySelector('.google-review__inner'),title=panel.querySelector('#google-review-title'),eye=panel.querySelector('.eyebrow');
 const rows=e=>{const out=[],w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);while(w.nextNode()){if(!w.currentNode.textContent.trim())continue;const r=document.createRange();r.selectNodeContents(w.currentNode);for(const b of r.getClientRects())if(b.width&&b.height){const q=out.find(x=>Math.abs(x.y-b.y)<2);if(q){q.left=Math.min(q.left,b.left);q.right=Math.max(q.right,b.right);}else out.push({y:b.y,left:b.left,right:b.right});}}return out;};
 const choose=(e,kind)=>{if(voltSelectHeading(e,kind))return;e.querySelectorAll('[data-google-copy]').forEach(n=>n.hidden=n.dataset.googleCopy!==kind);};
 let queued=false;const fit=()=>{queued=false;choose(title,'full');if(rows(title).length>2)choose(title,'short');choose(eye,'full');if(eye.getBoundingClientRect().width>280||eye.getBoundingClientRect().width>=Math.max(...rows(title).map(r=>r.right-r.left)))choose(eye,'short');section.dataset.googleTitleVariant=title.querySelector('[data-google-copy]:not([hidden])').dataset.googleCopy;section.dataset.googleEyebrowVariant=eye.querySelector('[data-google-copy]:not([hidden])').dataset.googleCopy;section.dispatchEvent(new Event('volt-google-fit'));};
 const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(fit)}};new ResizeObserver(schedule).observe(panel);window.addEventListener('resize',schedule,{passive:true});window.addEventListener('load',schedule,{once:true});document.fonts.ready.then(schedule);fit();
})();
(() => {
 })();
(() => {
 const s=document.querySelector('#area-atendida');if(!s)return;
 const eye=s.querySelector('.eyebrow'),title=s.querySelector('h2'),intro=s.querySelector('.section-intro'),paragraphs=[...s.querySelectorAll('[data-area-paragraph]')];
 const rows=e=>{const out=[],w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);while(w.nextNode()){if(!w.currentNode.textContent.trim())continue;const r=document.createRange();r.selectNodeContents(w.currentNode);for(const b of r.getClientRects())if(b.width&&b.height){let q=out.find(x=>Math.abs(x.y-b.y)<2);if(q){q.left=Math.min(q.left,b.left);q.right=Math.max(q.right,b.right);}else out.push({y:b.y,left:b.left,right:b.right});}}return out;};
 const choose=(e,kind)=>{if(voltSelectHeading(e,kind))return;e.querySelectorAll('[data-area-copy]').forEach(n=>n.hidden=n.dataset.areaCopy!==kind);};
 let pending=false;const fit=()=>{pending=false;choose(title,'full');if(rows(title).length>2)choose(title,'short');paragraphs.forEach((p,i)=>{const variants=[...p.querySelectorAll('[data-area-copy]')];let valid=false;for(const v of variants){if(i===1&&!paragraphs[0].querySelector('[data-area-copy]:not([hidden])').textContent.includes("residências e pequenos comércios")&&!v.textContent.includes("residências e pequenos comércios"))continue;choose(p,v.dataset.areaCopy);const n=rows(p).length;if(n>= (i===0?3:2)&&n<=3){valid=true;break;}}p.dataset.copyOverflow=String(!valid);});s.dispatchEvent(new Event('volt-area-fit'));};
 const schedule=()=>{if(!pending){pending=true;requestAnimationFrame(fit)}};new ResizeObserver(schedule).observe(s.querySelector('.service-area__grid'));window.addEventListener('resize',schedule,{passive:true});document.fonts.ready.then(schedule);fit();
 })();
(() => {
 const frame=document.querySelector('[data-base-city-map]');if(!frame)return;
 const mobile=matchMedia('(max-width:620px)');
 const fit=()=>{const url=new URL(frame.src),zoom=mobile.matches?'10':'11';if(url.searchParams.get('z')===zoom)return;url.searchParams.set('z',zoom);frame.src=url.href;};
 mobile.addEventListener('change',fit);fit();
})();
(() => {
 })();
(() => {
 const s=document.querySelector('#contato');if(!s)return;
 const inner=s.querySelector('.final-cta__inner'),copy=inner.firstElementChild,eye=s.querySelector('.eyebrow'),title=s.querySelector('h2'),intro=s.querySelector('.final-cta__intro'),action=s.querySelector('.final-cta__action'),label=s.querySelector('.final-cta__action-label'),cta=action.querySelector('button'),micro=action.querySelector('small');
 const rows=e=>{const out=[],w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);while(w.nextNode()){const n=w.currentNode;if(!n.textContent.trim())continue;const r=document.createRange();r.selectNodeContents(n);for(const b of r.getClientRects())if(b.width&&b.height){const v=out.find(x=>Math.abs(x.y-b.y)<2);if(v){v.left=Math.min(v.left,b.left);v.right=Math.max(v.right,b.right);}else out.push({y:b.y,left:b.left,right:b.right});}}return out;};
 const R=e=>e.getBoundingClientRect(),lines=e=>rows(e).length,px=n=>(Math.round(n*10)/10).toLocaleString('pt-BR')+' px';
 const choose=(e,v)=>{if(voltSelectHeading(e,v))return;e.querySelectorAll('[data-final-copy]').forEach(n=>n.hidden=n.dataset.finalCopy!==v);};
 const variant=e=>e.querySelector('[data-final-copy]:not([hidden])').dataset.finalCopy;
 let fitting=false;const fit=()=>{fitting=false;for(const v of ['full','compact','short']){choose(title,v);if(lines(title)<=2)break;}choose(eye,'full');const max=Math.max(...rows(title).map(r=>r.right-r.left));if(R(eye).width>=max||eye.scrollWidth>eye.clientWidth+.4)choose(eye,'short');choose(intro,'full');if(lines(intro)>(innerWidth<=620?5:3))choose(intro,'short');s.dispatchEvent(new Event('volt-final-fit'));};
 const scheduleFit=()=>{if(!fitting){fitting=true;requestAnimationFrame(fit)}};new ResizeObserver(scheduleFit).observe(copy);document.fonts.ready.then(scheduleFit);window.addEventListener('resize',scheduleFit,{passive:true});window.addEventListener('load',scheduleFit,{once:true});fit();
 })();
(() => {
 const s=document.querySelector('#rodape');if(!s)return;
 const grid=s.querySelector('.footer-grid'),brand=s.querySelector('.footer-brand'),logo=brand.querySelector('.wordmark'),name=logo.querySelector('.wordmark__main'),occupation=logo.querySelector('.wordmark__sub'),brandText=s.querySelector('.footer-brand__text'),socials=s.querySelector('.footer-socials'),socialLabel=socials.querySelector('.footer-socials__label'),socialIcons=socials.querySelector('.footer-socials__icons'),socialButtons=[...socialIcons.querySelectorAll('button')],labels=[...s.querySelectorAll('.footer-block__label')],eye=s.querySelector('[data-footer-eyebrow]'),contact=s.querySelector('.footer-contact'),title=contact.querySelector('.footer-contact__heading'),intro=contact.querySelector('p:not(.footer-block__label):not(.footer-contact__heading)'),cta=contact.querySelector('button'),regions=[...s.querySelectorAll('.footer-block>p:not(.footer-block__label)')],days=[...s.querySelectorAll('.footer-hours>span')],hours=[...s.querySelectorAll('.footer-hours>strong')],nav=[...s.querySelectorAll('.footer-nav a')],bottom=s.querySelector('.footer-bottom'),credits=[...s.querySelectorAll('.footer-bottom__copyright,.footer-bottom__description,.footer-bottom__developer-label')],developer=s.querySelector('.footer-bottom__developer-link'),back=s.querySelector('.footer-bottom__back-top');
 const R=e=>e.getBoundingClientRect(),rows=e=>{const out=[],w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);while(w.nextNode()){const n=w.currentNode;if(!n.textContent.trim())continue;const r=document.createRange();r.selectNodeContents(n);for(const b of r.getClientRects())if(b.width&&b.height){const v=out.find(x=>Math.abs(x.y-b.y)<2);if(v){v.left=Math.min(v.left,b.left);v.right=Math.max(v.right,b.right);}else out.push({y:b.y,left:b.left,right:b.right});}}return out;},lines=e=>rows(e).length,px=n=>(Math.round(n*10)/10).toLocaleString('pt-BR')+' px';
 const within=e=>rows(e).every(r=>r.left>=R(e).left-.4&&r.right<=R(e).right+.4),inside=(e,p)=>{const a=R(e),b=R(p);return a.left>=b.left-.4&&a.right<=b.right+.4&&a.top>=b.top-.4&&a.bottom<=b.bottom+.4;};
 const choose=v=>title.querySelectorAll('[data-footer-copy]').forEach(e=>e.hidden=e.dataset.footerCopy!==v);
 let fitting=false;const fit=()=>{fitting=false;choose('full');if(lines(title)>2)choose('short');s.dispatchEvent(new Event('volt-footer-fit'));};const scheduleFit=()=>{if(!fitting){fitting=true;requestAnimationFrame(fit)}};new ResizeObserver(scheduleFit).observe(contact);window.addEventListener('resize',scheduleFit,{passive:true});document.fonts.ready.then(scheduleFit);window.addEventListener('load',scheduleFit,{once:true});fit();
 })();
(() => {
 const s=document.querySelector('#topo'),wrap=s?.querySelector('.nav-wrap');if(!wrap)return;
 })();
(() => {
 })();
