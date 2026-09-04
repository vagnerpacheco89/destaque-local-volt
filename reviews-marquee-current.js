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
      gap:18px !important;
      width:100% !important;
      margin-top:10px !important;
      padding:5px 0 !important;
      border:0 !important;
      background:transparent !important;
      overflow:visible !important;
    }

    .reviews .review-marquee-row {
      position:relative;
      width:100%;
      overflow:hidden;
      padding:5px 0 7px;
    }

    .reviews .review-marquee-row::before,
    .reviews .review-marquee-row::after {
      content:'';
      position:absolute;
      z-index:3;
      top:0;
      bottom:0;
      width:44px;
      pointer-events:none;
    }

    .reviews .review-marquee-row::before {
      left:0;
      background:linear-gradient(90deg, #050606 0%, rgba(5,6,6,.76) 40%, rgba(5,6,6,0) 100%);
    }

    .reviews .review-marquee-row::after {
      right:0;
      background:linear-gradient(270deg, #050606 0%, rgba(5,6,6,.76) 40%, rgba(5,6,6,0) 100%);
    }

    .reviews .review-marquee-track {
      display:flex;
      width:max-content;
      will-change:transform;
    }

    .reviews .review-marquee-group {
      display:flex;
      flex:0 0 auto;
      gap:18px;
      padding-right:18px;
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
      flex:0 0 354px !important;
      width:354px !important;
      min-height:168px !important;
      margin:0 !important;
      padding:20px 21px 18px !important;
      border:1px solid rgba(244,196,0,.34) !important;
      border-radius:20px !important;
      background:
        radial-gradient(250px 135px at 0% 0%, rgba(244,196,0,.105), transparent 68%),
        linear-gradient(145deg, #171919 0%, #101313 54%, #0d1010 100%) !important;
      box-shadow:
        0 0 0 1px rgba(255,255,255,.025) inset,
        0 10px 26px rgba(0,0,0,.26),
        0 0 24px rgba(244,196,0,.035) !important;
      overflow:hidden;
      isolation:isolate;
      transition:transform 180ms var(--ease), border-color 180ms ease, background 180ms ease, box-shadow 180ms ease !important;
    }

    .reviews .review-marquee-card::before {
      content:'';
      position:absolute;
      z-index:-1;
      left:-48px;
      top:-58px;
      width:145px;
      height:145px;
      border:1px solid rgba(244,196,0,.12);
      border-radius:50%;
      background:rgba(244,196,0,.025);
      pointer-events:none;
    }

    .reviews .review-marquee-card::after {
      content:'';
      position:absolute;
      left:22px;
      bottom:0;
      width:72px;
      height:3px;
      border-radius:999px 999px 0 0;
      background:var(--accent);
      box-shadow:0 0 14px rgba(244,196,0,.23);
      opacity:.92;
      transition:width 180ms var(--ease), opacity 180ms ease;
    }

    .reviews .review-marquee-card:hover {
      transform:translateY(-4px);
      border-color:rgba(244,196,0,.72) !important;
      background:
        radial-gradient(280px 145px at 0% 0%, rgba(244,196,0,.16), transparent 70%),
        linear-gradient(145deg, #1a1d1c 0%, #121515 55%, #0e1111 100%) !important;
      box-shadow:
        0 0 0 1px rgba(255,255,255,.035) inset,
        0 16px 34px rgba(0,0,0,.34),
        0 0 30px rgba(244,196,0,.075) !important;
    }

    .reviews .review-marquee-card:hover::after {
      width:118px;
      opacity:1;
    }

    .reviews .review-marquee-mark {
      display:flex;
      align-items:center;
      justify-content:center;
      width:36px;
      height:32px;
      margin:0 0 13px;
      border:1px solid rgba(244,196,0,.72);
      border-radius:10px;
      background:var(--accent);
      color:var(--accent-ink);
      font:900 2.05rem/.72 var(--font-display);
      box-shadow:0 0 18px rgba(244,196,0,.11);
    }

    .reviews .review-marquee-message {
      display:-webkit-box;
      -webkit-box-orient:vertical;
      -webkit-line-clamp:3;
      overflow:hidden;
      margin:0 0 18px !important;
      color:#f7f7f2 !important;
      font-size:.98rem !important;
      font-weight:660 !important;
      line-height:1.43 !important;
      letter-spacing:-.012em !important;
    }

    .reviews .review-marquee-person {
      display:flex !important;
      align-items:center !important;
      gap:11px !important;
      margin-top:auto !important;
      padding-top:14px !important;
      border-top:1px solid rgba(244,196,0,.14) !important;
    }

    .reviews .review-marquee-avatar {
      display:inline-flex;
      align-items:center;
      justify-content:center;
      flex:0 0 38px;
      width:38px;
      height:38px;
      border:2px solid #f4c400;
      border-radius:50%;
      background:#151817;
      color:var(--accent);
      font-size:.72rem;
      font-weight:950;
      letter-spacing:.02em;
      box-shadow:
        0 0 0 3px rgba(244,196,0,.075),
        0 0 16px rgba(244,196,0,.07);
    }

    .reviews .review-marquee-identity {
      display:flex;
      flex-direction:column;
      gap:4px;
      min-width:0;
    }

    .reviews .review-marquee-identity strong {
      color:#fff;
      font-size:.82rem;
      font-weight:900;
      line-height:1.05;
    }

    .reviews .review-marquee-identity small {
      color:#b6bab5;
      font-size:.62rem;
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
        flex-basis:320px !important;
        width:320px !important;
        min-height:164px !important;
        border-radius:18px !important;
      }
      .reviews .review-marquee-row::before,
      .reviews .review-marquee-row::after {
        width:30px;
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
        flex-basis:286px !important;
        width:286px !important;
        min-height:158px !important;
        padding:18px 18px 16px !important;
        border-radius:17px !important;
      }
      .reviews .review-marquee-message {
        font-size:.91rem !important;
      }
      .reviews .review-marquee-avatar {
        flex-basis:35px;
        width:35px;
        height:35px;
      }
      .reviews .review-marquee-row--left .review-marquee-track {
        animation-duration:32s;
      }
      .reviews .review-marquee-row--right .review-marquee-track {
        animation-duration:35s;
      }
      .reviews .review-marquee-row::before,
      .reviews .review-marquee-row::after {
        width:16px;
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