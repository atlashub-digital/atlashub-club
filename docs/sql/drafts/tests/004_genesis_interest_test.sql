-- Testes de 004 (interesse Genesis a partir da conta). Corre depois de 003_live_test.sql:
-- 101 = adulto só no Club, sem marketing; 102 = adulto já com Genesis estudante; 103 = e-mail por verificar.
\set ON_ERROR_STOP on
create or replace function pg_temp.expect_fail(sql text, label text) returns void language plpgsql as $$
begin
  begin execute sql; exception when others then raise notice 'OK (bloqueado): % — %', label, sqlerrm; return; end;
  raise exception 'FALHA: % devia ter sido bloqueado', label;
end $$;
grant execute on function pg_temp.expect_fail(text,text) to anon, authenticated, service_role;

-- Só o servidor regista o interesse
set role authenticated; set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000101';
select pg_temp.expect_fail($q$select club.register_genesis_interest(auth.uid(), false, 'member_account')$q$, 'membro chama register_genesis_interest');
reset role;
set role anon;
select pg_temp.expect_fail($q$select club.register_genesis_interest('00000000-0000-0000-0000-000000000101', false, 'member_account')$q$, 'anon chama register_genesis_interest');
reset role;

set role service_role;
select pg_temp.expect_fail($q$select club.register_genesis_interest('00000000-0000-0000-0000-000000000103', false, 'member_account')$q$, 'conta sem e-mail verificado nem perfil');
select pg_temp.expect_fail($q$select club.register_genesis_interest('00000000-0000-0000-0000-000000000101', false, 'outra')$q$, 'origem inválida');
do $$ declare r text; n_outbox int; begin
  select count(*) into n_outbox from club.club_crm_outbox;
  r := club.register_genesis_interest('00000000-0000-0000-0000-000000000101', true, 'member_account');
  if r <> 'created' then raise exception 'FALHA: primeiro registo devolveu %', r; end if;
  if (select status from club.club_genesis_applications where user_id = '00000000-0000-0000-0000-000000000101') <> 'student_pending'
    then raise exception 'FALHA: estudante devia ficar student_pending'; end if;
  if (select count(*) from club.club_crm_outbox) <> n_outbox then raise exception 'FALHA: CRM sem opt-in'; end if;
  if club.register_genesis_interest('00000000-0000-0000-0000-000000000101', false, 'member_account') <> 'existing'
    then raise exception 'FALHA: segundo registo não é idempotente'; end if;
  if (select student_intent from club.club_genesis_applications where user_id = '00000000-0000-0000-0000-000000000101') is not true
    then raise exception 'FALHA: segundo registo alterou a candidatura'; end if;
  raise notice 'OK: interesse registado uma vez, estudante pendente, sem CRM sem opt-in';
end $$;
reset role;

-- Retirada e reativação; com opt-in (102 desligou-o em 003 e volta a ligá-lo) vai para o outbox
update club.club_genesis_applications set status = 'withdrawn' where user_id = '00000000-0000-0000-0000-000000000102';
set role service_role;
select club.set_marketing_consent('00000000-0000-0000-0000-000000000102', true, 'member_settings');
do $$ declare n_outbox int; begin
  select count(*) into n_outbox from club.club_crm_outbox where event = 'genesis_interest';
  if club.register_genesis_interest('00000000-0000-0000-0000-000000000102', false, 'member_account') <> 'reactivated'
    then raise exception 'FALHA: reativação'; end if;
  if (select status from club.club_genesis_applications where user_id = '00000000-0000-0000-0000-000000000102') <> 'interested'
    then raise exception 'FALHA: estado após reativação'; end if;
  if (select count(*) from club.club_crm_outbox where event = 'genesis_interest') <> n_outbox + 1
    then raise exception 'FALHA: opt-in devia gerar evento CRM'; end if;
  raise notice 'OK: reativação após retirada e evento CRM só com opt-in';
end $$;
reset role;

-- Defesa em profundidade: perfil de menor (só com aprovação do responsável) não usa este caminho
insert into auth.users(id, email, email_confirmed_at) values ('00000000-0000-0000-0000-000000000105', 'teen@example.test', now());
do $$ begin
  insert into club.club_profiles(user_id, display_name, age_band) values ('00000000-0000-0000-0000-000000000105', 'Teen', 'teen');
  raise notice 'perfil de menor criado só para o teste';
exception when others then raise notice 'OK: perfil de menor recusado sem aprovação (%), caminho fechado na origem', sqlerrm;
end $$;
set role service_role;
select pg_temp.expect_fail($q$select club.register_genesis_interest('00000000-0000-0000-0000-000000000105', false, 'member_account')$q$, 'menor pela conta');
reset role;
\echo TODOS OS TESTES DO 004 PASSARAM
