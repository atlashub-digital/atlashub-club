import type { SupabaseClient } from "@supabase/supabase-js";
import type { LiveConfig } from "./mode";
import { emailHash } from "./hash";
import { memberClient, serviceClient } from "./supabase";
import { verifyTurnstile } from "./turnstile";
import { storedSignup, type SignupInput } from "./signup-schema";

/**
 * Dependências externas do modo live, atrás de uma interface para os testes usarem um duplo.
 * Implementação real: Supabase (Auth + funções do schema `club`) e Cloudflare Turnstile.
 */
export type LinkResult = "sent" | "rate_limited";

export type ClubBackend = {
  hitRateLimit(key: string, limit: number, windowSeconds: number): Promise<boolean>;
  verifyTurnstile(token: string, ip: string): Promise<boolean>;
  /** Pede ao Supabase Auth um link de confirmação. `signup` ausente → só entrada (não cria conta). */
  sendLink(email: string, signup?: SignupInput): Promise<LinkResult>;
  createGuardianReview(row: { ageBand: "teen" | "child"; plan: string; studentIntent: boolean; contactEmail: string | null }): Promise<void>;
};

export const CONFIRM_PATH = "/entrar/confirmar";

/** Erros do Auth que significam "registo fechado na Master": nunca fingir que o link foi enviado. */
const SIGNUP_CLOSED = new Set(["signup_disabled", "otp_disabled", "email_provider_disabled"]);

export function supabaseBackend(
  cfg: LiveConfig,
  service: SupabaseClient = serviceClient(cfg),
  authClient: () => Promise<SupabaseClient> = () => memberClient(cfg),
): ClubBackend {
  const club = service.schema("club");
  return {
    async hitRateLimit(key, limit, windowSeconds) {
      const { data, error } = await club.rpc("hit_rate_limit", { p_key: key, p_limit: limit, p_window: `${windowSeconds} seconds` });
      if (error) throw new Error(`rate_limit: ${error.code ?? error.message}`);
      return data === true;
    },
    verifyTurnstile(token, ip) {
      return verifyTurnstile(cfg.turnstileSecret, token, ip, new URL(cfg.origin).hostname);
    },
    async sendLink(email, signup) {
      if (signup) {
        // Dados do formulário fora do auth.users (o user_metadata viaja no JWT partilhado da Master):
        // tabela club.club_pending_signups, por hash do e-mail, 48 h. O perfil só nasce em /conta/concluir.
        const { error } = await club.rpc("stash_signup", { p_email_hash: emailHash(email), p_payload: storedSignup(signup) });
        if (error) throw new Error(`stash_signup: ${error.code ?? error.message}`);
      }
      // Fluxo PKCE (cookies httpOnly do @supabase/ssr): funciona com os modelos de e-mail globais da
      // Master, sem os alterar. O link tem de ser aberto no mesmo navegador que fez o pedido.
      const auth = (await authClient()).auth;
      const { error } = await auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: Boolean(signup),
          emailRedirectTo: cfg.origin + CONFIRM_PATH,
          ...(signup ? { data: { signup_source: "club" } } : {}),
        },
      });
      if (!error) return "sent";
      if (error.status === 429) return "rate_limited";
      if (signup && error.code && SIGNUP_CLOSED.has(error.code)) throw new Error(`auth: registo fechado (${error.code})`);
      // 4xx (p.ex. entrada pedida para e-mail sem conta): resposta neutra, sem enumeração.
      if (error.status && error.status < 500) {
        console.warn("club.sendLink", error.status, error.code);
        return "sent";
      }
      throw new Error(`auth: ${error.status ?? "?"} ${error.code ?? error.message}`);
    },
    async createGuardianReview(row) {
      const { error } = await club.from("club_guardian_reviews").insert({
        age_band: row.ageBand,
        plan: row.plan,
        student_intent: row.studentIntent,
        contact_email: row.ageBand === "child" ? null : row.contactEmail,
      });
      if (error) throw new Error(`guardian_review: ${error.code ?? error.message}`);
    },
  };
}
