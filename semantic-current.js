(() => {
  const servicesIntro = document.querySelector('.services-heading__intro');
  if (servicesIntro) {
    servicesIntro.textContent = 'Em Palhoça e região, o atendimento vai do reparo pontual à instalação de novos pontos e circuitos, sempre começando pela avaliação do que realmente precisa ser corrigido ou instalado.';
  }

  document.querySelectorAll('.hero__trust-card h2').forEach((heading) => {
    const text = document.createElement('p');
    text.className = 'hero__trust-title';
    text.textContent = heading.textContent;
    heading.replaceWith(text);
  });

  const style = document.createElement('style');
  style.id = 'semantic-current-style';
  style.textContent = `
    .hero__trust-card .hero__trust-title {
      margin:0;
      font-family:var(--font-body);
      font-size:10px;
      line-height:1.3;
      font-weight:800;
      letter-spacing:.03em;
      text-transform:uppercase;
      color:#e8e9e4;
    }

    @media (max-width:620px) {
      .hero__trust-grid--mobile .hero__trust-title {
        font-size:9px;
        line-height:1.28;
        overflow-wrap:anywhere;
      }
    }
  `;
  document.head.appendChild(style);
})();
