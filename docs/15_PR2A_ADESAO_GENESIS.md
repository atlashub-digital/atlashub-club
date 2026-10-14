# PR2A — Adesão Club + oferta Genesis (prévia) · e proposta PR2B/PR2C

**Origem:** issue #14 e Handoff v2.0 (`design/handoff/club-signup-genesis-v2/`). Implementado no mesmo branch/PR #11 (o ambiente só permite o branch designado), em commits separados e reversíveis.

## Entregue (PR2A — só interface)
- `src/lib/offers.ts`: única fonte de preços de exibição (`club-free-v1` 0, `genesis-01-standard` 49000, `genesis-01-student` 19000 + `student_approved`), todos `pending_launch`.
- Landing: CTAs "Entrar no Club gratuitamente" / "Conhecer o Genesis", secção de ofertas, pergunta final.
- `/participar`: formulário de 4 etapas (percurso → dados mínimos → interesses → revisão/consentimentos). Club grátis por defeito; `?plan=genesis`; estudante = "pendente de validação"; marketing desmarcado; termos obrigatórios; menores avançam para `pending_guardian_review` (ver `docs/18_MENORES_REVISAO_RESPONSAVEL.md`); **sem envio**.
- `/genesis`: página comercial (preço, programa semanal com 24 ateliers previstos, benefícios, FAQ de condições).
- `/area-membro`: prévia do dashboard (Missão 001 a 0/4, Meu Ecossistema vazio, convite Genesis discreto).
- Guarda `content:check`: só R$ 490 e R$ 190 são aceites na UI.

## Proposta técnica (não implementada — exige aval do Sérgio e da Helena)
### PR2B — Auth + onboarding + CRM consentido
- Supabase Auth (projeto Club isolado), magic link/e-mail+senha, verificação de e-mail.
- Tabelas: `club_profiles`, `member_consent` (versão de termos e opt-in de marketing separados), `genesis_applications` (status do contrato: draft → interested → pending_student_review → …).
- Server action `createMembership` idempotente; RLS por `auth.uid()`; rate limit + Turnstile.
- CRM AtlasHub (`crm_contact/crm_lead/crm_consent`) só via servidor e só com opt-in; nenhum dado de progresso do Club vai para o CRM B2B.
### PR2C — Elegibilidade estudante + cotação + checkout
- Upload de comprovativo em bucket privado (retenção curta, acesso só a revisores), decisão humana `student_approved/rejected` com contestação.
- `price_quotes` assinadas no servidor (oferta, preço, validade, nonce); o cliente nunca envia valores.
- Gateway (PixGo/MisticPay/cartão) atrás de adaptador; webhooks assinados e idempotentes; estados pagamento pendente/cancelado/reembolsado; entitlements concedidos só no servidor.
- Testes: rejeição de estudante sem débito, replay de webhook, preço adulterado, menores, downgrade de entitlement.

## Rollback
`git revert` dos commits da PR2A; nenhuma migração, env ou serviço externo foi criado.
