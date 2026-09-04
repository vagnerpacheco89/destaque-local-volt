(() => {
  const section = document.querySelector('#trabalhos');
  if (!section) return;

  const heading = section.querySelector('.section-heading');
  const title = section.querySelector('#trabalhos-title');
  const eyebrow = heading?.querySelector('.eyebrow');

  if (eyebrow) eyebrow.textContent = 'TRABALHOS';

  if (heading && title) {
    title.innerHTML = '<span>Alguns serviços que fazem</span><span>parte do atendimento</span>';

    const lateralNote = heading.querySelector(':scope > p');
    if (lateralNote) lateralNote.remove();

    let intro = heading.querySelector('.portfolio-intro');
    if (!intro) {
      intro = document.createElement('p');
      intro.className = 'portfolio-intro';
      title.insertAdjacentElement('afterend', intro);
    }
    intro.textContent = 'Do quadro elétrico aos pontos de iluminação, estes são alguns exemplos de serviços que podem fazer parte do atendimento.';
  }

  const grid = section.querySelector('.portfolio-grid');
  if (grid && !section.querySelector('.portfolio-closing')) {
    const closing = document.createElement('div');
    closing.className = 'portfolio-closing';
    closing.innerHTML = `
      <h3>Tem um serviço parecido para fazer?</h3>
      <p>Envie uma foto ou descreva o que precisa para Rafael avaliar o atendimento.</p>
      <button class="btn btn--accent btn--large portfolio-closing__cta" type="button">Solicitar orçamento pelo WhatsApp</button>
    `;
    grid.insertAdjacentElement('afterend', closing);

    const button = closing.querySelector('.portfolio-closing__cta');
    const dialog = document.querySelector('#demo-dialog');
    button?.addEventListener('click', () => {
      if (dialog && typeof dialog.showModal === 'function') dialog.showModal();
    });
  }

  const style = document.createElement('style');
  style.textContent = `
    /* Trabalhos / Portfólio — em polimento */
    #trabalhos {
      background:
        radial-gradient(760px 360px at 12% 4%, rgba(244,196,0,.045), transparent 70%),
        #050606 !important;
    }

    #trabalhos .section-heading--split {
      display:block !important;
      margin-bottom:36px;
      padding-bottom:24px;
      border-bottom:1px solid #292d2d;
    }

    #trabalhos .section-heading h2 {
      max-width:980px;
      margin-bottom:16px;
    }

    #trabalhos .section-heading h2 span {
      display:block;
    }

    #trabalhos .portfolio-intro {
      max-width:760px;
      margin:0;
      color:#9ca19c;
      font-size:.9rem;
      line-height:1.6;
    }

    /* Mosaico fechado: ocupa toda a caixa, inclusive os quatro cantos */
    #trabalhos .portfolio-grid {
      display:grid;
      grid-template-columns:repeat(12, minmax(0, 1fr));
      grid-template-rows:repeat(6, 158px);
      gap:12px;
    }

    #trabalhos .portfolio-card:nth-child(1) { grid-column:1 / 6;  grid-row:1 / 4; }
    #trabalhos .portfolio-card:nth-child(2) { grid-column:6 / 10; grid-row:1 / 3; }
    #trabalhos .portfolio-card:nth-child(3) { grid-column:10 / 13; grid-row:1 / 3; }
    #trabalhos .portfolio-card:nth-child(4) { grid-column:6 / 9;  grid-row:3 / 5; }
    #trabalhos .portfolio-card:nth-child(5) { grid-column:9 / 13; grid-row:3 / 5; }
    #trabalhos .portfolio-card:nth-child(6) { grid-column:1 / 6;  grid-row:4 / 7; }
    #trabalhos .portfolio-card:nth-child(7) { grid-column:6 / 9;  grid-row:5 / 7; }
    #trabalhos .portfolio-card:nth-child(8) { grid-column:9 / 13; grid-row:5 / 7; }

    #trabalhos .portfolio-card {
      position:relative;
      border-color:#303534;
      background:#0a0c0c;
      transition:transform 190ms var(--ease), border-color 190ms ease, box-shadow 190ms ease;
    }

    #trabalhos .portfolio-card::before {
      content:"";
      position:absolute;
      z-index:3;
      left:0;
      top:0;
      width:0;
      height:3px;
      background:var(--accent);
      transition:width 220ms var(--ease);
    }

    #trabalhos .portfolio-card::after {
      background:
        linear-gradient(0deg, rgba(0,0,0,.94) 0%, rgba(0,0,0,.62) 20%, rgba(0,0,0,.16) 52%, transparent 74%) !important;
    }

    #trabalhos .portfolio-card img {
      filter:saturate(.82) contrast(1.06) brightness(.88);
      transition:transform 360ms var(--ease), filter 360ms ease;
    }

    #trabalhos .portfolio-card:hover {
      transform:translateY(-3px);
      border-color:#6f651d;
      box-shadow:0 18px 34px rgba(0,0,0,.24);
    }

    #trabalhos .portfolio-card:hover::before {
      width:100%;
    }

    #trabalhos .portfolio-card:hover img {
      transform:scale(1.045);
      filter:saturate(.98) contrast(1.06) brightness(.96);
    }

    #trabalhos .portfolio-card figcaption {
      padding:16px 17px 15px;
      align-items:flex-end;
    }

    #trabalhos .portfolio-card figcaption strong {
      max-width:72%;
      color:#fff;
      font-size:1.24rem;
      line-height:.95;
      letter-spacing:-.01em;
    }

    #trabalhos .portfolio-card figcaption span {
      flex:0 0 auto;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      padding:8px 11px;
      border:1px solid #d3aa00;
      border-radius:2px;
      background:var(--accent) !important;
      color:var(--accent-ink) !important;
      font-size:9px;
      font-weight:900;
      line-height:1;
      text-align:center;
      text-transform:uppercase;
      letter-spacing:.055em;
      box-shadow:0 4px 12px rgba(0,0,0,.16);
    }

    #trabalhos .portfolio-card:first-child figcaption {
      padding:20px;
    }

    #trabalhos .portfolio-card:first-child figcaption strong {
      font-size:1.65rem;
      max-width:68%;
    }

    #trabalhos .portfolio-closing {
      max-width:760px;
      margin:46px auto 0;
      padding-top:34px;
      border-top:1px solid #292d2d;
      text-align:center;
    }

    #trabalhos .portfolio-closing h3 {
      margin:0 0 10px;
      color:#fff;
      font-size:clamp(1.9rem, 3vw, 2.55rem);
      line-height:1;
    }

    #trabalhos .portfolio-closing p {
      max-width:620px;
      margin:0 auto 22px;
      color:#9ca19c;
      font-size:.9rem;
      line-height:1.6;
    }

    #trabalhos .portfolio-closing__cta {
      min-width:320px;
      text-transform:none;
    }

    @media (max-width: 760px) {
      #trabalhos .section-heading h2 {
        max-width:100%;
      }

      #trabalhos .portfolio-grid {
        display:grid;
        grid-template-columns:1fr 1fr;
        grid-template-rows:none;
        grid-auto-rows:190px;
      }

      #trabalhos .portfolio-card,
      #trabalhos .portfolio-card:nth-child(n) {
        grid-column:auto;
        grid-row:auto;
      }

      #trabalhos .portfolio-card:first-child {
        grid-column:1 / -1;
        grid-row:span 2;
      }
    }

    @media (max-width: 560px) {
      #trabalhos .portfolio-grid {
        grid-template-columns:1fr;
        grid-template-rows:none;
        grid-auto-rows:220px;
      }

      #trabalhos .portfolio-card:first-child {
        grid-column:auto;
        grid-row:span 2;
      }

      #trabalhos .portfolio-card figcaption strong,
      #trabalhos .portfolio-card:first-child figcaption strong {
        max-width:68%;
        font-size:1.15rem;
      }

      #trabalhos .portfolio-closing {
        margin-top:34px;
        padding-top:28px;
      }

      #trabalhos .portfolio-closing__cta {
        width:100%;
        min-width:0;
      }
    }
  `;
  document.head.appendChild(style);
})();