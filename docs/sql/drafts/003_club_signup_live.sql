-- ============================================================================
-- PR2B · modo live — funções de servidor para o registo gratuito real.
-- Aplicar DEPOIS de 002_club_auth_onboarding.sql, no MESMO projeto (staging primeiro).
-- Todas as funções são só para service_role (o servidor Next.js). Nenhuma é chamável
-- por anon/authenticated. Nunca executar na base do AI Workforce nem do app.atlashub.si.
-- ============================================================================

-- Outbox: reserva com expiração para o worker não enviar o mesmo evento em paralelo.
alter table club.club_crm_outbox add column if not exists claimed_at timestamptz;
create index if not exists club_crm_outbox_pending on club.club_crm_outbox (id) where processed_at is null;

-- ---------------------------------------------------------------------------
-- Conclusão do registo, chamada no callback de verificação de e-mail.
-- Idempotente: se o perfil já existe devolve 'existing' sem escrever nada.
-- O payload já foi validado no servidor (src/lib/club/signup-schema.ts); as CHECKs das
-- tabelas e os triggers de menores voltam a proteger aqui.
-- ---------------------------------------------------------------------------
create or replace function club.complete_signup(p_user uuid, p_payload jsonb)
returns text language plpgsql security definer set search_path = '' as $$
declare
  v_email text;
  v_plan text := p_payload->>'plan';
  v_student boolean := coalesce((p_payload->>'studentIntent')::boolean, false);
  v_marketing boolean := coalesce((p_payload->>'marketingOptIn')::boolean, false);
  v_name text := p_payload->>'displayName';
begin
  select u.email into v_email from auth.users u where u.id = p_user and u.email_confirmed_at is not null;
  if v_email is null then
    raise exception 'utilizador inexistente ou e-mail por verificar';
  end if;
  if exists (select 1 from club.club_profiles p where p.user_id = p_user) then
    return 'existing';
  end if;

  insert into club.club_profiles(user_id, display_name, age_band, area, device)
  values (p_user, v_name, p_payload->>'ageBand', p_payload->>'area', p_payload->>'device');

  insert into club.club_signup_intents(user_id, plan, student_intent, interests, first_mission)
  values (
    p_user, v_plan, v_student,
    coalesce(array(select jsonb_array_elements_text(p_payload->'interests')), '{}'),
    p_payload->>'firstMission'
  );

  insert into club.club_consent_events(user_id, kind, version, granted, source) values
    (p_user, 'terms', p_payload->>'termsVersion', true, 'web_signup'),
    (p_user, 'privacy', p_payload->>'privacyVersion', true, 'web_signup'),
    (p_user, 'marketing', null, v_marketing, 'web_signup');

  if v_plan = 'genesis' then
    insert into club.club_genesis_applications(user_id, status, student_intent)
    values (p_user, case when v_student then 'student_pending' else 'interested' end, v_student);
  end if;

  -- CRM só com opt-in explícito. Payload mínimo: nunca interesses, missão, área ou equipamento.
  if v_marketing then
    insert into club.club_crm_outbox(user_id, event, payload)
    values (p_user, 'contact_opt_in', jsonb_build_object('email', v_email, 'display_name', v_name, 'source', 'club'));
    if v_plan = 'genesis' then
      insert into club.club_crm_outbox(user_id, event, payload)
      values (p_user, 'genesis_interest', jsonb_build_object('email', v_email, 'display_name', v_name, 'source', 'club', 'cohort', 'genesis-01'));
    end if;
  end if;
  return 'created';
end $$;
revoke all on function club.complete_signup(uuid, jsonb) from public, anon, authenticated;
grant execute on function club.complete_signup(uuid, jsonb) to service_role;

