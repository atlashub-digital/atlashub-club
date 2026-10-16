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
