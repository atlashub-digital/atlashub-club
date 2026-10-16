# Reconciliação do schema `club` na DB Master (para a Helena)

**Problema (auditoria de 15/10/2026, #27):** na Master faltam `club.club_pending_signups` e `club.stash_signup`, e o papel `authenticated` ainda tem `INSERT`/`UPDATE` direto em `club_profiles` e `club_intents`. Isto é exatamente o estado "**002 aplicado, 003 e 004 por aplicar**" — reproduzido e corrigido em `scripts/test-sql-master-reconcile.sh`.
**Regra:** o 002 **não** se reaplica (não é reexecutável). O 003 e o 004 são reexecutáveis e aplicam-se juntos numa só transação.

## Passos (nada disto altera dados de membros)
1. **Diagnóstico só de leitura** (Master ou ambiente isolado):
   `psql "$DB" -At -f docs/sql/drafts/tools/club_schema_audit.sql`
   Devolve linhas `area|objeto|origem|estado` (`OK`/`FALTA`/`RISCO`) e uma linha final de diagnóstico. Guardar a saída no relatório.
2. **Ambiente isolado** (branch Supabase ou cópia do schema `club`): com o diagnóstico "002 aplicado, 003/004 em falta",
   `psql "$DB_ISOLADO" -f docs/sql/drafts/reconcile/apply_003_004.sql`
   - Pré-condição: recusa (sem alterar nada) se faltar alguma peça do 002.
   - Pós-condição: aborta e desfaz tudo se `authenticated` ainda puder inserir ou executar `complete_signup`.
3. Repetir o passo 1 → **zero linhas `FALTA`/`RISCO`**. Correr o Security Advisor. Correr os testes do modo live contra o ambiente (`docs/sql/drafts/tests/003_live_test.sql`, `004_genesis_interest_test.sql`) **só** num ambiente descartável: os testes criam utilizadores fictícios.
4. **Master:** só depois do passo 3 verde e com aprovação do Sérgio, repetir o passo 2 na Master e o passo 1 para provar o resultado.
5. Seguir `docs/17_PR2B_LIVE_SETUP.md` §2–§6 (Auth: Confirm email, Redirect URL `/entrar/confirmar`, SMTP com SPF/DKIM; env vars; homologação ponta a ponta). `CLUB_AUTH_MODE` continua `off` até ao relatório GO.

## Matrícula Genesis (005)
Depois de 003/004 aplicados e auditados: `psql "$DB" -f docs/sql/drafts/005_club_genesis_checkout.sql` (reexecutável; vendas fechadas por defeito em `club_cohorts`).

## Reversão
`psql "$DB" -f docs/sql/drafts/reconcile/rollback_003_004.sql` remove apenas os objetos novos do 003/004 (funções, `club_pending_signups`, coluna `claimed_at`, índice do outbox). **Não** volta a dar `INSERT` ao `authenticated` — reabrir essa escrita seria regressão de segurança. Reversão funcional imediata: `CLUB_AUTH_MODE=off` na Vercel.

## Prova local / CI
`scripts/test-sql-master-reconcile.sh` (job `sql-draft` do CI): simula a Master (stub Supabase + 002), confirma os achados da auditoria, prova que a pré-condição recusa sem efeitos, aplica, confirma zero achados, reaplica (reexecutável), reverte, reaplica e corre os testes do 003 e 004.
