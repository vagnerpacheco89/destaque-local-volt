(() => {
  const section = document.querySelector('.process');
  if (!section) return;

  const heading = section.querySelector('.section-heading');
  const title = section.querySelector('#process-title');
  const sideText = heading?.querySelector(':scope > p');
  const grid = section.querySelector('.process-grid');
  const differentials = section.querySelector('.differentials');
  const credential = section.querySelector('.credential-demo');

  if (heading && title) {
    let intro = heading.querySelector('.process-intro');
    if (!intro) {
      intro = document.createElement('p');
      intro.className = 'process-intro';
      title.insertAdjacentElement('afterend', intro);
    }
    intro.textContent = 'Do primeiro contato à finalização, cada etapa é combinada antes de avançar para que você saiba o que será feito e quando o serviço será executado.';
    if (sideText && !sideText.classList.contains('process-intro')) sideText.remove();
  }

  if (grid) {
    const steps = [
      ['Conte o que precisa', 'Descreva pelo WhatsApp o serviço ou problema. Fotos e vídeos ajudam na avaliação inicial quando possível.'],
      ['Avaliação', 'Se não der para entender o caso à distância, Rafael combina uma avaliação presencial antes de definir a solução.'],
      ['Orçamento', 'O valor e o que será executado são apresentados antes do início do serviço, incluindo a combinação sobre materiais.'],
      ['Execução e teste', 'Com o orçamento aprovado, o serviço é executado, testado e explicado antes da finalização.']
    ];

    [...grid.children].forEach((item, index) => {
      const step = steps[index];
      if (!step) return;
      const titleEl = item.querySelector('h3');
      const textEl = item.querySelector('p');
      if (titleEl) titleEl.textContent = step[0];
      if (textEl) textEl.textContent = step[1];
    });
  }

  if (credential) credential.remove();

  if (differentials) {
    const eyebrow = differentials.querySelector('.eyebrow');
    const headingEl = differentials.querySelector('h3');
    if (eyebrow) eyebrow.textContent = 'POR QUE CONFIAR';
    if (headingEl) headingEl.textContent = 'Processo claro e atendimento direto';
  }

  const style = document.createElement('style');
  style.textContent = `
    .process {
      background:radial-gradient(680px 340px at 88% 8%, rgba(244,196,0,.045), transparent 72%), #090b0b !important;
    }
    .process .section-heading--split {
      display:block !important;
      max-width:900px;
      margin-bottom:34px;
      padding-bottom:24px;
      border-bottom:1px solid #292d2d;
    }
    .process .section-heading h2 { max-width:780px; margin-bottom:14px; }
    .process .process-intro {
      max-width:760px;
      margin:0;
      color:#a5aaa5;
      font-size:.92rem;
      line-height:1.65;
    }
    .process .process-grid {
      display:grid;
      grid-template-columns:repeat(4,minmax(0,1fr));
      gap:12px;
      margin:0 0 34px;
      padding:0;
      border-top:0 !important;
    }
    .process .process-grid li {
      position:relative;
      min-height:218px;
      margin:0 !important;
      padding:22px 20px 20px !important;
      border:1px solid #303534;
      background:#0b0d0d;
      transition:border-color 180ms ease, transform 180ms var(--ease), background 180ms ease;
    }
    .process .process-grid li::before,
    .process .process-grid li::after { display:none !important; }
    .process .process-grid li > span {
      width:38px;
      height:30px;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      background:var(--accent);
      color:var(--accent-ink);
      font-size:10px;
      font-weight:900;
      letter-spacing:.08em;
      line-height:1;
    }
    .process .process-grid h3 {
      margin:18px 0 10px;
      color:#fff;
      font-size:1.62rem;
      line-height:.98;
    }
    .process .process-grid p {
      margin:0;
      color:#a9ada9;
      font-size:.82rem;
      line-height:1.55;
    }
    .process .process-grid li:hover {
      transform:translateY(-3px);
      border-color:#756919;
      background:#0e1010;
    }
    .process .differentials {
      display:grid !important;
      grid-template-columns:minmax(260px,.72fr) minmax(0,1.7fr) !important;
      gap:0 !important;
      overflow:hidden;
      border:1px solid #343938;
      background:#0b0d0d;
    }
    .process .differentials > div:first-child {
      padding:28px !important;
      background:var(--accent);
      color:var(--accent-ink);
    }
    .process .differentials > div:first-child .eyebrow {
      margin-bottom:12px;
      color:var(--accent-ink);
    }
    .process .differentials > div:first-child .eyebrow::after {
      background:var(--accent-ink);
      opacity:.55;
    }
    .process .differentials > div:first-child h3 {
      color:var(--accent-ink);
      font-size:2rem;
      line-height:.95;
    }
    .process .differentials ul {
      display:grid;
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:14px 28px;
      padding:28px !important;
      border-left:1px solid #343938;
      background:#0b0d0d;
    }
    .process .differentials li {
      padding-left:19px;
      color:#d0d3cd;
      font-size:.82rem;
      line-height:1.45;
    }
    .process .differentials li::before {
      color:var(--accent);
      font-weight:900;
    }
    .process .credential-demo { display:none !important; }
    @media (max-width:900px) {
      .process .process-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
      .process .differentials { grid-template-columns:1fr !important; }
      .process .differentials ul { border-left:0; border-top:1px solid #343938; }
    }
    @media (max-width:560px) {
      .process .process-grid { grid-template-columns:1fr; }
      .process .process-grid li { min-height:0; }
      .process .differentials ul { grid-template-columns:1fr; }
    }
  `;
  document.head.appendChild(style);
})();