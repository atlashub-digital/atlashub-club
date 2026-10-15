import { NextRequest, NextResponse } from "next/server";
import { supabaseBackend } from "@/lib/club/backend";
import { liveConfig } from "@/lib/club/mode";
import { handleSignup } from "@/lib/club/signup-handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** PR2B: 503 por defeito; dry-run fora de produção; live só com toda a configuração (src/lib/club/mode.ts). */
export async function POST(req: NextRequest) {
  const cfg = liveConfig();
  const r = await handleSignup(req, process.env, undefined, cfg ? supabaseBackend(cfg) : undefined);
  return NextResponse.json(r.body, { status: r.status, headers: { "cache-control": "no-store", ...r.headers } });
}
