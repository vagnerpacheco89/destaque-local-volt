(() => {
  const section = document.querySelector('.reviews');
  if (!section) return;

  const head = section.querySelector('.reviews-head');
  const eyebrow = head?.querySelector('.eyebrow');
  const title = section.querySelector('#reviews-title');
  const rating = section.querySelector('.rating-demo');
  const warning = section.querySelector('.demo-warning');
  const grid = section.querySelector('.reviews-grid');

  if (eyebrow) eyebrow.textContent = 'AVALIAÇÕES • DEMONSTRAÇÃO';
  if (title) title.textContent = 'Clareza, organização e serviço bem explicado';

  if (rating) {
    const small = rating.querySelector('small');
    if (small) small.textContent = '38 AVALIAÇÕES • FICTÍCIO';
  }

  if (warning) {
    warning.textContent = 'Depoimentos, nomes, nota e quantidade são fictícios e aparecem apenas para demonstrar como avaliações reais seriam apresentadas no modelo VOLT.';
  }

  if (grid) {
    [...grid.querySelectorAll('blockquote')].forEach((quote) => {
      const source = quote.querySelector('footer span');
      if (source) source.textContent = 'DEMO';
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
      margin-bottom:18px;
      padding-bottom:28px;
      border-bottom:1px solid #292d2d;
    }

    .reviews .reviews-head > div:first-child {
      max-width:900px;
    }

    .reviews .reviews-head h2 {
      max-width:900px;
      margin-bottom:0;
    }

    .reviews .rating-demo {
      min-width:176px;
      padding:0 0 2px 24px !important;
      border:0 !important;
      border-left:1px solid #343839 !important;
      border-radius:0 !important;
      background:transparent !important;
      text-align:left !important;
    }

    .reviews .rating-demo::before {
      content:'★★★★★';
      display:block;
      margin-bottom:9px;
      color:var(--accent);
      font-size:10px;
      line-height:1;
      letter-spacing:.16em;
    }

    .reviews .rating-demo strong {
      color:#fff;
      font-size:4rem;
      line-height:.78;
    }

    .reviews .rating-demo span {
      margin-left:3px;
      color:var(--accent);
      font-size:.86rem;
    }

    .reviews .rating-demo small {
      display:block;
      margin-top:10px;
      color:#737873;
      font-size:8px;
      font-weight:700;
      letter-spacing:.095em;
    }

    .reviews .demo-warning {
      position:relative;
      max-width:820px;
      margin:0 0 30px;
      padding:0 0 0 17px;
      border:0;
      color:#747974;
      font-size:.71rem;
      line-height:1.55;
    }

    .reviews .demo-warning::before {
      content:'';
      position:absolute;
      left:0;
      top:.48em;
      width:6px;
      height:6px;
      background:var(--accent);
      transform:rotate(45deg);
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

    .reviews .reviews-grid footer span {
      display:inline-flex;
      align-items:center;
      margin-left:8px;
      padding:4px 6px;
      border:1px solid #353938;
      color:#777c77;
      font-size:7px;
      font-weight:800;
      line-height:1;
      letter-spacing:.08em;
      vertical-align:middle;
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
        padding:18px 0 0 !important;
        border-left:0 !important;
        border-top:1px solid #292d2d !important;
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