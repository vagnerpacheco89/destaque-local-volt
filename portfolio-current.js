(() => {
  const section = document.querySelector('#trabalhos');
  if (!section) return;

  const heading = section.querySelector('.section-heading');
  const title = section.querySelector('#trabalhos-title');

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

    #trabalhos .portfolio-grid {
      grid-auto-rows:158px;
      gap:12px;
    }

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
      padding:5px 7px;
      border:1px solid rgba(244,196,0,.32);
      background:rgba(5,6,6,.7);
      color:#c5c8c2;
      font-size:8px;
      font-weight:700;
      line-height:1.2;
      text-transform:uppercase;
      letter-spacing:.04em;
    }

    #trabalhos .portfolio-card:first-child figcaption {
      padding:20px;
    }

    #trabalhos .portfolio-card:first-child figcaption strong {
      font-size:1.65rem;
      max-width:68%;
    }

    @media (max-width: 760px) {
      #trabalhos .section-heading h2 {
        max-width:100%;
      }

      #trabalhos .portfolio-grid {
        display:grid;
        grid-template-columns:1fr 1fr;
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
    }
  `;
  document.head.appendChild(style);
})();