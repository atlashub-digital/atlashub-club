# PR2B · Registo gratuito real — o que configurar para ligar

**Estado:** código pronto e testado; **nada aplicado nem ativado**. Sem as variáveis abaixo o site continua em modo demonstração (`/participar` não envia nada; `/entrar`, `/conta` e as APIs `/api/club/*` respondem "ainda não ativo"/503).
**Não ativa pagamentos.** O Genesis continua a ser só pré-candidatura sem cobrança.

## 1. Como funciona (modo `live`)
1. `/participar` (4 etapas) → `POST /api/club/signup`: Origin, JSON ≤ 4 KB, honeypot, **Turnstile**, rate limit partilhado em SQL (`club.hit_rate_limit`: 10/10 min por IP, 3/h por e-mail, chaves em hash).
2. Adulto → Supabase Auth `signInWithOtp` envia um **link de confirmação**. Os dados do formulário ficam no convite (`user_metadata.club_signup`) até à confirmação. **Nenhum perfil existe antes de confirmar.**
3. O link abre `/entrar/confirmar`, que pede um clique ("Confirmar e entrar") → `POST /api/club/auth/verify` → `verifyOtp`. O clique evita que os scanners de e-mail gastem o link.
4. Com o e-mail verificado, o servidor revalida os dados e chama `club.complete_signup` (uma transação): perfil, intenção, consentimentos de termos/privacidade com versão, marketing separado, candidatura Genesis (`interested` ou `student_pending`) e, **só com opt-in**, o evento no outbox CRM. Depois apaga os dados do convite.
5. `/conta`: dados do membro lidos com a sessão dele (**RLS**), ligar/desligar novidades (`club.set_marketing_consent` → opt-in/opt-out no outbox), pedir cópia ou apagamento dos dados, sair. `/entrar` envia link de entrada (nunca cria conta; resposta igual exista ou não o e-mail).
6. Menores: **sem conta**. Adolescente → linha em `club.club_guardian_reviews` com o e-mail de contacto; criança (<12) → linha sem e-mail. A equipa trata manualmente.
7. CRM: `club.club_crm_outbox` → webhook HTTPS assinado (§5). Entrega imediata após registo/alteração; o cron diário (`vercel.json` → `/api/club/crm-sync`) repete falhas e aplica a retenção (`club.purge_expired`).

## 2. Supabase (Helena — decisão A/B do doc 16 §2; recomendada A: projeto só do Club)
Primeiro em **staging**, nunca no AI Workforce nem no app.atlashub.si.
1. SQL Editor (por esta ordem): `docs/sql/drafts/002_club_auth_onboarding.sql` e `docs/sql/drafts/003_club_signup_live.sql`. Correr o Security Advisor a seguir.
2. **Settings → API → Exposed schemas:** acrescentar `club`.
3. **Authentication → Providers → Email:** ativo, "Confirm email" ligado. Desligar sign-up por password não é necessário (o site só usa links).
4. **Authentication → URL Configuration:** Site URL = origem do site (staging ou `https://club.atlashub.si`); **Redirect URLs** = `<origem>/entrar/confirmar`.
5. **Authentication → Email Templates** — "Confirm signup" **e** "Magic Link", o link passa a ser:
   ```html
   <a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=email">Confirmar e entrar no Club Atlas</a>
   ```
   Texto em PT-BR, sem prometer vaga nem pagamento.
6. **SMTP próprio** (domínio do Club, SPF/DKIM). O SMTP de teste do Supabase só envia para a equipa do projeto e tem limite baixo — serve para staging, não para lançamento.
7. Rate limits de e-mail do Auth ajustados ao volume previsto.

## 3. Cloudflare Turnstile
Widget para o hostname do Club (e o de staging), modo "Managed". Gera `NEXT_PUBLIC_TURNSTILE_SITE_KEY` e `TURNSTILE_SECRET_KEY`.

