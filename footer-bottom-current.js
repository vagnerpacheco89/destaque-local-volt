(() => {
  const footer = document.querySelector('.site-footer');
  const demo = footer?.querySelector('.footer-demo');
  const center = demo?.querySelector('.footer-demo__center');
  if (!demo || !center || demo.dataset.bottomPolished === 'true') return;

  demo.dataset.bottomPolished = 'true';
  center.classList.add('footer-demo__badge');

  const parts = [...center.querySelectorAll('span')];
  if (parts[0]) parts[0].classList.add('footer-demo__copyright');
  if (parts[1]) {
    parts[1].classList.remove('footer-demo__highlight');
    parts[1].classList.add('footer-demo__model');
  }

  const style = document.createElement('style');
  style.id = 'footer-bottom-current-style';
  style.textContent = `
    .site-footer .footer-demo__badge {
      display:flex !important;
      align-items:center !important;
      justify-content:center !important;
      gap:0 !important;
      min-height:38px;
      padding:7px 14px !important;
      border:2px solid var(--accent) !important;
      border-radius:5px !important;
      background:#020303 !important;
      box-shadow:0 0 0 1px rgba(244,196,0,.04), 0 0 16px rgba(244,196,0,.035);
      overflow:hidden;
    }

    .site-footer .footer-demo__copyright,
    .site-footer .footer-demo__model {
      display:inline-flex !important;
      align-items:center;
      min-height:20px;
      padding:0 12px;
      background:transparent !important;
      font-size:9px !important;
      font-weight:850 !important;
      line-height:1.2 !important;
      letter-spacing:.065em !important;
      white-space:nowrap;
    }

    .site-footer .footer-demo__copyright {
      color:#858b86 !important;
      border-right:1px solid rgba(244,196,0,.32);
    }

    .site-footer .footer-demo__model {
      color:var(--accent) !important;
    }

    @media (max-width:860px) {
      .site-footer .footer-demo__badge {
        width:min(100%,520px);
        flex-wrap:wrap;
        gap:5px 0 !important;
        padding:8px 10px !important;
      }

      .site-footer .footer-demo__copyright,
      .site-footer .footer-demo__model {
        justify-content:center;
        white-space:normal;
        text-align:center;
      }

      .site-footer .footer-demo__copyright {
        width:100%;
        border-right:0;
        border-bottom:1px solid rgba(244,196,0,.24);
        padding-bottom:5px;
      }

      .site-footer .footer-demo__model {
        width:100%;
        padding-top:3px;
      }
    }

    @media (max-width:480px) {
      .site-footer .footer-demo__badge {
        width:100%;
        border-width:2px !important;
        border-radius:5px !important;
      }
    }
  `;

  document.head.appendChild(style);
})();