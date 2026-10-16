-- Testes de 005 (matrícula Genesis via ARO). Corre depois de 004: 101 = adulto (estudante pendente em 004),
-- 102 = adulto interessado, 103 = e-mail por verificar.
\set ON_ERROR_STOP on
create or replace function pg_temp.expect_fail(sql text, msg text) returns void language plpgsql as $$
begin
  begin execute sql; exception when others then
    if position(msg in sqlerrm) = 0 then raise exception 'FALHA: esperava % mas veio %', msg, sqlerrm; end if;
    raise notice 'OK (bloqueado): %', msg; return;
  end;
  raise exception 'FALHA: esperava falha %', msg;
end $$;
grant execute on function pg_temp.expect_fail(text,text) to anon, authenticated, service_role;

-- Só o servidor
set role authenticated; set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000102';
select pg_temp.expect_fail($q$select * from club.genesis_start_checkout(auth.uid(), 'genesis-01-br', 'v1')$q$, 'permission denied');
select pg_temp.expect_fail($q$insert into club.club_aro_checkouts (user_id, offer, terms_version) values (auth.uid(), 'genesis-01-br', 'v1')$q$, 'permission denied');
reset role;

set role service_role;
-- vendas fechadas por defeito
select pg_temp.expect_fail($q$select * from club.genesis_start_checkout('00000000-0000-0000-0000-000000000102', 'genesis-01-br', 'v1')$q$, 'sales_closed');
update club.club_cohorts set sales_open = true, capacity = 2 where cohort = 'genesis-01';
-- e-mail por verificar, oferta desconhecida, estudante sem aprovação
select pg_temp.expect_fail($q$select * from club.genesis_start_checkout('00000000-0000-0000-0000-000000000103', 'genesis-01-br', 'v1')$q$, 'email_unconfirmed');
select pg_temp.expect_fail($q$select * from club.genesis_start_checkout('00000000-0000-0000-0000-000000000102', 'genesis-01-barato', 'v1')$q$, 'offer_unknown');
select pg_temp.expect_fail($q$select * from club.genesis_start_checkout('00000000-0000-0000-0000-000000000101', 'genesis-01-student-br', 'v1')$q$, 'student_not_approved');

do $$ declare k uuid; o text; begin
  -- padrão não exige estudante; retoma idempotente
  select id, outcome into k, o from club.genesis_start_checkout('00000000-0000-0000-0000-000000000102', 'genesis-01-br', 'v1');
  if o <> 'new' then raise exception 'FALHA: esperava new'; end if;
  if (select outcome from club.genesis_start_checkout('00000000-0000-0000-0000-000000000102', 'genesis-01-br', 'v1')) <> 'resume' then raise exception 'FALHA: resume'; end if;
  if (select status from club.club_genesis_applications where user_id = '00000000-0000-0000-0000-000000000102') <> 'awaiting_payment' then raise exception 'FALHA: awaiting_payment'; end if;
  perform club.genesis_attach_checkout(k, 's1', 'o1', 49000, now() + interval '30 minutes');
  perform pg_temp.expect_fail(format('select club.genesis_confirm(%L, %L)', k, 'outra'), 'order_mismatch');
  if not club.genesis_confirm(k, 'o1') then raise exception 'FALHA: confirm'; end if;
  if club.genesis_confirm(k, 'o1') then raise exception 'FALHA: confirm não idempotente'; end if;
  if (select status from club.club_genesis_applications where user_id = '00000000-0000-0000-0000-000000000102') <> 'member' then raise exception 'FALHA: member'; end if;
  if (select outcome from club.genesis_start_checkout('00000000-0000-0000-0000-000000000102', 'genesis-01-br', 'v1')) <> 'already_paid' then raise exception 'FALHA: already_paid'; end if;
  raise notice 'OK: padrão sem estudante, retoma, confirmação idempotente, sem segunda compra';
end $$;

-- estudante: pedido → aprovação humana → oferta de estudante permitida; troca de oferta liberta a anterior
do $$ declare k uuid; begin
  perform club.request_student_eligibility('00000000-0000-0000-0000-000000000101', 'Universidade X');
  perform pg_temp.expect_fail($q$select club.decide_student_eligibility('00000000-0000-0000-0000-000000000101', true, null, 'rev', null, now() + interval '180 days')$q$, 'club_student_eligibility_check');
  perform club.decide_student_eligibility('00000000-0000-0000-0000-000000000101', true, 'email-institucional', 'Equipe', null, now() + interval '180 days');
  if club.genesis_offer_check('00000000-0000-0000-0000-000000000101', 'genesis-01-student-br') <> 'ok' then raise exception 'FALHA: estudante aprovado'; end if;
  select id into k from club.genesis_start_checkout('00000000-0000-0000-0000-000000000101', 'genesis-01-br', 'v1');
  perform club.genesis_start_checkout('00000000-0000-0000-0000-000000000101', 'genesis-01-student-br', 'v1');
  if (select status from club.club_aro_checkouts where id = k) <> 'released' then raise exception 'FALHA: troca de oferta'; end if;
  -- elegibilidade expirada volta a bloquear
  update club.club_student_eligibility set expires_at = now() - interval '1 day' where user_id = '00000000-0000-0000-0000-000000000101';
  if club.genesis_offer_check('00000000-0000-0000-0000-000000000101', 'genesis-01-student-br') <> 'student_not_approved' then raise exception 'FALHA: expirada'; end if;
  raise notice 'OK: estudante só com aprovação humana válida; troca de oferta sem duplicar';
end $$;

-- limite de turma (capacidade 2: 102 pago + 101 pendente)
reset role;
insert into auth.users(id, email, email_confirmed_at) values ('00000000-0000-0000-0000-000000000110', 'novo@example.test', now());
insert into club.club_profiles(user_id, display_name, age_band) values ('00000000-0000-0000-0000-000000000110', 'Novo', 'adult');
set role service_role;
select pg_temp.expect_fail($q$select * from club.genesis_start_checkout('00000000-0000-0000-0000-000000000110', 'genesis-01-br', 'v1')$q$, 'sold_out');

-- reembolso devolve a candidatura a interested; webhook deduplicado; expiração liberta
do $$ begin
  if club.genesis_revoke('o1', 'payment.refunded') <> 1 then raise exception 'FALHA: revoke'; end if;
  if (select status from club.club_genesis_applications where user_id = '00000000-0000-0000-0000-000000000102') <> 'interested' then raise exception 'FALHA: estado após reembolso'; end if;
  if not club.aro_record_event('e1', 'payment.approved') or club.aro_record_event('e1', 'payment.approved') then raise exception 'FALHA: dedupe'; end if;
  perform club.genesis_release((select id from club.club_aro_checkouts where user_id = '00000000-0000-0000-0000-000000000101' and status = 'pending'), 'aro_expired');
  if (select status from club.club_genesis_applications where user_id = '00000000-0000-0000-0000-000000000101') <> 'interested' then raise exception 'FALHA: release'; end if;
  raise notice 'OK: reembolso, expiração e deduplicação';
end $$;
reset role;

-- membro lê só as suas matrículas
set role authenticated; set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000102';
do $$ begin
  if exists (select 1 from club.club_aro_checkouts where user_id <> auth.uid()) then raise exception 'FALHA: RLS'; end if;
  if not exists (select 1 from club.club_aro_checkouts) then raise exception 'FALHA: não vê a sua'; end if;
end $$;
reset role;
select 'TODOS OS TESTES DO 005 PASSARAM';
