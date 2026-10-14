-- Testes RLS do rascunho 002 (Postgres local descartável, dados fictícios).
\set ON_ERROR_STOP on
insert into auth.users values
  ('00000000-0000-0000-0000-00000000000a', 'a@example.test', now()),   -- verificado
  ('00000000-0000-0000-0000-00000000000b', 'b@example.test', now()),   -- verificado
  ('00000000-0000-0000-0000-00000000000c', 'c@example.test', null);    -- por verificar

create or replace function pg_temp.expect_fail(sql text, label text) returns void language plpgsql as $$
begin
  begin execute sql; exception when others then raise notice 'OK (bloqueado): % — %', label, sqlerrm; return; end;
  raise exception 'FALHA: % devia ter sido bloqueado', label;
end $$;
grant execute on function pg_temp.expect_fail(text,text) to anon, authenticated;

-- A (verificado) cria o seu perfil, intenção, consentimento de marketing e candidatura
set role authenticated; set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000a';
insert into club.club_profiles(user_id, display_name, age_band) values (auth.uid(), 'Pessoa A', 'adult');
insert into club.club_signup_intents(user_id, plan, interests) values (auth.uid(), 'genesis', '{"Pesquisa e escrita"}');
insert into club.club_consent_events(user_id, kind, granted, source) values (auth.uid(), 'marketing', true, 'member_settings');
insert into club.club_genesis_applications(user_id) values (auth.uid());
select pg_temp.expect_fail($q$insert into club.club_profiles(user_id, display_name, age_band) values ('00000000-0000-0000-0000-00000000000b','X','adult')$q$, 'inserir perfil de outro membro');
select pg_temp.expect_fail($q$insert into club.club_consent_events(user_id, kind, version, granted) values (auth.uid(), 'terms', 'v', true)$q$, 'membro forja consentimento de termos');
select pg_temp.expect_fail($q$update club.club_consent_events set granted = false$q$, 'alterar consentimento (append-only)');
select pg_temp.expect_fail($q$update club.club_genesis_applications set status = 'member'$q$, 'auto-promoção a membro Genesis');
select pg_temp.expect_fail($q$update club.club_profiles set age_band = 'adult'$q$, 'alterar coluna não permitida');
select pg_temp.expect_fail($q$select * from club.club_crm_outbox$q$, 'ler outbox CRM');
select pg_temp.expect_fail($q$select club.hit_rate_limit('k', 1, '1 minute')$q$, 'chamar rate limit como membro');
update club.club_profiles set display_name = 'Pessoa A2';
reset role;

-- B não vê nada de A
set role authenticated; set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000b';
do $$ begin
  if (select count(*) from club.club_profiles) <> 0 then raise exception 'FALHA: B vê perfil de A'; end if;
  if (select count(*) from club.club_consent_events) <> 0 then raise exception 'FALHA: B vê consentimentos de A'; end if;
  if (select count(*) from club.my_marketing_consent) <> 0 then raise exception 'FALHA: view expõe A'; end if;
  raise notice 'OK: isolamento entre membros';
end $$;
reset role;

-- C (email por verificar) não escreve
set role authenticated; set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000c';
select pg_temp.expect_fail($q$insert into club.club_profiles(user_id, display_name, age_band) values (auth.uid(), 'Pessoa C', 'adult')$q$, 'escrita sem email verificado');
reset role;

-- anon não acede a nada
set role anon;
select pg_temp.expect_fail($q$select * from club.club_profiles$q$, 'anon lê perfis');
reset role;

-- Menores e payload CRM com dados pedagógicos são recusados mesmo pelo servidor
set role service_role;
select pg_temp.expect_fail($q$insert into club.club_profiles(user_id, display_name, age_band) values ('00000000-0000-0000-0000-00000000000b','Menor','minor')$q$, 'perfil de menor');
select pg_temp.expect_fail($q$insert into club.club_crm_outbox(user_id, event, payload) values ('00000000-0000-0000-0000-00000000000a','contact_opt_in','{"email":"a@example.test","display_name":"A","source":"club","interests":["x"]}')$q$, 'outbox com dados pedagógicos');
insert into club.club_crm_outbox(user_id, event, payload) values ('00000000-0000-0000-0000-00000000000a','contact_opt_in','{"email":"a@example.test","display_name":"A","source":"club"}');
do $$ begin
  if not club.hit_rate_limit('h', 2, '1 minute') or not club.hit_rate_limit('h', 2, '1 minute') then raise exception 'FALHA rl'; end if;
  if club.hit_rate_limit('h', 2, '1 minute') then raise exception 'FALHA: rate limit não bloqueou'; end if;
  raise notice 'OK: rate limit partilhado bloqueia a 3.ª tentativa';
end $$;
reset role;

-- Apagamento de conta remove tudo em cascata
delete from auth.users where id = '00000000-0000-0000-0000-00000000000a';
do $$ begin
  if exists (select 1 from club.club_consent_events) or exists (select 1 from club.club_profiles)
     or exists (select 1 from club.club_crm_outbox) then raise exception 'FALHA: cascade'; end if;
  raise notice 'OK: apagamento em cascata';
end $$;
\echo TODOS OS TESTES RLS PASSARAM
