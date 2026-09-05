# VOLT — Checklist SEO / Busca por IA para cliente real

Este repositório está em **modo demo**. O HTML usa `noindex,follow` porque Rafael Martins é fictício.

## Antes de publicar um cliente real

- [ ] Trocar nome, serviços, cidades, horários, contatos e demais dados pelos dados reais validados do cliente.
- [ ] Trocar `<meta name="robots">` de `noindex,follow` para `index,follow,max-image-preview:large`.
- [ ] Trocar canonical pelo domínio real do cliente.
- [ ] Trocar `og:url`, `og:image`, Twitter Image e demais URLs absolutas pelo domínio real.
- [ ] Atualizar JSON-LD `Electrician` com somente dados reais e comprovados.
- [ ] Atualizar `areaServed` para cidades/regiões reais.
- [ ] Atualizar `hasOfferCatalog` para os serviços reais oferecidos.
- [ ] Atualizar `sitemap.xml` com o domínio real e data de modificação.
- [ ] Atualizar a linha `Sitemap:` do `robots.txt`.
- [ ] Manter `OAI-SearchBot` liberado no `robots.txt` se o cliente quiser elegibilidade para ChatGPT Search.
- [ ] Confirmar que CDN/WAF/Cloudflare não bloqueia o OAI-SearchBot.
- [ ] Cadastrar e validar o domínio no Google Search Console.
- [ ] Cadastrar e validar o domínio no Bing Webmaster Tools.
- [ ] Conectar o site ao Perfil da Empresa no Google do cliente e manter dados consistentes entre site e perfil.
- [ ] Confirmar que não existe `noindex` residual no HTML, cabeçalhos HTTP ou CMS/CDN.
- [ ] Validar HTML, canonical, sitemap e dados estruturados antes do lançamento.

## Estratégia local

Priorizar linguagem natural combinando:

- profissão/nicho principal, por exemplo `eletricista`;
- cidade principal, por exemplo `Palhoça`;
- serviços específicos realmente oferecidos;
- cidades/bairros realmente atendidos;
- perguntas reais de clientes no FAQ;
- provas reais: trabalhos, avaliações e informações comerciais verificáveis.

Não repetir palavras-chave artificialmente. Não criar cidades, bairros, credenciais, avaliações ou serviços apenas para SEO.

## O que NÃO adicionar só para ferramentas de auditoria ficarem verdes

- `meta keywords`;
- `author` genérico;
- `title` em todos os links;
- `title` em todas as imagens.

Esses itens não substituem conteúdo útil, ALT descritivo, HTML semântico, autoridade local e dados reais consistentes.

## Busca por IA / LLMs

Não existe garantia de aparecer em respostas de IA. Para aumentar a elegibilidade:

- manter o site público, rápido e rastreável;
- permitir o OAI-SearchBot para ChatGPT Search;
- manter o site indexável no Google para recursos de IA ligados à Pesquisa Google;
- usar conteúdo factual, claro e específico;
- manter Schema/JSON-LD coerente com o conteúdo visível;
- fortalecer sinais externos reais do negócio, especialmente Perfil da Empresa no Google, avaliações e citações locais.

`Google-Extended` é separado do Google Search; bloquear ou permitir esse token não substitui a indexação normal da Pesquisa Google.
