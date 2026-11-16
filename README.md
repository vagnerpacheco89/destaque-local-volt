# Destaque Local — VOLT

Template de página única para eletricistas locais. Este repositório mantém o código executável, os recursos e o histórico da matriz demonstrativa.

## Manual de implementação

A fonte principal de funcionamento, estrutura das seções, regras visuais aprovadas, personalização para o cliente, implementação e QA é o **[Manual de implementação do VOLT](https://github.com/vagnerpacheco89/destaque-local-core/blob/main/sites/nichos/eletricistas/templates/volt/manual-implementacao.md)**, no repositório `destaque-local-core`.

Consultar esse manual antes de adaptar o template. Não manter outra especificação operacional neste README, não usar `sites/producao.md` e não depender do Google Drive como base operacional.

## Matriz e arquivos

A matriz conferida na consolidação de 16/11/2026 está na branch [`release/volt-master-v1.0`](https://github.com/vagnerpacheco89/destaque-local-volt/tree/release/volt-master-v1.0), no commit de código [1fc1943](https://github.com/vagnerpacheco89/destaque-local-volt/commit/1fc1943ceed16f6530760ab57a8602d436fb66f7). A branch `main` tem código diferente; não presumir equivalência. A organização documental não altera HTML, CSS, JavaScript nem a publicação do site.

- `index.html`: estrutura, conteúdo e metadados.
- `styles.css` e `volt-final.css`: estilos base, composição final e responsividade.
- `volt-final.js`: comportamentos de interface, inclusive proteção dos CTAs demonstrativos.
- `assets/`: imagens.
- `robots.txt` e `sitemap.xml`: rastreamento e endereços.

## Demonstração e histórico

O [VOLT publicado](https://volt.destaquelocal.com.br/) é demonstrativo. Não transportar seus dados fictícios como fatos do cliente. A conversão dos contatos e do convite para avaliar exige tratar os bloqueios demonstrativos do JavaScript, conforme o manual.

`QA-MASTER-v1.0.md` preserva o registro histórico da refatoração de setembro de 2026; não substitui a QA vigente nem comprova uma implementação atual. `SEO-CLIENT-CHECKLIST.md` apenas aponta para o manual. As branches `archive/*` preservam estados antigos para consulta histórica.

A biblioteca de copy, a centralização completa das variáveis e a montagem automática ainda não estão concluídas.
