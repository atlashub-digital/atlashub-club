import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { deliverOutbox } from "@/lib/club/crm";
import { liveConfig } from "@/lib/club/mode";
import { serviceClient } from "@/lib/club/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Cron (vercel.json): reenvia o outbox CRM pendente e aplica a retenção mínima (club.purge_expired).
 * Protegido por CRON_SECRET (a Vercel envia "Authorization: Bearer <CRON_SECRET>").
 */
export async function GET(req: NextRequest) {
  const cfg = liveConfig();
  const secret = process.env.CRON_SECRET;
  if (!cfg || !secret) return NextResponse.json({ message: "Indisponível." }, { status: 503 });
  const got = Buffer.from(req.headers.get("authorization") ?? "");
  const want = Buffer.from(`Bearer ${secret}`);
  if (got.length !== want.length || !timingSafeEqual(got, want)) return NextResponse.json({ message: "Não autorizado." }, { status: 401 });

  const service = serviceClient(cfg);
  try {
    const crm = await deliverOutbox(service, process.env, 100);
    const { data: purge, error } = await service.schema("club").rpc("purge_expired");
    if (error) throw new Error(`purge_expired: ${error.code ?? error.message}`);
    return NextResponse.json({ crm, purge }, { headers: { "cache-control": "no-store" } });
  } catch (e) {
    console.error("club.cron", e instanceof Error ? e.message : "erro");
    return NextResponse.json({ message: "Falhou." }, { status: 500 });
  }
}
