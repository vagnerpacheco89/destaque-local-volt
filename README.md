# Destaque Local â VOLT MASTER v1.0

Template one-page VOLT para eletricistas locais, mantido como base demonstrativa e master de produto da Destaque Local | SITES.

**Status: MASTER v1.0 â consolidaÃ§Ã£o e QA pÃ³s-refatoraÃ§Ã£o concluÃ­das em 2026-09-05.**

## Estrutura final

A versÃ£o aprovada foi consolidada para evitar a antiga cadeia de arquivos `*-current.js` usada durante o polimento.

- `index.html` â HTML final, conteÃºdo, estrutura semÃ¢ntica, SEO e Schema do demo
- `styles.css` â estilos base do VOLT
- `volt-final.css` â direÃ§Ã£o visual final aprovada e responsividade
- `volt-final.js` â somente comportamentos de interface: menu mobile, FAQ, modal demo, navegaÃ§Ã£o interna e reveal
- `assets/` â imagens do template
- `robots.txt` â regras de crawling do demo
- `sitemap.xml` â sitemap do demo
- `SEO-CLIENT-CHECKLIST.md` â checklist para transformar o demo em um site real indexÃ¡vel
- `QA-MASTER-v1.0.md` â registro da revisÃ£o pÃ³s-refatoraÃ§Ã£o que aprovou esta versÃ£o como master

O HTML nÃ£o depende mais de JavaScript para criar, reescrever ou reorganizar as seÃ§Ãµes aprovadas. O JavaScript ficou restrito a comportamentos interativos.

## Estado do demo

- Dados, personagem, avaliaÃ§Ãµes, contatos e WhatsApp sÃ£o fictÃ­cios/demonstrativos.
- O demo usa `noindex,follow` para nÃ£o disputar busca local com negÃ³cios reais.
- A versÃ£o de cliente deve receber dados reais, domÃ­nio real, WhatsApp real e a configuraÃ§Ã£o de indexaÃ§Ã£o descrita em `SEO-CLIENT-CHECKLIST.md`.

## OperaÃ§Ã£o

- GitHub = source of truth do cÃ³digo executÃ¡vel e histÃ³rico.
- Google Drive = source of truth de produto, direÃ§Ã£o visual, copy, regras e contexto.
- O preview via GitHub Pages Ã© usado para revisÃ£o rÃ¡pida do template.

Fluxo normal: Founder dÃ¡ feedback â ChatGPT analisa â implementa no repo â preview atualiza â Founder avalia.

Codex nÃ£o Ã© etapa padrÃ£o; fica reservado para tarefas que realmente exijam engenharia especializada.

## SeguranÃ§a e versÃµes

- `archive/volt-pre-consolidation-20260905` preserva o estado anterior Ã  consolidaÃ§Ã£o, com os antigos overrides de desenvolvimento.
- `archive/volt-post-consolidation-pre-qa` preserva a versÃ£o consolidada imediatamente antes da QA final.
- `release/volt-master-v1.0` Ã© o branch congelado da versÃ£o aprovada para servir de base Ã s adaptaÃ§Ãµes de clientes.

## Tipografia auxiliar aprovada â 15/11/2026

A categoria de cada elemento estÃ¡ declarada em `data-typography`, no HTML. A fonte Ãºnica dos estilos dessas categorias Ã© a camada `volt-typography` de `volt-final.css`, que prevalece sobre as regras histÃ³ricas de componentes. Os tamanhos abaixo sÃ£o iguais em computador e celular; nÃ£o criar exceÃ§Ãµes locais.

| Categoria | Valor de `data-typography` | Tamanho | Peso | Entrelinha | AplicaÃ§Ã£o |
|---|---|---:|---:|---:|---|
| Copy do CTA | `cta` | 14 px | 700 | 1,4 | BotÃµes de aÃ§Ã£o, links com aparÃªncia de botÃ£o, Voltar ao topo e Entendi dos diÃ¡logos |
| Microcopy | `microcopy` | 14 px | 400 | 1,5 | OrientaÃ§Ãµes da Hero, Sobre, chamada final, fechamento do FAQ e passos para avaliar no Google |
| RÃ³tulo | `label` | 12 px | 700 | 1,4 | IdentificaÃ§Ã£o de painÃ©is, colunas do rodapÃ©, dias, bairros, ocupaÃ§Ã£o na foto, rÃ³tulos de cobertura e de atributos do Sobre |
| IdentificaÃ§Ã£o de pessoa | `person` | 14 px | 700 | 1,5 | Nomes dos autores de avaliaÃ§Ãµes |
| Legenda | `caption` | 12 px | 500 | 1,5 | LocalizaÃ§Ãµes dos trabalhos e dos autores de avaliaÃ§Ãµes |
| Aviso | `notice` | 12 px | 400 | 1,5 | Site demonstraÃ§Ã£o e aviso de perfil fictÃ­cio no convite para avaliar |
| CrÃ©ditos | `credit` | 12 px | 600 | 1,5 | Copyright, descriÃ§Ã£o final do negÃ³cio e autoria do site |
| Texto de conteÃºdo do rodapÃ© | `content` | 16 px | 400 | 1,5 | DescriÃ§Ã£o, regiÃµes, horÃ¡rios e links de navegaÃ§Ã£o |

- Fonte: Inter. Copy do CTA e RÃ³tulo em maiÃºsculas; Microcopy mantÃ©m escrita normal.
- `data-ink`: `primary` = `#F7F7F2`; `muted` = `#A9ADA9`; `accent` = `#F4C400`; `on-accent` = `#090A08`; `brand` = `#FF4B00`, exclusivo do crÃ©dito Destaque Local. A aplicaÃ§Ã£o jÃ¡ estÃ¡ definida no HTML e acompanha o componente, sem escolha livre do agente.
- As variantes aprovadas dos botÃµes preservam fundos, bordas, foco e comportamento; a cor de texto segue a paleta acima. Os Ã­cones decorativos e o selo grÃ¡fico do Google sÃ£o componentes prÃ³prios.
- O corpo do site continua no grupo de 16 px jÃ¡ aprovado. H1, H2, H3 e eyebrows mantÃªm suas regras. A marca grÃ¡fica e os tÃ­tulos visuais que ainda nÃ£o sÃ£o H3 (nomes dos trabalhos, cidades atendidas, nome sobre a foto e chamada de contato do rodapÃ©) nÃ£o foram reclassificados nesta rodada.
- Esta aprovaÃ§Ã£o cobre a tipografia auxiliar e o conteÃºdo do rodapÃ©; nÃ£o declara concluÃ­do o sistema visual completo nem autoriza recriar o layout por cliente.
