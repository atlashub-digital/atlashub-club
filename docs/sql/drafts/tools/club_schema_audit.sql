-- =============================================================================
-- Auditoria SÓ DE LEITURA do schema `club` (Master ou ambiente isolado).
-- Produz a matriz "esperado vs. existente" pedida para o GO/NO-GO do PR2B (#23, issue #27).
-- Não altera nada: só SELECTs sobre o catálogo. Seguro de correr na Master.
--   psql "$DATABASE_URL" -f docs/sql/drafts/tools/club_schema_audit.sql
-- Estados: OK · FALTA (objeto esperado ausente) · RISCO (permissão/estado inseguro) · 002/003/004 = migração de origem.
-- =============================================================================
with
exp_tables(origem, nome) as (values
  ('002','club_profiles'), ('002','club_guardian_reviews'), ('002','club_signup_intents'),
  ('002','club_consent_events'), ('002','club_genesis_applications'), ('002','club_data_requests'),
  ('002','club_crm_outbox'), ('002','club_rate_limits'), ('003','club_pending_signups')),
exp_functions(origem, assinatura) as (values
  ('002','club.is_verified()'), ('002','club.touch_updated_at()'), ('002','club.guardian_review_transition()'),
  ('002','club.has_guardian_approval(uuid)'), ('002','club.require_guardian_for_minor_profile()'),
  ('002','club.forbid_mutation()'), ('002','club.genesis_minor_gate()'), ('002','club.hit_rate_limit(text,integer,interval)'),
  ('003','club.stash_signup(text,jsonb)'), ('003','club.get_pending_signup(uuid)'), ('003','club.complete_signup(uuid,jsonb)'),
  ('003','club.set_marketing_consent(uuid,boolean,text)'), ('003','club.claim_crm_outbox(integer)'),
  ('003','club.complete_crm_outbox(bigint[])'), ('003','club.purge_expired()'),
  ('004','club.register_genesis_interest(uuid,boolean,text)')),
exp_triggers(origem, tabela, nome) as (values
  ('002','club_profiles','club_profiles_touch'), ('002','club_profiles','club_profiles_minor_gate'),
  ('002','club_guardian_reviews','club_guardian_reviews_transition'), ('002','club_consent_events','club_consent_append_only'),
  ('002','club_genesis_applications','club_genesis_touch'), ('002','club_genesis_applications','club_genesis_minor_gate')),
-- Depois do 003, o papel `authenticated` (partilhado por todas as apps da Master) não escreve diretamente nestas tabelas.
forbidden_writes(origem, tabela, priv) as (
  select '003', t, p from unnest(array['club_profiles','club_signup_intents','club_consent_events','club_genesis_applications']) t,
                          unnest(array['INSERT','UPDATE']) p),
service_only_fn(origem, assinatura) as (
  select origem, assinatura from exp_functions where origem in ('003','004') or assinatura like '%hit_rate_limit%' or assinatura like '%has_guardian%'),
rows as (
  select 1 o, 'schema' area, 'club' objeto, '-' origem,
         case when to_regnamespace('club') is null then 'FALTA' else 'OK' end estado
  union all
  select 2, 'tabela', 'club.'||nome, origem, case when to_regclass('club.'||nome) is null then 'FALTA' else 'OK' end from exp_tables
  union all
  select 3, 'RLS ativa', 'club.'||nome, origem,
         case when to_regclass('club.'||nome) is null then 'FALTA'
              when (select relrowsecurity from pg_class where oid = to_regclass('club.'||nome)) then 'OK' else 'RISCO' end
  from exp_tables where nome <> 'club_pending_signups'
  union all
  select 4, 'função', assinatura, origem, case when to_regprocedure(assinatura) is null then 'FALTA' else 'OK' end from exp_functions
  union all
  select 5, 'trigger', tabela||'.'||nome, origem,
         case when exists (select 1 from pg_trigger g join pg_class c on c.oid=g.tgrelid join pg_namespace n on n.oid=c.relnamespace
                           where n.nspname='club' and c.relname=tabela and g.tgname=nome and not g.tgisinternal) then 'OK' else 'FALTA' end
  from exp_triggers
  union all
  select 6, 'sem '||priv||' do authenticated', 'club.'||tabela, origem,
         case when to_regclass('club.'||tabela) is null then 'FALTA'
              when has_table_privilege('authenticated', 'club.'||tabela, priv) then 'RISCO' else 'OK' end
  from forbidden_writes
  union all
  select 7, 'sem acesso anon/authenticated', 'club.club_pending_signups', '003',
         case when to_regclass('club.club_pending_signups') is null then 'FALTA'
              when has_table_privilege('authenticated','club.club_pending_signups','SELECT')
                or has_table_privilege('anon','club.club_pending_signups','SELECT') then 'RISCO' else 'OK' end
  union all
  select 8, 'só service_role executa', assinatura, origem,
         case when to_regprocedure(assinatura) is null then 'FALTA'
              when has_function_privilege('authenticated', to_regprocedure(assinatura), 'EXECUTE')
                or has_function_privilege('anon', to_regprocedure(assinatura), 'EXECUTE') then 'RISCO' else 'OK' end
  from service_only_fn
  union all
  select 9, 'coluna', 'club.club_crm_outbox.claimed_at', '003',
         case when exists (select 1 from information_schema.columns where table_schema='club' and table_name='club_crm_outbox' and column_name='claimed_at')
              then 'OK' else 'FALTA' end
)
select area, objeto, origem, estado from rows order by o, origem, objeto;

-- Resumo e diagnóstico
with s as (
  select
    to_regclass('club.club_profiles') is not null as tem_002,
    to_regclass('club.club_pending_signups') is not null as tem_003,
    to_regprocedure('club.register_genesis_interest(uuid,boolean,text)') is not null as tem_004
)
select case
  when not tem_002 then 'Estado: schema club ausente ou incompleto antes do 002 → aplicar 002, 003 e 004 (ambiente isolado primeiro).'
  when tem_002 and not tem_003 then 'Estado: 002 aplicado, 003/004 em falta → aplicar 003 e 004 numa só transação (docs/sql/drafts/RECONCILIACAO_MASTER.md). NÃO reaplicar 002.'
  when tem_003 and not tem_004 then 'Estado: 002+003 aplicados → aplicar 004.'
  else 'Estado: 002+003+004 presentes → confirmar que não há linhas RISCO/FALTA acima.' end as diagnostico
from s;
