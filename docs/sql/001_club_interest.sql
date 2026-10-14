-- FOR REVIEW ONLY: execute in an isolated Atlas Club Supabase project,
-- only after legal review and authorization by Sérgio. Do not run on AI Workforce DB.
create table if not exists public.club_interest (
 id uuid primary key default gen_random_uuid(),
 name text not null check(char_length(name) between 2 and 90),
 email text not null,
 interest text not null check(interest in ('club','genesis','lab','workshops')),
 device text not null check(device in ('mobile','computer','shared','none')),
 consent boolean not null check(consent = true),
 consent_version text not null,
 created_at timestamptz not null default now(),
 constraint club_interest_email_unique unique(email)
);
alter table public.club_interest enable row level security;
revoke all on table public.club_interest from anon, authenticated;
grant all on table public.club_interest to service_role;
-- Intentionally no anon/authenticated select or insert policy.
-- Define retention/deletion and DPO contact before public collection.
