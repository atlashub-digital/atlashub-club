-- =============================================================================
-- Reversão de apply_003_004.sql (só se for preciso voltar atrás antes do LIVE).
-- Remove os objetos novos do 003/004. NÃO devolve INSERT direto ao `authenticated`:
-- reabrir essa permissão reintroduzia o risco da auditoria e nenhuma app precisa dela.
-- Com o site em CLUB_AUTH_MODE≠live, a reversão por flag é suficiente e esta reversão de schema é opcional.
-- =============================================================================
\set ON_ERROR_STOP on
begin;
drop function if exists club.register_genesis_interest(uuid, boolean, text);
drop function if exists club.purge_expired();
drop function if exists club.complete_crm_outbox(bigint[]);
drop function if exists club.claim_crm_outbox(integer);
drop function if exists club.set_marketing_consent(uuid, boolean, text);
drop function if exists club.complete_signup(uuid, jsonb);
drop function if exists club.get_pending_signup(uuid);
drop function if exists club.stash_signup(text, jsonb);
drop index if exists club.club_crm_outbox_pending;
alter table club.club_crm_outbox drop column if exists claimed_at;
drop table if exists club.club_pending_signups;
commit;
