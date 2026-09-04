(() => {
  const diagnostic = document.querySelector('.diagnostic');
  if (!diagnostic) return;

  const body = diagnostic.querySelector('.diagnostic__body') || diagnostic.querySelector('.lead-text');
  if (body) {
    body.classList.add('diagnostic__body');
    body.textContent = 'Se algo está desarmando, aquecendo ou funcionando de forma irregular, o primeiro passo é entender a causa antes de mexer na instalação. Envie pelo WhatsApp uma descrição do problema e, se possível, fotos ou vídeos.';

    let secondParagraph = diagnostic.querySelector('.diagnostic__body--second');
    if (!secondParagraph) {
      secondParagraph = document.createElement('p');
      secondParagraph.className = 'diagnostic__body diagnostic__body--second';
      body.insertAdjacentElement('afterend', secondParagraph);
    }
    secondParagraph.textContent = 'Rafael avalia as informações e orienta o próximo passo; quando for necessária uma visita, o orçamento é apresentado antes de qualquer serviço. Urgências são atendidas conforme disponibilidade dentro do horário de funcionamento.';
  }

  const cta = diagnostic.querySelector('.btn--accent');
  if (cta) {
    cta.textContent = 'Solicitar avaliação pelo WhatsApp';
    cta.classList.add('diagnostic__cta');
  }

  const style = document.createElement('style');
  style.textContent = `
    .diagnostic .diagnostic__body--second {
      margin-top: 12px !important;
    }

    .diagnostic .diagnostic__cta {
      min-width: 330px !important;
      min-height: 54px !important;
      padding-inline: 30px !important;
      font-size: .86rem !important;
      letter-spacing: .01em;
    }

    /* Painel de sinais — linguagem visual VOLT */
    .diagnostic .problem-panel {
      border: 1px solid #373d3a !important;
      background: #0a0c0c !important;
      box-shadow: 0 24px 56px rgba(0,0,0,.24) !important;
    }

    .diagnostic .problem-panel::before {
      display: none !important;
    }

    .diagnostic .problem-panel__label {
      margin: 0 !important;
      padding: 20px 20px !important;
      border: 0 !important;
      background: linear-gradient(90deg, #f4c400 0%, #e9b900 100%) !important;
      color: #090b0b !important;
      font-size: 13px !important;
      font-weight: 950 !important;
      letter-spacing: .11em !important;
      line-height: 1.2 !important;
      text-align: center !important;
    }

    .diagnostic .problem-panel ul {
      gap: 10px !important;
      padding: 16px !important;
      background: linear-gradient(180deg, #0d1010 0%, #090b0b 100%);
    }

    .diagnostic .problem-panel li {
      position: relative;
      min-height: 78px !important;
      padding: 16px 18px 16px 43px !important;
      border: 1px solid #303633 !important;
      background: linear-gradient(145deg, #101313 0%, #0b0d0d 100%) !important;
      color: #f0f2ed !important;
      font-size: .84rem !important;
      font-weight: 600;
      line-height: 1.4 !important;
      transition: transform 170ms ease, border-color 170ms ease, background 170ms ease, box-shadow 170ms ease;
    }

    .diagnostic .problem-panel li::before {
      left: 18px !important;
      top: 50% !important;
      width: 7px !important;
      height: 7px !important;
      transform: translateY(-50%) rotate(45deg) !important;
      background: #f4c400 !important;
      box-shadow: 0 0 0 4px rgba(244,196,0,.06);
    }

    .diagnostic .problem-panel li:hover {
      transform: translateY(-2px);
      border-color: #75691c !important;
      background: linear-gradient(145deg, #151816 0%, #0d100f 100%) !important;
      box-shadow: inset 3px 0 0 rgba(244,196,0,.78), 0 10px 22px rgba(0,0,0,.16);
    }

    @media (max-width: 620px) {
      .diagnostic .diagnostic__cta {
        width: 100% !important;
        min-width: 0 !important;
      }

      .diagnostic .problem-panel__label {
        padding: 17px 16px !important;
        font-size: 12px !important;
      }

      .diagnostic .problem-panel ul {
        padding: 12px !important;
      }

      .diagnostic .problem-panel li {
        min-height: 64px !important;
      }
    }
  `;
  document.head.appendChild(style);
})();