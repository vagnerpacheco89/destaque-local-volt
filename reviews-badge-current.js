(() => {
  const rating = document.querySelector('.reviews .rating-demo');
  if (!rating) return;

  const strong = rating.querySelector('strong');
  const span = rating.querySelector('span');

  if (strong && span && !rating.querySelector('.rating-score')) {
    const score = document.createElement('div');
    score.className = 'rating-score';
    strong.insertAdjacentElement('beforebegin', score);
    score.append(strong, span);
  }

  const style = document.createElement('style');
  style.textContent = `
    .reviews .rating-demo {
      min-width:188px !important;
      min-height:164px !important;
      padding:18px 20px 16px !important;
      justify-content:center !important;
      gap:0 !important;
    }

    .reviews .rating-demo::before {
      margin:0 0 10px !important;
      font-size:11px !important;
      letter-spacing:.16em !important;
    }

    .reviews .rating-demo .rating-score {
      display:flex;
      align-items:flex-end;
      justify-content:center;
      gap:7px;
      line-height:1;
    }

    .reviews .rating-demo .rating-score strong {
      margin:0 !important;
      font-size:4.05rem !important;
      line-height:.78 !important;
      letter-spacing:-.045em !important;
    }

    .reviews .rating-demo .rating-score span {
      margin:0 0 4px !important;
      font-size:.9rem !important;
      line-height:1 !important;
      font-weight:900 !important;
    }

    .reviews .rating-demo small {
      margin-top:11px !important;
      font-size:8px !important;
      line-height:1 !important;
    }

    @media (max-width:620px) {
      .reviews .rating-demo {
        min-height:150px !important;
      }
      .reviews .rating-demo .rating-score strong {
        font-size:3.55rem !important;
      }
    }
  `;

  document.head.appendChild(style);
})();