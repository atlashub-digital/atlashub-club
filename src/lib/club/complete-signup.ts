import type { SupabaseClient, User } from "@supabase/supabase-js";
import { storedSignup, validateSignup } from "./signup-schema";

/**
 * Corre no callback de confirmação, com o e-mail já verificado pelo Supabase Auth.
 * Revalida os dados guardados no convite (o browser nunca é fonte de verdade), cria perfil,
 * consentimentos e, se houver opt-in, a entrada no outbox do CRM — tudo numa só transação
 * (club.complete_signup). Depois apaga os dados do formulário do convite.
 */
export type CompleteResult = "created" | "existing" | "no_signup_data" | "invalid";

export async function completeSignup(service: SupabaseClient, user: User): Promise<CompleteResult> {
  if (!user.email_confirmed_at || !user.email) return "invalid";
  const meta = (user.user_metadata as Record<string, unknown> | undefined)?.club_signup;
  if (!meta || typeof meta !== "object") return "no_signup_data";

  const parsed = validateSignup({ ...(meta as Record<string, unknown>), email: user.email });
  if (!parsed.ok || parsed.value.ageBand !== "adult") return "invalid";

  const { data, error } = await service
    .schema("club")
    .rpc("complete_signup", { p_user: user.id, p_payload: storedSignup(parsed.value) });
  if (error) throw new Error(`complete_signup: ${error.code ?? error.message}`);

  const { error: clearError } = await service.auth.admin.updateUserById(user.id, { user_metadata: { club_signup: null } });
  if (clearError) console.warn("club.completeSignup: metadata", clearError.status);
  return data === "existing" ? "existing" : "created";
}
