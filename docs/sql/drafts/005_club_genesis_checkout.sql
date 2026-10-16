-- =============================================================================
-- PR2C · 005 — matrícula paga no Genesis via ARO (RASCUNHO, NÃO APLICADO)
-- Depende de 002+003+004. Aplicar primeiro no ambiente isolado da Helena; na Master só com aprovação.
-- RFC: docs/19_PR2C_RFC_ELEGIBILIDADE_PAGAMENTOS.md. Reexecutável.
--
-- Regras:
--  - o ARO é a autoridade de preço, pagamento e direito; aqui só referências (sessão, encomenda, oferta);
--  - a oferta é decidida no servidor: `genesis-01-br` para qualquer adulto com perfil e e-mail confirmado
--    (menor só com responsável aprovado); `genesis-01-student-br` só com elegibilidade APPROVED não expirada;
--  - uma matrícula viva por membro (pendente ou paga) → sem pagamento duplicado;
--  - limite de turma opcional (`club_cohorts.capacity`, null = sem limite);
--  - `member` só depois de ARO APPROVED + direito ACTIVE re-resolvido pelo servidor (genesis_confirm);
--  - reembolso/estorno/revogação devolvem a candidatura a `interested`;
--  - tudo só service_role; `authenticated` só lê as próprias linhas.
-- =============================================================================

create table if not exists club.club_cohorts (
  cohort text primary key,
  capacity int check (capacity is null or capacity > 0),
  sales_open boolean not null default false
);
insert into club.club_cohorts (cohort) values ('genesis-01') on conflict (cohort) do nothing;

-- Elegibilidade de estudante: decisão humana auditável (RFC §5). Sem upload neste PR.
create table if not exists club.club_student_eligibility (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'PENDING' check (status in ('PENDING','APPROVED','REJECTED','EXPIRED')),
  institution text check (char_length(institution) <= 160),
  evidence_ref text check (char_length(evidence_ref) <= 200),
  reviewer text check (char_length(reviewer) <= 120),
  reason text check (char_length(reason) <= 300),
  decided_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  check (status <> 'APPROVED' or (evidence_ref is not null and reviewer is not null and expires_at is not null))
);
create index if not exists club_student_eligibility_user on club.club_student_eligibility (user_id, created_at desc);

create table if not exists club.club_aro_checkouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cohort text not null default 'genesis-01' references club.club_cohorts(cohort),
  offer text not null check (offer in ('genesis-01-br','genesis-01-student-br')),
  status text not null default 'pending' check (status in ('pending','paid','released','revoked')),
  terms_version text not null,
  aro_session_id text unique,
  aro_order_id text unique,
  amount_minor int,
  hold_until timestamptz not null default now() + interval '30 minutes',
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  ended_at timestamptz,
  end_reason text
);
create unique index if not exists club_aro_checkouts_one_live
  on club.club_aro_checkouts (user_id, cohort) where status in ('pending','paid');

create table if not exists club.club_aro_events (
  event_id text primary key,
  type text not null,
  received_at timestamptz not null default now()
);

alter table club.club_student_eligibility enable row level security;
alter table club.club_aro_checkouts enable row level security;
alter table club.club_aro_events enable row level security;
alter table club.club_cohorts enable row level security;
drop policy if exists eligibility_own on club.club_student_eligibility;
create policy eligibility_own on club.club_student_eligibility for select to authenticated using (user_id = auth.uid());
drop policy if exists checkouts_own on club.club_aro_checkouts;
create policy checkouts_own on club.club_aro_checkouts for select to authenticated using (user_id = auth.uid());
revoke all on club.club_student_eligibility, club.club_aro_checkouts, club.club_aro_events, club.club_cohorts from anon, authenticated;
grant select on club.club_student_eligibility, club.club_aro_checkouts to authenticated;
grant select, insert, update on club.club_student_eligibility, club.club_aro_checkouts, club.club_aro_events, club.club_cohorts to service_role;

