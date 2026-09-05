(() => {
  const floatingCta = document.querySelector('.mobile-cta');
  if (floatingCta) floatingCta.remove();

  const diagnostic = document.querySelector('.diagnostic');
  const grid = diagnostic?.querySelector('.diagnostic__grid');
  const panel = diagnostic?.querySelector('.problem-panel');
  const cta = diagnostic?.querySelector('.diagnostic__cta') || diagnostic?.querySelector('.btn--accent');

  if (diagnostic && grid && panel && cta) {
    let row = grid.querySelector('.diagnostic__cta-row');

    if (!row) {
      row = document.createElement('div');
      row.className = 'diagnostic__cta-row';
      grid.appendChild(row);
    }

    if (cta.parentElement !== row) row.appendChild(cta);
    cta.textContent = 'SOLICITAR AVALIAÇÃO PELO WHATSAPP';
    cta.classList.add('diagnostic__cta');
  }

  const style = document.createElement('style');
  style.id = 'mobile-diagnostic-current-style';
  style.textContent = `
    .mobile-cta {
      display:none !important;
    }

    .diagnostic .diagnostic__cta-row {
      grid-column:1 / -1;
      display:flex;
      justify-content:center;
      width:100%;
      margin-top:8px;
      padding-top:30px;
      border-top:1px solid #272c2a;
    }

    .diagnostic .diagnostic__cta-row .diagnostic__cta {
      margin:0 !important;
      min-width:360px !important;
      min-height:54px !important;
      text-transform:uppercase;
    }

    @media (max-width:620px) {
      .diagnostic .diagnostic__cta-row {
        margin-top:4px;
        padding-top:26px;
      }

      .diagnostic .diagnostic__cta-row .diagnostic__cta {
        width:100% !important;
        min-width:0 !important;
      }
    }
  `;

  document.head.appendChild(style);
})();