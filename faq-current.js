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

    list.innerHTML = items.map((item, index) => `
      <details>
        <summary>
          <span class="faq__number">${String(index + 1).padStart(2, '0')}</span>
          <span class="faq__question">${item[0]}</span>
        </summary>
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
      margin-bottom:42px;
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
      position:relative;
      display:grid !important;
      grid-template-columns:repeat(5,minmax(0,1fr));
      gap:12px;
      width:100%;
      overflow:visible !important;
      border:0 !important;
    }

    .faq .faq__list::before { display:none !important; }

    .faq .faq__list details {
      position:relative;
      align-self:start;
      min-width:0;
      margin:0 !important;
      padding:0 !important;
      overflow:hidden;
      border:1px solid #303534 !important;
      border-radius:8px;
      background:linear-gradient(150deg,#101313 0%,#0b0d0d 100%) !important;
      transition:border-color 180ms ease, background 180ms ease, transform 180ms ease;
    }

    .faq .faq__list details:hover {
      border-color:#4a504d !important;
      background:#101212 !important;
    }

    .faq .faq__list details[open] {
      border-color:rgba(244,196,0,.52) !important;
      background:linear-gradient(155deg,rgba(244,196,0,.045),#0c0e0e 46%) !important;
      box-shadow:0 12px 30px rgba(0,0,0,.18);
    }

    .faq .faq__list summary {
      position:relative;
      display:grid;
      grid-template-columns:1fr 28px;
      grid-template-rows:auto 1fr;
      gap:10px 8px;
      align-items:start;
      min-height:132px;
      padding:18px 16px !important;
      color:#f3f4ef;
      cursor:pointer;
      list-style:none;
    }

    .faq .faq__list summary::-webkit-details-marker { display:none; }

    .faq .faq__number {
      grid-column:1;
      grid-row:1;
      color:#777d79;
      font-size:11px !important;
      font-weight:900;
      line-height:1;
      letter-spacing:.08em;
    }

    .faq .faq__question {
      grid-column:1 / -1;
      grid-row:2;
      padding-right:6px;
      color:#f3f4ef;
      font-size:16px !important;
      line-height:1.28;
      font-weight:750;
    }

    .faq .faq__list summary::after {
      content:'+';
      grid-column:2;
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

    .faq .faq__list details[open] .faq__number {
      color:var(--accent);
    }

    .faq .faq__list details[open] summary::after {
      content:'−';
      border-color:var(--accent);
      color:var(--accent);
      transform:rotate(180deg);
    }

    .faq .faq__list details > p {
      margin:0 !important;
      padding:0 16px 20px !important;
      color:#9ca29d !important;
      font-size:16px !important;
      line-height:1.55 !important;
    }

    .faq .faq__cta-wrap {
      grid-column:1;
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

    @media (max-width:1120px) {
      .faq .faq__list {
        grid-template-columns:repeat(3,minmax(0,1fr));
      }
    }

    @media (max-width:760px) {
      .faq .faq__intro {
        margin-bottom:32px;
      }

      .faq .faq__intro h2 {
        font-size:clamp(2.8rem,12vw,4rem);
      }

      .faq .faq__list {
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:10px;
      }

      .faq .faq__cta-wrap {
        align-items:flex-start;
        flex-direction:column;
      }
    }

    @media (max-width:520px) {
      .faq .faq__list {
        grid-template-columns:1fr;
      }

      .faq .faq__list summary {
        min-height:0;
        padding:16px 14px !important;
      }

      .faq .faq__list details > p {
        padding:0 14px 18px !important;
      }

      .faq .faq__cta {
        width:100%;
        min-width:0;
      }
    }
  `;

  document.head.appendChild(style);
})();