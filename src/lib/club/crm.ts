import { createHmac } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Worker do outbox CRM (club.club_crm_outbox → CRM AtlasHub).
 * Só contém eventos com opt-in de marketing (ou o opt-out que o revoga) e payload mínimo
 * {email, display_name, source:'club'}: nada pedagógico sai do Club (CHECK no SQL).
 *
 * Entrega por webhook HTTPS assinado (contrato em docs/17_PR2B_LIVE_SETUP.md §5): a Helena decide
 * o recetor (Edge Function no projeto AtlasHub que escreve em crm_contact/crm_consent/crm_lead/
 * crm_suppression). Sem CLUB_CRM_WEBHOOK_URL os eventos ficam guardados no outbox, sem perda.
 */
type Env = Record<string, string | undefined>;
type Row = { id: number; event: string; payload: Record<string, unknown>; created_at: string; attempts: number };
export type DeliveryReport = { delivered: number; failed: number; skipped?: "crm_not_configured" };

export function signBody(secret: string, timestamp: number, body: string) {
  return createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");
}

export async function deliverOutbox(
  service: SupabaseClient,
  env: Env = process.env,
  limit = 25,
  fetchImpl: typeof fetch = fetch,
): Promise<DeliveryReport> {
  const url = env.CLUB_CRM_WEBHOOK_URL;
  const secret = env.CLUB_CRM_WEBHOOK_SECRET;
  if (!url || !secret || !url.startsWith("https://")) return { delivered: 0, failed: 0, skipped: "crm_not_configured" };

  const club = service.schema("club");
  const { data, error } = await club.rpc("claim_crm_outbox", { p_limit: limit });
  if (error) throw new Error(`claim_crm_outbox: ${error.code ?? error.message}`);
  const rows = (data ?? []) as Row[];

  const done: number[] = [];
  let failed = 0;
  for (const row of rows) {
    const body = JSON.stringify({ id: row.id, event: row.event, payload: row.payload, created_at: row.created_at });
    const t = Math.floor(Date.now() / 1000);
    try {
      const r = await fetchImpl(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-club-signature": `t=${t},v1=${signBody(secret, t, body)}`,
          "idempotency-key": `club-outbox-${row.id}`,
        },
        body,
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      });
      if (r.ok) done.push(row.id);
      else failed++;
    } catch {
      failed++;
    }
  }
  if (done.length) {
    const { error: e } = await club.rpc("complete_crm_outbox", { p_ids: done });
    if (e) throw new Error(`complete_crm_outbox: ${e.code ?? e.message}`);
  }
  return { delivered: done.length, failed };
}

/** Entrega imediata, sem bloquear a resposta ao membro se o CRM falhar (o cron repete). */
export async function deliverOutboxQuietly(service: SupabaseClient) {
  try {
    await deliverOutbox(service, process.env, 10);
  } catch (e) {
    console.warn("club.crm", e instanceof Error ? e.message : "erro");
  }
}
