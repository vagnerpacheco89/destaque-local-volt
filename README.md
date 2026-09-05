# Destaque Local — VOLT

Template one-page VOLT para eletricistas locais, mantido como base demonstrativa e master de produto da Destaque Local | SITES.

## Estrutura final

A versão aprovada foi consolidada para evitar a antiga cadeia de arquivos `*-current.js` usada durante o polimento.

- `index.html` — HTML final, conteúdo, estrutura semântica, SEO e Schema do demo
- `styles.css` — estilos base do VOLT
- `volt-final.css` — direção visual final aprovada e responsividade
- `volt-final.js` — somente comportamentos de interface: menu mobile, FAQ, modal demo, voltar ao topo e reveal
- `assets/` — imagens do template
- `robots.txt` — regras de crawling do demo
- `sitemap.xml` — sitemap do demo
- `SEO-CLIENT-CHECKLIST.md` — checklist para transformar o demo em um site real indexável

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

## Segurança da consolidação

Antes da consolidação final foi criado o branch `archive/volt-pre-consolidation-20260905`, preservando o estado anterior com todos os overrides de desenvolvimento.
