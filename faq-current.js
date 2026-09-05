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
  if (title) title.innerHTML = 'RESPOSTAS RÁPIDAS<br>ANTES DE CHAMAR';
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

    const renderItem = (item, index) => `
      <details>
        <summary>
          <span class="faq__number">${String(index + 1).padStart(2, '0')}</span>
          <span class="faq__question">${item[0]}</span>
        </summary>
        <p>${item[1]}</p>
      </details>
    `;

    list.innerHTML = `
      <div class="faq__column faq__column--left">
        ${items.slice(0, 5).map((item, index) => renderItem(item, index)).join('')}
      </div>
      <div class="faq__column faq__column--right">
        ${items.slice(5).map((item, index) => renderItem(item, index + 5)).join('')}
      </div>
    `;

    [...list.querySelectorAll('details')].forEach((details) => {
      details.addEventListener('toggle', () => {
        if (!details.open) return;
        [...list.querySelectorAll('details[open]')].forEach((other) => {
          if (other !== details) other.open = false;
        });
      });
    });
  }

  let ctaWrap = intro?.querySelector('.faq__cta-wrap');
  if (!ctaWrap && intro) {
    ctaWrap = document.createElement('div');
    ctaWrap.className = 'faq__cta-wrap';
    ctaWrap.innerHTML = `
      <p>Ainda ficou alguma dúvida sobre o seu serviço?</p>
      <button class="btn btn--accent faq__cta" type="button" data-demo-cta>FALAR DIRETAMENTE COM RAFAEL</button>
    `;
  }

  if (grid && ctaWrap) grid.appendChild(ctaWrap);

  const style = document.createElement('style');
  style.id = 'faq-current-style';
  style.textContent = `
    .faq {
      position:relative;
      overflow:hidden;
      background:
        radial-gradient(760px 360px at 12% 8%, rgba(244,196,0,.035), transparent 72%),
        #090b0b !important;
      border-top:1px solid #1d2120;
    }

    .faq .faq__grid {
      display:grid !important;
      grid-template-columns:1fr !important;
      gap:0 !important;
      align-items:start !important;
    }

    .faq .faq__intro {
      position:static !important;
      max-width:900px !important;
      margin-bottom:40px;
    }

    .faq .faq__intro h2 {
      max-width:900px !important;
      margin-bottom:18px;
      font-size:clamp(3.15rem,4.9vw,5.1rem);
      line-height:.9;
    }

    .faq .faq__intro .section-intro {
      max-width:700px !important;
      margin:0;
      color:#969c97 !important;
      font-size:17px !important;
      line-height:1.58 !important;
    }

    .faq .faq__list {
      display:grid !important;
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:36px;
      width:100%;
      overflow:visible !important;
      border:0 !important;
    }

    .faq .faq__list::before { display:none !important; }

    .faq .faq__column {
      position:relative;
      border-top:1px solid #3a403e;
      border-bottom:1px solid #3a403e;
    }

    .faq .faq__column::before {
      content:'';
      position:absolute;
      top:0;
      left:0;
      width:70px;
      height:1px;
      background:var(--accent);
      box-shadow:0 0 12px rgba(244,196,0,.22);
      pointer-events:none;
    }

    .faq .faq__column details {
      margin:0 !important;
      padding:0 !important;
      border:0 !important;
      border-bottom:1px solid #292e2c !important;
      background:transparent !important;
    }

    .faq .faq__column details:last-child {
      border-bottom:0 !important;
    }

    .faq .faq__column summary {
      position:relative;
      display:grid;
      grid-template-columns:34px minmax(0,1fr) 28px;
      gap:12px;
      align-items:center;
      min-height:72px;
      padding:16px 2px !important;
      color:#f3f4ef;
      cursor:pointer;
      list-style:none;
      transition:color 180ms ease, padding-left 180ms ease;
    }

    .faq .faq__column summary::-webkit-details-marker { display:none; }

    .faq .faq__column summary:hover .faq__question {
      color:#fff;
    }

    .faq .faq__number {
      color:#6f7571;
      font-size:11px !important;
      font-weight:900;
      line-height:1;
      letter-spacing:.06em;
    }

    .faq .faq__question {
      min-width:0;
      color:#f0f2ed;
      font-size:16px !important;
      line-height:1.32;
      font-weight:750;
      transition:color 180ms ease;
    }

    .faq .faq__column summary::after {
      content:'+';
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
      transition:transform 180ms ease, border-color 180ms ease, color 180ms ease, background 180ms ease;
    }

    .faq .faq__column details[open] summary {
      color:#fff;
    }

    .faq .faq__column details[open] .faq__number {
      color:var(--accent);
    }

    .faq .faq__column details[open] summary::after {
      content:'−';
      border-color:var(--accent);
      color:var(--accent);
      background:rgba(244,196,0,.035);
      transform:rotate(180deg);
    }

    .faq .faq__column details > p {
      margin:0 !important;
      padding:0 42px 22px 46px !important;
      max-width:680px;
      color:#979d98 !important;
      font-size:16px !important;
      line-height:1.62 !important;
    }

    .faq .faq__cta-wrap {
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:24px;
      margin-top:32px;
      padding-top:24px;
      border-top:1px solid #303534;
    }

    .faq .faq__cta-wrap p {
      margin:0;
      color:#8d938e;
      font-size:14px !important;
      line-height:1.5;
    }

    .faq .faq__cta {
      min-width:260px;
      font-size:14px !important;
      text-transform:uppercase;
    }

    @media (max-width:900px) {
      .faq .faq__list {
        grid-template-columns:1fr;
        gap:26px;
      }
    }

    @media (max-width:620px) {
      .faq .faq__intro {
        margin-bottom:32px;
      }

      .faq .faq__intro h2 {
        font-size:clamp(2.8rem,12vw,4rem);
      }

      .faq .faq__column summary {
        grid-template-columns:30px minmax(0,1fr) 28px;
        gap:10px;
        min-height:66px;
        padding:14px 0 !important;
      }

      .faq .faq__column details > p {
        padding:0 36px 20px 40px !important;
      }

      .faq .faq__cta-wrap {
        align-items:flex-start;
        flex-direction:column;
      }

      .faq .faq__cta {
        width:100%;
        min-width:0;
      }
    }
  `;

  document.head.appendChild(style);
})();