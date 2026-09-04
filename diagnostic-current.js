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
    @media (max-width: 620px) {
      .diagnostic .diagnostic__cta {
        width: 100% !important;
        min-width: 0 !important;
      }
    }
  `;
  document.head.appendChild(style);
})();