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
    card.append(mark, copy, footer);
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
      margin-top:8px !important;
      padding:4px 0 !important;
      border:0 !important;
      background:transparent !important;
      overflow:visible !important;
    }

    .reviews .review-marquee-row {
      position:relative;
      width:100%;
      overflow:hidden;
      padding:2px 0 4px;
    }

    .reviews .review-marquee-row::before,
    .reviews .review-marquee-row::after {
      content:'';
      position:absolute;
      z-index:3;
      top:0;
      bottom:0;
      width:46px;
      pointer-events:none;
    }

    .reviews .review-marquee-row::before {
      left:0;
      background:linear-gradient(90deg, #050606 0%, rgba(5,6,6,.78) 38%, rgba(5,6,6,0) 100%);
    }

    .reviews .review-marquee-row::after {
      right:0;
      background:linear-gradient(270deg, #050606 0%, rgba(5,6,6,.78) 38%, rgba(5,6,6,0) 100%);
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
      flex:0 0 382px !important;
      width:382px !important;
      min-height:176px !important;
      margin:0 !important;
      padding:22px 22px 19px !important;
      border:1px solid #3a403f !important;
      border-radius:4px !important;
      background:
        radial-gradient(280px 120px at 12% 0%, rgba(244,196,0,.055), transparent 68%),
        linear-gradient(180deg, #111414 0%, #0c0f0f 100%) !important;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,.025),
        0 12px 28px rgba(0,0,0,.18) !important;
      overflow:hidden;
      transition:transform 180ms var(--ease), border-color 180ms ease, background 180ms ease, box-shadow 180ms ease !important;
    }

    .reviews .review-marquee-card::after {
      content:'';
      position:absolute;
      left:0;
      right:0;
      bottom:0;
      height:2px;
      background:var(--accent);
      transform:scaleX(.22);
      transform-origin:left center;
      opacity:.74;
      transition:transform 180ms var(--ease), opacity 180ms ease;
    }

    .reviews .review-marquee-card:hover {
      transform:translateY(-3px);
      border-color:#72651b !important;
      background:
        radial-gradient(300px 130px at 12% 0%, rgba(244,196,0,.085), transparent 70%),
        linear-gradient(180deg, #141717 0%, #0e1111 100%) !important;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,.035),
        0 16px 34px rgba(0,0,0,.26) !important;
    }

    .reviews .review-marquee-card:hover::after {
      transform:scaleX(1);
      opacity:1;
    }

    .reviews .review-marquee-mark {
      display:flex;
      align-items:center;
      justify-content:center;
      width:34px;
      height:30px;
      margin:0 0 14px;
      border:1px solid rgba(244,196,0,.52);
      background:rgba(244,196,0,.08);
      color:var(--accent);
      font:800 2.05rem/.72 var(--font-display);
    }

    .reviews .review-marquee-message {
      display:-webkit-box;
      -webkit-box-orient:vertical;
      -webkit-line-clamp:3;
      overflow:hidden;
      margin:0 0 20px !important;
      color:#f2f3ee !important;
      font-size:1rem !important;
      font-weight:620 !important;
      line-height:1.42 !important;
      letter-spacing:-.012em !important;
    }

    .reviews .review-marquee-person {
      display:flex !important;
      align-items:center !important;
      gap:11px !important;
      margin-top:auto !important;
      padding-top:15px !important;
      border-top:1px solid #292e2d !important;
    }

    .reviews .review-marquee-avatar {
      display:inline-flex;
      align-items:center;
      justify-content:center;
      flex:0 0 36px;
      width:36px;
      height:36px;
      border:1px solid #e1b900;
      border-radius:50%;
      background:var(--accent);
      color:var(--accent-ink);
      font-size:.72rem;
      font-weight:950;
      letter-spacing:.02em;
      box-shadow:0 0 16px rgba(244,196,0,.12);
    }

    .reviews .review-marquee-identity {
      display:flex;
      flex-direction:column;
      gap:3px;
      min-width:0;
    }

    .reviews .review-marquee-identity strong {
      color:#fff;
      font-size:.8rem;
      font-weight:850;
      line-height:1.05;
    }

    .reviews .review-marquee-identity small {
      color:#8f9590;
      font-size:.62rem;
      font-weight:750;
      line-height:1;
      letter-spacing:.09em;
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
        flex-basis:330px !important;
        width:330px !important;
        min-height:170px !important;
      }
      .reviews .review-marquee-row::before,
      .reviews .review-marquee-row::after {
        width:32px;
      }
    }

    @media (max-width:620px) {
      .reviews .reviews-grid.reviews-marquee {
        gap:11px !important;
      }
      .reviews .review-marquee-group {
        gap:11px;
        padding-right:11px;
      }
      .reviews .review-marquee-card {
        flex-basis:292px !important;
        width:292px !important;
        min-height:164px !important;
        padding:19px 18px 17px !important;
      }
      .reviews .review-marquee-message {
        font-size:.92rem !important;
      }
      .reviews .review-marquee-avatar {
        flex-basis:33px;
        width:33px;
        height:33px;
      }
      .reviews .review-marquee-row--left .review-marquee-track {
        animation-duration:32s;
      }
      .reviews .review-marquee-row--right .review-marquee-track {
        animation-duration:35s;
      }
      .reviews .review-marquee-row::before,
      .reviews .review-marquee-row::after {
        width:18px;
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