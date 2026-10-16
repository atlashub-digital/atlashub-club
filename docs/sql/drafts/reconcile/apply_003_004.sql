-- =============================================================================
-- Reconciliação da Master: schema `club` com 002 aplicado e 003/004 em falta (auditoria de 15/10, issue #27).
-- Aplica 003 e 004 numa ÚNICA transação; qualquer erro desfaz tudo. Não reaplica 002.
-- Correr primeiro no ambiente isolado; na Master só depois da matriz verde e com aprovação.
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f docs/sql/drafts/reconcile/apply_003_004.sql
-- Antes e depois: docs/sql/drafts/tools/club_schema_audit.sql
-- =============================================================================
\set ON_ERROR_STOP on
begin;

-- Pré-condição: o 002 tem de estar presente e completo (senão parar, sem alterar nada).
do $$
declare missing text[] := array[]::text[]; t text;
begin
  foreach t in array array['club_profiles','club_guardian_reviews','club_signup_intents','club_consent_events',
                           'club_genesis_applications','club_data_requests','club_crm_outbox','club_rate_limits'] loop
    if to_regclass('club.'||t) is null then missing := missing || t; end if;
  end loop;
  if to_regprocedure('club.has_guardian_approval(uuid)') is null then missing := missing || 'has_guardian_approval'::text; end if;
  if to_regprocedure('club.genesis_minor_gate()') is null then missing := missing || 'genesis_minor_gate'::text; end if;
  if cardinality(missing) > 0 then
    raise exception 'Pré-condição falhou: objetos do 002 em falta: % — não aplicar; rever a matriz com a equipa.', missing;
  end if;
  raise notice 'Pré-condição OK: 002 presente.';
end $$;

\ir ../003_club_signup_live.sql
\ir ../004_club_genesis_interest.sql

-- Pós-condição: os achados da auditoria ficam resolvidos dentro da mesma transação.
do $$ begin
  if to_regclass('club.club_pending_signups') is null then raise exception 'pós: club_pending_signups em falta'; end if;
  if to_regprocedure('club.stash_signup(text,jsonb)') is null then raise exception 'pós: stash_signup em falta'; end if;
  if has_table_privilege('authenticated','club.club_profiles','INSERT')
     or has_table_privilege('authenticated','club.club_signup_intents','INSERT')
     or has_table_privilege('authenticated','club.club_consent_events','INSERT')
     or has_table_privilege('authenticated','club.club_genesis_applications','INSERT') then
    raise exception 'pós: authenticated ainda tem INSERT direto';
  end if;
  if has_function_privilege('authenticated', 'club.complete_signup(uuid,jsonb)'::regprocedure, 'EXECUTE') then
    raise exception 'pós: authenticated executa complete_signup';
  end if;
  raise notice 'Pós-condição OK: achados da auditoria resolvidos.';
end $$;

commit;
