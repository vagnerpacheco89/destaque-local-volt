(() => {
  const rating = document.querySelector('.reviews .rating-demo');
  if (!rating) return;

  const strong = rating.querySelector('strong');
  const span = rating.querySelector('span');
  const small = rating.querySelector('small');

  if (strong && span && !rating.querySelector('.rating-score')) {
    const score = document.createElement('div');
    score.className = 'rating-score';
    strong.insertAdjacentElement('beforebegin', score);
    score.append(strong, span);
  }

  if (small) small.textContent = '38 AVALIAÇÕES NO GOOGLE';

  const style = document.createElement('style');
  style.textContent = `
    .reviews .rating-demo {
      min-width:198px !important;
      min-height:142px !important;
      padding:14px 20px 13px !important;
      justify-content:center !important;
      gap:0 !important;
    }

    .reviews .rating-demo::before {
      content:'NOTA' !important;
      margin:0 0 8px !important;
      color:var(--accent-ink) !important;
      font-size:9px !important;
      font-weight:900 !important;
      line-height:1 !important;
      letter-spacing:.16em !important;
    }

    .reviews .rating-demo::after {
      inset:7px !important;
    }

    .reviews .rating-demo .rating-score {
      display:flex;
      align-items:flex-end;
      justify-content:center;
      gap:6px;
      line-height:1;
    }

    .reviews .rating-demo .rating-score strong {
      margin:0 !important;
      font-size:3.72rem !important;
      line-height:.78 !important;
      letter-spacing:-.045em !important;
    }

    .reviews .rating-demo .rating-score span {
      margin:0 0 4px !important;
      font-size:.82rem !important;
      line-height:1 !important;
      font-weight:900 !important;
    }

    .reviews .rating-demo small {
      margin-top:9px !important;
      font-size:7.5px !important;
      line-height:1 !important;
      letter-spacing:.105em !important;
      white-space:nowrap;
    }

    @media (max-width:620px) {
      .reviews .rating-demo {
        min-height:136px !important;
      }

      .reviews .rating-demo .rating-score strong {
        font-size:3.4rem !important;
      }
    }
  `;

  document.head.appendChild(style);
})();