(() => {
  const section = document.querySelector('.reviews');
  const grid = section?.querySelector('.reviews-grid');
  if (!section || !grid || grid.dataset.marqueeReady === 'true') return;

  const source = [...grid.querySelectorAll('blockquote')].map((quote) => ({
    text: quote.querySelector('p')?.textContent?.trim() || '',
    name: quote.querySelector('footer')?.textContent?.trim() || ''
  })).filter((item) => item.text && item.name);

  if (source.length < 6) return;

  const getInitials = (name) => name
    .replace(/\./g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

  const forceCardBox = (card) => {
    card.style.setProperty('display', 'flex', 'important');
    card.style.setProperty('flex-direction', 'column', 'important');
    card.style.setProperty('flex', '0 0 322px', 'important');
    card.style.setProperty('width', '322px', 'important');
    card.style.setProperty('min-height', '184px', 'important');
    card.style.setProperty('margin', '0', 'important');
    card.style.setProperty('padding', '18px 18px 17px', 'important');
    card.style.setProperty('border', '1px solid #3d4443', 'important');
    card.style.setProperty('border-radius', '12px', 'important');
    card.style.setProperty('background-color', '#141717', 'important');
    card.style.setProperty('background-image', 'linear-gradient(145deg,#171a1a 0%,#111414 100%)', 'important');
    card.style.setProperty('box-shadow', 'inset 0 1px 0 rgba(255,255,255,.035), 0 12px 28px rgba(0,0,0,.34)', 'important');
    card.style.setProperty('overflow', 'hidden', 'important');
  };

  const makeCard = ({ text, name }) => {
    const card = document.createElement('article');
    card.className = 'review-marquee-card';
    forceCardBox(card);

    const mark = document.createElement('span');
    mark.className = 'review-marquee-mark';
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = '“';

    const copy = document.createElement('p');
    copy.className = 'review-marquee-message';
    copy.textContent = text.replace(/^“|”$/g, '');

    const stars = document.createElement('div');
    stars.className = 'review-marquee-stars';
    stars.setAttribute('aria-label', '5 de 5 estrelas');
    stars.textContent = '★★★★★';

    const footer = document.createElement('footer');
    footer.className = 'review-marquee-person';

    const avatar = document.createElement('span');
    avatar.className = 'review-marquee-avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = getInitials(name);

    const identity = document.createElement('span');
    identity.className = 'review-marquee-identity';

    const personName = document.createElement('strong');
    personName.textContent = name;

    const personMeta = document.createElement('small');
    personMeta.textContent = 'Cliente';

    identity.append(personName, personMeta);
    footer.append(avatar, identity);
    card.append(mark, copy, stars, footer);
    return card;
  };

  const makeRow = (items, direction) => {
    const row = document.createElement('div');
    row.className = `review-marquee-row review-marquee-row--${direction}`;

    const track = document.createElement('div');
    track.className = 'review-marquee-track';

    for (let copyIndex = 0; copyIndex < 2; copyIndex += 1) {
      const group = document.createElement('div');
      group.className = 'review-marquee-group';
      group.setAttribute('aria-hidden', copyIndex === 1 ? 'true' : 'false');
      items.forEach((item) => group.appendChild(makeCard(item)));
      track.appendChild(group);
    }

    row.appendChild(track);
    return row;
  };

  grid.innerHTML = '';
  grid.classList.add('reviews-marquee');
  grid.dataset.marqueeReady = 'true';
  grid.append(
    makeRow(source.slice(0, 3), 'left'),
    makeRow(source.slice(3, 6), 'right')
  );

  const style = document.createElement('style');
  style.textContent = `
    .reviews .reviews-grid.reviews-marquee {
      display:flex !important;
      flex-direction:column !important;
      gap:16px !important;
      width:100% !important;
      margin-top:10px !important;
      padding:6px 0 !important;
      border:0 !important;
      background:transparent !important;
      overflow:visible !important;
    }

    .reviews .reviews-grid.reviews-marquee .review-marquee-row {
      position:relative;
      width:100%;
      overflow:hidden;
      padding:7px 0;
    }

    .reviews .reviews-grid.reviews-marquee .review-marquee-row::before,
    .reviews .reviews-grid.reviews-marquee .review-marquee-row::after {
      content:'';
      position:absolute;
      z-index:3;
      top:0;
      bottom:0;
      width:28px;
      pointer-events:none;
    }

    .reviews .reviews-grid.reviews-marquee .review-marquee-row::before {
      left:0;
      background:linear-gradient(90deg,#050606 0%,rgba(5,6,6,.68) 45%,rgba(5,6,6,0) 100%);
    }

    .reviews .reviews-grid.reviews-marquee .review-marquee-row::after {
      right:0;
      background:linear-gradient(270deg,#050606 0%,rgba(5,6,6,.68) 45%,rgba(5,6,6,0) 100%);
    }

    .reviews .reviews-grid.reviews-marquee .review-marquee-track {
      display:flex !important;
      width:max-content !important;
      will-change:transform;
    }

    .reviews .reviews-grid.reviews-marquee .review-marquee-group {
      display:flex !important;
      flex:0 0 auto !important;
      gap:16px !important;
      padding-right:16px !important;
    }

    .reviews .reviews-grid.reviews-marquee .review-marquee-row--left .review-marquee-track {
      animation:volt-review-left 38s linear infinite;
    }

    .reviews .reviews-grid.reviews-marquee .review-marquee-row--right .review-marquee-track {
      animation:volt-review-right 42s linear infinite;
    }

    .reviews .reviews-grid.reviews-marquee .review-marquee-row:hover .review-marquee-track,
    .reviews .reviews-grid.reviews-marquee .review-marquee-row:focus-within .review-marquee-track {
      animation-play-state:paused;
    }

    .reviews .reviews-grid.reviews-marquee article.review-marquee-card {
      position:relative !important;
      box-sizing:border-box !important;
      isolation:isolate;
      transition:transform 180ms var(--ease), border-color 180ms ease, box-shadow 180ms ease, background 180ms ease !important;
    }

    .reviews .reviews-grid.reviews-marquee article.review-marquee-card:hover {
      transform:translateY(-3px);
      border-color:rgba(244,196,0,.72) !important;
      background:#171a1a !important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.05),0 16px 34px rgba(0,0,0,.38),0 0 20px rgba(244,196,0,.06) !important;
    }

    .reviews .reviews-grid.reviews-marquee .review-marquee-mark {
      display:block !important;
      height:22px !important;
      margin:0 0 8px !important;
      color:var(--accent) !important;
      font:900 2.2rem/.74 var(--font-display) !important;
    }

    .reviews .reviews-grid.reviews-marquee .review-marquee-message {
      display:-webkit-box !important;
      -webkit-box-orient:vertical;
      -webkit-line-clamp:3;
      overflow:hidden;
      margin:0 0 10px !important;
      color:#f4f5f0 !important;
      font-size:.91rem !important;
      font-weight:760 !important;
      line-height:1.34 !important;
      letter-spacing:-.012em !important;
    }

    .reviews .reviews-grid.reviews-marquee .review-marquee-stars {
      margin:0 0 12px !important;
      color:var(--accent) !important;
      font-size:.82rem !important;
      line-height:1 !important;
      letter-spacing:.065em !important;
      white-space:nowrap;
    }

    .reviews .reviews-grid.reviews-marquee .review-marquee-person {
      display:flex !important;
      align-items:center !important;
      gap:10px !important;
      margin-top:auto !important;
      padding:0 !important;
      border:0 !important;
      background:transparent !important;
    }

    .reviews .reviews-grid.reviews-marquee .review-marquee-avatar {
      display:inline-flex !important;
      align-items:center !important;
      justify-content:center !important;
      flex:0 0 36px !important;
      width:36px !important;
      height:36px !important;
      border:1.5px solid var(--accent) !important;
      border-radius:50% !important;
      background:#0a0c0c !important;
      color:var(--accent) !important;
      font-size:.66rem !important;
      font-weight:950 !important;
    }

    .reviews .reviews-grid.reviews-marquee .review-marquee-identity {
      display:flex !important;
      flex-direction:column !important;
      gap:2px !important;
    }

    .reviews .reviews-grid.reviews-marquee .review-marquee-identity strong {
      color:#fff !important;
      font-size:.79rem !important;
      font-weight:900 !important;
      line-height:1.05 !important;
    }

    .reviews .reviews-grid.reviews-marquee .review-marquee-identity small {
      color:#9ea39e !important;
      font-size:.57rem !important;
      font-weight:800 !important;
      line-height:1 !important;
      letter-spacing:.1em !important;
      text-transform:uppercase !important;
    }

    @keyframes volt-review-left {
      from { transform:translate3d(0,0,0); }
      to { transform:translate3d(-50%,0,0); }
    }

    @keyframes volt-review-right {
      from { transform:translate3d(-50%,0,0); }
      to { transform:translate3d(0,0,0); }
    }

    @media (max-width:900px) {
      .reviews .reviews-grid.reviews-marquee article.review-marquee-card {
        flex-basis:306px !important;
        width:306px !important;
        min-height:178px !important;
      }
    }

    @media (max-width:620px) {
      .reviews .reviews-grid.reviews-marquee {
        gap:12px !important;
      }
      .reviews .reviews-grid.reviews-marquee .review-marquee-group {
        gap:12px !important;
        padding-right:12px !important;
      }
      .reviews .reviews-grid.reviews-marquee article.review-marquee-card {
        flex-basis:282px !important;
        width:282px !important;
        min-height:170px !important;
        padding:16px 16px 15px !important;
      }
      .reviews .reviews-grid.reviews-marquee .review-marquee-message {
        font-size:.86rem !important;
      }
      .reviews .reviews-grid.reviews-marquee .review-marquee-row--left .review-marquee-track { animation-duration:32s; }
      .reviews .reviews-grid.reviews-marquee .review-marquee-row--right .review-marquee-track { animation-duration:35s; }
    }

    @media (prefers-reduced-motion: reduce) {
      .reviews .reviews-grid.reviews-marquee .review-marquee-track {
        animation:none !important;
        transform:none !important;
      }
      .reviews .reviews-grid.reviews-marquee .review-marquee-row {
        overflow-x:auto;
        scrollbar-width:none;
      }
      .reviews .reviews-grid.reviews-marquee .review-marquee-row::-webkit-scrollbar { display:none; }
      .reviews .reviews-grid.reviews-marquee .review-marquee-group[aria-hidden='true'] { display:none !important; }
    }
  `;

  document.head.appendChild(style);
})();