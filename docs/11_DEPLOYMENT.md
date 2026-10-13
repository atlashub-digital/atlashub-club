# Deployment — club.atlashub.si (planeado)

## Isolamento
Novo projeto Vercel ligado EXCLUSIVAMENTE ao repo atlashub-digital/atlashub-club. Não reutilizar app.atlashub.si nem substituir binding do simulador AI Workforce/Workspaces. Domínio target: club.atlashub.si.
Produção ainda não preparada. Não configurar deploy automático para main antes de gate de privacidade, Auth, testes e aceite do Sérgio.

## Pré-requisitos
- Node.js 22, Next.js App Router.
- npm install; npm run verify. Sem package-lock inicial: criar lock a partir de instalação verificada e incluí-lo num PR subsequente.
- Vercel project e DNS sob autorizações do Sérgio; revisão com Helena.
- SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em ambiente SERVER ONLY, nunca NEXT_PUBLIC.
- TURNSTILE_SECRET_KEY (server), NEXT_PUBLIC_TURNSTILE_SITE_KEY (public), CLUB_SITE_ORIGIN (origem permitida).
- Criar tabela docs/sql/001_club_interest.sql em projeto isolado e revisão de política.
- Rate limit por edge/WAF e proteção DNS/SSL antes de aceitar solicitações públicas.
- Rever avisos legais, endereço de exercício de direitos, base legal, finalidade e retenção.

## Verificação
1. Homepage SSR, console sem erro e metadados de preview noindex.
2. Área de membro serve SOMENTE maquete fictícia, nunca ficheiros pessoais.
3. POST /api/interesse sem env: 503. Com origem incorreta: 403. Sem Turnstile válido: 400. Com dados corretos + tokens/config: 201 e row em Supabase isolado.
4. Navegação mobile e WCAG AA, teclas e motion reduzido.
5. Testes de conteúdo: não declarar ingressos ou vagas abertas; personagens virtuais identificadas.
6. Vercel rollback testado, domínio validado, métricas e limites de consumo aprovados.
7. Só retirar noindex com revisão de SEO/conteúdo/homologação visual.

## Conversão de mockup em produto
Fase 1 landing + form; Fase 2 Auth/área de membros e entitlements; Fase 3 Lab remoto + biblioteca por direitos + pagamentos; Fase 4 programas e gamificação. Sem atalhos de browser-only para acesso pago.
