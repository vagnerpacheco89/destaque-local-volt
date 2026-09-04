(() => {
  const script = document.createElement('script');
  script.src = `dev-current.js?v=${Date.now()}`;
  script.defer = true;
  document.head.appendChild(script);
})();