-- Oferta permitida para o membro: devolve 'ok' ou o motivo.
create or replace function club.genesis_offer_check(p_user uuid, p_offer text) returns text
language plpgsql stable security definer set search_path = '' as $$
declare v_band text; v_confirmed boolean;
begin
  if p_offer not in ('genesis-01-br','genesis-01-student-br') then return 'offer_unknown'; end if;
  select (u.email_confirmed_at is not null) into v_confirmed from auth.users u where u.id = p_user;
  if not coalesce(v_confirmed, false) then return 'email_unconfirmed'; end if;
  select p.age_band into v_band from club.club_profiles p where p.user_id = p_user;
  if v_band is null then return 'no_profile'; end if;
  if v_band <> 'adult' and not club.has_guardian_approval(p_user) then return 'guardian_required'; end if;
  if p_offer = 'genesis-01-student-br' and not exists (
      select 1 from club.club_student_eligibility e
      where e.user_id = p_user and e.status = 'APPROVED' and e.expires_at > now()) then
    return 'student_not_approved';
  end if;
  return 'ok';
end $$;

-- Pedido de validação de estudante (fica PENDING para revisão humana).
create or replace function club.request_student_eligibility(p_user uuid, p_institution text) returns text
language plpgsql security definer set search_path = '' as $$
begin
  if exists (select 1 from club.club_student_eligibility e where e.user_id = p_user and e.status in ('PENDING','APPROVED') and (e.expires_at is null or e.expires_at > now())) then
    return 'existing';
  end if;
  insert into club.club_student_eligibility (user_id, institution) values (p_user, nullif(trim(p_institution), ''));
  return 'created';
end $$;

-- Decisão do revisor (equipa). APPROVED exige evidência, revisor e validade.
create or replace function club.decide_student_eligibility(p_user uuid, p_approved boolean, p_evidence_ref text, p_reviewer text, p_reason text, p_expires timestamptz)
returns void language plpgsql security definer set search_path = '' as $$
begin
  update club.club_student_eligibility set
    status = case when p_approved then 'APPROVED' else 'REJECTED' end,
    evidence_ref = p_evidence_ref, reviewer = p_reviewer, reason = p_reason, decided_at = now(),
    expires_at = case when p_approved then p_expires else null end
  where id = (select e.id from club.club_student_eligibility e where e.user_id = p_user and e.status = 'PENDING' order by e.created_at desc limit 1);
  if not found then raise exception 'no_pending_request'; end if;
end $$;

-- Inicia ou retoma a matrícula. Resultado: (id, status, outcome) com outcome new|resume|already_paid.
create or replace function club.genesis_start_checkout(p_user uuid, p_offer text, p_terms_version text)
returns table (id uuid, status text, outcome text)
language plpgsql security definer set search_path = '' as $$
declare v_check text; c club.club_cohorts; r club.club_aro_checkouts;
begin
  v_check := club.genesis_offer_check(p_user, p_offer);
  if v_check <> 'ok' then raise exception '%', v_check; end if;
  select * into c from club.club_cohorts where cohort = 'genesis-01' for update;
  if not c.sales_open then raise exception 'sales_closed'; end if;

  update club.club_aro_checkouts k set status = 'released', ended_at = now(), end_reason = 'hold_expired'
    where k.cohort = 'genesis-01' and k.status = 'pending' and k.hold_until <= now();

  select * into r from club.club_aro_checkouts k where k.user_id = p_user and k.cohort = 'genesis-01' and k.status in ('pending','paid');
  if found then
    if r.status = 'paid' then return query select r.id, r.status, 'already_paid'::text; return; end if;
    if r.offer = p_offer then return query select r.id, r.status, 'resume'::text; return; end if;
    -- mudou de oferta antes de pagar: liberta a anterior
    update club.club_aro_checkouts k set status = 'released', ended_at = now(), end_reason = 'offer_changed' where k.id = r.id;
  end if;

  if c.capacity is not null and (select count(*) from club.club_aro_checkouts k where k.cohort = 'genesis-01'
      and (k.status = 'paid' or (k.status = 'pending' and k.hold_until > now()))) >= c.capacity then
    raise exception 'sold_out';
  end if;

  insert into club.club_aro_checkouts (user_id, offer, terms_version) values (p_user, p_offer, p_terms_version) returning * into r;
  update club.club_genesis_applications a set status = 'awaiting_payment', student_intent = (p_offer = 'genesis-01-student-br')
    where a.user_id = p_user and a.cohort = 'genesis-01';
  if not found then
    insert into club.club_genesis_applications (user_id, status, student_intent) values (p_user, 'awaiting_payment', p_offer = 'genesis-01-student-br');
  end if;
  return query select r.id, r.status, 'new'::text;
end $$;

