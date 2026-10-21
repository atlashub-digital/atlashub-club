# PR2B · Registo gratuito real — o que configurar para ligar

**Estado no port de 21/10/2026:** código reconciliado; segundo o brief, 002/003/004 já estão aplicados na Master. Este port não executa SQL, não altera envs nem faz deploy. As instruções de aplicação abaixo são históricas e destinam-se apenas a ambientes isolados novos; não reaplicar na Master. As envs live da main são preservadas.
**Não ativa pagamentos.** O Genesis continua a ser só pré-candidatura sem cobrança.

## 1. Como funciona (modo `live`) na DB Master (ATL-D29)
O Club usa a DB Master AtlasHub (`aakdyumavlzgyklbrsrw`), schema `club`. **Não** se cria projeto Supabase próprio. Consequências desenhadas no código:
- O `auth.users` e o papel `authenticated` são partilhados com outras aplicações AtlasHub. Ser utilizador da Master **não** faz de ninguém membro do Club: só `club.complete_signup` (servidor) cria o perfil, e a migração 003 retira ao `authenticated` qualquer escrita direta em perfis, intenções, consentimentos e Genesis.
- Uma sessão do Club também não abre nada fora do schema `club`: na auditoria de leitura de 15/10/2026 `anon`/`authenticated` não tinham privilégios em nenhuma tabela de `public`, nem buckets de Storage, nem funções públicas executáveis. **As outras aplicações não devem tratar "ter sessão na Master" como autorização** (a confirmar pela Helena para cada app).
- Os dados do formulário **não** vão para o `user_metadata` (viajaria no JWT partilhado): ficam em `club.club_pending_signups`, chaveados por `sha256(email)`, sem e-mail em claro, 48 h.
- Os **modelos de e-mail globais da Master não são alterados**: o link usa o fluxo PKCE padrão (`?code=`), por isso tem de ser aberto no mesmo navegador do pedido.
- A purga nunca apaga utilizadores de `auth.users`.

Fluxo:
1. `/participar` (4 etapas) → `POST /api/club/signup`: Origin, JSON ≤ 4 KB, honeypot, **Turnstile**, rate limit partilhado em SQL (`club.hit_rate_limit`: 10/10 min por IP, 3/h por e-mail, chaves em hash).
2. Adulto → `club.stash_signup` guarda os dados validados (sem e-mail) → Supabase Auth `signInWithOtp` envia o link. **Nenhum perfil existe antes de confirmar.** Se o registo por e-mail estiver fechado na Master (`signup_disabled`/`otp_disabled`), a API responde 503 em vez de fingir envio.
3. O link abre `/entrar/confirmar`, que pede um clique ("Confirmar e entrar") → `POST /api/club/auth/verify` → `exchangeCodeForSession` (ou `verifyOtp` se um dia houver `token_hash`). O clique evita que os scanners de e-mail gastem o link.
4. Com o e-mail verificado e dados pendentes, a pessoa vai para `/conta/concluir`: vê o resumo, **aceita os termos (obrigatório, desmarcado)** e confirma ou não as novidades → `POST /api/club/complete` → `club.complete_signup` (uma transação): perfil, intenção, consentimentos com versão, marketing separado, candidatura Genesis (`interested` ou `student_pending`) e, **só com opt-in**, o evento no outbox CRM; os dados pendentes são apagados. Assim quem consente é o dono do e-mail, não quem preencheu o formulário.
5. `/conta`: dados do membro lidos com a sessão dele (**RLS**), ligar/desligar novidades (`club.set_marketing_consent` → opt-in/opt-out no outbox), pedir cópia ou apagamento dos dados do Club, sair. `/entrar` envia link de entrada (nunca cria conta; resposta igual exista ou não o e-mail). Um utilizador da Master sem perfil do Club vê só o convite para se cadastrar.
   - **Interesse Genesis a partir da conta** (004): quem se registou só no Club vê o cartão "Genesis · Turma 01" com o Early Access e pode registar interesse (com pedido opcional da condição de estudante) → `POST /api/club/genesis-interest` → `club.register_genesis_interest` (servidor, só adultos com perfil; idempotente; reativa uma candidatura retirada; CRM só com opt-in). Sem preço, cotação nem pagamento; `created_at` prova o prazo do Early Access (30/11/2026).
6. Menores: **sem conta**. Adolescente → linha em `club.club_guardian_reviews` com o e-mail de contacto; criança (<12) → o formulário **não pede nem envia** o e-mail e a API recusa-o (400) se chegar; fica uma linha sem contacto. A equipa trata manualmente; nada de conta, CRM, matrícula ou cobrança antes da revisão.
7. CRM: `club.club_crm_outbox` → webhook HTTPS assinado (§5). Entrega imediata após registo/alteração; o cron diário (`vercel.json` → `/api/club/crm-sync`) repete falhas e aplica a retenção (`club.purge_expired`).
8. Interessados já recebidos (`public.club_interest`, `/api/interesse`) e o WhatsApp assistido ficam como estão; o PR2B não os lê nem os altera.

