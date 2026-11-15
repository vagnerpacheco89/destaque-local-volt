# Destaque Local — VOLT MASTER v1.0

Template one-page VOLT para eletricistas locais, mantido como base demonstrativa e master de produto da Destaque Local | SITES.

**Status: MASTER v1.0 — consolidação e QA pós-refatoração concluídas em 2026-09-05.**

## Estrutura final

A versão aprovada foi consolidada para evitar a antiga cadeia de arquivos `*-current.js` usada durante o polimento.

- `index.html` — HTML final, conteúdo, estrutura semântica, SEO e Schema do demo
- `styles.css` — estilos base do VOLT
- `volt-final.css` — direção visual final aprovada e responsividade
- `volt-final.js` — somente comportamentos de interface: menu mobile, FAQ, modal demo, navegação interna e reveal
- `assets/` — imagens do template
- `robots.txt` — regras de crawling do demo
- `sitemap.xml` — sitemap do demo
- `SEO-CLIENT-CHECKLIST.md` — checklist para transformar o demo em um site real indexável
- `QA-MASTER-v1.0.md` — registro da revisão pós-refatoração que aprovou esta versão como master

O HTML não depende mais de JavaScript para criar, reescrever ou reorganizar as seções aprovadas. O JavaScript ficou restrito a comportamentos interativos.

## Estado do demo

- Dados, personagem, avaliações, contatos e WhatsApp são fictícios/demonstrativos.
- O demo usa `noindex,follow` para não disputar busca local com negócios reais.
- A versão de cliente deve receber dados reais, domínio real, WhatsApp real e a configuração de indexação descrita em `SEO-CLIENT-CHECKLIST.md`.

## Operação

- GitHub = source of truth do código executável e histórico.
- Google Drive = source of truth de produto, direção visual, copy, regras e contexto.
- O preview via GitHub Pages é usado para revisão rápida do template.

Fluxo normal: Founder dá feedback → ChatGPT analisa → implementa no repo → preview atualiza → Founder avalia.

Codex não é etapa padrão; fica reservado para tarefas que realmente exijam engenharia especializada.

## Segurança e versões

- `archive/volt-pre-consolidation-20260905` preserva o estado anterior à consolidação, com os antigos overrides de desenvolvimento.
- `archive/volt-post-consolidation-pre-qa` preserva a versão consolidada imediatamente antes da QA final.
- `release/volt-master-v1.0` é o branch congelado da versão aprovada para servir de base às adaptações de clientes.

## Tipografia auxiliar aprovada — 15/11/2026

A categoria de cada elemento está declarada em `data-typography`, no HTML. A fonte única dos estilos dessas categorias é a camada `volt-typography` de `volt-final.css`, que prevalece sobre as regras históricas de componentes. Os tamanhos da tabela abaixo são iguais em computador e celular; não criar exceções locais.

| Categoria | Valor de `data-typography` | Tamanho | Peso | Entrelinha | Aplicação |
|---|---|---:|---:|---:|---|
| Copy do CTA | `cta` | 14 px | 700 | 1,4 | Botões de ação, links com aparência de botão, Voltar ao topo e Entendi dos diálogos |
| Microcopy | `microcopy` | 14 px | 400 | 1,5 | Orientações da Hero, Sobre, chamada final, fechamento do FAQ e passos para avaliar no Google |
| Rótulo | `label` | 12 px | 700 | 1,4 | Identificação de painéis, colunas do rodapé, dias, bairros, ocupação na foto, rótulos de cobertura e de atributos do Sobre |
| Identificação de pessoa | `person` | 14 px | 700 | 1,5 | Nomes dos autores de avaliações e nome do profissional sobre a foto |
| Legenda | `caption` | 12 px | 500 | 1,5 | Localizações dos trabalhos e dos autores de avaliações |
| Aviso | `notice` | 12 px | 400 | 1,5 | Site demonstração e aviso de perfil fictício no convite para avaliar |
| Créditos | `credit` | 12 px | 600 | 1,5 | Copyright, descrição final do negócio e autoria do site |
| Texto de conteúdo do rodapé | `content` | 16 px | 400 | 1,5 | Descrição, regiões, horários e links de navegação |

- Fonte: Inter. Copy do CTA e Rótulo em maiúsculas; Microcopy mantém escrita normal.
- `data-ink`: `primary` = `#F7F7F2`; `muted` = `#A9ADA9`; `accent` = `#F4C400`; `on-accent` = `#090A08`; `brand` = `#FF4B00`, exclusivo do crédito Destaque Local. A aplicação já está definida no HTML e acompanha o componente, sem escolha livre do agente.
- As variantes aprovadas dos botões preservam fundos, bordas, foco e comportamento; a cor de texto segue a paleta acima. Os ícones decorativos e o selo gráfico do Google são componentes próprios.
- O corpo do site continua no grupo de 16 px já aprovado. H1, H2 e eyebrows mantêm suas regras. Os nomes dos oito trabalhos nas fotos, os títulos das três cidades da seção Área atendida e a chamada de contato do rodapé são H3: Barlow Condensed 800, 28 px no computador e 24 px até 620 px, entrelinha 1,05 e espaçamento entre letras de −0,018 em, conforme a regra compartilhada. A cidade principal mantém o destaque amarelo; os outros H3 usam texto claro. As localizações nas fotos continuam como Legenda, com texto escuro sobre o selo amarelo. O nome sobre a foto é Identificação de pessoa de 14 px; a ocupação continua como Rótulo. A marca gráfica mantém suas regras próprias.
- Esta aprovação cobre a tipografia auxiliar e o conteúdo do rodapé; não declara concluído o sistema visual completo nem autoriza recriar o layout por cliente.
