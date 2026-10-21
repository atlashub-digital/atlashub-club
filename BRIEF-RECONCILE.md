# BRIEF — Port cirúrgico #23 → fix/club-auth-reconcile-20261020

Branch criada: fix/club-auth-reconcile-20261020 (base a98effd). A branch pr23 existe local (fetch: origin pull/23/head).

## Objetivo
Portar APENAS as melhorias canónicas do #23 sem quebrar o que a main recebeu depois. MERGE DIRETO CONFLITA em 5 ficheiros (AdesaoForm, participar/page + 3). NÃO usar merge — portar ficheiro a ficheiro.

## O que portar (5 commits únicos: a032f89, 6f7272b, 0681b87, 9a2b1f7, 513351c)
1. **club_pending_signups fora de user_metadata**: signup-handler guarda em club.club_pending_signups (email_hash, payload, created_at, expires_at) via stash_signup; complete-signup lê via get_pending_signup — REMOVE user_metadata.club_signup de src/lib/club/backend.ts e complete-signup.ts.
2. **/conta/concluir** (route + página): confirmação explícita de termos pelo dono do e-mail; portar de pr23 src/app/conta/concluir/*.
3. **PKCE atualizado** em src/lib/club/supabase.ts.
4. **003 reconciliado + 004_club_genesis_interest.sql** (docs/sql/drafts/) — NÃO reaplicar na Master (003/004 já aplicados; apenas versionar no repo).
5. **Child-block no validador** (0681b87).
6. **Prova de isolamento Master** (9a2b1f7 docs).

## O que NÃO portar
- 7 merge-syncs repetidos do pr23 (git log --merges)
- Conflitos em AdesaoForm.tsx e participar/page.tsx: a main tem a versão viva (Clara catálogo ee2f3cd, fix criança d5a0dc0) — MANTE-LAS, integrar apenas as diferenças semânticas do pr23 que não existam na main

## Preservar da main (não regredir)
- ee2f3cd envs live · 59e2785 Clara catálogo · d5a0dc0/e2f3cd fixes criança · a98effd remove debug route · b8bbe1f/ad90fff já removidos

## Banco DB Master
club_pending_signups, stash_signup, get_pending_signup, complete_signup, register_genesis_interest JÁ EXISTEM na Master (verificado). NÃO reaplicar 002/003/004 na DB. Apenas código.

## E2E
1. /participar → Turnstile → OTP → sessão → /conta/concluir → termos → perfil → 3 consents → genesis interest idempotente → pending signup removido → RLS cross-member falha → user de outra app NÃO é member.
2. Verificar JWT/user_metadata sem dados de signup.
3. Tests: unit + sql tests (scripts/test-sql-draft.sh) + e2e.

## Entrega
Commits organizados na branch, push, PR DRAFT. NÃO mergear. SHA no relatório.
