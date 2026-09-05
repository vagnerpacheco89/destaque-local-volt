(() => {
  if (document.documentElement.dataset.ctaEventsReady === 'true') return;
  document.documentElement.dataset.ctaEventsReady = 'true';

  const dialog = document.querySelector('#demo-dialog');
  const demoSelectors = [
    '[data-demo-cta]',
    '.service-card__cta',
    '.services-other__cta'
  ].join(',');

  document.addEventListener('click', (event) => {
    const cta = event.target.closest(demoSelectors);
    if (!cta) return;

    if (cta.tagName === 'A') event.preventDefault();

    if (dialog && typeof dialog.showModal === 'function' && !dialog.open) {
      dialog.showModal();
    }
  });
})();
