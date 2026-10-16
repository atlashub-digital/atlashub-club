-- ============================================================================
-- RASCUNHO PR2B — NÃO APLICAR.
-- Destino decidido (ATL-D29): DB Master AtlasHub, schema `club`. Aplicar sempre com a 003,
-- que fecha a escrita direta do `authenticated` (partilhado com outras apps). Testar num
-- ambiente isolado preparado pela Helena e só aplicar na Master com aprovação do Sérgio.
-- Nunca executar na base do AI Workforce nem do app.atlashub.si.
-- Sem dados reais, sem utilizadores reais nesta fase.
-- ============================================================================

create schema if not exists club;
revoke all on schema club from public, anon;
grant usage on schema club to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
-- Email verificado é pré-requisito para qualquer escrita do próprio membro.
create or replace function club.is_verified() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from auth.users u
    where u.id = auth.uid() and u.email_confirmed_at is not null
  );
$$;
revoke all on function club.is_verified() from public, anon;
grant execute on function club.is_verified() to authenticated;

create or replace function club.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end $$;

-- ---------------------------------------------------------------------------
-- Perfil pedagógico (NUNCA replicado para o CRM B2B)
-- ---------------------------------------------------------------------------
create table club.club_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 60),
  age_band text not null check (age_band in ('adult','teen','child')), -- menores só após revisão aprovada (trigger abaixo)
  area text,
  device text check (device in ('Só celular','Computador','Equipamento compartilhado')),
  country text check (country ~ '^[A-Z]{2}$'),                -- opcional (SPEC 01 §2)
  timezone text check (char_length(timezone) <= 64),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deletion_requested_at timestamptz
);
create trigger club_profiles_touch before update on club.club_profiles
  for each row execute function club.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Revisão do responsável (menores) — decisão do Sérgio de 14/10/2026
-- Menores não são bloqueados: ficam em pending_guardian_review até a equipa validar,
-- manualmente, a autorização do responsável legal. Só o servidor (service_role) escreve aqui.
-- Criança (<12): nunca guardar o e-mail da criança; só o contacto do responsável.
-- ---------------------------------------------------------------------------
create table club.club_guardian_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,   -- preenchido só depois da aprovação
  age_band text not null check (age_band in ('teen','child')),
  plan text not null check (plan in ('club','genesis')),
  student_intent boolean not null default false,              -- verificação de estudante é independente
  contact_email text,                                          -- adolescente: contacto mínimo
  guardian_contact text,                                       -- recolhido pela equipa por canal verificado
  status text not null default 'pending_guardian_review' check (status in (
    'pending_guardian_review','guardian_approved','guardian_rejected','guardian_expired')),
  decided_by uuid,                                             -- membro da equipa (auditoria)
  decided_at timestamptz,
  evidence_ref text,                                           -- referência, nunca o documento em claro
  expires_at timestamptz not null default now() + interval '30 days',
  created_at timestamptz not null default now(),
  check (age_band <> 'child' or contact_email is null),
  check (status in ('pending_guardian_review','guardian_expired') or (decided_by is not null and decided_at is not null)),
  check (status <> 'guardian_approved' or evidence_ref is not null)
);

-- Transições válidas: pending → approved | rejected | expired. Decisões são finais.
create or replace function club.guardian_review_transition() returns trigger
language plpgsql set search_path = '' as $$
begin
  if old.status <> 'pending_guardian_review' and new.status <> old.status then
    raise exception 'guardian review já decidida (%)', old.status;
  end if;
  return new;
end $$;
create trigger club_guardian_reviews_transition before update on club.club_guardian_reviews
  for each row execute function club.guardian_review_transition();

create or replace function club.has_guardian_approval(p_user uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from club.club_guardian_reviews g
    where g.user_id = p_user and g.status = 'guardian_approved'
  );
$$;
revoke all on function club.has_guardian_approval(uuid) from public, anon, authenticated;

-- Perfil de menor só existe com aprovação do responsável.
create or replace function club.require_guardian_for_minor_profile() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.age_band <> 'adult' and not club.has_guardian_approval(new.user_id) then
    raise exception 'perfil de menor requer revisão do responsável aprovada';
  end if;
  return new;
