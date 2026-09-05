(() => {
  const footer = document.querySelector('.site-footer');
  if (!footer || footer.dataset.footerPolished === 'true') return;

  const grid = footer.querySelector('.footer-grid');
  const demo = footer.querySelector('.footer-demo');

  footer.dataset.footerPolished = 'true';

  if (grid) {
    grid.innerHTML = `
      <div class="footer-brand footer-brand--polished">
        <a class="wordmark" href="#topo" aria-label="Rafael Martins Elétrica — voltar ao início">
          <span class="wordmark__main">Rafael Martins</span>
          <span class="wordmark__sub">ELÉTRICA</span>
        </a>
        <p class="footer-brand__text">Serviços elétricos para residências e pequenos comércios em Palhoça e região.</p>
        <div class="footer-brand__location"><span></span> PALHOÇA • SANTA CATARINA</div>
      </div>

      <div class="footer-block">
        <p class="footer-block__label">ÁREA DE ATENDIMENTO</p>
        <p>Palhoça</p>
        <p>São José</p>
        <p>Florianópolis continental</p>
      </div>

      <div class="footer-block">
        <p class="footer-block__label">HORÁRIOS</p>
        <div class="footer-hours"><span>SEG–SEX</span><strong>08:00–18:00</strong></div>
        <div class="footer-hours"><span>SÁBADO</span><strong>08:00–13:00</strong></div>
        <div class="footer-hours"><span>DOM / FERIADOS</span><strong>Não atende</strong></div>
      </div>

      <div class="footer-block footer-nav-block">
        <p class="footer-block__label">NAVEGAÇÃO</p>
        <nav class="footer-nav" aria-label="Navegação do rodapé">
          <a href="#servicos">Serviços</a>
          <a href="#trabalhos">Trabalhos</a>
          <a href="#sobre">Sobre mim</a>
          <a href="#area-atendida">Área atendida</a>
          <a href="#faq">Dúvidas frequentes</a>
        </nav>
      </div>

      <div class="footer-contact">
        <p class="footer-block__label">CONTATO</p>
        <strong>Precisa falar com Rafael?</strong>
        <p>Envie pelo WhatsApp o que precisa e, quando possível, fotos ou vídeos do serviço.</p>
        <button class="footer-contact__cta" type="button" data-demo-cta>CHAMAR NO WHATSAPP <span aria-hidden="true">↗</span></button>
      </div>
    `;
  }

  if (demo) {
    demo.innerHTML = `
      <div class="footer-demo__center">
        <span>© 2026 RAFAEL MARTINS ELÉTRICA</span>
        <span class="footer-demo__highlight">SITE DEMONSTRATIVO DO MODELO VOLT • DESTAQUE LOCAL</span>
      </div>
      <a href="#topo">VOLTAR AO TOPO ↑</a>
    `;
  }

  const style = document.createElement('style');
  style.id = 'footer-current-style';
  style.textContent = `
    .site-footer {
      position:relative;
      overflow:hidden;
      padding:0 !important;
      background:#020303 !important;
      border-top:1px solid #242827;
    }

    .site-footer::before {
      content:'';
      position:absolute;
      top:0;
      left:50%;
      width:min(1180px,calc(100% - 48px));
      height:1px;
      transform:translateX(-50%);
      background:linear-gradient(90deg,var(--accent) 0 92px,#343938 92px 100%);
      opacity:.9;
      pointer-events:none;
    }

    .site-footer .footer-grid {
      display:grid !important;
      grid-template-columns:minmax(260px,1.42fr) minmax(150px,.76fr) minmax(175px,.92fr) minmax(150px,.72fr) minmax(235px,1fr) !important;
      gap:0 !important;
      padding:54px 0 46px;
    }

    .site-footer .footer-grid > * {
      min-width:0;
      padding:0 28px;
      border-left:1px solid #202423;
    }

    .site-footer .footer-grid > *:first-child {
      padding-left:0;
      border-left:0;
    }

    .site-footer .footer-grid > *:last-child {
      padding-right:0;
    }

    /* A marca do footer deve ser exatamente a mesma assinatura visual do navbar. */
    .site-footer .footer-brand--polished .wordmark {
      display:inline-grid !important;
      grid-template-columns:auto 1fr !important;
      column-gap:8px !important;
      align-items:center !important;
      width:auto !important;
      margin:0 0 20px !important;
      color:inherit !important;
      font-size:inherit !important;
      line-height:1 !important;
    }

    .site-footer .footer-brand--polished .wordmark::before {
      content:'' !important;
      display:block !important;
      grid-row:1 / span 2 !important;
      width:22px !important;
      height:34px !important;
      background:var(--accent) !important;
      clip-path:polygon(55% 0,12% 53%,43% 53%,27% 100%,88% 38%,57% 38%) !important;
    }

    .site-footer .footer-brand--polished .wordmark__main {
      display:block !important;
      color:#f7f7f2 !important;
      font-family:var(--font-display) !important;
      font-size:22px !important;
      font-weight:800 !important;
      line-height:1 !important;
      text-transform:uppercase !important;
      letter-spacing:.015em !important;
    }

    .site-footer .footer-brand--polished .wordmark__sub {
      display:block !important;
      color:var(--muted) !important;
      font-size:9px !important;
      font-weight:800 !important;
      line-height:1 !important;
      letter-spacing:.22em !important;
    }

    .footer-brand__text {
      max-width:290px;
      margin:0 0 22px !important;
      color:#858b86 !important;
      font-size:14px !important;
      line-height:1.62 !important;
    }

    .footer-brand__location {
      display:flex;
      align-items:center;
      gap:8px;
      color:#c3c7c2;
      font-size:10px;
      font-weight:850;
      letter-spacing:.1em;
    }

    .footer-brand__location span {
      width:7px;
      height:7px;
      background:var(--accent);
      transform:rotate(45deg);
      box-shadow:0 0 12px rgba(244,196,0,.28);
    }

    .site-footer .footer-block__label {
      margin:2px 0 18px !important;
      color:var(--accent) !important;
      font-size:10px !important;
      line-height:1.2;
      font-weight:900;
      letter-spacing:.12em;
    }

    .site-footer .footer-block > p:not(.footer-block__label) {
      margin:0 0 9px !important;
      color:#969c97 !important;
      font-size:13px !important;
      line-height:1.4;
    }

    .footer-hours {
      display:grid;
      gap:2px;
      margin-bottom:14px;
    }

    .footer-hours span {
      color:#676d68;
      font-size:9px;
      font-weight:850;
      letter-spacing:.08em;
    }

    .footer-hours strong {
      color:#d7dad5;
      font-size:13px;
      line-height:1.3;
      font-weight:650;
    }

    .footer-nav {
      display:grid;
      gap:8px;
    }

    .site-footer .footer-nav a {
      width:fit-content;
      margin:0 !important;
      color:#969c97 !important;
      font-size:13px !important;
      line-height:1.4;
      transition:color 160ms ease, transform 160ms ease;
    }

    .site-footer .footer-nav a:hover {
      color:#fff !important;
      transform:translateX(3px);
    }

    .footer-contact strong {
      display:block;
      max-width:220px;
      margin-bottom:10px;
      color:#f1f2ee;
      font-family:var(--font-display);
      font-size:1.6rem;
      line-height:.98;
      text-transform:uppercase;
    }

    .footer-contact > p:not(.footer-block__label) {
      margin:0 0 18px !important;
      color:#858b86 !important;
      font-size:13px !important;
      line-height:1.5;
    }

    .footer-contact__cta {
      min-height:42px;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      gap:10px;
      padding:0 15px;
      border:1px solid #4b504d;
      background:#080a0a;
      color:var(--accent);
      font-size:11px;
      font-weight:900;
      letter-spacing:.05em;
      transition:border-color 170ms ease, background 170ms ease, color 170ms ease, transform 170ms var(--ease);
    }

    .footer-contact__cta:hover {
      border-color:var(--accent);
      background:var(--accent);
      color:var(--accent-ink);
      transform:translateY(-2px);
    }

    .site-footer .footer-demo {
      min-height:58px;
      display:grid !important;
      grid-template-columns:1fr auto 1fr;
      align-items:center;
      padding:12px 0 !important;
      border-top:1px solid #202423;
      color:#5f6560 !important;
      font-size:9px !important;
      line-height:1.35;
      font-weight:750;
      letter-spacing:.065em;
      text-transform:uppercase;
    }

    .footer-demo__center {
      grid-column:2;
      display:flex;
      align-items:center;
      justify-content:center;
      gap:12px;
      white-space:nowrap;
      text-align:center;
    }

    .footer-demo__highlight {
      display:inline-flex;
      align-items:center;
      justify-content:center;
      min-height:28px;
      padding:0 10px;
      background:var(--accent);
      color:var(--accent-ink);
      font-weight:900;
      letter-spacing:.07em;
    }

    .site-footer .footer-demo a {
      grid-column:3;
      justify-self:end;
      margin:0 !important;
      color:#888e89 !important;
      font-size:9px !important;
      font-weight:850;
      letter-spacing:.07em;
      transition:color 160ms ease;
    }

    .site-footer .footer-demo a:hover {
      color:var(--accent) !important;
    }

    @media (max-width:1060px) {
      .site-footer .footer-grid {
        grid-template-columns:1.3fr 1fr 1fr !important;
        row-gap:36px !important;
      }

      .site-footer .footer-grid > * {
        border-left:0;
        padding:0 24px 0 0;
      }

      .site-footer .footer-contact,
      .site-footer .footer-nav-block {
        padding-top:30px;
        border-top:1px solid #202423;
      }
    }

    @media (max-width:860px) {
      .site-footer .footer-demo {
        grid-template-columns:1fr;
        justify-items:center;
        gap:10px;
        padding:14px 0 !important;
      }

      .footer-demo__center {
        grid-column:1;
        white-space:normal;
        flex-wrap:wrap;
      }

      .site-footer .footer-demo a {
        grid-column:1;
        justify-self:center;
      }
    }

    @media (max-width:720px) {
      .site-footer::before {
        width:calc(100% - 36px);
      }

      .site-footer .footer-grid {
        grid-template-columns:1fr 1fr !important;
        gap:30px 20px !important;
        padding:42px 0 36px;
      }

      .site-footer .footer-grid > * {
        padding:0 !important;
      }

      .footer-brand--polished,
      .footer-contact {
        grid-column:1 / -1;
      }

      .site-footer .footer-nav-block,
      .site-footer .footer-contact {
        padding-top:26px !important;
      }
    }

    @media (max-width:480px) {
      .site-footer .footer-grid {
        grid-template-columns:1fr !important;
      }

      .footer-brand--polished,
      .footer-contact {
        grid-column:auto;
      }

      .site-footer .footer-grid > * + * {
        padding-top:22px !important;
        border-top:1px solid #202423;
      }

      .footer-demo__center {
        gap:8px;
      }

      .footer-demo__highlight {
        width:100%;
        min-height:30px;
        padding:6px 10px;
      }
    }
  `;

  document.head.appendChild(style);
})();