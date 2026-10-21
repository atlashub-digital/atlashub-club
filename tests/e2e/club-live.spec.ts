import { expect, test } from "@playwright/test";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { supabaseBackend, type ClubBackend } from "@/lib/club/backend";
import { completeSignup, hasClubProfile, loadPendingSignup } from "@/lib/club/complete-signup";
import { deliverOutbox, signBody } from "@/lib/club/crm";
import { handleLogin } from "@/lib/club/login-handler";
import { clubAuthMode, liveConfig, missingLiveConfig } from "@/lib/club/mode";
import { emailHash } from "@/lib/club/hash";
import { handleSignup } from "@/lib/club/signup-handler";
import { PRIVACY_VERSION, TERMS_VERSION, type SignupInput } from "@/lib/club/signup-schema";

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
function fakeService(rpcResults: Record<string, unknown> = {}, profile = false) {
  const rpcs: { fn: string; args: unknown }[] = [];
  const service = {
    schema: () => ({
      rpc: async (fn: string, args: unknown) => {
        rpcs.push({ fn, args });
        return { data: rpcResults[fn] ?? null, error: null };
      },
      from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: profile ? { user_id: "x" } : null, error: null }) }) }) }),
    }),
  } as unknown as SupabaseClient;
  return { service, rpcs };
}

const user = (confirmed = true) =>
  ({
    id: "00000000-0000-0000-0000-000000000001",
    email: "pessoa@example.test",
    email_confirmed_at: confirmed ? "2026-10-15T00:00:00Z" : undefined,
    user_metadata: {},
  }) as unknown as User;

test.describe("PR2B live · conclusão depois de confirmar o e-mail", () => {
  const pending = { ...valid, email: undefined, turnstileToken: undefined, marketingOptIn: true, studentIntent: false };

  test("lê os dados pendentes, aplica a escolha do dono do e-mail e grava numa transação", async () => {
    const { service, rpcs } = fakeService({ get_pending_signup: pending, complete_signup: "created" });
    expect(await completeSignup(service, user(), { termsAccepted: true, marketingOptIn: false })).toBe("created");
    expect(rpcs.map((r) => r.fn)).toEqual(["get_pending_signup", "complete_signup"]);
    expect(rpcs[1].args).toMatchObject({
      p_user: user().id,
      p_payload: { plan: "club", displayName: "Pessoa Teste", marketingOptIn: false, termsVersion: TERMS_VERSION, privacyVersion: PRIVACY_VERSION },
    });
    expect(JSON.stringify(rpcs[1].args)).not.toContain("example.test");
  });

  test("sem aceitar os termos, sem e-mail verificado, sem dados, com dados adulterados ou de menor: nada é gravado", async () => {
    const ok = fakeService({ get_pending_signup: pending });
    expect(await completeSignup(ok.service, user(), { termsAccepted: false, marketingOptIn: true })).toBe("terms_required");
    expect(await completeSignup(ok.service, user(false), { termsAccepted: true, marketingOptIn: true })).toBe("invalid");
    for (const data of [null, { ...pending, price: 1 }, { ...pending, ageBand: "teen" }, [pending]]) {
      const { service, rpcs } = fakeService({ get_pending_signup: data });
      expect(await completeSignup(service, user(), { termsAccepted: true, marketingOptIn: true })).toBe("no_signup_data");
      expect(rpcs.map((r) => r.fn)).not.toContain("complete_signup");
    }
    expect(await loadPendingSignup(fakeService({ get_pending_signup: pending }).service, user(false))).toBeNull();
  });

  test("repetir conclusão com perfil existente não exige dados pendentes nem grava novamente", async () => {
    const { service, rpcs } = fakeService({}, true);
    expect(await completeSignup(service, user(), { termsAccepted: true, marketingOptIn: false })).toBe("existing");
    expect(rpcs).toEqual([]);
  });

  test("metadata antiga nunca substitui os dados pendentes do servidor", async () => {
    const account = user();
    account.user_metadata = { club_signup: pending };
    const { service, rpcs } = fakeService();
    expect(await completeSignup(service, account, { termsAccepted: true, marketingOptIn: true })).toBe("no_signup_data");
    expect(rpcs.map((r) => r.fn)).toEqual(["get_pending_signup"]);
  });

  test("perfil existente é detetado pelo servidor", async () => {
    expect(await hasClubProfile(fakeService({}, true).service, user().id)).toBe(true);
    expect(await hasClubProfile(fakeService({}, false).service, user().id)).toBe(false);
  });
});

test.describe("PR2B live · link de e-mail na Master", () => {
  const cfg = liveConfig(liveEnv)!;
  const fakeAuth = (error: { status: number; code: string } | null = null) => {
    const otps: { email: string; options: Record<string, unknown> }[] = [];
    const client = { auth: { signInWithOtp: async (a: { email: string; options: Record<string, unknown> }) => (otps.push(a), { error }) } };
    return { otps, factory: async () => client as unknown as SupabaseClient };
  };

  test("registo: dados pendentes por hash, fora do auth.users; o JWT só leva a origem", async () => {
    const { service, rpcs } = fakeService();
    const auth = fakeAuth();
    const signup = { ...valid, email: "pessoa@example.test", marketingOptIn: true } as unknown as SignupInput;
    expect(await supabaseBackend(cfg, service, auth.factory).sendLink("pessoa@example.test", signup)).toBe("sent");
    expect(rpcs[0]).toMatchObject({ fn: "stash_signup", args: { p_email_hash: emailHash("pessoa@example.test") } });
    expect((rpcs[0].args as { p_email_hash: string }).p_email_hash).toMatch(/^[0-9a-f]{64}$/);
    expect(JSON.stringify(rpcs[0].args)).not.toContain("example.test");
    expect(auth.otps[0].options).toEqual({ shouldCreateUser: true, emailRedirectTo: ORIGIN + "/entrar/confirmar", data: { signup_source: "club" } });
  });

  test("entrada nunca cria conta nem grava dados; e-mail sem conta responde neutro", async () => {
    const { service, rpcs } = fakeService();
    const auth = fakeAuth({ status: 422, code: "otp_disabled" });
    expect(await supabaseBackend(cfg, service, auth.factory).sendLink("x@example.test")).toBe("sent");
    expect(auth.otps[0].options).toEqual({ shouldCreateUser: false, emailRedirectTo: ORIGIN + "/entrar/confirmar" });
    expect(rpcs).toHaveLength(0);
  });

  test("registo fechado na Master não finge envio", async () => {
    const signup = { ...valid } as unknown as SignupInput;
    for (const code of ["signup_disabled", "otp_disabled", "email_provider_disabled"]) {
      const backend = supabaseBackend(cfg, fakeService().service, fakeAuth({ status: 422, code }).factory);
      await expect(backend.sendLink("pessoa@example.test", signup)).rejects.toThrow(/registo fechado/);
    }
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
    for (const path of ["/api/club/login", "/api/club/auth/verify", "/api/club/complete", "/api/club/consent", "/api/club/logout", "/api/club/data-request", "/api/club/genesis-interest"]) {
      expect((await request.post(path, { data: {} })).status(), path).toBe(503);
    }
    expect((await request.get("/api/club/crm-sync")).status()).toBe(503);
    for (const path of ["/entrar", "/conta", "/conta/concluir", "/entrar/confirmar?token_hash=abcdefghijkl", "/entrar/confirmar?code=abcdefghijkl"]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.locator("form[action^='/api/club']")).toHaveCount(0);
    }
    await page.goto("/participar");
    await expect(page.getByText("Modo demonstração.")).toBeVisible();
  });
});
