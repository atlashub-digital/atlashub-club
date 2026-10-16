import { NextRequest, NextResponse } from "next/server";
import { liveConfig } from "@/lib/club/mode";
import { memberClient } from "@/lib/club/supabase";
import { getGenesisStatus } from "@/lib/genesis/checkout";
import { genesisDeps, genesisSecretCookie } from "@/lib/genesis/runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "cache-control": "no-store" };

/** Polling da matrícula do próprio membro; o segredo da sessão ARO vem do cookie httpOnly. */
export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const cfg = liveConfig();
  if (!cfg) return NextResponse.json({ error: "unavailable" }, { status: 503, headers: noStore });
  const { data } = await (await memberClient(cfg)).auth.getUser();
  if (!data.user) return NextResponse.json({ error: "auth" }, { status: 401, headers: noStore });
  const { id } = await ctx.params;
  const secret = req.cookies.get(genesisSecretCookie(id))?.value ?? null;
  const view = await getGenesisStatus(id, data.user.id, secret, genesisDeps(cfg)).catch(() => undefined);
  if (view === undefined) return NextResponse.json({ error: "unavailable" }, { status: 503, headers: noStore });
  if (!view) return NextResponse.json({ error: "not_found" }, { status: 404, headers: noStore });
  return NextResponse.json(view, { headers: noStore });
}
