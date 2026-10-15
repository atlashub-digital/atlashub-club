import type { SupabaseClient } from "@supabase/supabase-js";
import type { LiveConfig } from "./mode";
import { anonClient, serviceClient } from "./supabase";
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

export function supabaseBackend(cfg: LiveConfig, service: SupabaseClient = serviceClient(cfg)): ClubBackend {
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
      const { error } = await anonClient(cfg).auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: Boolean(signup),
          emailRedirectTo: cfg.origin + CONFIRM_PATH,
          // Dados do formulário guardados no convite até à confirmação; o perfil só nasce no callback.
          ...(signup ? { data: { club_signup: storedSignup(signup) } } : {}),
        },
      });
      if (!error) return "sent";
      if (error.status === 429) return "rate_limited";
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
