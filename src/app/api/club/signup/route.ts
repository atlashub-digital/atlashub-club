import { NextRequest, NextResponse } from "next/server";
import { handleSignup } from "@/lib/club/signup-handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** PR2B: fail-closed (503) salvo CLUB_AUTH_MODE=dry-run fora de produção. Nunca persiste. */
export async function POST(req: NextRequest) {
  const r = await handleSignup(req);
  return NextResponse.json(r.body, { status: r.status, headers: { "cache-control": "no-store", ...r.headers } });
}
