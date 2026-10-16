// ARO simulado para os testes da matrícula Genesis (sem rede).
import { randomUUID } from "node:crypto";

export function fakeAro(opts: { amountOverride?: number } = {}) {
  const prices: Record<string, number> = { "genesis-01-br": 49000, "genesis-01-student-br": 19000 };
  const sessions = new Map<string, { offer: string; state: string; order: string; email: string }>();
  const byIdem = new Map<string, string>();
  const entitled = new Set<string>();
  const calls: { url: string; body?: Record<string, unknown>; headers: Record<string, string> }[] = [];
  const view = (id: string, secret: boolean) => {
    const s = sessions.get(id)!;
    return { id, order_id: s.order, project: "atlas-club", offer: s.offer, state: s.state,
      amount: { amount_minor: opts.amountOverride ?? prices[s.offer], currency: "BRL" }, ...(secret ? { checkout_secret: `cs-${id}` } : {}),
      payment: { kind: "PIX", copy_paste: "00020126GENESIS", qr_payload: "00020126GENESIS", expires_at: new Date(Date.now() + 1800e3).toISOString() } };
  };
  const fetch = (async (url: string, init: RequestInit) => {
    const headers = (init.headers ?? {}) as Record<string, string>;
    const body = init.body ? JSON.parse(init.body as string) : undefined;
    calls.push({ url, body, headers });
    const ok = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status });
    if (url.endsWith("/v1/checkout-sessions")) {
      const idem = headers["Idempotency-Key"];
      if (byIdem.has(idem)) return ok(view(byIdem.get(idem)!, true), 201);
      const id = randomUUID();
      sessions.set(id, { offer: body.offer, state: "PENDING", order: randomUUID(), email: body.payer.email });
      byIdem.set(idem, id);
      return ok(view(id, true), 201);
    }
    const m = url.match(/\/v1\/checkout-sessions\/([^/]+)$/);
    if (m) return headers["X-ARO-Checkout-Secret"] === `cs-${m[1]}` ? ok(view(m[1], false)) : ok({}, 401);
    if (url.endsWith("/v1/entitlements/resolve"))
      return ok({ project: "atlas-club", entitlements: entitled.has(body.identity.email) ? [{ key: "atlas-club:course:genesis-01", status: "ACTIVE", starts_at: "2026-10-16T00:00:00Z" }] : [] });
    return ok({}, 404);
  }) as unknown as typeof globalThis.fetch;
  const approve = (email: string) => { for (const s of sessions.values()) if (s.email === email) s.state = "APPROVED"; entitled.add(email); };
  return { fetch, sessions, entitled, calls, approve };
}

export const aroEnv = { ARO_API_URL: "https://aro.example", ARO_PROJECT_SLUG: "atlas-club", ARO_PUBLIC_KEY: "pk", ARO_SERVER_KEY: "sk", ARO_PAYMENTS_ENABLED: "yes", GENESIS_SALES_OPEN: "yes" };
