import { NextRequest, NextResponse } from "next/server";
import { completeSignup } from "@/lib/club/complete-signup";
import { deliverOutboxQuietly } from "@/lib/club/crm";
import { sameOrigin, seeOther } from "@/lib/club/http";
import { liveConfig } from "@/lib/club/mode";
import { memberClient, serviceClient } from "@/lib/club/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** O dono do e-mail verificado aceita os termos (e escolhe novidades) e o perfil do Club é criado. */
export async function POST(req: NextRequest) {
  const cfg = liveConfig();
  if (!cfg) return NextResponse.json({ message: "Indisponível." }, { status: 503 });
  if (!sameOrigin(req, cfg)) return NextResponse.json({ message: "Pedido inválido." }, { status: 403 });

  const { data: auth } = await (await memberClient(cfg)).auth.getUser();
  if (!auth.user) return seeOther(cfg, "/entrar");
  const form = await req.formData().catch(() => null);

  try {
    const service = serviceClient(cfg);
    const result = await completeSignup(service, auth.user, {
      termsAccepted: form?.get("terms") === "yes",
      marketingOptIn: form?.get("marketing") === "yes",
    });
    if (result === "terms_required") return seeOther(cfg, "/conta/concluir?erro=termos");
    if (result === "created") {
      await deliverOutboxQuietly(service);
      return seeOther(cfg, "/conta?bem-vindo=1");
    }
    if (result === "existing") return seeOther(cfg, "/conta");
    return seeOther(cfg, "/conta/concluir?erro=expirado");
  } catch (e) {
    console.error("club.complete", e instanceof Error ? e.message : "erro");
    return seeOther(cfg, "/conta?erro=perfil");
  }
}