## 4. Vercel (`atlas-hub1` / `atlashub-club`) — primeiro só no ambiente **Preview**
| Variável | Valor | Segredo? |
|---|---|---|
| `CLUB_AUTH_MODE` | `live` | não |
| `CLUB_SITE_ORIGIN` | origem exata do ambiente (sem `/` final) | não |
| `SUPABASE_URL` | URL do projeto | não |
| `SUPABASE_ANON_KEY` | chave anon/publishable (usada só no servidor) | não, mas não expor sem necessidade |
| `SUPABASE_SERVICE_ROLE_KEY` | service role | **sim** |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | §3 | secret: **sim** |
| `CRON_SECRET` | aleatório ≥ 32 caracteres | **sim** |
| `CLUB_CRM_WEBHOOK_URL` / `CLUB_CRM_WEBHOOK_SECRET` | §5 (opcional no início) | secret: **sim** |
| `CLUB_AUTH_PRODUCTION_APPROVED` | `yes` **só em Production e só após aprovação escrita do Sérgio** | não |

Basta faltar uma variável obrigatória para o modo cair para `off` (fail-closed). Em Production, sem `CLUB_AUTH_PRODUCTION_APPROVED=yes`, fica `off` mesmo com tudo o resto configurado. As variáveis `NEXT_PUBLIC_*` entram no build: refazer o deploy depois de as definir.

## 5. Contrato do webhook CRM (para a Helena implementar o recetor)
`POST <CLUB_CRM_WEBHOOK_URL>` (HTTPS), corpo JSON:
```json
{ "id": 123, "event": "contact_opt_in | contact_opt_out | genesis_interest",
  "payload": { "email": "…", "display_name": "…", "source": "club", "cohort": "genesis-01 (só genesis_interest)" },
  "created_at": "…" }
```
- `x-club-signature: t=<unix>,v1=<hex>` com `v1 = HMAC-SHA256(CLUB_CRM_WEBHOOK_SECRET, "<t>.<corpo>")`; recusar se `|agora − t| > 300 s`.
- `idempotency-key: club-outbox-<id>` — o recetor deve ignorar repetições.
- `2xx` = entregue; qualquer outra resposta = nova tentativa (até 10).
- Mapeamento sugerido no CRM AtlasHub: `contact_opt_in` → `crm_contact` + `crm_consent` (marketing, `source='club'`); `genesis_interest` → `crm_lead`; `contact_opt_out` → `crm_suppression`.
- **Nunca** chegam ao CRM interesses, primeira missão, área, equipamento, progresso, idade ou dados de menores (`CHECK` no SQL).

## 6. Teste em staging (antes de qualquer produção)
1. `/participar` com conta `@example.test` ou caixa da equipa → e-mail recebido → "Confirmar e entrar" → `/conta` mostra nome e percurso.
2. Confirmar no SQL: 1 linha em `club_profiles`, 3 em `club_consent_events`, 0 no outbox sem opt-in.
3. Repetir com opt-in e Genesis estudante → `student_pending` + 2 eventos no outbox; desligar novidades em `/conta` → `contact_opt_out`.
4. Menor (adolescente/criança) → só `club_guardian_reviews`, nenhum utilizador em `auth.users`.
5. `/entrar` com e-mail inexistente → mesma mensagem, nenhum e-mail enviado.
6. `GET /api/club/crm-sync` com `Authorization: Bearer <CRON_SECRET>` → JSON com `crm` e `purge`.

## 7. Reversão
- Desligar: remover `CLUB_AUTH_MODE` (ou pôr `off`) e refazer o deploy → o formulário volta ao modo demonstração; nenhum dado é apagado.
- Código: reverter o merge deste PR.
- Base: `drop schema club cascade` + apagar utilizadores do Club em `auth.users` (só com decisão do Sérgio; destrói registos).

## 8. Pendentes fora do código
- Textos finais de termos e privacidade (versões `club-terms-*`/`club-privacy-*`), incluindo tratamento real de dados e menores.
- Runbook da revisão de responsável (quem contacta, por que canal, prazo, `evidence_ref`).
- Decisão de retenção da prova de consentimento após apagamento de conta (doc 16 §6).
