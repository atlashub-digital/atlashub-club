import { NextRequest, NextResponse } from "next/server";
import { completeSignup } from "@/lib/club/complete-signup";
import { deliverOutboxQuietly } from "@/lib/club/crm";
import { sameOrigin, seeOther } from "@/lib/club/http";
import { liveConfig } from "@/lib/club/mode";
import { memberClient, serviceClient } from "@/lib/club/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Confirmação do link enviado por e-mail. É um POST disparado por um botão em /entrar/confirmar
 * (e não um GET direto) para que os scanners de e-mail não gastem o link de uso único.
 */
export async function POST(req: NextRequest) {
  const cfg = liveConfig();
  if (!cfg) return NextResponse.json({ message: "Indisponível." }, { status: 503 });
  if (!sameOrigin(req, cfg)) return NextResponse.json({ message: "Pedido inválido." }, { status: 403 });

  const form = await req.formData().catch(() => null);
  const tokenHash = form?.get("token_hash");
  if (typeof tokenHash !== "string" || tokenHash.length < 10 || tokenHash.length > 512) return seeOther(cfg, "/entrar?erro=link");

  const supabase = await memberClient(cfg);
  const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "email" });
  if (error || !data.user) return seeOther(cfg, "/entrar?erro=link");

  try {
    const service = serviceClient(cfg);
    const result = await completeSignup(service, data.user);
    if (result === "created") {
      await deliverOutboxQuietly(service);
      return seeOther(cfg, "/conta?bem-vindo=1");
    }
  } catch (e) {
    console.error("club.verify", e instanceof Error ? e.message : "erro");
    return seeOther(cfg, "/conta?erro=perfil");
  }
  return seeOther(cfg, "/conta");
}
