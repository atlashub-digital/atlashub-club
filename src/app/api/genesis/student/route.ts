import { NextRequest, NextResponse } from "next/server";
import { sameOrigin, seeOther } from "@/lib/club/http";
import { liveConfig } from "@/lib/club/mode";
import { memberClient } from "@/lib/club/supabase";
import { genesisDeps } from "@/lib/genesis/runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Pedido de validação da condição de estudante (decisão humana da equipe; sem upload neste PR). */
export async function POST(req: NextRequest) {
  const cfg = liveConfig();
  if (!cfg) return NextResponse.json({ message: "Indisponível." }, { status: 503 });
  if (!sameOrigin(req, cfg)) return NextResponse.json({ message: "Pedido inválido." }, { status: 403 });
  const { data } = await (await memberClient(cfg)).auth.getUser();
  if (!data.user) return seeOther(cfg, "/entrar");
  const form = await req.formData().catch(() => null);
  const institution = String(form?.get("institution") ?? "").trim().slice(0, 160);
  const db = genesisDeps(cfg).db!;
  try {
    await db.requestStudent(data.user.id, institution);
  } catch {
    return seeOther(cfg, "/genesis/inscricao?erro=estudante");
  }
  return seeOther(cfg, "/genesis/inscricao?ok=estudante");
}
