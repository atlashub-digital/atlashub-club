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

-- Master partilhada: um utilizador autenticado (de qualquer app) não se torna membro pela API
set role authenticated; set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000101';
select pg_temp.expect_fail($q$insert into club.club_profiles(user_id, display_name, age_band) values (auth.uid(), 'Atalho', 'adult')$q$, 'perfil criado direto pela API');
select pg_temp.expect_fail($q$insert into club.club_signup_intents(user_id, plan) values (auth.uid(), 'club')$q$, 'intenção criada direto pela API');
select pg_temp.expect_fail($q$insert into club.club_consent_events(user_id, kind, granted, source) values (auth.uid(), 'marketing', true, 'member_settings')$q$, 'consentimento direto pela API');
select pg_temp.expect_fail($q$insert into club.club_genesis_applications(user_id) values (auth.uid())$q$, 'Genesis direto pela API');
select pg_temp.expect_fail($q$insert into club.club_data_requests(user_id, kind) values (auth.uid(), 'access')$q$, 'pedido de dados sem ser membro');
select pg_temp.expect_fail($q$select * from club.club_pending_signups$q$, 'membro lê dados pendentes');
select pg_temp.expect_fail($q$select club.stash_signup(repeat('a', 64), '{}'::jsonb)$q$, 'membro grava dados pendentes');
select pg_temp.expect_fail($q$select club.get_pending_signup(auth.uid())$q$, 'membro lê dados pendentes via função');
-- Só o servidor chama as funções
select pg_temp.expect_fail($q$select club.complete_signup(auth.uid(), '{}'::jsonb)$q$, 'membro chama complete_signup');
select pg_temp.expect_fail($q$select club.set_marketing_consent(auth.uid(), true, 'member_settings')$q$, 'membro chama set_marketing_consent');
select pg_temp.expect_fail($q$select * from club.claim_crm_outbox(10)$q$, 'membro lê o outbox via worker');
select pg_temp.expect_fail($q$select club.purge_expired()$q$, 'membro corre a purga');
reset role;
set role anon;
select pg_temp.expect_fail($q$select club.complete_signup('00000000-0000-0000-0000-000000000101', '{}'::jsonb)$q$, 'anon chama complete_signup');
reset role;

set role service_role;
-- Dados pendentes: só por hash, sem e-mail, só depois de verificar o e-mail
select pg_temp.expect_fail($q$select club.stash_signup('nao-e-hash', '{}'::jsonb)$q$, 'chave que não é sha256');
select pg_temp.expect_fail($q$select club.stash_signup(encode(sha256('x'::bytea), 'hex'), '{"email":"a@example.test"}'::jsonb)$q$, 'e-mail em claro nos dados pendentes');
select club.stash_signup(encode(sha256(convert_to('live1@example.test', 'UTF8')), 'hex'), '{"plan":"club","displayName":"Live Um"}');
select club.stash_signup(encode(sha256(convert_to('live1@example.test', 'UTF8')), 'hex'), '{"plan":"club","displayName":"Live Um"}');
select club.stash_signup(encode(sha256(convert_to('live3@example.test', 'UTF8')), 'hex'), '{"plan":"club","displayName":"Por Verificar"}');
do $$ begin
  if club.get_pending_signup('00000000-0000-0000-0000-000000000101')->>'displayName' <> 'Live Um' then raise exception 'FALHA: ler pendente'; end if;
  if club.get_pending_signup('00000000-0000-0000-0000-000000000103') is not null then raise exception 'FALHA: pendente antes de verificar'; end if;
  raise notice 'OK: dados pendentes por hash, legíveis só com e-mail verificado';
end $$;
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
  if club.get_pending_signup('00000000-0000-0000-0000-000000000101') is not null
    then raise exception 'FALHA: dados pendentes ficaram depois do registo'; end if;
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

-- Membro (com perfil) pede os seus dados e lê só o que é seu
set role authenticated; set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000101';
insert into club.club_data_requests(user_id, kind) values (auth.uid(), 'access');
do $$ begin
  if (select count(*) from club.club_profiles) <> 1 then raise exception 'FALHA: membro vê perfis alheios'; end if;
  raise notice 'OK: membro pede dados e só vê o próprio perfil';
end $$;
reset role;

-- Purga: só dados pendentes expirados; nunca utilizadores de auth.users (Master partilhada)
insert into auth.users(id, email, email_confirmed_at, created_at) values
  ('00000000-0000-0000-0000-000000000104', 'outra-app@example.test', null, now() - interval '30 days');
update club.club_pending_signups set expires_at = now() - interval '1 hour'
  where email_hash = encode(sha256(convert_to('live3@example.test', 'UTF8')), 'hex');
set role service_role;
do $$ begin
  if (club.purge_expired()->>'pending_signups')::int <> 1 then raise exception 'FALHA: purga dos pendentes'; end if;
end $$;
reset role;
do $$ begin
  if exists (select 1 from club.club_pending_signups) then raise exception 'FALHA: pendente expirado ficou'; end if;
  if (select count(*) from auth.users where id in ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000104')) <> 2
    then raise exception 'FALHA: a purga apagou utilizadores'; end if;
  raise notice 'OK: purga não toca em auth.users';
end $$;
\echo TODOS OS TESTES DO MODO LIVE PASSARAM
