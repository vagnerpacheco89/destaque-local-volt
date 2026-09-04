(() => {
  const section = document.querySelector('.about');
  if (!section || section.dataset.aboutPolished === 'true') return;

  const grid = section.querySelector('.about__grid');
  const image = section.querySelector('.about__image');
  const copy = section.querySelector('.about__copy');
  const eyebrow = copy?.querySelector('.eyebrow');
  const title = copy?.querySelector('#sobre-title');
  const paragraphs = copy ? [...copy.querySelectorAll(':scope > p:not(.eyebrow)')] : [];
  const proofs = copy?.querySelector('.about__proofs');

  section.dataset.aboutPolished = 'true';

  if (eyebrow) eyebrow.textContent = 'SOBRE MIM';
  if (title) title.textContent = 'Rafael Martins, eletricista em Palhoça';

  const bodyCopy = [
    'Rafael Martins atua desde 2017 com serviços elétricos em Palhoça e região, atendendo residências, pequenos comércios e demandas do dia a dia com manutenção, instalações e reparos elétricos.',
    'Ao longo do trabalho, busca entender primeiro o que realmente precisa ser resolvido, explicar a situação de forma simples e executar somente o que foi combinado com o cliente.',
    'Organização, cuidado com o local e atenção aos detalhes fazem parte da forma como conduz cada serviço, desde a avaliação inicial até a finalização.'
  ];

  paragraphs.forEach((paragraph, index) => {
    if (bodyCopy[index]) paragraph.textContent = bodyCopy[index];
    paragraph.classList.toggle('about__lead', index === 0);
  });

  if (proofs) {
    const labels = [
      ['PALHOÇA', 'Base de atendimento'],
      ['DESDE 2017', 'Atuação'],
      ['RESIDENCIAL', 'E pequenos comércios'],
      ['DIRETO', 'Contato com Rafael']
    ];

    proofs.innerHTML = '';
    labels.forEach(([strongText, smallText]) => {
      const item = document.createElement('span');
      item.className = 'about-proof';

      const strong = document.createElement('strong');
      strong.textContent = strongText;

      const small = document.createElement('small');
      small.textContent = smallText;

      item.append(strong, small);
      proofs.appendChild(item);
    });
  }

  if (image && !image.querySelector('.about__image-label')) {
    const label = document.createElement('div');
    label.className = 'about__image-label';
    label.innerHTML = '<strong>RAFAEL MARTINS</strong><span>ELETRICISTA EM PALHOÇA</span>';
    image.appendChild(label);
  }

  if (copy && !copy.querySelector('.about__action')) {
    const action = document.createElement('div');
    action.className = 'about__action';

    const button = document.createElement('button');
    button.className = 'btn btn--accent btn--large';
    button.type = 'button';
    button.setAttribute('data-demo-cta', '');
    button.textContent = 'FALAR DIRETAMENTE COM RAFAEL';

    const micro = document.createElement('p');
    micro.className = 'about__action-micro';
    micro.textContent = 'Descreva o serviço e envie fotos ou vídeos quando possível.';

    action.append(button, micro);
    copy.appendChild(action);
  }

  const style = document.createElement('style');
  style.textContent = `
    .about {
      position:relative;
      overflow:hidden;
      background:
        radial-gradient(760px 420px at 5% 16%, rgba(244,196,0,.045), transparent 68%),
        #090b0b !important;
      border-block:1px solid #1b1f1f !important;
    }

    .about::before {
      content:'';
      position:absolute;
      top:0;
      right:7%;
      width:180px;
      height:1px;
      background:linear-gradient(90deg, transparent, rgba(244,196,0,.72));
      pointer-events:none;
    }

    .about .about__grid {
      display:grid !important;
      grid-template-columns:minmax(360px,.82fr) minmax(0,1.18fr) !important;
      gap:72px !important;
      align-items:center !important;
    }

    .about .about__image {
      position:relative;
      min-height:610px !important;
      overflow:hidden;
      border:1px solid #363b3a !important;
      border-radius:10px !important;
      background:#0d1010 !important;
      box-shadow:0 24px 60px rgba(0,0,0,.28) !important;
    }

    .about .about__image::before {
      content:'';
      position:absolute;
      z-index:2;
      inset:0;
      background:linear-gradient(180deg, transparent 52%, rgba(5,6,6,.78) 100%);
      pointer-events:none;
    }

    .about .about__image::after {
      content:'' !important;
      position:absolute !important;
      z-index:3 !important;
      inset:18px 18px auto auto !important;
      width:46px !important;
      height:46px !important;
      border-top:2px solid var(--accent) !important;
      border-right:2px solid var(--accent) !important;
      border-left:0 !important;
      border-bottom:0 !important;
      border-radius:0 !important;
      background:none !important;
      transform:none !important;
      opacity:.95 !important;
    }

    .about .about__image img {
      width:100% !important;
      height:610px !important;
      min-height:610px !important;
      object-fit:cover !important;
      object-position:center top !important;
      filter:saturate(.82) contrast(1.07) brightness(.9) !important;
      transform:scale(1.01);
      transition:transform 350ms var(--ease), filter 350ms ease;
    }

    .about .about__image:hover img {
      transform:scale(1.035);
      filter:saturate(.92) contrast(1.07) brightness(.95) !important;
    }

    .about .about__image-label {
      position:absolute;
      z-index:4;
      left:22px;
      right:22px;
      bottom:20px;
      display:flex;
      align-items:end;
      justify-content:space-between;
      gap:18px;
      padding-top:16px;
      border-top:1px solid rgba(255,255,255,.25);
    }

    .about .about__image-label strong {
      color:#fff;
      font:800 1.7rem/.92 var(--font-display);
      letter-spacing:.01em;
    }

    .about .about__image-label span {
      color:var(--accent);
      font-size:.62rem;
      font-weight:900;
      letter-spacing:.12em;
      text-align:right;
    }

    .about .about__copy {
      max-width:780px;
    }

    .about .about__copy .eyebrow {
      margin-bottom:14px;
    }

    .about .about__copy h2 {
      max-width:780px !important;
      margin-bottom:22px !important;
      font-size:clamp(3rem,4.55vw,4.9rem) !important;
      line-height:.9 !important;
      text-transform:uppercase;
    }

    .about .about__copy > p:not(.eyebrow) {
      max-width:690px !important;
      margin:0 0 14px !important;
      color:#a9ada9 !important;
      font-size:.9rem !important;
      line-height:1.62 !important;
    }

    .about .about__copy > p.about__lead {
      margin-bottom:17px !important;
      color:#a9ada9 !important;
      font-size:1.02rem !important;
      line-height:1.58 !important;
    }

    .about .about__proofs {
      display:grid !important;
      grid-template-columns:repeat(4,minmax(0,1fr)) !important;
      margin:30px 0 0 !important;
      border:1px solid #343938 !important;
      border-radius:0 !important;
      background:#0b0d0d !important;
      overflow:hidden;
    }

    .about .about__proofs .about-proof {
      min-height:82px !important;
      padding:16px 15px !important;
      border:0 !important;
      border-right:1px solid #343938 !important;
      border-radius:0 !important;
      background:transparent !important;
      display:flex !important;
      flex-direction:column !important;
      align-items:flex-start !important;
      justify-content:center !important;
      gap:5px !important;
      color:inherit !important;
      text-transform:none !important;
    }

    .about .about__proofs .about-proof:last-child {
      border-right:0 !important;
    }

    .about .about__proofs .about-proof::before {
      display:none !important;
    }

    .about .about-proof strong {
      color:var(--accent);
      font:800 1.18rem/.95 var(--font-display);
      letter-spacing:.02em;
    }

    .about .about-proof small {
      color:#8e938e;
      font-size:.58rem;
      font-weight:800;
      line-height:1.2;
      letter-spacing:.07em;
      text-transform:uppercase;
    }

    .about .about__action {
      display:flex;
      align-items:center;
      gap:18px;
      margin-top:26px;
    }

    .about .about__action .btn {
      flex:0 0 auto;
      min-width:245px;
      text-transform:uppercase;
    }

    .about .about__action-micro {
      max-width:245px !important;
      margin:0 !important;
      color:#777c77 !important;
      font-size:.7rem !important;
      line-height:1.45 !important;
    }

    @media (max-width:980px) {
      .about .about__grid {
        grid-template-columns:.9fr 1.1fr !important;
        gap:42px !important;
      }
      .about .about__image,
      .about .about__image img {
        min-height:540px !important;
        height:540px !important;
      }
      .about .about__proofs {
        grid-template-columns:repeat(2,minmax(0,1fr)) !important;
      }
      .about .about__proofs .about-proof:nth-child(2) {
        border-right:0 !important;
      }
      .about .about__proofs .about-proof:nth-child(-n+2) {
        border-bottom:1px solid #343938 !important;
      }
    }

    @media (max-width:760px) {
      .about .about__grid {
        grid-template-columns:1fr !important;
        gap:34px !important;
      }
      .about .about__image {
        order:2;
        min-height:470px !important;
      }
      .about .about__image img {
        height:470px !important;
        min-height:470px !important;
      }
      .about .about__copy {
        order:1;
      }
      .about .about__copy h2 {
        font-size:clamp(2.7rem,13vw,4.25rem) !important;
      }
      .about .about__action {
        align-items:flex-start;
        flex-direction:column;
        gap:10px;
      }
    }

    @media (max-width:480px) {
      .about .about__image {
        min-height:420px !important;
      }
      .about .about__image img {
        height:420px !important;
        min-height:420px !important;
      }
      .about .about__image-label {
        left:16px;
        right:16px;
        bottom:16px;
      }
      .about .about__image-label strong {
        font-size:1.45rem;
      }
      .about .about__proofs {
        grid-template-columns:1fr 1fr !important;
      }
      .about .about__action .btn {
        width:100%;
        min-width:0;
      }
    }
  `;

  document.head.appendChild(style);
})();