## 2. Supabase — DB Master (Helena; nada disto foi feito)
0. **Master já com o 002 (auditoria de 15/10):** seguir `docs/sql/drafts/RECONCILIACAO_MASTER.md` (diagnóstico de leitura → `reconcile/apply_003_004.sql`); não reaplicar o 002.
1. **Ambiente isolado primeiro** (branch Supabase ou cópia, preparado pela Helena): aplicar `docs/sql/drafts/002_club_auth_onboarding.sql`, depois `docs/sql/drafts/003_club_signup_live.sql` e `docs/sql/drafts/004_club_genesis_interest.sql`; correr o Security Advisor. Só depois, com aprovação do Sérgio, na Master. Localmente: `scripts/test-sql-draft.sh` (Postgres descartável) corre os testes RLS e do modo live.
2. **Settings → API → Exposed schemas:** acrescentar `club` (as tabelas ficam fechadas por RLS; o membro só lê o que é seu).
3. **Authentication → Providers → Email:** ativo e "Confirm email" ligado. **Decisão Helena/Sérgio:** se "Allow new users to sign up" estiver desligado na Master, o cadastro devolve 503 até ser ligado.
4. **Authentication → URL Configuration → Redirect URLs:** acrescentar `<origem do Club>/entrar/confirmar` (staging e produção). **Não mudar o Site URL** nem os modelos de e-mail: são globais da Master.
5. **SMTP próprio** da Master com SPF/DKIM e limites de envio adequados; o SMTP de teste do Supabase não serve para lançamento.

## 3. Cloudflare Turnstile
Widget para o hostname do Club (e o de staging), modo "Managed". Gera `NEXT_PUBLIC_TURNSTILE_SITE_KEY` e `TURNSTILE_SECRET_KEY`.

## 4. Vercel (`atlas-hub1` / `atlashub-club`) — primeiro só no ambiente **Preview**
| Variável | Valor | Segredo? |
|---|---|---|
| `CLUB_AUTH_MODE` | `live` | não |
| `CLUB_SITE_ORIGIN` | origem exata do ambiente (sem `/` final); o Preview precisa da sua própria | não |
| `SUPABASE_URL` | URL da Master (já existe) | não |
| `SUPABASE_ANON_KEY` | chave anon/publishable da Master (usada só no servidor) | não, mas não expor sem necessidade |
| `SUPABASE_SERVICE_ROLE_KEY` | service role (já existe; marcar como **Sensitive**) | **sim** |
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

## 6. Teste no ambiente isolado (antes de qualquer produção)
1. `/participar` com caixa da equipa → e-mail recebido → "Confirmar e entrar" (mesmo navegador) → `/conta/concluir` → aceitar termos → `/conta` mostra nome e percurso.
2. Confirmar no SQL: 1 linha em `club_profiles`, 3 em `club_consent_events`, 0 no outbox sem opt-in, 0 em `club_pending_signups`.
3. Repetir com opt-in e Genesis estudante → `student_pending` + 2 eventos no outbox; desligar novidades em `/conta` → `contact_opt_out`.
4. Menor (adolescente/criança) → só `club_guardian_reviews`, nenhum utilizador novo em `auth.users`; criança sem e-mail.
5. `/entrar` com e-mail inexistente → mesma mensagem, nenhum e-mail enviado.
6. Utilizador existente de outra app da Master entra pelo `/entrar` → `/conta` mostra "ainda não há perfil do Club"; com a sessão dele, `select` em `public.*` pela API devolve erro de permissão.
7. `GET /api/club/crm-sync` com `Authorization: Bearer <CRON_SECRET>` → JSON com `crm` e `purge`.

### 6.1 Prova de que uma sessão do Club não autoriza nada noutras apps da Master
Só leitura; anexar o resultado ao relatório GO/NO-GO (com o SHA completo do commit testado).
1. Privilégios do `authenticated`/`anon` fora do schema `club` (esperado: nenhuma linha, ou só as que cada app justificar):
   ```sql
   select table_schema, table_name, grantee, privilege_type
   from information_schema.role_table_grants
   where grantee in ('anon','authenticated') and table_schema not in ('club','pg_catalog','information_schema')
   order by 1,2;
   ```
2. Funções executáveis por `authenticated` fora de `club`, `auth`, `extensions` e `graphql`:
   ```sql
   select n.nspname, p.proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where has_function_privilege('authenticated', p.oid, 'execute')
     and n.nspname not in ('club','auth','extensions','graphql','graphql_public','pg_catalog','information_schema','realtime','storage','vault','net','cron','pgbouncer');
   ```
3. Storage: políticas em `storage.objects` que aceitem qualquer `authenticated` (`select policyname, roles, qual from pg_policies where schemaname = 'storage'`).
4. Edge Functions e backends das outras apps: confirmar que não aceitam "qualquer JWT válido da Master" como autorização (devem verificar papel/pertença próprios). Teste prático: com a sessão de uma conta criada só pelo Club, chamar as APIs de cada app e esperar 401/403.
5. Realtime: nenhum canal de outra app aberto a `authenticated` sem filtro.

## 7. Reversão
- Desligar: remover `CLUB_AUTH_MODE` (ou pôr `off`) e refazer o deploy → o formulário volta ao modo demonstração; nenhum dado é apagado.
- Código: reverter o merge deste PR.
- Base: `drop schema club cascade` (só com decisão do Sérgio; destrói registos do Club). **Nunca apagar utilizadores de `auth.users` na Master**: podem pertencer a outras aplicações; contas criadas só pelo Club tratam-se caso a caso.
- Redirect URL do Club removível da lista sem efeito nas outras apps.

## 8. Pendentes fora do código
- Textos finais de termos e privacidade (versões `club-terms-*`/`club-privacy-*`), incluindo tratamento real de dados e menores.
- Runbook da revisão de responsável (quem contacta, por que canal, prazo, `evidence_ref`).
- Decisão de retenção da prova de consentimento após apagamento de conta (doc 16 §6).
