-- Testes das funções de servidor do modo live (003). Postgres local descartável, dados fictícios.
\set ON_ERROR_STOP on
create or replace function pg_temp.expect_fail(sql text, label text) returns void language plpgsql as $$
begin
  begin execute sql; exception when others then raise notice 'OK (bloqueado): % — %', label, sqlerrm; return; end;
  raise exception 'FALHA: % devia ter sido bloqueado', label;
end $$;
grant execute on function pg_temp.expect_fail(text,text) to anon, authenticated, service_role;

insert into auth.users(id, email, email_confirmed_at) values
  ('00000000-0000-0000-0000-000000000101', 'live1@example.test', now()),   -- adulto, Club, sem marketing
  ('00000000-0000-0000-0000-000000000102', 'live2@example.test', now()),   -- adulto, Genesis estudante, com marketing
  ('00000000-0000-0000-0000-000000000103', 'live3@example.test', null);    -- por verificar

-- Só o servidor chama as funções
set role authenticated; set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000101';
select pg_temp.expect_fail($q$select club.complete_signup(auth.uid(), '{}'::jsonb)$q$, 'membro chama complete_signup');
select pg_temp.expect_fail($q$select club.set_marketing_consent(auth.uid(), true, 'member_settings')$q$, 'membro chama set_marketing_consent');
select pg_temp.expect_fail($q$select * from club.claim_crm_outbox(10)$q$, 'membro lê o outbox via worker');
select pg_temp.expect_fail($q$select club.purge_expired()$q$, 'membro corre a purga');
reset role;
set role anon;
select pg_temp.expect_fail($q$select club.complete_signup('00000000-0000-0000-0000-000000000101', '{}'::jsonb)$q$, 'anon chama complete_signup');
reset role;

set role service_role;
select pg_temp.expect_fail($q$select club.complete_signup('00000000-0000-0000-0000-000000000103',
  '{"plan":"club","displayName":"Por Verificar","ageBand":"adult","termsVersion":"t","privacyVersion":"p","interests":[]}')$q$,
  'concluir registo sem e-mail verificado');
select pg_temp.expect_fail($q$select club.complete_signup('00000000-0000-0000-0000-000000000101',
  '{"plan":"club","displayName":"Menor","ageBand":"teen","termsVersion":"t","privacyVersion":"p","interests":[]}')$q$,
  'perfil de menor pelo registo direto');

do $$ begin
  if club.complete_signup('00000000-0000-0000-0000-000000000101',
       '{"plan":"club","displayName":"Live Um","ageBand":"adult","interests":["Pesquisa e escrita"],"firstMission":"organizar estudos","termsVersion":"club-terms-draft-2026-10","privacyVersion":"club-privacy-draft-2026-10","marketingOptIn":false}')
     <> 'created' then raise exception 'FALHA: registo 1'; end if;
  if club.complete_signup('00000000-0000-0000-0000-000000000101', '{"plan":"club","displayName":"Outro","ageBand":"adult"}') <> 'existing'
    then raise exception 'FALHA: idempotência'; end if;
  if (select display_name from club.club_profiles where user_id = '00000000-0000-0000-0000-000000000101') <> 'Live Um'
    then raise exception 'FALHA: segunda chamada alterou o perfil'; end if;
  if (select count(*) from club.club_consent_events where user_id = '00000000-0000-0000-0000-000000000101') <> 3
    then raise exception 'FALHA: consentimentos do registo 1'; end if;
  if exists (select 1 from club.club_crm_outbox where user_id = '00000000-0000-0000-0000-000000000101')
    then raise exception 'FALHA: CRM sem opt-in'; end if;
  if exists (select 1 from club.club_genesis_applications where user_id = '00000000-0000-0000-0000-000000000101')
    then raise exception 'FALHA: Genesis sem escolha'; end if;
  raise notice 'OK: registo Club gratuito sem marketing, idempotente, sem CRM';

  perform club.complete_signup('00000000-0000-0000-0000-000000000102',
       '{"plan":"genesis","studentIntent":true,"displayName":"Live Dois","ageBand":"adult","interests":[],"termsVersion":"club-terms-draft-2026-10","privacyVersion":"club-privacy-draft-2026-10","marketingOptIn":true}');
  if (select status from club.club_genesis_applications where user_id = '00000000-0000-0000-0000-000000000102') <> 'student_pending'
    then raise exception 'FALHA: estado Genesis estudante'; end if;
  if (select count(*) from club.club_crm_outbox where user_id = '00000000-0000-0000-0000-000000000102') <> 2
    then raise exception 'FALHA: outbox com opt-in'; end if;
  if exists (select 1 from club.club_crm_outbox where payload ?| array['interests','first_mission','area','device'])
    then raise exception 'FALHA: dados pedagógicos no outbox'; end if;
  raise notice 'OK: Genesis estudante fica student_pending; CRM só com opt-in e payload mínimo';
end $$;

-- Consentimento: só regista quando muda; opt-out vai para o outbox
do $$ begin
  if club.set_marketing_consent('00000000-0000-0000-0000-000000000102', true, 'member_settings')
    then raise exception 'FALHA: evento repetido'; end if;
  if not club.set_marketing_consent('00000000-0000-0000-0000-000000000102', false, 'member_settings')
    then raise exception 'FALHA: opt-out'; end if;
  if not exists (select 1 from club.club_crm_outbox where user_id = '00000000-0000-0000-0000-000000000102' and event = 'contact_opt_out')
    then raise exception 'FALHA: opt-out no outbox'; end if;
  raise notice 'OK: opt-out registado e enviado para supressão';
end $$;
select pg_temp.expect_fail($q$select club.set_marketing_consent('00000000-0000-0000-0000-000000000103', true, 'member_settings')$q$, 'consentimento de conta sem perfil');
select pg_temp.expect_fail($q$select club.set_marketing_consent('00000000-0000-0000-0000-000000000101', true, 'qualquer')$q$, 'origem de consentimento inválida');

-- Worker: reserva, não repete enquanto reservado, conclui
do $$ declare ids bigint[]; again int; begin
  select array_agg(id) into ids from club.claim_crm_outbox(10);
  if cardinality(ids) <> 3 then raise exception 'FALHA: reserva (%)', cardinality(ids); end if;
  select count(*) into again from club.claim_crm_outbox(10);
  if again <> 0 then raise exception 'FALHA: reserva dupla'; end if;
  if club.complete_crm_outbox(ids) <> 3 then raise exception 'FALHA: conclusão'; end if;
  raise notice 'OK: outbox reservado uma vez e concluído';
end $$;
reset role;

-- Purga: registo nunca confirmado com dados do formulário > 7 dias
insert into auth.users(id, email, email_confirmed_at, created_at, raw_user_meta_data) values
  ('00000000-0000-0000-0000-000000000104', 'old@example.test', null, now() - interval '8 days', '{"club_signup":{"plan":"club"}}'),
  ('00000000-0000-0000-0000-000000000105', 'other@example.test', null, now() - interval '8 days', '{}');
set role service_role;
select club.purge_expired();
reset role;
do $$ begin
  if exists (select 1 from auth.users where id = '00000000-0000-0000-0000-000000000104') then raise exception 'FALHA: purga'; end if;
  if not exists (select 1 from auth.users where id = '00000000-0000-0000-0000-000000000105') then raise exception 'FALHA: purga fora do Club'; end if;
  raise notice 'OK: purga só de registos do Club nunca confirmados';
end $$;
\echo TODOS OS TESTES DO MODO LIVE PASSARAM
