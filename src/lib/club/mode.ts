/**
 * Modo do fluxo de adesão (PR2B). Fail-closed por defeito.
 *
 * - "off"     → endpoints respondem 503 (estado atual e o de produção).
 * - "dry-run" → valida, aplica rate limit e devolve o que SERIA gravado, sem persistir nada.
 *               Só é aceite fora de produção (VERCEL_ENV !== "production").
 *
 * Não existe modo "live" neste PR: a escrita real depende da decisão Supabase com a Helena
 * (docs/16_PR2B_AUTH_ONBOARDING_CRM.md §2) e da aprovação explícita do Sérgio.
 */
export type ClubAuthMode = "off" | "dry-run";

export function clubAuthMode(env: Record<string, string | undefined> = process.env): ClubAuthMode {
  if (env.CLUB_AUTH_MODE !== "dry-run") return "off";
  if (env.VERCEL_ENV === "production") return "off";
  return "dry-run";
}
