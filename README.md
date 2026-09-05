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
