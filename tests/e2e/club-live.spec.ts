import { expect, test } from "@playwright/test";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { ClubBackend } from "@/lib/club/backend";
import { completeSignup } from "@/lib/club/complete-signup";
import { deliverOutbox, signBody } from "@/lib/club/crm";
import { handleLogin } from "@/lib/club/login-handler";
import { clubAuthMode, liveConfig, missingLiveConfig } from "@/lib/club/mode";
import { handleSignup } from "@/lib/club/signup-handler";
import { PRIVACY_VERSION, TERMS_VERSION } from "@/lib/club/signup-schema";

// PR2B · modo live com duplos de Supabase/Turnstile: sem rede, sem persistência, sem segredos.
test.beforeEach(({ isMobile }) => test.skip(isMobile, "lógica de servidor: basta um projeto"));

const ORIGIN = "https://club.example.test";
const liveEnv: Record<string, string> = {
  CLUB_AUTH_MODE: "live",
  CLUB_SITE_ORIGIN: ORIGIN,
  SUPABASE_URL: "https://staging.example.test",
  SUPABASE_ANON_KEY: "anon",
  SUPABASE_SERVICE_ROLE_KEY: "service",
  TURNSTILE_SECRET_KEY: "ts-secret",
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: "ts-site",
  VERCEL_ENV: "preview",
};
const valid = {
  plan: "club",
  displayName: "Pessoa Teste",
  email: "Pessoa@Example.test",
  ageBand: "adult",
  interests: ["Pesquisa e escrita"],
  firstMission: "organizar o semestre",
  termsVersion: TERMS_VERSION,
  privacyVersion: PRIVACY_VERSION,
  turnstileToken: "token-valido-123",
};
const req = (body: unknown, headers: Record<string, string> = {}) => ({
  headers: new Headers({ origin: ORIGIN, "content-type": "application/json", "x-forwarded-for": "198.51.100.7", ...headers }),
  text: async () => (typeof body === "string" ? body : JSON.stringify(body)),
});

function fakeBackend(opts: { turnstile?: boolean; limit?: Record<string, number>; link?: "sent" | "rate_limited"; fail?: boolean } = {}) {
  const hits = new Map<string, number>();
  const calls = { links: [] as { email: string; signup?: unknown }[], reviews: [] as unknown[], keys: [] as string[] };
  const backend: ClubBackend = {
    async hitRateLimit(key, limit) {
      if (opts.fail) throw new Error("db down");
      calls.keys.push(key);
      const n = (hits.get(key) ?? 0) + 1;
      hits.set(key, n);
      return n <= (opts.limit?.[key.split(":").slice(0, 2).join(":")] ?? limit);
    },
    async verifyTurnstile() {
      return opts.turnstile ?? true;
    },
    async sendLink(email, signup) {
      calls.links.push({ email, signup });
      return opts.link ?? "sent";
    },
    async createGuardianReview(row) {
      calls.reviews.push(row);
    },
  };
  return { backend, calls };
}

test.describe("PR2B live · ativação", () => {
  test("live só com toda a configuração; produção exige aprovação explícita", () => {
    expect(clubAuthMode(liveEnv)).toBe("live");
    expect(clubAuthMode({ ...liveEnv, TURNSTILE_SECRET_KEY: "" })).toBe("off");
    expect(missingLiveConfig({ CLUB_AUTH_MODE: "live" })).toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(clubAuthMode({ ...liveEnv, VERCEL_ENV: "production" })).toBe("off");
    expect(clubAuthMode({ ...liveEnv, VERCEL_ENV: "production", CLUB_AUTH_PRODUCTION_APPROVED: "yes" })).toBe("live");
    expect(liveConfig({ ...liveEnv, CLUB_SITE_ORIGIN: ORIGIN + "/" })?.origin).toBe(ORIGIN);
    expect(liveConfig({})).toBeNull();
  });

  test("sem backend responde 503 (nunca finge sucesso)", async () => {
    expect((await handleSignup(req(valid), liveEnv)).status).toBe(503);
  });

  test("falha do Supabase responde 503", async () => {
    const { backend } = fakeBackend({ fail: true });
    expect((await handleSignup(req(valid), liveEnv, undefined, backend)).status).toBe(503);
  });
});

