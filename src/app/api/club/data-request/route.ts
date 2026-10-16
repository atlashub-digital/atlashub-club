import { NextRequest, NextResponse } from "next/server";
import { sameOrigin, seeOther } from "@/lib/club/http";
import { liveConfig } from "@/lib/club/mode";
import { memberClient } from "@/lib/club/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Pedido do titular (acesso ou apagamento). Gravado com a sessão do membro, sujeito a RLS. */
export async function POST(req: NextRequest) {
  const cfg = liveConfig();
  if (!cfg) return NextResponse.json({ message: "Indisponível." }, { status: 503 });
  if (!sameOrigin(req, cfg)) return NextResponse.json({ message: "Pedido inválido." }, { status: 403 });
  const supabase = await memberClient(cfg);
  const { data } = await supabase.auth.getUser();
  if (!data.user) return seeOther(cfg, "/entrar");

  const form = await req.formData().catch(() => null);
  const kind = form?.get("kind");
  if (kind !== "access" && kind !== "delete") return seeOther(cfg, "/conta");
  const { error } = await supabase.schema("club").from("club_data_requests").insert({ user_id: data.user.id, kind });
  if (error) {
    console.error("club.data_request", error.code);
    return seeOther(cfg, "/conta?erro=pedido");
  }
  return seeOther(cfg, "/conta?ok=pedido");
}
