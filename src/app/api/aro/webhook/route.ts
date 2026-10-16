import { verifyAroWebhook } from "@/lib/aro/webhook";
import { liveConfig } from "@/lib/club/mode";
import { handleGenesisEvent } from "@/lib/genesis/checkout";
import { genesisDeps } from "@/lib/genesis/runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Webhook de saída do ARO (atlashub-finance docs/35). Fail-closed: sem `ARO_WEBHOOK_SECRET` e
 * `ARO_PROJECT_SLUG` responde 503. O evento é só um gatilho: a matrícula só passa a `member` depois de
 * re-resolver o direito ACTIVE no ARO; reembolso/estorno/revogação retiram-na. Idempotente e registado.
 * Não regista corpo, cabeçalhos de assinatura nem dados do pagador.
 */
export async function POST(request: Request) {
  const secret = process.env.ARO_WEBHOOK_SECRET;
  const project = process.env.ARO_PROJECT_SLUG;
  if (!secret || !project) return Response.json({ error: "aro_not_configured" }, { status: 503 });

  const rawBody = await request.text();
  if (rawBody.length > 64_000) return Response.json({ error: "too_large" }, { status: 413 });
  const result = verifyAroWebhook({
    rawBody,
    eventId: request.headers.get("x-aro-event-id"),
    timestamp: request.headers.get("x-aro-timestamp"),
    signature: request.headers.get("x-aro-signature"),
    secret,
    project,
  });
  if (!result.ok) return Response.json({ error: result.reason }, { status: result.status });

  const deps = genesisDeps(liveConfig());
  if (!deps.db) {
    console.info(JSON.stringify({ aro_event: result.event.type, id: result.event.id, processed: false }));
    return Response.json({ received: true });
  }
  try {
    const outcome = await handleGenesisEvent(result.event, deps);
    console.info(JSON.stringify({ aro_event: result.event.type, id: result.event.id, outcome }));
    return Response.json({ received: true, outcome });
  } catch {
    return Response.json({ error: "processing_failed" }, { status: 500 }); // o ARO reentrega
  }
}