test.describe("PR2B live · registo", () => {
  test("adulto: pede link de confirmação com os dados validados, sem e-mail no convite", async () => {
    const { backend, calls } = fakeBackend();
    const r = await handleSignup(req({ ...valid, marketingOptIn: true }), liveEnv, undefined, backend);
    expect(r.status).toBe(202);
    expect(r.body).toMatchObject({ ok: true, next: "check_email", status: "club_free" });
    expect(calls.links).toHaveLength(1);
    expect(calls.links[0].email).toBe("pessoa@example.test");
    expect(calls.links[0].signup).toMatchObject({ plan: "club", marketingOptIn: true, ageBand: "adult" });
    expect(JSON.stringify(calls.keys)).not.toContain("example.test");
    expect(JSON.stringify(calls.keys)).not.toContain("198.51.100.7");
  });

  test("Turnstile obrigatório", async () => {
    const { backend, calls } = fakeBackend({ turnstile: false });
    const r = await handleSignup(req(valid), liveEnv, undefined, backend);
    expect(r.status).toBe(400);
    expect(calls.links).toHaveLength(0);
    const noToken = await handleSignup(req({ ...valid, turnstileToken: undefined }), liveEnv, undefined, fakeBackend().backend);
    expect(noToken.status).toBe(400);
  });

  test("origem, tipo, tamanho e dados inválidos", async () => {
    const { backend, calls } = fakeBackend();
    expect((await handleSignup(req(valid, { origin: "https://evil.example" }), liveEnv, undefined, backend)).status).toBe(403);
    expect((await handleSignup(req(valid, { "content-type": "text/plain" }), liveEnv, undefined, backend)).status).toBe(415);
    expect((await handleSignup(req("x".repeat(5000)), liveEnv, undefined, backend)).status).toBe(413);
    expect((await handleSignup(req("[]"), liveEnv, undefined, backend)).status).toBe(400);
    expect((await handleSignup(req({ ...valid, cpf: "1" }), liveEnv, undefined, backend)).status).toBe(400);
    expect(calls.links).toHaveLength(0);
  });

  test("honeypot e limite por e-mail respondem de forma neutra, sem enviar", async () => {
    const { backend, calls } = fakeBackend({ limit: { "signup:email": 0 } });
    const hp = await handleSignup(req({ ...valid, website: "spam" }), liveEnv, undefined, backend);
    const limited = await handleSignup(req(valid), liveEnv, undefined, backend);
    expect(hp).toEqual(limited);
    expect(limited.status).toBe(202);
    expect(calls.links).toHaveLength(0);
  });

  test("limite por IP devolve 429; limite do Supabase Auth também", async () => {
    const ip = await handleSignup(req(valid), liveEnv, undefined, fakeBackend({ limit: { "signup:ip": 0 } }).backend);
    expect(ip.status).toBe(429);
    const auth = await handleSignup(req(valid), liveEnv, undefined, fakeBackend({ link: "rate_limited" }).backend);
    expect(auth.status).toBe(429);
  });

  test("adolescente: só revisão do responsável, sem conta nem link", async () => {
    const { backend, calls } = fakeBackend();
    const r = await handleSignup(req({ ...valid, plan: "genesis", ageBand: "teen", marketingOptIn: true }), liveEnv, undefined, backend);
    expect(r.body).toMatchObject({ ok: true, next: "guardian_review", status: "pending_guardian_review", child: false });
    expect(calls.links).toHaveLength(0);
    expect(calls.reviews).toEqual([{ ageBand: "teen", plan: "genesis", studentIntent: false, contactEmail: "pessoa@example.test" }]);
  });

  test("criança: sem e-mail no pedido; nenhum link, conta, CRM ou limite por e-mail", async () => {
    const { backend, calls } = fakeBackend();
    const { email: _e, ...noEmail } = valid;
    const r = await handleSignup(req({ ...noEmail, ageBand: "child", marketingOptIn: true }), liveEnv, undefined, backend);
    expect(r.status).toBe(202);
    expect(r.body).toMatchObject({ next: "guardian_review", status: "pending_guardian_review", child: true });
    expect(calls.reviews).toEqual([{ ageBand: "child", plan: "club", studentIntent: false, contactEmail: null }]);
    expect(calls.links).toHaveLength(0);
    expect(calls.keys.some((k) => k.startsWith("signup:email"))).toBe(false);
  });

  test("criança: e-mail enviado por engano é recusado e nada é gravado", async () => {
    const { backend, calls } = fakeBackend();
    const r = await handleSignup(req({ ...valid, ageBand: "child" }), liveEnv, undefined, backend);
    expect(r.status).toBe(400);
    expect(calls.reviews).toHaveLength(0);
    expect(calls.links).toHaveLength(0);
  });
});

test.describe("PR2B live · entrada", () => {
  test("nunca cria conta e responde igual exista ou não", async () => {
    const { backend, calls } = fakeBackend();
    const r = await handleLogin(req({ email: "Alguem@Example.test", turnstileToken: "token-valido-123" }), ORIGIN, backend);
    expect(r.status).toBe(202);
    expect(calls.links).toEqual([{ email: "alguem@example.test", signup: undefined }]);
    expect((await handleLogin(req({ email: "x", turnstileToken: "token-valido-123" }), ORIGIN, backend)).status).toBe(400);
    expect((await handleLogin(req({ email: "a@example.test" }), ORIGIN, backend)).status).toBe(400);
    expect((await handleLogin(req({ email: "a@example.test" }, { origin: "https://evil.example" }), ORIGIN, backend)).status).toBe(403);
  });
});

// Duplo mínimo do cliente Supabase (service_role) para as funções de servidor.
function fakeService(rpcResults: Record<string, unknown> = {}) {
  const rpcs: { fn: string; args: unknown }[] = [];
  const updates: unknown[] = [];
  const service = {
    schema: () => ({
      rpc: async (fn: string, args: unknown) => {
        rpcs.push({ fn, args });
        return { data: rpcResults[fn] ?? null, error: null };
      },
    }),
    auth: { admin: { updateUserById: async (_id: string, attrs: unknown) => (updates.push(attrs), { error: null }) } },
  } as unknown as SupabaseClient;
  return { service, rpcs, updates };
}

