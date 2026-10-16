export const runtime = "nodejs";
export async function GET() {
  const keys = ["CLUB_AUTH_MODE","CLUB_AUTH_PRODUCTION_APPROVED","VERCEL_ENV","CLUB_SITE_ORIGIN"] as const;
  const cfg: Record<string, unknown> = {};
  for (const k of keys) {
    const v = process.env[k];
    cfg[k] = k === "CLUB_SITE_ORIGIN" ? Boolean(v) : v;
  }
  const { clubAuthMode, missingLiveConfig } = await import("@/lib/club/mode");
  return Response.json({ cfg, mode: clubAuthMode(), missing: missingLiveConfig() });
}
export async function POST() {
  const { liveConfig } = await import("@/lib/club/mode");
  const { serviceClient } = await import("@/lib/club/supabase");
  const cfg = liveConfig();
  if (!cfg) return Response.json({ ok: false, why: "no_cfg" });
  const club = serviceClient(cfg).schema("club");
  const { data, error } = await club.rpc("hit_rate_limit", { p_key: "debug:test", p_limit: 10, p_window: "600 seconds" });
  return Response.json({ ok: !error, data, error: error ? { code: error.code, message: error.message.slice(0, 150) } : null });
}
