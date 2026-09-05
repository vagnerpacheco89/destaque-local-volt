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
      <div class="area-panel__top">
        <span class="area-panel__label">BASE DE ATENDIMENTO</span>
        <strong>PALHOÇA</strong>
        <p>Atendimento local com deslocamento para cidades próximas conforme disponibilidade.</p>
      </div>

      <div class="area-route" aria-label="Cidades atendidas">
        <div class="area-route__city area-route__city--primary">
          <span>01</span>
          <strong>PALHOÇA</strong>
          <small>BASE PRINCIPAL</small>
        </div>
        <div class="area-route__city">
          <span>02</span>
          <strong>SÃO JOSÉ</strong>
          <small>DESLOCAMENTO</small>
        </div>
        <div class="area-route__city">
          <span>03</span>
          <strong>FLORIANÓPOLIS</strong>
          <small>CONTINENTAL</small>
        </div>
      </div>

      <div class="area-panel__neighborhoods">
        <span class="area-panel__sub">BAIRROS EM PALHOÇA</span>
        <div class="area-chips">
          <span>Pagani</span>
          <span>Pedra Branca</span>
          <span>Passa Vinte</span>
          <span>Ponte do Imaruim</span>
          <span>Bela Vista</span>
          <span>Aririú</span>
        </div>
      </div>

      <div class="hours-grid">
        <div><small>SEG–SEX</small><strong>08:00–18:00</strong></div>
        <div><small>SÁBADO</small><strong>08:00–13:00</strong></div>
        <div><small>DOM / FERIADOS</small><strong>Não atende</strong></div>
      </div>

      <p class="area-note">Atendimento conforme disponibilidade e deslocamento. Não há endereço físico aberto ao público.</p>
    `;
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
      grid-template-columns:minmax(0,.82fr) minmax(520px,1.18fr) !important;
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
      border:1px solid #373c3b;
      border-radius:6px;
      background:linear-gradient(145deg,#101313 0%,#090b0b 72%);
      box-shadow:0 24px 58px rgba(0,0,0,.28);
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

    .service-area .area-panel__top {
      display:grid;
      grid-template-columns:1fr auto;
      column-gap:22px;
      align-items:end;
      padding:24px 26px 22px;
      border-bottom:1px solid #303534;
      background:rgba(255,255,255,.012);
    }

    .service-area .area-panel__label {
      grid-column:1 / -1;
      margin-bottom:8px;
      color:var(--accent);
      font-size:12px;
      font-weight:900;
      line-height:1;
      letter-spacing:.12em;
    }

    .service-area .area-panel__top > strong {
      color:#fff;
      font:800 2.8rem/.86 var(--font-display);
      letter-spacing:-.01em;
    }

    .service-area .area-panel__top p {
      max-width:280px;
      margin:0;
      color:#919691;
      font-size:12px !important;
      line-height:1.5;
      text-align:right;
    }

    .service-area .area-route {
      position:relative;
      display:grid;
      grid-template-columns:repeat(3,minmax(0,1fr));
      padding:24px 22px 22px;
      border-bottom:1px solid #303534;
    }

    .service-area .area-route::before {
      content:'';
      position:absolute;
      left:16.66%;
      right:16.66%;
      top:43px;
      height:1px;
      background:#4a504d;
    }

    .service-area .area-route__city {
      position:relative;
      z-index:1;
      min-width:0;
      padding:0 12px;
      text-align:center;
    }

    .service-area .area-route__city > span {
      width:36px;
      height:36px;
      margin:0 auto 14px;
      display:grid;
      place-items:center;
      border:1px solid #555b57;
      border-radius:50%;
      background:#0a0c0c;
      color:#a8ada8;
      font-size:10px;
      font-weight:900;
      line-height:1;
      box-shadow:0 0 0 7px #0c0f0f;
    }

    .service-area .area-route__city--primary > span {
      border-color:var(--accent);
      background:var(--accent);
      color:var(--accent-ink);
      box-shadow:0 0 0 7px #0c0f0f, 0 0 22px rgba(244,196,0,.12);
    }

    .service-area .area-route__city strong {
      display:block;
      color:#fff;
      font:800 1.18rem/1 var(--font-display);
      letter-spacing:.01em;
    }

    .service-area .area-route__city--primary strong {
      color:var(--accent);
    }

    .service-area .area-route__city small {
      display:block;
      margin-top:6px;
      color:#777d79;
      font-size:11px !important;
      font-weight:800;
      line-height:1.1;
      letter-spacing:.07em;
    }

    .service-area .area-panel__neighborhoods {
      padding:20px 22px 22px;
      border-bottom:1px solid #303534;
    }

    .service-area .area-panel__sub {
      display:block;
      margin-bottom:12px;
      color:#8f958f;
      font-size:11px !important;
      font-weight:900;
      line-height:1;
      letter-spacing:.11em;
    }

    .service-area .area-chips {
      display:flex;
      flex-wrap:wrap;
      gap:8px;
    }

    .service-area .area-chips span {
      display:inline-flex;
      align-items:center;
      min-height:34px;
      padding:0 12px;
      border:1px solid #363b39;
      border-radius:3px;
      background:#0c0f0e;
      color:#d5d8d2;
      font-size:12px !important;
      font-weight:700;
    }

    .service-area .hours-grid {
      display:grid;
      grid-template-columns:repeat(3,minmax(0,1fr));
      border-bottom:1px solid #303534;
    }

    .service-area .hours-grid > div {
      min-height:78px;
      display:flex;
      flex-direction:column;
      justify-content:center;
      padding:15px 18px;
      border-right:1px solid #303534;
    }

    .service-area .hours-grid > div:last-child {
      border-right:0;
    }

    .service-area .hours-grid small {
      margin-bottom:6px;
      color:#777d79;
      font-size:11px !important;
      font-weight:800;
      letter-spacing:.08em;
    }

    .service-area .hours-grid strong {
      color:#fff;
      font-size:14px;
      line-height:1.2;
    }

    .service-area .area-note {
      margin:0 !important;
      padding:14px 22px !important;
      color:#747a75 !important;
      font-size:11px !important;
      line-height:1.45 !important;
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
    }

    @media (max-width:620px) {
      .service-area .area-panel__top {
        grid-template-columns:1fr;
        gap:12px;
      }
      .service-area .area-panel__top p {
        max-width:none;
        text-align:left;
      }
      .service-area .area-route {
        grid-template-columns:1fr;
        gap:18px;
        padding:20px;
      }
      .service-area .area-route::before {
        left:37px;
        right:auto;
        top:38px;
        bottom:38px;
        width:1px;
        height:auto;
      }
      .service-area .area-route__city {
        display:grid;
        grid-template-columns:36px 1fr;
        grid-template-rows:auto auto;
        column-gap:14px;
        padding:0;
        text-align:left;
      }
      .service-area .area-route__city > span {
        grid-row:1 / span 2;
        margin:0;
      }
      .service-area .area-route__city strong,
      .service-area .area-route__city small {
        align-self:center;
      }
      .service-area .area-route__city small {
        margin-top:2px;
      }
      .service-area .hours-grid {
        grid-template-columns:1fr;
      }
      .service-area .hours-grid > div {
        min-height:64px;
        border-right:0;
        border-bottom:1px solid #303534;
      }
      .service-area .hours-grid > div:last-child {
        border-bottom:0;
      }
      .service-area .service-area__cta {
        width:100%;
      }
    }
  `;

  document.head.appendChild(style);
})();