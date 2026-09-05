(() => {
  const loadScript = (src, onLoad) => {
    const script = document.createElement('script');
    script.src = `${src}?v=${Date.now()}`;
    script.defer = true;
    if (onLoad) script.addEventListener('load', onLoad, { once: true });
    document.head.appendChild(script);
  };

  loadScript('dev-current.js', () => {
    loadScript('diagnostic-current.js', () => {
      loadScript('portfolio-current.js', () => {
        loadScript('process-current.js', () => {
          loadScript('reviews-current.js', () => {
            loadScript('reviews-badge-current.js', () => {
              loadScript('reviews-marquee-current.js', () => {
                loadScript('about-current.js', () => {
                  loadScript('service-area-current.js', () => {
                    loadScript('service-area-simple-current.js', () => {
                      loadScript('service-area-map-current.js', () => {
                        loadScript('faq-current.js', () => {
                          loadScript('faq-controls-current.js', () => {
                            loadScript('typography-current.js');
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
})();