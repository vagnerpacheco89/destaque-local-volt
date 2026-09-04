(() => {
  const loadScript = (src, onLoad) => {
    const script = document.createElement('script');
    script.src = `${src}?v=${Date.now()}`;
    script.defer = true;
    if (onLoad) script.addEventListener('load', onLoad, { once: true });
    document.head.appendChild(script);
  };

  loadScript('dev-current.js', () => {
    loadScript('diagnostic-current.js');
  });
})();