import { NextRequest, NextResponse } from "next/server";
import { hasClubProfile, loadPendingSignup } from "@/lib/club/complete-signup";
import { sameOrigin, seeOther } from "@/lib/club/http";
import { liveConfig } from "@/lib/club/mode";
import { memberClient, serviceClient } from "@/lib/club/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const okParam = (v: FormDataEntryValue | null | undefined): v is string => typeof v === "string" && v.length >= 10 && v.length <= 512;

/**
 * Confirmação do link enviado por e-mail. É um POST disparado por um botão em /entrar/confirmar
 * (e não um GET direto) para que os scanners de e-mail não gastem o link de uso único.
 * Aceita `code` (PKCE, modelos de e-mail padrão da Master) ou `token_hash`.
 * Não cria perfil: quem tem cadastro pendente segue para /conta/concluir e confirma os termos.
 */
export async function POST(req: NextRequest) {
  const cfg = liveConfig();
  if (!cfg) return NextResponse.json({ message: "Indisponível." }, { status: 503 });
  if (!sameOrigin(req, cfg)) return NextResponse.json({ message: "Pedido inválido." }, { status: 403 });

  const form = await req.formData().catch(() => null);
  const code = form?.get("code");
  const tokenHash = form?.get("token_hash");
  const supabase = await memberClient(cfg);
  const { data, error } = okParam(code)
    ? await supabase.auth.exchangeCodeForSession(code)
    : okParam(tokenHash)
      ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "email" })
      : { data: { user: null }, error: true };
  if (error || !data.user) return seeOther(cfg, "/entrar?erro=link");

  try {
    const service = serviceClient(cfg);
    if (!(await hasClubProfile(service, data.user.id)) && (await loadPendingSignup(service, data.user))) {
      return seeOther(cfg, "/conta/concluir");
    }
  } catch (e) {
    console.error("club.verify", e instanceof Error ? e.message : "erro");
    return seeOther(cfg, "/conta?erro=perfil");
  }
  return seeOther(cfg, "/conta");
}
