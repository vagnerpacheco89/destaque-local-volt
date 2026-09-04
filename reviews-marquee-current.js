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

  const makeCard = ({ text, name }) => {
    const card = document.createElement('blockquote');
    card.className = 'review-marquee-card';

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

    .reviews .review-marquee-row {
      position:relative;
      width:100%;
      overflow:hidden;
      padding:7px 0;
    }

    .reviews .review-marquee-row::before,
    .reviews .review-marquee-row::after {
      content:'';
      position:absolute;
      z-index:3;
      top:0;
      bottom:0;
      width:34px;
      pointer-events:none;
    }

    .reviews .review-marquee-row::before {
      left:0;
      background:linear-gradient(90deg, #050606 0%, rgba(5,6,6,.72) 42%, rgba(5,6,6,0) 100%);
    }

    .reviews .review-marquee-row::after {
      right:0;
      background:linear-gradient(270deg, #050606 0%, rgba(5,6,6,.72) 42%, rgba(5,6,6,0) 100%);
    }

    .reviews .review-marquee-track {
      display:flex;
      width:max-content;
      will-change:transform;
    }

    .reviews .review-marquee-group {
      display:flex;
      flex:0 0 auto;
      gap:16px;
      padding-right:16px;
    }

    .reviews .review-marquee-row--left .review-marquee-track {
      animation:volt-review-left 38s linear infinite;
    }

    .reviews .review-marquee-row--right .review-marquee-track {
      animation:volt-review-right 42s linear infinite;
    }

    .reviews .review-marquee-row:hover .review-marquee-track,
    .reviews .review-marquee-row:focus-within .review-marquee-track {
      animation-play-state:paused;
    }

    .reviews .review-marquee-card {
      position:relative;
      display:flex !important;
      flex-direction:column !important;
      flex:0 0 322px !important;
      width:322px !important;
      min-height:184px !important;
      margin:0 !important;
      padding:18px 18px 17px !important;
      border:1px solid #3a4040 !important;
      border-radius:12px !important;
      background:#111414 !important;
      box-shadow:
        inset 0 0 0 1px rgba(255,255,255,.018),
        0 12px 28px rgba(0,0,0,.30) !important;
      overflow:hidden;
      transition:transform 180ms var(--ease), border-color 180ms ease, box-shadow 180ms ease, background 180ms ease !important;
    }

    .reviews .review-marquee-card:hover {
      transform:translateY(-3px);
      border-color:rgba(244,196,0,.72) !important;
      background:#141717 !important;
      box-shadow:
        inset 0 0 0 1px rgba(244,196,0,.045),
        0 16px 34px rgba(0,0,0,.34),
        0 0 22px rgba(244,196,0,.065) !important;
    }

    .reviews .review-marquee-mark {
      display:block;
      width:auto;
      height:22px;
      margin:0 0 8px;
      color:var(--accent);
      font:900 2.2rem/.74 var(--font-display);
    }

    .reviews .review-marquee-message {
      display:-webkit-box;
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

    .reviews .review-marquee-stars {
      margin:0 0 12px;
      color:var(--accent);
      font-size:.82rem;
      line-height:1;
      letter-spacing:.065em;
      white-space:nowrap;
    }

    .reviews .review-marquee-person {
      display:flex !important;
      align-items:center !important;
      gap:10px !important;
      margin-top:auto !important;
      padding:0 !important;
      border:0 !important;
    }

    .reviews .review-marquee-avatar {
      display:inline-flex;
      align-items:center;
      justify-content:center;
      flex:0 0 36px;
      width:36px;
      height:36px;
      border:1.5px solid var(--accent);
      border-radius:50%;
      background:#0a0c0c;
      color:var(--accent);
      font-size:.66rem;
      font-weight:950;
      letter-spacing:.02em;
      box-shadow:0 0 0 2px rgba(244,196,0,.025);
    }

    .reviews .review-marquee-identity {
      display:flex;
      flex-direction:column;
      gap:2px;
      min-width:0;
    }

    .reviews .review-marquee-identity strong {
      color:#fff;
      font-size:.79rem;
      font-weight:900;
      line-height:1.05;
    }

    .reviews .review-marquee-identity small {
      color:#9ea39e;
      font-size:.57rem;
      font-weight:800;
      line-height:1;
      letter-spacing:.1em;
      text-transform:uppercase;
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
      .reviews .review-marquee-card {
        flex-basis:306px !important;
        width:306px !important;
        min-height:178px !important;
      }
      .reviews .review-marquee-row::before,
      .reviews .review-marquee-row::after {
        width:26px;
      }
    }

    @media (max-width:620px) {
      .reviews .reviews-grid.reviews-marquee {
        gap:12px !important;
      }
      .reviews .review-marquee-group {
        gap:12px;
        padding-right:12px;
      }
      .reviews .review-marquee-card {
        flex-basis:282px !important;
        width:282px !important;
        min-height:170px !important;
        padding:16px 16px 15px !important;
        border-radius:11px !important;
      }
      .reviews .review-marquee-message {
        font-size:.86rem !important;
      }
      .reviews .review-marquee-row--left .review-marquee-track {
        animation-duration:32s;
      }
      .reviews .review-marquee-row--right .review-marquee-track {
        animation-duration:35s;
      }
      .reviews .review-marquee-row::before,
      .reviews .review-marquee-row::after {
        width:14px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .reviews .review-marquee-track {
        animation:none !important;
        transform:none !important;
      }
      .reviews .review-marquee-row {
        overflow-x:auto;
        scrollbar-width:none;
      }
      .reviews .review-marquee-row::-webkit-scrollbar { display:none; }
      .reviews .review-marquee-group[aria-hidden='true'] { display:none; }
    }
  `;

  document.head.appendChild(style);
})();