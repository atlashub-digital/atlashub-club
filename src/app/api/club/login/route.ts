import { NextRequest, NextResponse } from "next/server";
import { supabaseBackend } from "@/lib/club/backend";
import { handleLogin } from "@/lib/club/login-handler";
import { liveConfig } from "@/lib/club/mode";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const cfg = liveConfig();
  if (!cfg) return NextResponse.json({ message: "Entrada ainda não disponível." }, { status: 503 });
  try {
    const r = await handleLogin(req, cfg.origin, supabaseBackend(cfg));
    return NextResponse.json(r.body, { status: r.status, headers: { "cache-control": "no-store", ...r.headers } });
  } catch (e) {
    console.error("club.login", e instanceof Error ? e.message : "erro");
    return NextResponse.json({ message: "Entrada temporariamente indisponível." }, { status: 503 });
  }
}
