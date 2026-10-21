import type { SupabaseClient, User } from "@supabase/supabase-js";
import { PRIVACY_VERSION, TERMS_VERSION, storedSignup, validateSignup, type StoredSignup } from "./signup-schema";

/**
 * Conclusão do registo, já com o e-mail verificado pelo Supabase Auth.
 * Os dados do formulário ficaram em club.club_pending_signups (por hash do e-mail, 48 h) e são
 * revalidados aqui: o browser nunca é fonte de verdade. Quem confirma termos e marketing é o
 * dono do e-mail, em /conta/concluir; só então club.complete_signup cria perfil, consentimentos
 * e, com opt-in, o evento CRM, tudo numa transação.
 */
export type CompleteResult = "created" | "existing" | "no_signup_data" | "invalid" | "terms_required";

const verified = (user: User) => Boolean(user.email_confirmed_at && user.email);

export async function hasClubProfile(service: SupabaseClient, userId: string): Promise<boolean> {
  const { data, error } = await service.schema("club").from("club_profiles").select("user_id").eq("user_id", userId).maybeSingle();
  if (error) throw new Error(`club_profiles: ${error.code ?? error.message}`);
  return Boolean(data);
}

/** Dados pendentes revalidados; `null` se não há, expiraram ou não são de um adulto. */
export async function loadPendingSignup(service: SupabaseClient, user: User): Promise<StoredSignup | null> {
  if (!verified(user)) return null;
  const { data, error } = await service.schema("club").rpc("get_pending_signup", { p_user: user.id });
  if (error) throw new Error(`get_pending_signup: ${error.code ?? error.message}`);
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  const parsed = validateSignup({ ...(data as Record<string, unknown>), email: user.email });
  return parsed.ok && parsed.value.ageBand === "adult" ? storedSignup(parsed.value) : null;
}

export async function completeSignup(
  service: SupabaseClient,
  user: User,
  choices: { termsAccepted: boolean; marketingOptIn: boolean },
): Promise<CompleteResult> {
  if (!verified(user)) return "invalid";
  if (!choices.termsAccepted) return "terms_required";
  // Repetir o POST depois da transação não depende do cadastro pendente já removido.
  if (await hasClubProfile(service, user.id)) return "existing";
  const pending = await loadPendingSignup(service, user);
  if (!pending) return "no_signup_data";

  const payload: StoredSignup = { ...pending, marketingOptIn: choices.marketingOptIn, termsVersion: TERMS_VERSION, privacyVersion: PRIVACY_VERSION };
  const { data, error } = await service.schema("club").rpc("complete_signup", { p_user: user.id, p_payload: payload });
  if (error) throw new Error(`complete_signup: ${error.code ?? error.message}`);
  return data === "existing" ? "existing" : "created";
}
