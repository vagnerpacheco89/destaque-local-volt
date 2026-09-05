(() => {
  const section = document.querySelector('.service-area');
  if (!section || section.dataset.areaPolished === 'true') return;

  const grid = section.querySelector('.service-area__grid');
  const copy = grid?.querySelector(':scope > div:first-child');
  const eyebrow = copy?.querySelector('.eyebrow');
  const title = copy?.querySelector('#area-title');
  const intro = copy?.querySelector('.lead-text');
  const cities = copy?.querySelector('.area-cities');
  const cta = copy?.querySelector('.btn');
  const panel = section.querySelector('.area-panel');

  section.dataset.areaPolished = 'true';

  if (eyebrow) eyebrow.textContent = 'ÁREA ATENDIDA';
  if (title) title.textContent = 'Atendimento em Palhoça e região';
  if (intro) {
    intro.textContent = 'Com base em Palhoça, Rafael atende por deslocamento em Palhoça, São José e Florianópolis continental para serviços elétricos em residências e pequenos comércios.';
    intro.classList.add('section-intro');
  }

  if (cities) cities.remove();

  if (cta) {
    cta.textContent = 'CONSULTAR DISPONIBILIDADE';
    cta.classList.add('service-area__cta');
  }

  if (copy && !copy.querySelector('.service-area__note')) {
    const note = document.createElement('p');
    note.className = 'service-area__note';
    note.textContent = 'Informe seu bairro no primeiro contato para confirmar o atendimento e o deslocamento.';
    cta?.insertAdjacentElement('afterend', note);
  }

  if (panel) {
    panel.innerHTML = `
      <div class="area-summary">
        <div class="area-summary__main">
          <span>BASE DE ATENDIMENTO</span>
          <strong>PALHOÇA</strong>
        </div>
        <div class="area-summary__nearby">
          <span>TAMBÉM ATENDO</span>
          <strong>São José</strong>
          <strong>Florianópolis continental</strong>
        </div>
      </div>

      <div class="area-neighborhoods-simple">
        <span>BAIRROS EM PALHOÇA</span>
        <p>Pagani • Pedra Branca • Passa Vinte • Ponte do Imaruim • Bela Vista • Aririú</p>
      </div>

      <div class="area-hours-simple" aria-label="Horários de atendimento">
        <div><span>SEG–SEX</span><strong>08:00–18:00</strong></div>
        <div><span>SÁBADO</span><strong>08:00–13:00</strong></div>
        <div><span>DOM / FERIADOS</span><strong>Não atende</strong></div>
      </div>

      <p class="area-note">Atendimento conforme disponibilidade e deslocamento. Não há endereço físico aberto ao público.</p>
    `;
  }

  if (grid && !grid.querySelector('.service-area__map')) {
    const map = document.createElement('div');
    map.className = 'service-area__map';
    map.innerHTML = `
      <div class="service-area__map-head">
        <div>
          <span class="service-area__map-kicker">LOCALIZAÇÃO</span>
          <strong>PALHOÇA • SANTA CATARINA</strong>
        </div>
        <span class="service-area__map-pin" aria-hidden="true">⌖</span>
      </div>
      <div class="service-area__map-frame">
        <iframe
          title="Mapa de Palhoça, Santa Catarina"
          src="https://www.google.com/maps?q=Palho%C3%A7a%2C%20Santa%20Catarina&z=12&output=embed"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen>
        </iframe>
      </div>
    `;
    grid.appendChild(map);
  }

  const style = document.createElement('style');
  style.textContent = `
    .service-area {
      position:relative;
      overflow:hidden;
      background:
        radial-gradient(680px 360px at 92% 12%, rgba(244,196,0,.05), transparent 70%),
        #070909 !important;
      border-top:1px solid #1d2120;
    }

    .service-area::before {
      content:'';
      position:absolute;
      left:0;
      right:0;
      top:0;
      height:1px;
      background:linear-gradient(90deg, transparent 0%, rgba(244,196,0,.28) 50%, transparent 100%);
      pointer-events:none;
    }

    .service-area .service-area__grid {
      display:grid !important;
      grid-template-columns:minmax(0,.82fr) minmax(500px,1.18fr) !important;
      gap:72px !important;
      align-items:center !important;
    }

    .service-area .service-area__grid > div:first-child {
      max-width:520px;
    }

    .service-area .service-area__grid h2 {
      max-width:560px;
      margin-bottom:20px;
      font-size:clamp(3.1rem,4.6vw,4.8rem);
      line-height:.9;
    }

    .service-area .lead-text {
      max-width:510px;
      margin:0 0 26px;
      color:#a9ada9 !important;
      font-weight:400 !important;
      line-height:1.62 !important;
    }

    .service-area .service-area__cta {
      min-width:250px;
      text-transform:uppercase;
    }

    .service-area .service-area__note {
      max-width:410px;
      margin:12px 0 0;
      color:#777d79;
      font-size:12px !important;
      line-height:1.5;
    }

    .service-area .area-panel {
      position:relative;
      overflow:hidden;
      border:1px solid #343938;
      border-radius:6px;
      background:linear-gradient(145deg,#101313 0%,#090b0b 78%);
      box-shadow:0 24px 58px rgba(0,0,0,.26);
    }

    .service-area .area-panel::before {
      content:'';
      position:absolute;
      top:0;
      left:0;
      width:100%;
      height:2px;
      background:var(--accent);
    }

    .service-area .area-summary {
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:0;
      min-height:152px;
      border-bottom:1px solid #2d3230;
    }

    .service-area .area-summary__main,
    .service-area .area-summary__nearby {
      display:flex;
      flex-direction:column;
      justify-content:center;
      padding:28px 30px;
    }

    .service-area .area-summary__main {
      background:linear-gradient(135deg, rgba(244,196,0,.08), transparent 74%);
      border-right:1px solid #2d3230;
    }

    .service-area .area-summary span,
    .service-area .area-neighborhoods-simple > span,
    .service-area .area-hours-simple span {
      color:#868c87;
      font-size:11px !important;
      font-weight:900;
      line-height:1.1;
      letter-spacing:.11em;
    }

    .service-area .area-summary__main > span {
      color:var(--accent);
      margin-bottom:10px;
    }

    .service-area .area-summary__main > strong {
      color:#fff;
      font:800 3.2rem/.84 var(--font-display);
      letter-spacing:-.02em;
    }

    .service-area .area-summary__nearby > span {
      margin-bottom:11px;
    }

    .service-area .area-summary__nearby > strong {
      color:#eceee9;
      font-size:16px;
      line-height:1.45;
      font-weight:750;
    }

    .service-area .area-summary__nearby > strong + strong {
      margin-top:2px;
    }

    .service-area .area-neighborhoods-simple {
      padding:22px 30px 24px;
      border-bottom:1px solid #2d3230;
    }

    .service-area .area-neighborhoods-simple > span {
      display:block;
      margin-bottom:10px;
    }

    .service-area .area-neighborhoods-simple p {
      margin:0 !important;
      color:#d6d9d3 !important;
      font-size:14px !important;
      line-height:1.7 !important;
    }

    .service-area .area-hours-simple {
      display:grid;
      grid-template-columns:repeat(3,minmax(0,1fr));
      border-bottom:1px solid #2d3230;
    }

    .service-area .area-hours-simple > div {
      min-height:84px;
      display:flex;
      flex-direction:column;
      justify-content:center;
      padding:17px 20px;
      border-right:1px solid #2d3230;
    }

    .service-area .area-hours-simple > div:last-child {
      border-right:0;
    }

    .service-area .area-hours-simple span {
      margin-bottom:7px;
    }

    .service-area .area-hours-simple strong {
      color:#fff;
      font-size:15px;
      line-height:1.2;
      font-weight:800;
    }

    .service-area .area-note {
      margin:0 !important;
      padding:14px 30px !important;
      color:#747a75 !important;
      font-size:11px !important;
      line-height:1.45 !important;
    }

    .service-area .service-area__map {
      grid-column:1 / -1;
      width:100%;
      margin-top:-22px;
      overflow:hidden;
      border:1px solid #373c3b;
      border-radius:6px;
      background:#0b0d0d;
      box-shadow:0 24px 58px rgba(0,0,0,.24);
    }

    .service-area .service-area__map-head {
      min-height:72px;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:20px;
      padding:16px 20px;
      border-bottom:1px solid #303534;
      background:linear-gradient(90deg,#101313 0%,#0a0c0c 100%);
    }

    .service-area .service-area__map-head > div {
      display:flex;
      flex-direction:column;
      gap:5px;
    }

    .service-area .service-area__map-kicker {
      color:var(--accent);
      font-size:11px !important;
      font-weight:900;
      line-height:1;
      letter-spacing:.12em;
    }

    .service-area .service-area__map-head strong {
      color:#fff;
      font:800 1.45rem/1 var(--font-display);
      letter-spacing:.01em;
    }

    .service-area .service-area__map-pin {
      width:38px;
      height:38px;
      display:grid;
      place-items:center;
      flex:0 0 38px;
      border:1px solid var(--accent);
      border-radius:50%;
      color:var(--accent);
      font-size:1.2rem;
      line-height:1;
      box-shadow:0 0 18px rgba(244,196,0,.08);
    }

    .service-area .service-area__map-frame {
      position:relative;
      height:340px;
      background:#101313;
    }

    .service-area .service-area__map-frame::after {
      content:'';
      position:absolute;
      inset:0;
      pointer-events:none;
      box-shadow:inset 0 0 0 1px rgba(255,255,255,.025);
    }

    .service-area .service-area__map-frame iframe {
      display:block;
      width:100%;
      height:100%;
      border:0;
      filter:grayscale(.82) saturate(.72) contrast(1.06) brightness(.86);
    }

    @media (max-width:980px) {
      .service-area .service-area__grid {
        grid-template-columns:1fr !important;
        gap:38px !important;
      }
      .service-area .service-area__grid > div:first-child {
        max-width:720px;
      }
      .service-area .lead-text {
        max-width:680px;
      }
      .service-area .service-area__map {
        margin-top:0;
      }
    }

    @media (max-width:620px) {
      .service-area .area-summary {
        grid-template-columns:1fr;
      }

      .service-area .area-summary__main {
        border-right:0;
        border-bottom:1px solid #2d3230;
      }

      .service-area .area-summary__main,
      .service-area .area-summary__nearby,
      .service-area .area-neighborhoods-simple {
        padding-left:20px;
        padding-right:20px;
      }

      .service-area .area-hours-simple {
        grid-template-columns:1fr;
      }

      .service-area .area-hours-simple > div {
        min-height:66px;
        border-right:0;
        border-bottom:1px solid #2d3230;
      }

      .service-area .area-hours-simple > div:last-child {
        border-bottom:0;
      }

      .service-area .area-note {
        padding-left:20px !important;
        padding-right:20px !important;
      }

      .service-area .service-area__cta {
        width:100%;
      }

      .service-area .service-area__map-head {
        min-height:64px;
        padding:14px 16px;
      }

      .service-area .service-area__map-head strong {
        font-size:1.2rem;
      }

      .service-area .service-area__map-frame {
        height:300px;
      }
    }
  `;

  document.head.appendChild(style);
})();