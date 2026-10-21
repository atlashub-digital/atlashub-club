-- =============================================================================
-- PR2B · 004 — interesse no Genesis a partir da conta (versionado; já aplicado na Master segundo o brief de reconciliação)
-- Fecha o percurso Visitante → Registo gratuito → E-mail confirmado → Conta → Interesse Genesis
-- para quem se registou só no Club. Aplicar depois de 002 e 003, primeiro no ambiente isolado
-- da Helena; na DB Master só com aprovação do Sérgio.
--
-- Regras:
--  - só servidor (service_role); o papel `authenticated` continua sem escrita direta (003);
--  - só membros adultos com perfil e e-mail confirmado (menores seguem a revisão do responsável);
--  - nenhum preço, cotação ou pagamento: o estado é `interested` ou `student_pending`;
--  - Early Access: a data de `created_at` é a prova de que o interesse chegou até 30/11/2026;
--  - CRM só se o último consentimento de marketing for positivo.
-- =============================================================================

create or replace function club.register_genesis_interest(p_user uuid, p_student boolean, p_source text)
returns text language plpgsql security definer set search_path = '' as $$
declare
  v_email text;
  v_name text;
  v_band text;
  v_status text;
  v_marketing boolean;
  v_target text := case when p_student then 'student_pending' else 'interested' end;
begin
  if p_source not in ('member_account') then
    raise exception 'origem inválida';
  end if;
  select u.email into v_email from auth.users u where u.id = p_user and u.email_confirmed_at is not null;
  select p.display_name, p.age_band into v_name, v_band from club.club_profiles p where p.user_id = p_user;
  if v_email is null or v_name is null then
    raise exception 'membro inexistente';
  end if;
  if v_band <> 'adult' then
    raise exception 'interesse Genesis de menor segue a revisão do responsável';
  end if;

  select a.status into v_status from club.club_genesis_applications a
    where a.user_id = p_user and a.cohort = 'genesis-01' for update;
  if v_status is not null and v_status <> 'withdrawn' then
    return 'existing';
  end if;

  if v_status = 'withdrawn' then
    update club.club_genesis_applications set status = v_target, student_intent = p_student
      where user_id = p_user and cohort = 'genesis-01';
  else
    insert into club.club_genesis_applications(user_id, status, student_intent) values (p_user, v_target, p_student);
  end if;

  select c.granted into v_marketing from club.club_consent_events c
    where c.user_id = p_user and c.kind = 'marketing' order by c.created_at desc, c.id desc limit 1;
  if v_marketing then
    insert into club.club_crm_outbox(user_id, event, payload)
    values (p_user, 'genesis_interest', jsonb_build_object('email', v_email, 'display_name', v_name, 'source', 'club', 'cohort', 'genesis-01'));
  end if;
  return case when v_status = 'withdrawn' then 'reactivated' else 'created' end;
end $$;
revoke all on function club.register_genesis_interest(uuid, boolean, text) from public, anon, authenticated;
grant execute on function club.register_genesis_interest(uuid, boolean, text) to service_role;
