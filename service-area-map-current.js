(() => {
  const section = document.querySelector('.service-area');
  const map = section?.querySelector('.service-area__map');
  if (!section || !map) return;

  map.querySelector('.service-area__map-pin')?.remove();

  const style = document.createElement('style');
  style.id = 'service-area-map-current-style';
  style.textContent = `
    .service-area .service-area__map {
      position:relative;
      overflow:hidden;
      border:1px solid rgba(244,196,0,.58) !important;
      border-radius:10px !important;
      background:
        radial-gradient(520px 150px at 50% 0%, rgba(244,196,0,.11), transparent 72%),
        #090b0b !important;
      box-shadow:
        0 0 0 1px rgba(244,196,0,.08),
        0 0 34px rgba(244,196,0,.10),
        0 24px 58px rgba(0,0,0,.28) !important;
    }

    .service-area .service-area__map::before {
      content:'';
      position:absolute;
      z-index:2;
      left:12%;
      right:12%;
      top:0;
      height:1px;
      background:var(--accent);
      box-shadow:0 0 14px rgba(244,196,0,.58);
      pointer-events:none;
    }

    .service-area .service-area__map-head {
      position:relative;
      min-height:78px !important;
      display:flex !important;
      align-items:center !important;
      justify-content:center !important;
      padding:17px 24px !important;
      text-align:center;
      border-bottom:1px solid rgba(244,196,0,.28) !important;
      background:
        radial-gradient(280px 100px at 50% 0%, rgba(244,196,0,.14), transparent 72%),
        linear-gradient(180deg, rgba(244,196,0,.035), rgba(10,12,12,.98)) !important;
    }

    .service-area .service-area__map-head > div {
      display:flex !important;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      gap:6px !important;
      text-align:center;
    }

    .service-area .service-area__map-kicker {
      color:var(--accent) !important;
      letter-spacing:.14em !important;
    }

    .service-area .service-area__map-head strong {
      text-align:center;
      letter-spacing:.025em !important;
    }

    .service-area .service-area__map-frame {
      position:relative;
      background:#0a0c0c !important;
    }

    .service-area .service-area__map-frame::before {
      content:'';
      position:absolute;
      z-index:1;
      inset:0;
      pointer-events:none;
      background:linear-gradient(180deg, rgba(244,196,0,.045) 0%, transparent 18%);
    }

    .service-area .service-area__map-frame iframe {
      filter:grayscale(.76) saturate(.78) contrast(1.05) brightness(.88) !important;
    }

    @media (max-width:620px) {
      .service-area .service-area__map-head {
        min-height:70px !important;
        padding:14px 18px !important;
      }
    }
  `;

  document.head.appendChild(style);
})();