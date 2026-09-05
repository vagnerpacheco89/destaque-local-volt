(() => {
  const section = document.querySelector('.faq');
  if (!section || section.dataset.faqPolished === 'true') return;

  const grid = section.querySelector('.faq__grid');
  const intro = section.querySelector('.faq__intro');
  const eyebrow = intro?.querySelector('.eyebrow');
  const title = intro?.querySelector('#faq-title');
  const introText = intro?.querySelector(':scope > p:not(.eyebrow)');
  const list = section.querySelector('.faq__list');

  section.dataset.faqPolished = 'true';

  if (eyebrow) eyebrow.textContent = 'DÚVIDAS FREQUENTES';
  if (title) title.textContent = 'Respostas rápidas antes de chamar';
  if (introText) {
    introText.textContent = 'Veja as principais dúvidas sobre orçamento, atendimento e serviços elétricos em Palhoça e região.';
    introText.classList.add('section-intro');
  }

  if (list) {
    const items = [
      ['Como funciona o orçamento?', 'O primeiro contato é feito pelo WhatsApp. Quando possível, as informações e fotos enviadas ajudam na avaliação inicial. Se for necessária uma visita, o orçamento é apresentado antes da execução do serviço.'],
      ['Quais regiões são atendidas?', 'O atendimento tem base em Palhoça e também pode ser realizado por deslocamento em São José e Florianópolis continental, conforme disponibilidade.'],
      ['Quais serviços elétricos são realizados?', 'Manutenção e diagnóstico elétrico, quadros e disjuntores, tomadas e novos pontos, iluminação, chuveiros e circuitos dedicados, fiação, aterramento e dispositivos de proteção como DR e DPS.'],
      ['Atende residências e pequenos comércios?', 'Sim. O atendimento contempla residências e pequenos comércios, de acordo com o tipo e a complexidade do serviço.'],
      ['Atende urgências?', 'Sim, dentro do horário de atendimento e conforme disponibilidade. Não há promessa de atendimento imediato ou de chegada em um prazo fixo.'],
      ['O atendimento é 24 horas?', 'Não. O horário é de segunda a sexta, das 08:00 às 18:00, e aos sábados, das 08:00 às 13:00.'],
      ['O serviço tem garantia?', 'As condições de garantia dependem do tipo de serviço e são informadas no orçamento. Não existe um único prazo divulgado para todos os trabalhos.'],
      ['Emite nota fiscal?', 'Sim, mediante solicitação.'],
      ['Quais são as formas de pagamento?', 'Pix, dinheiro, cartão de débito e cartão de crédito. Condições de parcelamento podem variar conforme o valor do serviço.'],
      ['Como ficam os materiais do serviço?', 'Os materiais necessários são combinados antes da execução. Quando preciso, Rafael orienta o que será necessário para que tudo fique definido antes de começar.']
    ];

    list.innerHTML = items.map((item, index) => `
      <details${index === 0 ? ' open' : ''}>
        <summary><span class="faq__number">${String(index + 1).padStart(2, '0')}</span><span>${item[0]}</span></summary>
        <p>${item[1]}</p>
      </details>
    `).join('');

    [...list.querySelectorAll('details')].forEach((details) => {
      details.addEventListener('toggle', () => {
        if (!details.open) return;
        [...list.querySelectorAll('details[open]')].forEach((other) => {
          if (other !== details) other.open = false;
        });
      });
    });
  }

  if (intro && !intro.querySelector('.faq__cta-wrap')) {
    const ctaWrap = document.createElement('div');
    ctaWrap.className = 'faq__cta-wrap';
    ctaWrap.innerHTML = `
      <p>Ainda ficou alguma dúvida sobre o seu serviço?</p>
      <button class="btn btn--accent faq__cta" type="button" data-demo-cta>FALAR DIRETAMENTE COM RAFAEL</button>
    `;
    intro.appendChild(ctaWrap);
  }

  const style = document.createElement('style');
  style.id = 'faq-current-style';
  style.textContent = `
    .faq {
      position:relative;
      overflow:hidden;
      background:
        radial-gradient(700px 340px at 8% 12%, rgba(244,196,0,.035), transparent 72%),
        #090b0b !important;
      border-top:1px solid #1d2120;
    }

    .faq .faq__grid {
      display:grid !important;
      grid-template-columns:minmax(300px,.72fr) minmax(0,1.28fr) !important;
      gap:76px !important;
      align-items:start !important;
    }

    .faq .faq__intro {
      position:sticky;
      top:104px;
      max-width:430px;
    }

    .faq .faq__intro h2 {
      margin-bottom:18px;
      max-width:430px;
      font-size:clamp(3rem,4.2vw,4.35rem);
      line-height:.92;
    }

    .faq .faq__intro .section-intro {
      margin:0;
      max-width:410px;
      color:#969c97 !important;
      font-size:17px !important;
      line-height:1.58 !important;
    }

    .faq .faq__cta-wrap {
      margin-top:34px;
      padding-top:24px;
      border-top:1px solid #303534;
    }

    .faq .faq__cta-wrap p {
      margin:0 0 14px;
      color:#8d938e;
      font-size:14px !important;
      line-height:1.5;
    }

    .faq .faq__cta {
      min-width:260px;
      font-size:14px !important;
      text-transform:uppercase;
    }

    .faq .faq__list {
      position:relative;
      overflow:hidden;
      border-top:1px solid #3a403e;
      border-bottom:1px solid #3a403e;
    }

    .faq .faq__list::before {
      content:'';
      position:absolute;
      top:0;
      left:0;
      width:88px;
      height:1px;
      background:var(--accent);
      box-shadow:0 0 12px rgba(244,196,0,.25);
      pointer-events:none;
    }

    .faq .faq__list details {
      margin:0 !important;
      padding:0 !important;
      border:0 !important;
      border-bottom:1px solid #292e2c !important;
      background:transparent !important;
    }

    .faq .faq__list details:last-child {
      border-bottom:0 !important;
    }

    .faq .faq__list summary {
      position:relative;
      display:grid;
      grid-template-columns:42px minmax(0,1fr) 28px;
      gap:14px;
      align-items:center;
      min-height:74px;
      padding:17px 4px !important;
      color:#f3f4ef;
      font-size:16px !important;
      line-height:1.35;
      font-weight:750;
      cursor:pointer;
      list-style:none;
      transition:color 180ms ease, padding-left 180ms ease;
    }

    .faq .faq__list summary::-webkit-details-marker { display:none; }

    .faq .faq__list summary::after {
      content:'+';
      grid-column:3;
      grid-row:1;
      justify-self:end;
      width:26px;
      height:26px;
      display:grid;
      place-items:center;
      border:1px solid #454b48;
      border-radius:50%;
      color:#a5aaa6;
      font-size:17px;
      font-weight:500;
      line-height:1;
      transition:transform 180ms ease, border-color 180ms ease, color 180ms ease;
    }

    .faq .faq__list details[open] summary {
      color:#fff;
    }

    .faq .faq__list details[open] summary::after {
      content:'−';
      border-color:var(--accent);
      color:var(--accent);
      transform:rotate(180deg);
    }

    .faq .faq__number {
      color:#6f7571;
      font-size:11px !important;
      font-weight:900;
      letter-spacing:.06em;
    }

    .faq .faq__list details[open] .faq__number {
      color:var(--accent);
    }

    .faq .faq__list details > p {
      margin:0 !important;
      padding:0 50px 24px 56px !important;
      max-width:760px;
      color:#979d98 !important;
      font-size:16px !important;
      line-height:1.62 !important;
    }

    @media (max-width:980px) {
      .faq .faq__grid {
        grid-template-columns:1fr !important;
        gap:42px !important;
      }

      .faq .faq__intro {
        position:static;
        max-width:700px;
      }

      .faq .faq__intro h2,
      .faq .faq__intro .section-intro {
        max-width:680px;
      }

      .faq .faq__cta-wrap {
        max-width:430px;
      }
    }

    @media (max-width:620px) {
      .faq .faq__intro h2 {
        font-size:clamp(2.6rem,13vw,3.4rem);
      }

      .faq .faq__list summary {
        grid-template-columns:32px minmax(0,1fr) 28px;
        gap:10px;
        min-height:68px;
        padding:15px 0 !important;
      }

      .faq .faq__list details > p {
        padding:0 38px 22px 42px !important;
      }

      .faq .faq__cta {
        width:100%;
        min-width:0;
      }
    }
  `;

  document.head.appendChild(style);
})();