end $$;
create trigger club_profiles_minor_gate before insert or update of age_band on club.club_profiles
  for each row execute function club.require_guardian_for_minor_profile();

-- ---------------------------------------------------------------------------
-- Intenção de adesão (o que foi escolhido no formulário de 4 etapas)
-- ---------------------------------------------------------------------------
create table club.club_signup_intents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null check (plan in ('club','genesis')),
  student_intent boolean not null default false,             -- declaração; não é elegibilidade (PR2C)
  interests text[] not null default '{}' check (cardinality(interests) <= 6),
  first_mission text check (char_length(first_mission) <= 280),
  created_at timestamptz not null default now()
);
create index on club.club_signup_intents (user_id);

-- ---------------------------------------------------------------------------
-- Consentimentos: append-only, versionados; marketing separado e desmarcado por defeito
-- ---------------------------------------------------------------------------
create table club.club_consent_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('terms','privacy','marketing')),
  version text,
  granted boolean not null,
  source text not null default 'web_signup' check (source in ('web_signup','member_settings','unsubscribe_link','support')),
  created_at timestamptz not null default now(),
  check (kind = 'marketing' or version is not null)
);
create index on club.club_consent_events (user_id, kind, created_at desc);

create or replace function club.forbid_mutation() returns trigger
language plpgsql set search_path = '' as $$
begin raise exception 'append-only'; end $$;
create trigger club_consent_append_only before update or delete on club.club_consent_events
  for each row when (pg_trigger_depth() = 0) execute function club.forbid_mutation();
-- Nota: a eliminação de conta remove as linhas via ON DELETE CASCADE (direito ao apagamento);
-- confirmar com jurídico se é preciso reter prova de consentimento por prazo legal.

create view club.my_marketing_consent with (security_invoker = true) as
  select distinct on (user_id) user_id, granted, created_at
  from club.club_consent_events where kind = 'marketing'
  order by user_id, created_at desc;

-- ---------------------------------------------------------------------------
-- Candidatura Genesis (estados da SPEC 01; transições após 'interested' só no servidor)
-- ---------------------------------------------------------------------------
create table club.club_genesis_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cohort text not null default 'genesis-01',
  status text not null default 'interested' check (status in (
    'interested','student_pending','quote_ready','awaiting_payment','paid_confirmed','member','withdrawn')),
  student_intent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, cohort)
);
create trigger club_genesis_touch before update on club.club_genesis_applications
  for each row execute function club.touch_updated_at();

-- Menor não avança no Genesis (cotação, pagamento, matrícula) sem aprovação do responsável.
create or replace function club.genesis_minor_gate() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.status not in ('interested','withdrawn')
     and exists (select 1 from club.club_profiles p where p.user_id = new.user_id and p.age_band <> 'adult')
     and not club.has_guardian_approval(new.user_id) then
    raise exception 'Genesis de menor requer revisão do responsável aprovada';
  end if;
  return new;
end $$;
create trigger club_genesis_minor_gate before insert or update on club.club_genesis_applications
  for each row execute function club.genesis_minor_gate();

