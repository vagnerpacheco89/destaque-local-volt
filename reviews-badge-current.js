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
    .reviews .reviews-head {
      align-items:center !important;
    }

    .reviews .rating-demo {
      min-width:202px !important;
      min-height:148px !important;
      padding:15px 22px 14px !important;
      justify-content:center !important;
      align-self:center !important;
      gap:0 !important;
    }

    .reviews .rating-demo::before {
      content:'NOTA' !important;
      margin:0 0 10px !important;
      color:var(--accent-ink) !important;
      font-size:11px !important;
      font-weight:900 !important;
      line-height:1 !important;
      letter-spacing:.18em !important;
    }

    .reviews .rating-demo::after {
      inset:7px !important;
    }

    .reviews .rating-demo .rating-score {
      display:flex;
      align-items:flex-end;
      justify-content:center;
      gap:7px;
      margin:0 0 13px;
      line-height:1;
    }

    .reviews .rating-demo .rating-score strong {
      margin:0 !important;
      font-size:3.8rem !important;
      line-height:.78 !important;
      letter-spacing:-.045em !important;
    }

    .reviews .rating-demo .rating-score span {
      margin:0 0 5px !important;
      font-size:.96rem !important;
      line-height:1 !important;
      font-weight:900 !important;
    }

    .reviews .rating-demo small {
      margin:0 !important;
      color:rgba(9,10,8,.82) !important;
      font-size:9px !important;
      font-weight:900 !important;
      line-height:1 !important;
      letter-spacing:.11em !important;
      white-space:nowrap;
    }

    @media (max-width:900px) {
      .reviews .reviews-head {
        align-items:center !important;
      }
    }

    @media (max-width:620px) {
      .reviews .reviews-head {
        align-items:stretch !important;
      }

      .reviews .rating-demo {
        min-height:142px !important;
        align-self:stretch !important;
      }

      .reviews .rating-demo .rating-score strong {
        font-size:3.5rem !important;
      }
    }
  `;

  document.head.appendChild(style);
})();