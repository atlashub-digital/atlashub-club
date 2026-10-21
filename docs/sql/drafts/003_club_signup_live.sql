-- ============================================================================
-- PR2B · modo live — funções de servidor para o registo gratuito real.
-- Aplicar DEPOIS de 002_club_auth_onboarding.sql, no MESMO projeto.
-- Destino (ATL-D29): DB Master AtlasHub, schema `club`. Testar primeiro num ambiente
-- isolado (branch/cópia preparada pela Helena); nunca aplicar na Master sem aprovação.
-- Todas as funções são só para service_role (o servidor Next.js). Nenhuma é chamável
-- por anon/authenticated.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Master partilhada: o papel `authenticated` inclui utilizadores de OUTRAS aplicações
-- AtlasHub. Ninguém pode tornar-se membro do Club escrevendo diretamente pela API:
-- perfil, intenção, consentimentos e Genesis só nascem em club.complete_signup (servidor),
-- depois de o dono do e-mail aceitar os termos. O membro continua a LER só o que é seu.
-- ---------------------------------------------------------------------------
revoke insert, update on club.club_profiles, club.club_signup_intents, club.club_consent_events,
  club.club_genesis_applications from authenticated;
drop policy if exists own_profile_insert on club.club_profiles;
drop policy if exists own_profile_update on club.club_profiles;
drop policy if exists own_intent_insert on club.club_signup_intents;
drop policy if exists own_marketing_insert on club.club_consent_events;
drop policy if exists own_genesis_insert on club.club_genesis_applications;
-- Pedidos de dados só de quem é membro do Club.
drop policy if exists own_dsr_insert on club.club_data_requests;
create policy own_dsr_insert on club.club_data_requests for insert to authenticated
  with check (user_id = (select auth.uid()) and status = 'open'
              and exists (select 1 from club.club_profiles p where p.user_id = (select auth.uid())));

-- ---------------------------------------------------------------------------
-- Dados do formulário entre o pedido do link e a confirmação. Ficam FORA do auth.users
-- (o user_metadata segue no JWT partilhado com outras aplicações da Master) e sem e-mail
-- em claro: a chave é sha256(lower(email)). Expiram em 48 h; só service_role acede.
-- ---------------------------------------------------------------------------
create table if not exists club.club_pending_signups (
  email_hash text primary key check (email_hash ~ '^[0-9a-f]{64}$'),
  payload jsonb not null check (jsonb_typeof(payload) = 'object' and not payload ? 'email'),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '48 hours'
);
alter table club.club_pending_signups enable row level security;
revoke all on club.club_pending_signups from public, anon, authenticated;
grant all on club.club_pending_signups to service_role;

create or replace function club.stash_signup(p_email_hash text, p_payload jsonb)
returns void language sql security definer set search_path = '' as $$
  insert into club.club_pending_signups(email_hash, payload) values (p_email_hash, p_payload)
  on conflict (email_hash) do update set payload = excluded.payload, created_at = now(),
    expires_at = now() + interval '48 hours';
$$;
revoke all on function club.stash_signup(text, jsonb) from public, anon, authenticated;
grant execute on function club.stash_signup(text, jsonb) to service_role;

create or replace function club.get_pending_signup(p_user uuid)
returns jsonb language sql stable security definer set search_path = '' as $$
  select s.payload from club.club_pending_signups s
  join auth.users u on s.email_hash = encode(sha256(convert_to(lower(u.email), 'UTF8')), 'hex')
  where u.id = p_user and u.email_confirmed_at is not null and s.expires_at > now();
$$;
revoke all on function club.get_pending_signup(uuid) from public, anon, authenticated;
grant execute on function club.get_pending_signup(uuid) to service_role;

-- Outbox: reserva com expiração para o worker não enviar o mesmo evento em paralelo.
alter table club.club_crm_outbox add column if not exists claimed_at timestamptz;
create index if not exists club_crm_outbox_pending on club.club_crm_outbox (id) where processed_at is null;

-- ---------------------------------------------------------------------------
-- Conclusão do registo, chamada depois de o dono do e-mail verificado aceitar os termos
-- em /conta/concluir. Apaga os dados pendentes do formulário.
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
  delete from club.club_pending_signups s where s.email_hash = encode(sha256(convert_to(lower(v_email), 'UTF8')), 'hex');
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
-- Retenção mínima (corre com o worker): dados de formulário pendentes expirados; rate limits
-- > 24 h; outbox entregue > 30 dias; pedidos de revisão de menores expirados perdem o contacto.
-- NUNCA apaga utilizadores de auth.users: na Master eles podem pertencer a outras aplicações.
-- ---------------------------------------------------------------------------
create or replace function club.purge_expired()
returns jsonb language plpgsql security definer set search_path = '' as $$
declare n_pending int; n_rl int; n_outbox int; n_guardian int;
begin
  with d as (delete from club.club_pending_signups where expires_at < now() returning 1)
    select count(*) into n_pending from d;
  with d as (delete from club.club_rate_limits where window_start < now() - interval '24 hours' returning 1)
    select count(*) into n_rl from d;
  with d as (delete from club.club_crm_outbox where processed_at < now() - interval '30 days' returning 1)
    select count(*) into n_outbox from d;
  with d as (
    update club.club_guardian_reviews set status = 'guardian_expired', contact_email = null
    where status = 'pending_guardian_review' and expires_at < now() returning 1
  ) select count(*) into n_guardian from d;
  return jsonb_build_object('pending_signups', n_pending, 'rate_limits', n_rl, 'outbox', n_outbox, 'guardian_expired', n_guardian);
end $$;
revoke all on function club.purge_expired() from public, anon, authenticated;
grant execute on function club.purge_expired() to service_role;
