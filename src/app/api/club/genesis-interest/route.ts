import { NextRequest, NextResponse } from "next/server";
import { deliverOutboxQuietly } from "@/lib/club/crm";
import { sameOrigin, seeOther } from "@/lib/club/http";
import { liveConfig } from "@/lib/club/mode";
import { memberClient, serviceClient } from "@/lib/club/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Membro do Club regista interesse no Genesis a partir da conta (último passo do percurso PR2B).
 * Sem preço, cotação nem pagamento: estado `interested` ou `student_pending` (validação à parte).
 */
export async function POST(req: NextRequest) {
  const cfg = liveConfig();
  if (!cfg) return NextResponse.json({ message: "Indisponível." }, { status: 503 });
  if (!sameOrigin(req, cfg)) return NextResponse.json({ message: "Pedido inválido." }, { status: 403 });
  const { data } = await (await memberClient(cfg)).auth.getUser();
  if (!data.user) return seeOther(cfg, "/entrar");

  const form = await req.formData().catch(() => null);
  const student = form?.get("student") === "on";

  const service = serviceClient(cfg);
  const { error } = await service
    .schema("club")
    .rpc("register_genesis_interest", { p_user: data.user.id, p_student: student, p_source: "member_account" });
  if (error) {
    console.error("club.genesis_interest", error.code);
    return seeOther(cfg, "/conta?erro=genesis");
  }
  await deliverOutboxQuietly(service);
  return seeOther(cfg, "/conta?ok=genesis");
}
