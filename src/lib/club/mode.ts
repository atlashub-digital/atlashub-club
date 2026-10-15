/**
 * Modo do fluxo de adesão (PR2B). Fail-closed por defeito.
 *
 * - "off"     → endpoints respondem 503 e o formulário fica em modo demonstração.
 * - "dry-run" → valida, aplica rate limit e devolve o que SERIA gravado, sem persistir nada.
 *               Só é aceite fora de produção (VERCEL_ENV !== "production").
 * - "live"    → registo real com Supabase Auth (link de confirmação por e-mail), Turnstile e CRM
 *               só com opt-in. Exige TODAS as variáveis de LIVE_REQUIRED; em produção exige ainda
 *               CLUB_AUTH_PRODUCTION_APPROVED=yes, definido por um humano depois da aprovação do Sérgio.
 *               Sem isso, cai para "off" — nunca para um modo intermédio.
 */
export type ClubAuthMode = "off" | "dry-run" | "live";
type Env = Record<string, string | undefined>;

export const LIVE_REQUIRED = [
  "CLUB_SITE_ORIGIN",
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "TURNSTILE_SECRET_KEY",
  "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
] as const;

export function missingLiveConfig(env: Env = process.env): string[] {
  return LIVE_REQUIRED.filter((k) => !env[k]);
}

export function clubAuthMode(env: Env = process.env): ClubAuthMode {
  if (env.CLUB_AUTH_MODE === "live") {
    if (missingLiveConfig(env).length) return "off";
    if (env.VERCEL_ENV === "production" && env.CLUB_AUTH_PRODUCTION_APPROVED !== "yes") return "off";
    return "live";
  }
  if (env.CLUB_AUTH_MODE !== "dry-run") return "off";
  if (env.VERCEL_ENV === "production") return "off";
  return "dry-run";
}

export type LiveConfig = {
  origin: string;
  supabaseUrl: string;
  anonKey: string;
  serviceKey: string;
  turnstileSecret: string;
  turnstileSiteKey: string;
};

/** Configuração do modo live, ou null se o modo efetivo não for "live". Só para código de servidor. */
export function liveConfig(env: Env = process.env): LiveConfig | null {
  if (clubAuthMode(env) !== "live") return null;
  return {
    origin: env.CLUB_SITE_ORIGIN!.replace(/\/$/, ""),
    supabaseUrl: env.SUPABASE_URL!,
    anonKey: env.SUPABASE_ANON_KEY!,
    serviceKey: env.SUPABASE_SERVICE_ROLE_KEY!,
    turnstileSecret: env.TURNSTILE_SECRET_KEY!,
    turnstileSiteKey: env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
  };
}
