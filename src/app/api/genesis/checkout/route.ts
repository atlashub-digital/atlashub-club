import { NextRequest, NextResponse } from "next/server";
import { sameOrigin, seeOther } from "@/lib/club/http";
import { liveConfig } from "@/lib/club/mode";
import { memberClient } from "@/lib/club/supabase";
import { startGenesisCheckout } from "@/lib/genesis/checkout";
import { genesisDeps, genesisSecretCookie } from "@/lib/genesis/runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Membro inicia a matrícula. A oferta é validada no servidor (005); o preço vem do ARO. */
export async function POST(req: NextRequest) {
  const cfg = liveConfig();
  if (!cfg) return NextResponse.json({ message: "Indisponível." }, { status: 503 });
  if (!sameOrigin(req, cfg)) return NextResponse.json({ message: "Pedido inválido." }, { status: 403 });
  const supabase = await memberClient(cfg);
  const { data } = await supabase.auth.getUser();
  if (!data.user?.email) return seeOther(cfg, "/entrar");
  const form = await req.formData().catch(() => null);
  const offer = form?.get("offer") === "student" ? "genesis-01-student-br" : "genesis-01-br";
  const terms = typeof form?.get("terms") === "string" ? (form!.get("terms") as string) : null;
  const profile = await supabase.schema("club").from("club_profiles").select("display_name").maybeSingle();
  const name = (profile.data?.display_name as string | undefined) ?? "";

  const r = await startGenesisCheckout({ id: data.user.id, email: data.user.email, name }, offer, terms, genesisDeps(cfg));
  if (!r.ok) return seeOther(cfg, `/genesis/inscricao?erro=${r.error}`);
  const res = seeOther(cfg, `/genesis/inscricao/${r.id}`);
  if (r.checkoutSecret)
    res.cookies.set(genesisSecretCookie(r.id), r.checkoutSecret, { httpOnly: true, secure: true, sameSite: "lax", path: "/api/genesis/checkout", maxAge: 7200 });
  return res;
}
