(() => {
  const section = document.querySelector('.faq');
  if (!section) return;

  const style = document.createElement('style');
  style.id = 'faq-controls-current-style';
  style.textContent = `
    .faq .faq__column summary::after {
      width:34px !important;
      height:34px !important;
      display:grid !important;
      place-items:center !important;
      justify-self:end !important;
      align-self:center !important;
      border:1px solid #3b413e !important;
      border-radius:6px !important;
      background:#111414 !important;
      color:#aeb3af !important;
      font-size:18px !important;
      font-weight:500 !important;
      line-height:1 !important;
      box-shadow:inset 0 0 0 1px rgba(255,255,255,.015);
      transform:none !important;
    }

    .faq .faq__column summary:hover::after {
      border-color:rgba(244,196,0,.55) !important;
      color:var(--accent) !important;
      background:rgba(244,196,0,.045) !important;
    }

    .faq .faq__column details[open] summary::after {
      content:'−' !important;
      border-color:var(--accent) !important;
      color:var(--accent) !important;
      background:rgba(244,196,0,.06) !important;
      box-shadow:0 0 14px rgba(244,196,0,.08), inset 0 0 0 1px rgba(244,196,0,.035);
      transform:none !important;
    }

    .faq .faq__cta-wrap {
      width:min(100%,520px) !important;
      margin:36px auto 0 !important;
      padding-top:24px !important;
      display:flex !important;
      flex-direction:column !important;
      align-items:center !important;
      justify-content:center !important;
      gap:14px !important;
      text-align:center !important;
      border-top:1px solid #303534 !important;
    }

    .faq .faq__cta-wrap p {
      margin:0 !important;
      text-align:center !important;
    }

    .faq .faq__cta {
      margin:0 auto !important;
    }

    @media (max-width:620px) {
      .faq .faq__column summary {
        grid-template-columns:30px minmax(0,1fr) 34px !important;
      }

      .faq .faq__cta-wrap {
        width:100% !important;
        max-width:none !important;
        align-items:center !important;
      }
    }
  `;

  document.head.appendChild(style);
})();