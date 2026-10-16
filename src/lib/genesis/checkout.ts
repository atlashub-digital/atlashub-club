// Matrícula paga no Genesis: membro → oferta permitida no servidor → sessão ARO → PIX → APPROVED +
// direito ACTIVE → `member`. O valor vem do ARO e tem de bater com o catálogo (offers.ts = aro.project.yaml).
import QRCode from "qrcode";
import {
  AroError, createCheckoutSession, getCheckoutSession, hasActiveEntitlement, terminalCheckoutStates,
  type AroConfig, type CheckoutSession,
} from "../aro/client";
import type { AroEvent } from "../aro/webhook";
import { offers } from "../offers";
import type { GenesisBackend, GenesisOffer } from "./backend";
import { genesisTermsVersion } from "./policy";

export const genesisEntitlement = "atlas-club:course:genesis-01";

export type GenesisDeps = {
  aro: AroConfig | null;
  db: GenesisBackend | null;
  env: Record<string, string | undefined>;
  fetch: typeof fetch;
  now: () => Date;
};

export function paymentsReady(d: Pick<GenesisDeps, "aro" | "db" | "env">): boolean {
  return Boolean(d.aro?.paymentsEnabled && d.db && d.env.GENESIS_SALES_OPEN === "yes");
}

type Fail = { ok: false; status: number; error: string };
const fail = (status: number, error: string): Fail => ({ ok: false, status, error });
const reasons = ["sales_closed", "sold_out", "student_not_approved", "guardian_required", "email_unconfirmed", "no_profile", "offer_unknown"];

export async function startGenesisCheckout(
  member: { id: string; email: string; name: string },
  offer: GenesisOffer,
  acceptedTerms: string | null,
  d: GenesisDeps,
): Promise<{ ok: true; id: string; checkoutSecret?: string } | Fail> {
  if (!paymentsReady(d)) return fail(503, "sales_closed");
  if (acceptedTerms !== genesisTermsVersion) return fail(400, "terms_required");
  if (offer !== "genesis-01-br" && offer !== "genesis-01-student-br") return fail(400, "offer_unknown");
  const db = d.db!, aro = d.aro!;
  let row;
  try {
    row = await db.start(member.id, offer, genesisTermsVersion);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    const code = reasons.find((r) => msg.includes(r));
    return code ? fail(code === "sold_out" ? 409 : code === "sales_closed" ? 503 : 403, code) : fail(503, "db_unavailable");
  }
  if (row.outcome === "already_paid") return fail(409, "already_enrolled");

  let session: CheckoutSession;
  try {
    session = await createCheckoutSession(aro, {
      offer,
      payer: { name: member.name, email: member.email },
      idempotencyKey: `club:${row.id}:${offer}`,
      metadata: { checkout_id: row.id, cohort: "genesis-01" },
      attribution: { utm_campaign: "GEN-CONTA", utm_source: "club" },
    }, d.fetch);
  } catch (e) {
    if (row.outcome === "new") await db.release(row.id, "aro_unavailable").catch(() => {});
    return fail(e instanceof AroError && e.status === 422 ? 409 : 503, "aro_unavailable");
  }
  const expected = offers[offer].priceMinor;
  if (session.project !== aro.project || session.offer !== offer || session.amount?.amount_minor !== expected || session.amount?.currency !== "BRL") {
    await db.release(row.id, "price_mismatch").catch(() => {});
    return fail(502, "price_mismatch");
  }
  try {
    await db.attach(row.id, session.id, session.order_id, expected, session.expires_at ?? (session.payment?.kind === "PIX" ? session.payment.expires_at : null));
  } catch {
    return fail(409, "checkout_conflict");
  }
  return { ok: true, id: row.id, checkoutSecret: session.checkout_secret };
}

export type GenesisStatus =
  | { state: "PENDING"; offer: GenesisOffer; amountMinor: number | null; payment: { copyPaste: string; qrSvg: string; expiresAt: string } | null }
  | { state: "PROCESSING" | "ENROLLED" | "FAILED" | "EXPIRED" | "CANCELED" | "RELEASED" | "REVOKED" };

async function finalize(id: string, email: string, order: string, d: GenesisDeps): Promise<boolean> {
  if (!(await hasActiveEntitlement(d.aro, { email }, genesisEntitlement, d.fetch, d.now()))) return false;
  await d.db!.confirm(id, order);
  return true;
}

/** Estado da matrícula do próprio membro (null se não existir ou não for dele). */
export async function getGenesisStatus(id: string, memberId: string, secret: string | null, d: GenesisDeps): Promise<GenesisStatus | null> {
  if (!d.db || !/^[0-9a-f-]{36}$/i.test(id)) return null;
  const row = await d.db.owner(id);
  if (!row || row.user_id !== memberId) return null;
  if (row.status === "paid") return { state: "ENROLLED" };
  if (row.status === "released") return { state: "RELEASED" };
  if (row.status === "revoked") return { state: "REVOKED" };
  const pending = { state: "PENDING" as const, offer: row.offer, amountMinor: row.amount_minor, payment: null };
  if (!secret || !d.aro || !row.aro_session_id) return pending;
  let s: CheckoutSession;
  try {
    s = await getCheckoutSession(d.aro, row.aro_session_id, secret, d.fetch);
  } catch {
    return pending;
  }
  if (s.id !== row.aro_session_id || s.order_id !== row.aro_order_id) return null;
  if (s.state === "APPROVED") return (await finalize(id, row.email, row.aro_order_id!, d)) ? { state: "ENROLLED" } : { state: "PROCESSING" };
  if (s.state === "REFUNDED" || s.state === "CHARGEBACK") { await d.db.revoke(row.aro_order_id!, `aro_${s.state.toLowerCase()}`); return { state: "REVOKED" }; }
  if (terminalCheckoutStates.includes(s.state)) { await d.db.release(id, `aro_${s.state.toLowerCase()}`); return { state: s.state as "FAILED" | "EXPIRED" | "CANCELED" }; }
  const pix = s.payment?.kind === "PIX" ? s.payment : null;
  return { ...pending, payment: pix ? { copyPaste: pix.copy_paste, expiresAt: pix.expires_at,
    qrSvg: await QRCode.toString(pix.qr_payload, { type: "svg", margin: 1, errorCorrectionLevel: "M" }) } : null };
}

/** Webhook ARO verificado, para o projeto `atlas-club`. Idempotente; o id fica registado. */
export async function handleGenesisEvent(event: AroEvent, d: GenesisDeps): Promise<"processed" | "duplicate" | "ignored"> {
  const db = d.db!;
  const order = typeof event.data.order_id === "string" ? event.data.order_id : null;
  const id = order ? await db.byOrder(order) : null;
  let result: "processed" | "ignored" = "ignored";
  if (id && order) {
    const row = await db.owner(id);
    result = "processed";
    switch (event.type) {
      case "payment.approved": case "order.approved": case "entitlement.granted":
        if (row) await finalize(id, row.email, order, d); break;
      case "payment.failed": await db.release(id, "aro_payment_failed"); break;
      case "payment.refunded": case "payment.chargeback": case "entitlement.revoked": await db.revoke(order, event.type); break;
      default: result = "ignored";
    }
  }
  return (await db.recordEvent(event.id, event.type)) ? result : "duplicate";
}