-- ---------------------------------------------------------------------------
-- Pedidos de titular: acesso, apagamento, opt-out
-- ---------------------------------------------------------------------------
create table club.club_data_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('access','delete','marketing_opt_out')),
  status text not null default 'open' check (status in ('open','in_review','done','rejected')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

-- ---------------------------------------------------------------------------
-- Ponte para o CRM AtlasHub: outbox só servidor, só com opt-in de marketing
-- Payload restrito: sem interesses, missão, área, progresso ou qualquer dado pedagógico.
-- ---------------------------------------------------------------------------
create table club.club_crm_outbox (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  event text not null check (event in ('contact_opt_in','contact_opt_out','genesis_interest')),
  payload jsonb not null check (payload ?& array['email','display_name','source'] and
                                not (payload ?| array['interests','first_mission','area','device','progress'])),
  created_at timestamptz not null default now(),
  processed_at timestamptz,
  attempts int not null default 0
);

-- ---------------------------------------------------------------------------
-- Rate limit partilhado (substitui o limitador em memória em produção)
-- ---------------------------------------------------------------------------
create table club.club_rate_limits (
  key text not null,                       -- hash (nunca IP/email em claro)
  window_start timestamptz not null,
  hits int not null default 0,
  primary key (key, window_start)
);
create or replace function club.hit_rate_limit(p_key text, p_limit int, p_window interval)
returns boolean language plpgsql security definer set search_path = '' as $$
declare w timestamptz := date_bin(p_window, now(), timestamptz '2000-01-01'); n int;
begin
  insert into club.club_rate_limits(key, window_start, hits) values (p_key, w, 1)
  on conflict (key, window_start) do update set hits = club.club_rate_limits.hits + 1
  returning hits into n;
  return n <= p_limit;
end $$;
revoke all on function club.hit_rate_limit(text,int,interval) from public, anon, authenticated;
grant execute on function club.hit_rate_limit(text,int,interval) to service_role;

-- ---------------------------------------------------------------------------
-- RLS — tudo fechado por defeito; o membro só vê/escreve o que é seu e com email verificado
-- ---------------------------------------------------------------------------
alter table club.club_profiles enable row level security;
alter table club.club_signup_intents enable row level security;
alter table club.club_consent_events enable row level security;
alter table club.club_genesis_applications enable row level security;
alter table club.club_data_requests enable row level security;
alter table club.club_crm_outbox enable row level security;
alter table club.club_rate_limits enable row level security;
alter table club.club_guardian_reviews enable row level security;

revoke all on all tables in schema club from anon, authenticated;
grant all on all tables in schema club to service_role;

grant select, insert on club.club_profiles to authenticated;
grant update (display_name, area, device, country, timezone) on club.club_profiles to authenticated;
create policy own_profile_select on club.club_profiles for select to authenticated
  using (user_id = (select auth.uid()));
create policy own_profile_insert on club.club_profiles for insert to authenticated
  with check (user_id = (select auth.uid()) and age_band = 'adult' and (select club.is_verified()));
create policy own_profile_update on club.club_profiles for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

grant select, insert on club.club_signup_intents to authenticated;
create policy own_intent_select on club.club_signup_intents for select to authenticated
  using (user_id = (select auth.uid()));
create policy own_intent_insert on club.club_signup_intents for insert to authenticated
  with check (user_id = (select auth.uid()) and (select club.is_verified()));

grant select, insert on club.club_consent_events to authenticated;
grant select on club.my_marketing_consent to authenticated;
create policy own_consent_select on club.club_consent_events for select to authenticated
  using (user_id = (select auth.uid()));
-- O membro pode registar/retirar marketing; termos/privacidade só pelo servidor no registo.
create policy own_marketing_insert on club.club_consent_events for insert to authenticated
  with check (user_id = (select auth.uid()) and kind = 'marketing' and source = 'member_settings'
              and (select club.is_verified()));

grant select, insert on club.club_genesis_applications to authenticated;
create policy own_genesis_select on club.club_genesis_applications for select to authenticated
  using (user_id = (select auth.uid()));
create policy own_genesis_insert on club.club_genesis_applications for insert to authenticated
  with check (user_id = (select auth.uid()) and status = 'interested' and (select club.is_verified()));
-- Sem UPDATE para authenticated: estados seguintes (student_pending…member) são do servidor/PR2C.

grant select, insert on club.club_data_requests to authenticated;
create policy own_dsr_select on club.club_data_requests for select to authenticated
  using (user_id = (select auth.uid()));
create policy own_dsr_insert on club.club_data_requests for insert to authenticated
  with check (user_id = (select auth.uid()) and status = 'open');

-- club_crm_outbox, club_rate_limits e club_guardian_reviews: sem políticas → inacessíveis a anon/authenticated.
-- Perfis de menores são criados pelo servidor depois da aprovação (trigger club_profiles_minor_gate).

-- ---------------------------------------------------------------------------
-- Retenção (a confirmar com jurídico/DPO antes de aplicar)
--  - club_rate_limits: purga > 24h
--  - club_crm_outbox: purga processados > 30 dias
--  - contas não verificadas: Supabase Auth apaga/expira convites; perfis só existem após verificação
--  - club_guardian_reviews: pedidos 'pending' expiram aos 30 dias; contact_email apagado ao expirar/rejeitar
-- ---------------------------------------------------------------------------