const user = (meta: Record<string, unknown> | undefined, confirmed = true) =>
  ({
    id: "00000000-0000-0000-0000-000000000001",
    email: "pessoa@example.test",
    email_confirmed_at: confirmed ? "2026-10-15T00:00:00Z" : undefined,
    user_metadata: meta ? { club_signup: meta } : {},
  }) as unknown as User;

test.describe("PR2B live · conclusão após confirmar o e-mail", () => {
  const stored = { ...valid, email: undefined, turnstileToken: undefined, marketingOptIn: true, studentIntent: false };

  test("revalida, grava numa transação e limpa os dados do convite", async () => {
    const { service, rpcs, updates } = fakeService({ complete_signup: "created" });
    expect(await completeSignup(service, user(stored))).toBe("created");
    expect(rpcs[0].fn).toBe("complete_signup");
    expect(rpcs[0].args).toMatchObject({ p_user: user(stored).id, p_payload: { plan: "club", displayName: "Pessoa Teste", marketingOptIn: true } });
    expect(JSON.stringify(rpcs[0].args)).not.toContain("example.test");
    expect(updates).toEqual([{ user_metadata: { club_signup: null } }]);
  });

  test("não grava sem e-mail verificado, sem dados, com dados adulterados ou de menor", async () => {
    const { service, rpcs } = fakeService();
    expect(await completeSignup(service, user(stored, false))).toBe("invalid");
    expect(await completeSignup(service, user(undefined))).toBe("no_signup_data");
    expect(await completeSignup(service, user({ ...stored, price: 1 }))).toBe("invalid");
    expect(await completeSignup(service, user({ ...stored, ageBand: "teen" }))).toBe("invalid");
    expect(rpcs).toHaveLength(0);
  });
});

test.describe("PR2B live · outbox CRM", () => {
  const rows = [
    { id: 1, event: "contact_opt_in", payload: { email: "a@example.test", display_name: "A", source: "club" }, created_at: "t", attempts: 1 },
    { id: 2, event: "contact_opt_out", payload: { email: "b@example.test", display_name: "B", source: "club" }, created_at: "t", attempts: 1 },
  ];

  test("sem webhook configurado os eventos ficam no outbox", async () => {
    const { service, rpcs } = fakeService();
    expect(await deliverOutbox(service, {})).toEqual({ delivered: 0, failed: 0, skipped: "crm_not_configured" });
    expect(await deliverOutbox(service, { CLUB_CRM_WEBHOOK_URL: "http://inseguro.example", CLUB_CRM_WEBHOOK_SECRET: "s" })).toMatchObject({ skipped: "crm_not_configured" });
    expect(rpcs).toHaveLength(0);
  });

  test("entrega assinada e idempotente; só conclui o que o CRM aceitou", async () => {
    const { service, rpcs } = fakeService({ claim_crm_outbox: rows });
    const sent: { headers: Record<string, string>; body: string }[] = [];
    const fetchImpl = (async (_url: string, init: RequestInit) => {
      sent.push({ headers: init.headers as Record<string, string>, body: init.body as string });
      return new Response(null, { status: sent.length === 1 ? 200 : 500 });
    }) as unknown as typeof fetch;
    const env = { CLUB_CRM_WEBHOOK_URL: "https://crm.example.test/club", CLUB_CRM_WEBHOOK_SECRET: "segredo" };
    expect(await deliverOutbox(service, env, 25, fetchImpl)).toEqual({ delivered: 1, failed: 1 });
    expect(rpcs.at(-1)).toEqual({ fn: "complete_crm_outbox", args: { p_ids: [1] } });
    const [t, v1] = sent[0].headers["x-club-signature"].split(",").map((p) => p.split("=")[1]);
    expect(v1).toBe(signBody("segredo", Number(t), sent[0].body));
    expect(sent[0].headers["idempotency-key"]).toBe("club-outbox-1");
    expect(sent[0].body).not.toMatch(/interests|first_mission|area|device/);
  });
});

test.describe("PR2B live · rotas fechadas sem configuração", () => {
  test("APIs de conta respondem 503 e páginas dizem que as contas não estão ativas", async ({ request, page }) => {
    for (const path of ["/api/club/login", "/api/club/auth/verify", "/api/club/consent", "/api/club/logout", "/api/club/data-request"]) {
      expect((await request.post(path, { data: {} })).status(), path).toBe(503);
    }
    expect((await request.get("/api/club/crm-sync")).status()).toBe(503);
    for (const path of ["/entrar", "/conta", "/entrar/confirmar?token_hash=abcdefghijkl"]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.locator("form[action^='/api/club']")).toHaveCount(0);
    }
    await page.goto("/participar");
    await expect(page.getByText("Modo demonstração.")).toBeVisible();
  });
});