create or replace function club.genesis_attach_checkout(p_id uuid, p_session text, p_order text, p_amount int, p_expires timestamptz)
returns void language plpgsql security definer set search_path = '' as $$
begin
  update club.club_aro_checkouts set aro_session_id = p_session, aro_order_id = p_order, amount_minor = p_amount,
    hold_until = greatest(hold_until, coalesce(p_expires, now() + interval '30 minutes') + interval '5 minutes')
  where id = p_id and status = 'pending' and (aro_session_id is null or aro_session_id = p_session);
  if not found then raise exception 'not_pending'; end if;
end $$;

-- Matrícula efetiva (idempotente). Só chamar depois de APPROVED + direito ACTIVE re-resolvido.
create or replace function club.genesis_confirm(p_id uuid, p_order text) returns boolean
language plpgsql security definer set search_path = '' as $$
declare r club.club_aro_checkouts;
begin
  select * into r from club.club_aro_checkouts where id = p_id for update;
  if not found or r.aro_order_id is distinct from p_order then raise exception 'order_mismatch'; end if;
  if r.status = 'paid' then return false; end if;
  if r.status = 'revoked' then raise exception 'revoked'; end if;
  update club.club_aro_checkouts set status = 'paid', paid_at = now(), ended_at = null, end_reason = null where id = p_id;
  update club.club_genesis_applications set status = 'member' where user_id = r.user_id and cohort = r.cohort;
  return true;
end $$;

create or replace function club.genesis_release(p_id uuid, p_reason text) returns void
language plpgsql security definer set search_path = '' as $$
declare v_user uuid;
begin
  update club.club_aro_checkouts set status = 'released', ended_at = now(), end_reason = p_reason
    where id = p_id and status = 'pending' returning user_id into v_user;
  if v_user is not null then
    update club.club_genesis_applications set status = 'interested' where user_id = v_user and cohort = 'genesis-01' and status = 'awaiting_payment';
  end if;
end $$;

create or replace function club.genesis_revoke(p_order text, p_reason text) returns int
language plpgsql security definer set search_path = '' as $$
declare v_user uuid;
begin
  update club.club_aro_checkouts set status = 'revoked', ended_at = now(), end_reason = p_reason
    where aro_order_id = p_order and status in ('pending','paid') returning user_id into v_user;
  if v_user is null then return 0; end if;
  update club.club_genesis_applications set status = 'interested' where user_id = v_user and cohort = 'genesis-01' and status in ('awaiting_payment','member','paid_confirmed');
  return 1;
end $$;

create or replace function club.aro_record_event(p_event text, p_type text) returns boolean
language sql security definer set search_path = '' as $$
  with i as (insert into club.club_aro_events (event_id, type) values (p_event, p_type) on conflict (event_id) do nothing returning 1)
  select exists (select 1 from i);
$$;

-- Leitura do servidor: e-mail confirmado do membro de uma matrícula (para re-resolver o direito).
create or replace function club.genesis_checkout_owner(p_id uuid) returns table (user_id uuid, email text, status text, offer text, aro_session_id text, aro_order_id text, amount_minor int)
language sql stable security definer set search_path = '' as $$
  select k.user_id, u.email, k.status, k.offer, k.aro_session_id, k.aro_order_id, k.amount_minor
  from club.club_aro_checkouts k join auth.users u on u.id = k.user_id where k.id = p_id;
$$;
create or replace function club.genesis_checkout_by_order(p_order text) returns uuid
language sql stable security definer set search_path = '' as $$
  select k.id from club.club_aro_checkouts k where k.aro_order_id = p_order;
$$;

do $$ declare f text; begin
  foreach f in array array[
    'club.genesis_offer_check(uuid,text)', 'club.request_student_eligibility(uuid,text)',
    'club.decide_student_eligibility(uuid,boolean,text,text,text,timestamptz)', 'club.genesis_start_checkout(uuid,text,text)',
    'club.genesis_attach_checkout(uuid,text,text,int,timestamptz)', 'club.genesis_confirm(uuid,text)',
    'club.genesis_release(uuid,text)', 'club.genesis_revoke(text,text)', 'club.aro_record_event(text,text)',
    'club.genesis_checkout_owner(uuid)', 'club.genesis_checkout_by_order(text)']
  loop
    execute format('revoke all on function %s from public, anon, authenticated', f);
    execute format('grant execute on function %s to service_role', f);
  end loop;
end $$;
