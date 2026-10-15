import { NextRequest, NextResponse } from "next/server";
import { deliverOutboxQuietly } from "@/lib/club/crm";
import { sameOrigin, seeOther } from "@/lib/club/http";
import { liveConfig } from "@/lib/club/mode";
import { memberClient, serviceClient } from "@/lib/club/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** O membro liga/desliga as novidades por e-mail. Opt-out segue para supressão no CRM. */
export async function POST(req: NextRequest) {
  const cfg = liveConfig();
  if (!cfg) return NextResponse.json({ message: "Indisponível." }, { status: 503 });
  if (!sameOrigin(req, cfg)) return NextResponse.json({ message: "Pedido inválido." }, { status: 403 });
  const { data } = await (await memberClient(cfg)).auth.getUser();
  if (!data.user) return seeOther(cfg, "/entrar");

  const form = await req.formData().catch(() => null);
  const marketing = form?.get("marketing");
  if (marketing !== "on" && marketing !== "off") return seeOther(cfg, "/conta");

  const service = serviceClient(cfg);
  const { error } = await service
    .schema("club")
    .rpc("set_marketing_consent", { p_user: data.user.id, p_granted: marketing === "on", p_source: "member_settings" });
  if (error) {
    console.error("club.consent", error.code);
    return seeOther(cfg, "/conta?erro=consentimento");
  }
  await deliverOutboxQuietly(service);
  return seeOther(cfg, "/conta?ok=consentimento");
}
