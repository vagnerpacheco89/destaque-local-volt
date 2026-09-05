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
  if (cta) cta.remove();
  if (oldNote) oldNote.remove();

  let coverage = section.querySelector('.service-area__coverage');
  if (!coverage) {
    coverage = document.createElement('div');
    coverage.className = 'service-area__coverage';
    coverage.setAttribute('aria-label', 'Cidades e regiões atendidas');
  }

  coverage.innerHTML = `
    <article class="service-area__coverage-item service-area__coverage-item--primary">
      <div class="service-area__coverage-head">
        <span class="service-area__coverage-mark">01</span>
        <div>
          <strong>PALHOÇA</strong>
          <small>BASE PRINCIPAL</small>
        </div>
      </div>
      <div class="service-area__coverage-neighborhoods" aria-label="Bairros confirmados em Palhoça">
        <span>Pagani</span>
        <span>Pedra Branca</span>
        <span>Passa Vinte</span>
        <span>Ponte do Imaruim</span>
        <span>Bela Vista</span>
        <span>Aririú</span>
      </div>
    </article>

    <article class="service-area__coverage-item">
      <div class="service-area__coverage-head">
        <span class="service-area__coverage-mark">02</span>
        <div>
          <strong>SÃO JOSÉ</strong>
          <small>ATENDIMENTO POR DESLOCAMENTO</small>
        </div>
      </div>
      <div class="service-area__coverage-neighborhoods service-area__coverage-neighborhoods--pending">
        <span>BAIRROS SOB CONSULTA</span>
      </div>
    </article>

    <article class="service-area__coverage-item">
      <div class="service-area__coverage-head">
        <span class="service-area__coverage-mark">03</span>
        <div>
          <strong>FLORIANÓPOLIS CONTINENTAL</strong>
          <small>ATENDIMENTO POR DESLOCAMENTO</small>
        </div>
      </div>
      <div class="service-area__coverage-neighborhoods service-area__coverage-neighborhoods--pending">
        <span>BAIRROS SOB CONSULTA</span>
      </div>
    </article>
  `;

  if (grid) {
    if (map) grid.insertBefore(coverage, map);
    else grid.appendChild(coverage);

    if (map) grid.appendChild(map);
  }

  const style = document.createElement('style');
  style.id = 'service-area-simple-style';
  style.textContent = `
    .service-area .service-area__grid {
      grid-template-columns:minmax(0,.9fr) minmax(500px,1.1fr) !important;
      column-gap:64px !important;
      row-gap:42px !important;
      align-items:start !important;
    }

    .service-area .service-area__grid > div:first-child {
      max-width:580px !important;
      align-self:center;
    }

    .service-area .service-area__coverage {
      display:grid;
      gap:10px;
      width:100%;
      margin:0 !important;
      align-self:start;
    }

    .service-area .service-area__coverage-item {
      position:relative;
      overflow:hidden;
      padding:18px 18px 17px;
      border:1px solid #303534;
      border-radius:10px;
      background:linear-gradient(145deg,#101313 0%,#0b0d0d 100%);
      box-shadow:0 10px 28px rgba(0,0,0,.16);
    }

    .service-area .service-area__coverage-item::before {
      content:'';
      position:absolute;
      left:0;
      top:0;
      bottom:0;
      width:2px;
      background:#3f4542;
    }

    .service-area .service-area__coverage-item--primary {
      border-color:#4a4420;
      background:linear-gradient(145deg,rgba(244,196,0,.055) 0%,#0d0f0f 42%,#0a0c0c 100%);
    }

    .service-area .service-area__coverage-item--primary::before {
      width:3px;
      background:var(--accent);
      box-shadow:0 0 16px rgba(244,196,0,.18);
    }

    .service-area .service-area__coverage-head {
      display:flex;
      align-items:center;
      gap:13px;
    }

    .service-area .service-area__coverage-mark {
      width:34px;
      height:34px;
      display:grid;
      place-items:center;
      flex:0 0 34px;
      border:1px solid #454b48;
      border-radius:50%;
      color:#8d938f;
      font-size:11px !important;
      font-weight:900;
      line-height:1;
    }

    .service-area .service-area__coverage-item--primary .service-area__coverage-mark {
      border-color:var(--accent);
      background:var(--accent);
      color:var(--accent-ink);
      box-shadow:0 0 18px rgba(244,196,0,.12);
    }

    .service-area .service-area__coverage-head > div {
      min-width:0;
    }

    .service-area .service-area__coverage-item strong {
      display:block;
      color:#f4f5f0;
      font:800 1.2rem/1 var(--font-display);
      letter-spacing:.015em;
    }

    .service-area .service-area__coverage-item--primary strong {
      color:var(--accent);
    }

    .service-area .service-area__coverage-item small {
      display:block;
      margin-top:5px;
      color:#727874;
      font-size:11px !important;
      font-weight:800;
      line-height:1.15;
      letter-spacing:.08em;
    }

    .service-area .service-area__coverage-neighborhoods {
      display:flex;
      flex-wrap:wrap;
      gap:7px;
      margin:14px 0 0 47px;
    }

    .service-area .service-area__coverage-neighborhoods span {
      display:inline-flex;
      align-items:center;
      min-height:30px;
      padding:0 10px;
      border:1px solid #343a37;
      border-radius:999px;
      background:#0a0c0c;
      color:#c6cac5;
      font-size:12px !important;
      font-weight:700;
      line-height:1;
    }

    .service-area .service-area__coverage-item--primary .service-area__coverage-neighborhoods span {
      border-color:#554d1f;
      background:rgba(244,196,0,.045);
      color:#e2dfc9;
    }

    .service-area .service-area__coverage-neighborhoods--pending span {
      border-style:dashed;
      color:#777d79;
      font-size:11px !important;
      letter-spacing:.06em;
    }

    .service-area .service-area__map {
      grid-column:1 / -1 !important;
      width:100%;
      margin:0 !important;
      align-self:stretch;
      display:flex;
      flex-direction:column;
      min-height:0 !important;
    }

    .service-area .service-area__map-frame {
      height:340px !important;
      min-height:340px !important;
      flex:none !important;
    }

    .service-area .service-area__map-frame iframe {
      min-height:340px !important;
    }

    @media (max-width:980px) {
      .service-area .service-area__grid {
        grid-template-columns:1fr !important;
        gap:34px !important;
      }

      .service-area .service-area__grid > div:first-child {
        max-width:720px !important;
      }

      .service-area .service-area__coverage {
        max-width:720px;
      }

      .service-area .service-area__map {
        grid-column:1 !important;
      }

      .service-area .service-area__map-frame,
      .service-area .service-area__map-frame iframe {
        height:340px !important;
        min-height:340px !important;
      }
    }

    @media (max-width:620px) {
      .service-area .service-area__coverage-item {
        padding:15px 14px 14px;
        border-radius:9px;
      }

      .service-area .service-area__coverage-neighborhoods {
        margin-left:0;
      }

      .service-area .service-area__map-frame,
      .service-area .service-area__map-frame iframe {
        height:300px !important;
        min-height:300px !important;
      }
    }
  `;

  document.head.appendChild(style);
})();