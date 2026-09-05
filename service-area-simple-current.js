(() => {
  const section = document.querySelector('.service-area');
  if (!section || section.dataset.areaSimple === 'true') return;

  const grid = section.querySelector('.service-area__grid');
  const copy = grid?.querySelector(':scope > div:first-child');
  const panel = section.querySelector('.area-panel');
  const map = section.querySelector('.service-area__map');
  const cta = copy?.querySelector('.service-area__cta, .btn');
  const oldNote = copy?.querySelector('.service-area__note');

  section.dataset.areaSimple = 'true';

  if (panel) panel.remove();

  if (copy && !copy.querySelector('.service-area__coverage')) {
    const coverage = document.createElement('div');
    coverage.className = 'service-area__coverage';
    coverage.setAttribute('aria-label', 'Cidades e regiões atendidas');
    coverage.innerHTML = `
      <div class="service-area__coverage-item service-area__coverage-item--primary">
        <strong>PALHOÇA</strong>
        <p>Pagani, Pedra Branca, Passa Vinte, Ponte do Imaruim, Bela Vista e Aririú.</p>
      </div>
      <div class="service-area__coverage-item">
        <strong>SÃO JOSÉ</strong>
        <p>Atendimento por deslocamento conforme disponibilidade.</p>
      </div>
      <div class="service-area__coverage-item">
        <strong>FLORIANÓPOLIS CONTINENTAL</strong>
        <p>Atendimento por deslocamento conforme disponibilidade.</p>
      </div>
    `;

    if (cta) cta.insertAdjacentElement('beforebegin', coverage);
    else copy.appendChild(coverage);
  }

  if (oldNote) {
    oldNote.textContent = 'Informe seu bairro no contato para confirmar o atendimento na sua região.';
  }

  if (grid && map) {
    grid.appendChild(map);
  }

  const style = document.createElement('style');
  style.id = 'service-area-simple-style';
  style.textContent = `
    .service-area .service-area__grid {
      grid-template-columns:minmax(0,.88fr) minmax(500px,1.12fr) !important;
      gap:64px !important;
      align-items:center !important;
    }

    .service-area .service-area__grid > div:first-child {
      max-width:560px !important;
    }

    .service-area .service-area__coverage {
      margin:28px 0 26px;
      border-top:1px solid #303534;
      border-bottom:1px solid #303534;
    }

    .service-area .service-area__coverage-item {
      position:relative;
      padding:17px 0 17px 18px;
      border-bottom:1px solid #242827;
    }

    .service-area .service-area__coverage-item:last-child {
      border-bottom:0;
    }

    .service-area .service-area__coverage-item::before {
      content:'';
      position:absolute;
      left:0;
      top:21px;
      width:6px;
      height:6px;
      border-radius:50%;
      background:#535957;
    }

    .service-area .service-area__coverage-item--primary::before {
      background:var(--accent);
      box-shadow:0 0 12px rgba(244,196,0,.22);
    }

    .service-area .service-area__coverage-item strong {
      display:block;
      margin-bottom:6px;
      color:#f5f5f0;
      font:800 1.16rem/1 var(--font-display);
      letter-spacing:.02em;
    }

    .service-area .service-area__coverage-item--primary strong {
      color:var(--accent);
    }

    .service-area .service-area__coverage-item p {
      margin:0;
      color:#989e99;
      font-size:16px !important;
      line-height:1.5;
    }

    .service-area .service-area__map {
      grid-column:auto !important;
      width:100%;
      margin:0 !important;
      align-self:stretch;
      display:flex;
      flex-direction:column;
      min-height:500px;
    }

    .service-area .service-area__map-frame {
      flex:1;
      min-height:420px;
      height:auto !important;
    }

    .service-area .service-area__map-frame iframe {
      min-height:420px;
    }

    @media (max-width:980px) {
      .service-area .service-area__grid {
        grid-template-columns:1fr !important;
        gap:36px !important;
      }

      .service-area .service-area__grid > div:first-child {
        max-width:720px !important;
      }

      .service-area .service-area__map {
        min-height:440px;
      }

      .service-area .service-area__map-frame,
      .service-area .service-area__map-frame iframe {
        min-height:360px;
      }
    }

    @media (max-width:620px) {
      .service-area .service-area__coverage {
        margin:24px 0 22px;
      }

      .service-area .service-area__coverage-item {
        padding:15px 0 15px 17px;
      }

      .service-area .service-area__coverage-item p {
        font-size:16px !important;
      }

      .service-area .service-area__map {
        min-height:390px;
      }

      .service-area .service-area__map-frame,
      .service-area .service-area__map-frame iframe {
        min-height:310px;
      }
    }
  `;

  document.head.appendChild(style);
})();