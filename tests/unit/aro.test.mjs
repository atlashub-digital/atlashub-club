// Testes unitários do consumidor ARO (sem rede): `node --test tests/unit`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { signAroPayload, verifyAroWebhook } from "../../src/lib/aro/webhook.ts";
import { aroConfig, createCheckoutSession, getCheckoutSession, hasActiveEntitlement, AroError } from "../../src/lib/aro/client.ts";

const secret = "test-secret";
const now = 1_792_040_470;
const event = { id: "6b1f0c4e-0000-4000-8000-000000000001", type: "entitlement.granted", created_at: "2026-10-15T05:01:22Z", project: "atlas-club", data: { entitlements: ["atlas-club:course:genesis-01"] } };
const body = JSON.stringify(event);
const ts = String(now);
const base = { rawBody: body, eventId: event.id, timestamp: ts, signature: signAroPayload(secret, ts, body), secret, project: "atlas-club", nowSeconds: now };

test("webhook: assinatura válida é aceite", () => {
  const r = verifyAroWebhook(base);
  assert.equal(r.ok, true);
});
test("webhook: corpo alterado, segredo errado, cabeçalho em falta ou fora da janela são recusados", () => {
  assert.equal(verifyAroWebhook({ ...base, rawBody: body.replace("genesis-01", "genesis-02") }).ok, false);
  assert.equal(verifyAroWebhook({ ...base, secret: "outro" }).ok, false);
  assert.equal(verifyAroWebhook({ ...base, signature: null }).ok, false);
  const stale = verifyAroWebhook({ ...base, nowSeconds: now + 301 });
  assert.deepEqual(stale, { ok: false, status: 401, reason: "stale_timestamp" });
});
test("webhook: id, projeto e tipo têm de bater certo", () => {
  const sign = (b) => ({ ...base, rawBody: b, signature: signAroPayload(secret, ts, b) });
  assert.equal(verifyAroWebhook({ ...base, eventId: "outro" }).reason, "event_id_mismatch");
  assert.equal(verifyAroWebhook(sign(JSON.stringify({ ...event, project: "espelhomeu" }))).reason, "wrong_project");
  assert.equal(verifyAroWebhook(sign(JSON.stringify({ ...event, type: "payment.magic" }))).reason, "unknown_type");
});

const env = { ARO_API_URL: "https://aro.example", ARO_PROJECT_SLUG: "atlas-club", ARO_PUBLIC_KEY: "pk", ARO_SERVER_KEY: "sk" };

test("config: incompleta ou sem https → null; pagamentos desligados por defeito", () => {
  assert.equal(aroConfig({}), null);
  assert.equal(aroConfig({ ...env, ARO_SERVER_KEY: "" }), null);
  assert.equal(aroConfig({ ...env, ARO_API_URL: "http://aro.example" }), null);
  assert.equal(aroConfig(env).paymentsEnabled, false);
  assert.equal(aroConfig({ ...env, ARO_PAYMENTS_ENABLED: "yes" }).paymentsEnabled, true);
});

test("checkout: recusa sem configuração e com pagamentos desligados, sem chamar a rede", async () => {
  const never = () => assert.fail("não devia chamar a rede");
  await assert.rejects(createCheckoutSession(null, { offer: "genesis-01-br", payer: { name: "Teste", email: "t@example.com" } }, never), (e) => e instanceof AroError && e.code === "not_configured");
  await assert.rejects(createCheckoutSession(aroConfig(env), { offer: "genesis-01-br", payer: { name: "Teste", email: "t@example.com" } }, never), (e) => e.code === "payments_disabled");
});

test("checkout: pedido canónico (chave pública, Idempotency-Key, projeto/oferta/mercado) e polling com o segredo", async () => {
  const calls = [];
  const fake = async (url, init) => {
    calls.push({ url, init });
    return new Response(JSON.stringify({ id: "s1", order_id: "o1", project: "atlas-club", offer: "genesis-01-br", state: "PENDING", amount: { amount_minor: 49000, currency: "BRL" }, checkout_secret: "cs" }), { status: 201 });
  };
  const cfg = aroConfig({ ...env, ARO_PAYMENTS_ENABLED: "yes" });
  const s = await createCheckoutSession(cfg, { offer: "genesis-01-br", payer: { name: "Teste", email: "t@example.com" }, idempotencyKey: "intent-1" }, fake);
  assert.equal(calls[0].url, "https://aro.example/v1/checkout-sessions");
  assert.equal(calls[0].init.headers["X-ARO-Public-Key"], "pk");
  assert.equal(calls[0].init.headers["Idempotency-Key"], "intent-1");
  assert.deepEqual(JSON.parse(calls[0].init.body), { project: "atlas-club", offer: "genesis-01-br", market: "BR", currency: "BRL", payment_method: "PIX", payer: { name: "Teste", email: "t@example.com" } });
  await getCheckoutSession(cfg, s.id, s.checkout_secret, fake);
  assert.equal(calls[1].url, "https://aro.example/v1/checkout-sessions/s1");
  assert.equal(calls[1].init.headers["X-ARO-Checkout-Secret"], "cs");
});

test("direito: só ACTIVE não expirado desbloqueia; erro do ARO nega", async () => {
  const reply = (entitlements, status = 200) => async () => new Response(JSON.stringify({ project: "atlas-club", entitlements }), { status });
  const cfg = aroConfig(env);
  const key = "atlas-club:course:genesis-01";
  const who = { customerId: "c1" };
  assert.equal(await hasActiveEntitlement(cfg, who, key, reply([{ key, status: "ACTIVE", starts_at: "2026-10-15T00:00:00Z" }])), true);
  assert.equal(await hasActiveEntitlement(cfg, who, key, reply([{ key, status: "REVOKED", starts_at: "2026-10-15T00:00:00Z" }])), false);
  assert.equal(await hasActiveEntitlement(cfg, who, key, reply([{ key, status: "ACTIVE", starts_at: "2026-01-01T00:00:00Z", expires_at: "2026-02-01T00:00:00Z" }])), false);
  assert.equal(await hasActiveEntitlement(cfg, who, key, reply([], 503)), false);
  assert.equal(await hasActiveEntitlement(null, who, key, reply([{ key, status: "ACTIVE", starts_at: "x" }])), false);
});