-- ---------------------------------------------------------------------------
-- Alteração do consentimento de marketing pelo membro (ou link de cancelamento).
-- Regista o evento e, se mudou, coloca opt-in/opt-out no outbox (opt-out → crm_suppression).
-- ---------------------------------------------------------------------------
create or replace function club.set_marketing_consent(p_user uuid, p_granted boolean, p_source text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare v_email text; v_name text; v_current boolean;
begin
  select u.email into v_email from auth.users u where u.id = p_user and u.email_confirmed_at is not null;
  select p.display_name into v_name from club.club_profiles p where p.user_id = p_user;
  if v_email is null or v_name is null then
    raise exception 'membro inexistente';
  end if;
  select c.granted into v_current from club.club_consent_events c
    where c.user_id = p_user and c.kind = 'marketing' order by c.created_at desc, c.id desc limit 1;
  if v_current is not distinct from p_granted then
    return false;
  end if;
  insert into club.club_consent_events(user_id, kind, granted, source) values (p_user, 'marketing', p_granted, p_source);
  insert into club.club_crm_outbox(user_id, event, payload)
  values (p_user, case when p_granted then 'contact_opt_in' else 'contact_opt_out' end,
          jsonb_build_object('email', v_email, 'display_name', v_name, 'source', 'club'));
  return true;
end $$;
revoke all on function club.set_marketing_consent(uuid, boolean, text) from public, anon, authenticated;
grant execute on function club.set_marketing_consent(uuid, boolean, text) to service_role;

-- ---------------------------------------------------------------------------
-- Worker do outbox: reserva um lote (SKIP LOCKED) e marca como entregue.
-- ---------------------------------------------------------------------------
create or replace function club.claim_crm_outbox(p_limit int default 25)
returns table (id bigint, event text, payload jsonb, created_at timestamptz, attempts int)
language plpgsql security definer set search_path = '' as $$
begin
  return query
  update club.club_crm_outbox o set claimed_at = now(), attempts = o.attempts + 1
  where o.id in (
    select x.id from club.club_crm_outbox x
    where x.processed_at is null and x.attempts < 10
      and (x.claimed_at is null or x.claimed_at < now() - interval '5 minutes')
    order by x.id
    limit least(greatest(p_limit, 1), 100)
    for update skip locked
  )
  returning o.id, o.event, o.payload, o.created_at, o.attempts;
end $$;
revoke all on function club.claim_crm_outbox(int) from public, anon, authenticated;
grant execute on function club.claim_crm_outbox(int) to service_role;

create or replace function club.complete_crm_outbox(p_ids bigint[])
returns int language sql security definer set search_path = '' as $$
  with done as (
    update club.club_crm_outbox set processed_at = now(), claimed_at = null
    where id = any(p_ids) and processed_at is null returning 1
  ) select count(*)::int from done;
$$;
revoke all on function club.complete_crm_outbox(bigint[]) from public, anon, authenticated;
grant execute on function club.complete_crm_outbox(bigint[]) to service_role;

-- ---------------------------------------------------------------------------
-- Retenção mínima (corre com o worker): registos nunca confirmados (> 7 dias) são apagados,
-- assim como os dados do formulário guardados no convite; rate limits > 24 h; outbox
-- entregue > 30 dias; pedidos de revisão de menores expirados perdem o contacto.
-- ---------------------------------------------------------------------------
create or replace function club.purge_expired()
returns jsonb language plpgsql security definer set search_path = '' as $$
declare n_users int; n_rl int; n_outbox int; n_guardian int;
begin
  with d as (
    delete from auth.users u
    where u.email_confirmed_at is null and u.created_at < now() - interval '7 days'
      and u.raw_user_meta_data ? 'club_signup'
    returning 1
  ) select count(*) into n_users from d;
  with d as (delete from club.club_rate_limits where window_start < now() - interval '24 hours' returning 1)
    select count(*) into n_rl from d;
  with d as (delete from club.club_crm_outbox where processed_at < now() - interval '30 days' returning 1)
    select count(*) into n_outbox from d;
  with d as (
    update club.club_guardian_reviews set status = 'guardian_expired', contact_email = null
    where status = 'pending_guardian_review' and expires_at < now() returning 1
  ) select count(*) into n_guardian from d;
  return jsonb_build_object('unverified_users', n_users, 'rate_limits', n_rl, 'outbox', n_outbox, 'guardian_expired', n_guardian);
end $$;
revoke all on function club.purge_expired() from public, anon, authenticated;
grant execute on function club.purge_expired() to service_role;
