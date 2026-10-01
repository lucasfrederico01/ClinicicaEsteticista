# Site institucional — Dra. Gisele Nasário

Next.js, TypeScript, Tailwind CSS, shadcn/ui e Lucide.

## Executar

`npm install`, `npm run dev` e abrir http://localhost:3000.
`npm run build` verifica a compilação de produção. `npm start` inicia a versão compilada.

## Conteúdo

Conteúdo centralizado em `lib/content.ts`. Horários e registro profissional estão vazios intencionalmente. Lavieen não foi incluído porque sua oferta não foi confirmada. Depoimentos ficam ocultos até receber conteúdo real autorizado.

Imagens locais otimizadas em `public/images`. Originais preservados em `../images`; `node scripts/prepare-images.mjs` recria os WebP sem retoques. Resultados e artes usam imagem completa, sem cortar créditos.

## Contato e privacidade

O formulário valida os campos e prepara uma mensagem para revisão e envio pelo próprio visitante no WhatsApp. Não há envio automático nem armazenamento de leads no servidor. Honeypot e tempo mínimo protegem a preparação; não substituem proteção de servidor se futuramente houver endpoint.

Sem rastreadores externos. Após consentimento opcional, cliques disparam eventos `clinic:analytics` com `{event,label}` sem dados pessoais. Categorias: whatsapp, instagram, location, treatment. Integrar um provedor real somente após atualizar a política e manter o bloqueio por consentimento. Preferência alterável em Cookies no rodapé.

## Antes de publicar

- Confirmar registro profissional, horários e autorização das imagens com a clínica.
- Revisar os textos de privacidade conforme a operação real da clínica e hospedagem.
- Configurar `NEXT_PUBLIC_SITE_URL` com domínio real: habilita canonical, indexação e sitemap. Sem valor, robots bloqueia indexação e não se inventa domínio.
- Telefone mantido exatamente como fornecido: +55 41 9776-3995 / 554197763995. Confirmar que a conta WhatsApp está ativa.
- Schema LocalBusiness escolhido por descrever o estabelecimento sem atribuir formação médica à farmacêutica: https://schema.org/LocalBusiness.
- Referência de consentimento: guia de cookies da ANPD. Não é uma certificação jurídica de conformidade.

## Validações realizadas

- Compilação de produção e TypeScript aprovados.
- Sem overflow horizontal em 360, 768, 1024 e 1440 px.
- Menu mobile, Escape, filtros, lightbox com setas/Escape, categorias, FAQ e formulário conferidos com Playwright.
- 15 imagens locais respondendo HTTP 200; originais preservados.
- Axe sem violações nos critérios automatizados WCAG A/AA testados no desktop, mobile, banner e lightbox. Isso não substitui uma auditoria manual completa.
- Preferências opcionais de cookies e `prefers-reduced-motion` conferidas.

Para repetir com a prévia em execução: `node scripts/verify.mjs` e `node scripts/final-qa.mjs` (usam o Chrome instalado). Capturas e relatórios em `test-results/`, ignorados pelo Git.
