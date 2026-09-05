# VOLT MASTER v1.0 — QA pós-refatoração

Data: 2026-09-05

## Resultado

**PASS — aprovado tecnicamente como master demonstrativo do VOLT.**

A revisão foi feita após a consolidação que removeu a antiga cadeia de arquivos `*-current.js`. O objetivo desta QA foi confirmar que a troca de arquitetura não quebrou layout, conteúdo, comportamento, responsividade ou SEO do demo aprovado.

## Estrutura e build

- `index.html` contém a estrutura e o conteúdo final das seções.
- `styles.css` permanece como base visual.
- `volt-final.css` concentra a camada visual final e responsiva.
- `volt-final.js` contém somente comportamento de interface.
- Não existem referências ativas a `app.js`, `dev-overrides.css` ou arquivos `*-current.js`.
- Todos os 10 assets WebP usados pelo template estão presentes.
- JavaScript validado sem erro de sintaxe.
- GitHub Pages gera o artefato de publicação corretamente.

## HTML, conteúdo e acessibilidade básica

- IDs verificados sem duplicidade.
- Um único H1 principal: `ELETRICISTA EM PALHOÇA`.
- Hierarquia principal de H2 preservada por seção.
- Links internos apontam para IDs existentes.
- Referências `aria-labelledby` apontam para elementos existentes.
- Imagens possuem `alt` descritivo.
- Imagens abaixo da Hero usam lazy loading; Hero mantém prioridade alta.
- CTAs de conversão permanecem padronizados em caixa alta.
- Não existe CTA flutuante de WhatsApp no mobile.

## Responsividade

Revisão estrutural executada entre **320 px e 1440 px**, incluindo 320, 360, 390, 480, 560, 620, 680, 720, 768, 860, 900, 980, 1024, 1060, 1120, 1280 e 1440 px.

Verificado:

- sem overflow horizontal nas larguras testadas;
- Serviços: 3 → 2 → 1 coluna conforme breakpoint;
- FAQ: 2 colunas no desktop e 1 coluna em telas menores;
- Sobre: composição em 2 colunas e empilhamento mobile;
- Área de atendimento: 2 colunas e empilhamento responsivo;
- Footer: 5 → 3 → 2 → 1 coluna;
- título do FAQ em uma linha no desktop;
- título do Processo em uma linha no desktop;
- navbar desktop e menu mobile alternam corretamente.

## Interações

- menu mobile abre, fecha e atualiza `aria-expanded`;
- clicar em item do menu mobile fecha o menu;
- FAQ mantém apenas uma resposta aberta por vez;
- CTAs demo abrem o dialog de demonstração;
- CTAs de cards de Serviço são neutralizados no runtime para não manter destino externo de WhatsApp no demo;
- CTA do Diagnóstico permanece depois do painel de sinais, inclusive no mobile;
- `VOLTAR AO TOPO` retorna ao início;
- navegação por âncoras agora desconta a altura do header sticky no desktop e mobile;
- `prefers-reduced-motion` mantém conteúdo visível e desativa animações contínuas relevantes.

## SEO e descoberta

- title e meta description presentes diretamente no HTML;
- canonical presente;
- Open Graph e Twitter Card presentes;
- JSON-LD válido com `Electrician`, `WebSite` e `WebPage`;
- serviços e áreas atendidas presentes no Schema;
- `robots.txt` presente e permite crawling, inclusive OAI-SearchBot e ChatGPT-User;
- `sitemap.xml` válido;
- demo permanece deliberadamente `noindex,follow,max-image-preview:large`;
- ativação de cliente real continua condicionada ao `SEO-CLIENT-CHECKLIST.md`.

## Correções realizadas durante a QA

1. Navegação interna corrigida para não esconder o início das seções atrás do header sticky.
2. CTAs demonstrativos de Serviços reforçados para permanecerem seguros no demo e abrirem o dialog demonstrativo.
3. CTAs demo recebem associação explícita com o dialog via atributos ARIA no runtime.

## Estado de produto

Esta versão pode ser usada como **VOLT MASTER v1.0** para iniciar adaptações de clientes, desde que todos os dados fictícios sejam substituídos pelos dados reais e o checklist de publicação/indexação seja executado antes de colocar um cliente em produção.
