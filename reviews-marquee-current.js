(() => {
  const section = document.querySelector('.reviews');
  const grid = section?.querySelector('.reviews-grid');
  if (!section || !grid || grid.dataset.marqueeReady === 'true') return;

  const source = [...grid.querySelectorAll('blockquote')].map((quote) => ({
    text: quote.querySelector('p')?.textContent?.trim() || '',
    name: quote.querySelector('footer')?.textContent?.trim() || ''
  })).filter((item) => item.text && item.name);

  if (source.length < 6) return;

  const makeCard = ({ text, name }) => {
    const card = document.createElement('blockquote');
    card.className = 'review-marquee-card';

    const mark = document.createElement('span');
    mark.className = 'review-marquee-mark';
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = '“';

    const copy = document.createElement('p');
    copy.textContent = `“${text.replace(/^“|”$/g, '')}”`;

    const footer = document.createElement('footer');
    footer.textContent = name;

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
      gap:14px !important;
      width:100% !important;
      margin-top:4px !important;
      padding:2px 0 !important;
      border:0 !important;
      background:transparent !important;
      overflow:visible !important;
    }

    .reviews .review-marquee-row {
      position:relative;
      width:100%;
      overflow:hidden;
      padding:1px 0;
    }

    .reviews .review-marquee-row::before,
    .reviews .review-marquee-row::after {
      content:'';
      position:absolute;
      z-index:3;
      top:0;
      bottom:0;
      width:64px;
      pointer-events:none;
    }

    .reviews .review-marquee-row::before {
      left:0;
      background:linear-gradient(90deg, #050606 0%, rgba(5,6,6,.86) 34%, rgba(5,6,6,0) 100%);
    }

    .reviews .review-marquee-row::after {
      right:0;
      background:linear-gradient(270deg, #050606 0%, rgba(5,6,6,.86) 34%, rgba(5,6,6,0) 100%);
    }

    .reviews .review-marquee-track {
      display:flex;
      width:max-content;
      will-change:transform;
    }

    .reviews .review-marquee-group {
      display:flex;
      flex:0 0 auto;
      gap:14px;
      padding-right:14px;
    }

    .reviews .review-marquee-row--left .review-marquee-track {
      animation:volt-review-left 34s linear infinite;
    }

    .reviews .review-marquee-row--right .review-marquee-track {
      animation:volt-review-right 38s linear infinite;
    }

    .reviews .review-marquee-row:hover .review-marquee-track,
    .reviews .review-marquee-row:focus-within .review-marquee-track {
      animation-play-state:paused;
    }

    .reviews .review-marquee-card {
      position:relative;
      display:flex !important;
      flex-direction:column !important;
      justify-content:space-between !important;
      flex:0 0 360px !important;
      width:360px !important;
      min-height:150px !important;
      margin:0 !important;
      padding:20px 22px 18px !important;
      border:1px solid #303534 !important;
      border-radius:4px !important;
      background:
        linear-gradient(180deg, rgba(244,196,0,.025), transparent 45%),
        #0b0d0d !important;
      box-shadow:none !important;
      overflow:hidden;
      transition:transform 180ms var(--ease), border-color 180ms ease, background 180ms ease !important;
    }

    .reviews .review-marquee-card::after {
      content:'';
      position:absolute;
      left:0;
      right:0;
      bottom:0;
      height:2px;
      background:var(--accent);
      transform:scaleX(.18);
      transform-origin:left center;
      opacity:.62;
      transition:transform 180ms var(--ease), opacity 180ms ease;
    }

    .reviews .review-marquee-card:hover {
      transform:translateY(-2px);
      border-color:#665d1d !important;
      background:
        linear-gradient(180deg, rgba(244,196,0,.045), transparent 50%),
        #0e1010 !important;
    }

    .reviews .review-marquee-card:hover::after {
      transform:scaleX(1);
      opacity:1;
    }

    .reviews .review-marquee-mark {
      display:block;
      height:25px;
      margin:0 0 9px;
      color:var(--accent);
      font:800 2.6rem/.72 var(--font-display);
    }

    .reviews .review-marquee-card p {
      display:-webkit-box;
      -webkit-box-orient:vertical;
      -webkit-line-clamp:3;
      overflow:hidden;
      margin:0 0 18px !important;
      color:#e9ebe6 !important;
      font-size:.88rem !important;
      line-height:1.48 !important;
      letter-spacing:-.005em !important;
    }

    .reviews .review-marquee-card footer {
      margin-top:auto !important;
      color:#fff !important;
      font-size:.76rem !important;
      font-weight:850 !important;
      line-height:1.1 !important;
      letter-spacing:.01em !important;
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
      }
      .reviews .review-marquee-row::before,
      .reviews .review-marquee-row::after {
        width:38px;
      }
    }

    @media (max-width:620px) {
      .reviews .reviews-grid.reviews-marquee {
        gap:10px !important;
      }
      .reviews .review-marquee-group {
        gap:10px;
        padding-right:10px;
      }
      .reviews .review-marquee-card {
        flex-basis:280px !important;
        width:280px !important;
        min-height:142px !important;
        padding:18px 18px 16px !important;
      }
      .reviews .review-marquee-row--left .review-marquee-track {
        animation-duration:30s;
      }
      .reviews .review-marquee-row--right .review-marquee-track {
        animation-duration:33s;
      }
      .reviews .review-marquee-row::before,
      .reviews .review-marquee-row::after {
        width:22px;
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