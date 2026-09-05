(() => {
  const section = document.querySelector('.final-cta');
  if (!section || section.dataset.finalCtaPolished === 'true') return;

  const inner = section.querySelector('.final-cta__inner');
  const copy = inner?.querySelector(':scope > div:first-child');
  const eyebrow = copy?.querySelector('.eyebrow');
  const title = copy?.querySelector('#cta-title');
  const body = copy?.querySelector(':scope > p:not(.eyebrow)');
  const action = section.querySelector('.final-cta__action');
  const button = action?.querySelector('.btn');
  const small = action?.querySelector('small');

  section.dataset.finalCtaPolished = 'true';

  if (eyebrow) eyebrow.textContent = 'PRECISA DE UM ELETRICISTA?';
  if (title) title.textContent = 'FALE COM RAFAEL E EXPLIQUE O QUE PRECISA';
  if (body) {
    body.textContent = 'Atendimento em Palhoça, São José e Florianópolis continental para manutenção, instalações e reparos elétricos.';
    body.classList.add('final-cta__intro');
  }

  if (action && !action.querySelector('.final-cta__action-label')) {
    const label = document.createElement('p');
    label.className = 'final-cta__action-label';
    label.textContent = 'CONTATO DIRETO COM RAFAEL';
    action.insertBefore(label, action.firstChild);
  }

  if (button) button.textContent = 'PEDIR ORÇAMENTO NO WHATSAPP';
  if (small) small.textContent = 'Informe seu bairro, descreva o serviço e envie fotos ou vídeos quando possível.';

  const style = document.createElement('style');
  style.id = 'final-cta-current-style';
  style.textContent = `
    .final-cta {
      position:relative;
      overflow:hidden;
      padding:72px 0 !important;
      background:#050606 !important;
      border-top:1px solid #1e2221 !important;
      border-bottom:1px solid #1e2221 !important;
    }

    .final-cta::before,
    .final-cta::after {
      content:'';
      position:absolute;
      pointer-events:none;
    }

    .final-cta::before {
      inset:auto -10% -55% auto;
      width:520px;
      height:520px;
      border-radius:50%;
      background:radial-gradient(circle, rgba(244,196,0,.08), transparent 68%);
      opacity:1 !important;
      clip-path:none !important;
    }

    .final-cta::after {
      left:0;
      right:0;
      top:0;
      height:1px;
      background:linear-gradient(90deg, transparent 0%, rgba(244,196,0,.55) 24%, rgba(244,196,0,.55) 76%, transparent 100%);
    }

    .final-cta .final-cta__inner {
      position:relative;
      z-index:1;
      display:grid !important;
      grid-template-columns:minmax(0,1.45fr) minmax(320px,.55fr) !important;
      gap:0 !important;
      align-items:stretch !important;
      overflow:hidden;
      border:1px solid rgba(244,196,0,.7);
      border-radius:10px;
      background:var(--accent);
      box-shadow:
        0 0 0 1px rgba(244,196,0,.07),
        0 0 38px rgba(244,196,0,.08),
        0 26px 70px rgba(0,0,0,.26);
    }

    .final-cta .final-cta__inner > div:first-child {
      position:relative;
      padding:48px 52px 46px;
      color:var(--accent-ink);
      background:
        linear-gradient(115deg, rgba(255,255,255,.08), transparent 42%),
        var(--accent);
    }

    .final-cta .final-cta__inner > div:first-child::after {
      content:'';
      position:absolute;
      right:24px;
      top:24px;
      width:70px;
      height:70px;
      border-top:1px solid rgba(9,10,8,.3);
      border-right:1px solid rgba(9,10,8,.3);
      pointer-events:none;
    }

    .final-cta .eyebrow {
      margin-bottom:16px;
      color:var(--accent-ink) !important;
    }

    .final-cta .eyebrow::after {
      background:var(--accent-ink) !important;
      opacity:.55;
    }

    .final-cta h2 {
      max-width:820px !important;
      margin:0 0 18px !important;
      color:var(--accent-ink) !important;
      font-size:clamp(3.25rem,5.2vw,5.5rem) !important;
      line-height:.87 !important;
    }

    .final-cta .final-cta__intro {
      max-width:700px !important;
      margin:0 !important;
      color:rgba(9,10,8,.72) !important;
      line-height:1.58 !important;
    }

    .final-cta .final-cta__action {
      min-width:0 !important;
      display:flex !important;
      flex-direction:column;
      justify-content:center;
      align-items:stretch;
      padding:42px 36px !important;
      text-align:left !important;
      border-left:1px solid rgba(244,196,0,.34);
      background:
        radial-gradient(260px 160px at 50% 0%, rgba(244,196,0,.055), transparent 72%),
        #090b0b;
    }

    .final-cta .final-cta__action-label {
      margin:0 0 16px;
      color:#f1f2ed;
      font-size:12px !important;
      font-weight:900;
      line-height:1.2;
      letter-spacing:.09em;
    }

    .final-cta .final-cta__action .btn {
      width:100%;
      min-height:58px;
      padding-inline:20px;
      border:1px solid var(--accent) !important;
      border-radius:6px !important;
      background:var(--accent) !important;
      color:var(--accent-ink) !important;
      text-transform:uppercase;
      box-shadow:0 0 24px rgba(244,196,0,.09);
    }

    .final-cta .final-cta__action .btn:hover {
      background:var(--accent-hover) !important;
      border-color:var(--accent-hover) !important;
      box-shadow:0 10px 30px rgba(244,196,0,.14);
    }

    .final-cta .final-cta__action small {
      display:block;
      max-width:none !important;
      margin:13px 0 0 !important;
      color:#8f9690 !important;
      font-size:12px !important;
      line-height:1.5;
      text-align:left;
    }

    @media (max-width:900px) {
      .final-cta .final-cta__inner {
        grid-template-columns:1fr !important;
      }

      .final-cta .final-cta__action {
        border-left:0;
        border-top:1px solid rgba(244,196,0,.34);
      }
    }

    @media (max-width:620px) {
      .final-cta {
        padding:52px 0 !important;
      }

      .final-cta .final-cta__inner > div:first-child {
        padding:34px 24px 32px;
      }

      .final-cta .final-cta__inner > div:first-child::after {
        width:46px;
        height:46px;
        right:16px;
        top:16px;
      }

      .final-cta h2 {
        font-size:clamp(2.8rem,13vw,4rem) !important;
      }

      .final-cta .final-cta__action {
        padding:28px 24px !important;
      }
    }
  `;

  document.head.appendChild(style);
})();