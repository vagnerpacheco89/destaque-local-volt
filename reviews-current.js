(() => {
  const section = document.querySelector('.reviews');
  if (!section) return;

  const head = section.querySelector('.reviews-head');
  const eyebrow = head?.querySelector('.eyebrow');
  const title = section.querySelector('#reviews-title');
  const rating = section.querySelector('.rating-demo');
  const warning = section.querySelector('.demo-warning');
  const grid = section.querySelector('.reviews-grid');

  if (eyebrow) eyebrow.textContent = 'DEPOIMENTOS DE CLIENTES';
  if (title) title.textContent = 'O que clientes dizem sobre o atendimento';

  if (head && title) {
    let intro = head.querySelector('.reviews-intro');
    if (!intro) {
      intro = document.createElement('p');
      intro.className = 'reviews-intro';
      title.insertAdjacentElement('afterend', intro);
    }
    intro.textContent = 'Relatos sobre clareza, organização, cuidado e comunicação ao longo do serviço.';
  }

  if (rating) {
    const small = rating.querySelector('small');
    if (small) small.textContent = '38 AVALIAÇÕES';
  }

  if (warning) warning.remove();

  if (grid) {
    [...grid.querySelectorAll('blockquote')].forEach((quote) => {
      const source = quote.querySelector('footer span');
      if (source) source.remove();
    });
  }

  const style = document.createElement('style');
  style.textContent = `
    .reviews {
      background:
        radial-gradient(700px 320px at 9% 4%, rgba(244,196,0,.035), transparent 72%),
        #050606 !important;
      border-top:1px solid #181b1b;
    }

    .reviews .reviews-head {
      display:grid !important;
      grid-template-columns:minmax(0,1fr) auto !important;
      gap:56px !important;
      align-items:end;
      margin-bottom:30px;
      padding-bottom:30px;
      border-bottom:1px solid #292d2d;
    }

    .reviews .reviews-head > div:first-child {
      max-width:960px;
    }

    .reviews .reviews-head h2 {
      max-width:920px;
      margin-bottom:14px;
    }

    .reviews .reviews-intro {
      max-width:720px;
      margin:0;
      color:#9ca19c;
      font-size:.9rem;
      line-height:1.6;
    }

    .reviews .rating-demo {
      min-width:190px;
      padding:22px 24px 20px !important;
      border:1px solid #e5b900 !important;
      border-radius:2px !important;
      background:var(--accent) !important;
      color:var(--accent-ink) !important;
      text-align:left !important;
      box-shadow:
        0 0 0 1px rgba(244,196,0,.2),
        0 0 28px rgba(244,196,0,.22),
        0 14px 34px rgba(0,0,0,.24) !important;
    }

    .reviews .rating-demo::before {
      content:'★★★★★';
      display:block;
      margin-bottom:11px;
      color:var(--accent-ink);
      font-size:11px;
      line-height:1;
      letter-spacing:.15em;
    }

    .reviews .rating-demo strong {
      color:var(--accent-ink) !important;
      font-size:4.25rem;
      line-height:.78;
    }

    .reviews .rating-demo span {
      margin-left:3px;
      color:var(--accent-ink) !important;
      font-size:.88rem;
      font-weight:900;
    }

    .reviews .rating-demo small {
      display:block;
      margin-top:11px;
      color:rgba(9,10,8,.72) !important;
      font-size:8px;
      font-weight:900;
      letter-spacing:.1em;
    }

    .reviews .demo-warning {
      display:none !important;
    }

    /* Composição editorial: um depoimento principal + lista aberta */
    .reviews .reviews-grid {
      display:grid !important;
      grid-template-columns:minmax(0,.82fr) minmax(0,1.18fr) !important;
      grid-template-rows:repeat(5,auto);
      border:0 !important;
      border-top:1px solid #343839 !important;
      border-bottom:1px solid #343839 !important;
      background:transparent;
    }

    .reviews .reviews-grid blockquote {
      min-height:0 !important;
      margin:0 !important;
      border:0 !important;
      border-radius:0 !important;
      background:transparent !important;
      box-shadow:none !important;
      transition:background 180ms ease;
    }

    .reviews .reviews-grid blockquote:first-child {
      grid-column:1;
      grid-row:1 / span 5;
      display:flex;
      flex-direction:column;
      justify-content:flex-start;
      padding:38px 38px 34px 0 !important;
      border-right:1px solid #343839 !important;
    }

    .reviews .reviews-grid blockquote:first-child::before {
      content:'“';
      display:block;
      margin-bottom:20px;
      color:var(--accent);
      font:800 5.4rem/.58 var(--font-display);
    }

    .reviews .reviews-grid blockquote:first-child p {
      max-width:470px;
      margin:0;
      color:#f1f2ed;
      font-size:1.28rem;
      line-height:1.48;
      letter-spacing:-.01em;
    }

    .reviews .reviews-grid blockquote:first-child footer {
      margin-top:auto;
      padding-top:34px;
      color:#fff;
      font-size:.78rem;
      font-weight:800;
    }

    .reviews .reviews-grid blockquote:nth-child(n+2) {
      grid-column:2;
      display:grid;
      grid-template-columns:minmax(0,1fr) auto;
      column-gap:28px;
      align-items:end;
      padding:20px 0 20px 30px !important;
      border-bottom:1px solid #292d2d !important;
    }

    .reviews .reviews-grid blockquote:last-child {
      border-bottom:0 !important;
    }

    .reviews .reviews-grid blockquote:nth-child(n+2)::before {
      content:'“';
      grid-column:1 / -1;
      display:block;
      height:auto;
      width:auto;
      margin-bottom:6px;
      background:none;
      color:var(--accent);
      font:800 1.7rem/.7 var(--font-display);
    }

    .reviews .reviews-grid blockquote:nth-child(n+2) p {
      max-width:610px;
      margin:0;
      color:#d8dad5;
      font-size:.86rem;
      line-height:1.52;
    }

    .reviews .reviews-grid footer {
      color:#fff;
      font-size:.74rem;
      font-weight:800;
      white-space:nowrap;
    }

    .reviews .reviews-grid blockquote:hover {
      background:rgba(255,255,255,.018) !important;
    }

    @media (max-width:900px) {
      .reviews .reviews-head {
        gap:34px !important;
      }

      .reviews .reviews-grid {
        grid-template-columns:1fr !important;
        grid-template-rows:auto !important;
      }

      .reviews .reviews-grid blockquote:first-child,
      .reviews .reviews-grid blockquote:nth-child(n+2) {
        grid-column:1;
        grid-row:auto;
      }

      .reviews .reviews-grid blockquote:first-child {
        min-height:300px !important;
        padding:32px 0 !important;
        border-right:0 !important;
        border-bottom:1px solid #343839 !important;
      }

      .reviews .reviews-grid blockquote:first-child p {
        max-width:650px;
      }

      .reviews .reviews-grid blockquote:nth-child(n+2) {
        padding-left:0 !important;
      }
    }

    @media (max-width:620px) {
      .reviews .reviews-head {
        grid-template-columns:1fr !important;
        gap:24px !important;
      }

      .reviews .rating-demo {
        width:100%;
        min-width:0;
      }

      .reviews .rating-demo strong {
        font-size:3.5rem;
      }

      .reviews .reviews-grid blockquote:first-child {
        min-height:0 !important;
      }

      .reviews .reviews-grid blockquote:first-child p {
        font-size:1.08rem;
      }

      .reviews .reviews-grid blockquote:nth-child(n+2) {
        display:block;
        padding:20px 0 !important;
      }

      .reviews .reviews-grid blockquote:nth-child(n+2) footer {
        margin-top:13px;
      }
    }
  `;

  document.head.appendChild(style);
})();