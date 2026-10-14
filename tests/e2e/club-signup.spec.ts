import { expect, test } from "@playwright/test";
import { clubAuthMode } from "@/lib/club/mode";
import { createMemoryRateLimiter } from "@/lib/club/rate-limit";
import { handleSignup } from "@/lib/club/signup-handler";
import { PRIVACY_VERSION, TERMS_VERSION, validateSignup } from "@/lib/club/signup-schema";

// PR2B — lógica de servidor sem rede nem persistência. Corre só no projeto desktop (não depende do browser).
test.beforeEach(({ isMobile }) => test.skip(isMobile, "lógica de servidor: basta um projeto"));

const valid = {
  plan: "club",
  displayName: "Pessoa Teste",
  email: "Pessoa@Example.test",
  ageBand: "adult",
  interests: ["Pesquisa e escrita"],
  termsVersion: TERMS_VERSION,
  privacyVersion: PRIVACY_VERSION,
};
const dryEnv = { CLUB_AUTH_MODE: "dry-run", CLUB_SITE_ORIGIN: "https://club.example.test", VERCEL_ENV: "preview" };
const req = (body: unknown, headers: Record<string, string> = {}) => ({
  headers: new Headers({ origin: dryEnv.CLUB_SITE_ORIGIN, "content-type": "application/json", "x-forwarded-for": "198.51.100.7", ...headers }),
  text: async () => (typeof body === "string" ? body : JSON.stringify(body)),
});
const limiters = () => ({ ip: createMemoryRateLimiter(5, 60_000), email: createMemoryRateLimiter(3, 60_000) });

test.describe("PR2B · modo fail-closed", () => {
  test("off por defeito e sempre off em produção", () => {
    expect(clubAuthMode({})).toBe("off");
    expect(clubAuthMode({ CLUB_AUTH_MODE: "live" })).toBe("off");
    expect(clubAuthMode({ CLUB_AUTH_MODE: "dry-run", VERCEL_ENV: "production" })).toBe("off");
    expect(clubAuthMode({ CLUB_AUTH_MODE: "dry-run", VERCEL_ENV: "preview" })).toBe("dry-run");
  });

  test("API responde 503 sem configuração", async ({ request }) => {
    const r = await request.post("/api/club/signup", { data: valid });
    expect(r.status()).toBe(503);
  });
});

test.describe("PR2B · validação de dados mínimos", () => {
  test("normaliza e aceita o mínimo; marketing desmarcado por defeito", () => {
    const r = validateSignup(valid);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.email).toBe("pessoa@example.test");
      expect(r.value.marketingOptIn).toBe(false);
      expect(r.value.studentIntent).toBe(false);
    }
  });

  test("bloqueia menores, termos em falta e campos proibidos", () => {
    const r = validateSignup({ ...valid, ageBand: "minor", termsVersion: undefined, price: 1, cpf: "x", whatsapp: "x" });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.ageBand).toBe("minor_blocked");
      expect(r.errors.termsVersion).toBe("terms_required");
      expect(r.errors.price).toBe("not_allowed");
      expect(r.errors.cpf).toBe("not_allowed");
      expect(r.errors.whatsapp).toBe("not_allowed");
    }
  });

  test("intenção de estudante só conta no plano Genesis", () => {
    const club = validateSignup({ ...valid, studentIntent: true });
    const genesis = validateSignup({ ...valid, plan: "genesis", studentIntent: true });
    expect(club.ok && club.value.studentIntent).toBe(false);
    expect(genesis.ok && genesis.value.studentIntent).toBe(true);
  });
});

test.describe("PR2B · handler em dry-run", () => {
  test("origem, tipo e tamanho são verificados", async () => {
    expect((await handleSignup(req(valid, { origin: "https://evil.example" }), dryEnv, limiters())).status).toBe(403);
    expect((await handleSignup(req(valid, { "content-type": "text/plain" }), dryEnv, limiters())).status).toBe(415);
    expect((await handleSignup(req("x".repeat(5000)), dryEnv, limiters())).status).toBe(413);
    expect((await handleSignup(req("{"), dryEnv, limiters())).status).toBe(400);
  });

  test("devolve plano de escrita sem persistir e sem email em claro", async () => {
    const r = await handleSignup(req({ ...valid, plan: "genesis", marketingOptIn: true }), dryEnv, limiters());
    expect(r.status).toBe(202);
    expect(r.body.dryRun).toBe(true);
    const tables = (r.body.wouldWrite as { table: string }[]).map((w) => w.table);
    expect(tables).toEqual(expect.arrayContaining(["club.club_genesis_applications", "club.club_crm_outbox"]));
    expect(JSON.stringify(r.body)).not.toContain("example.test");
  });

  test("sem opt-in de marketing não há envio para o CRM", async () => {
    const r = await handleSignup(req(valid), dryEnv, limiters());
    expect(JSON.stringify(r.body)).not.toContain("crm_outbox");
  });

  test("rate limit por IP devolve 429; por email responde de forma neutra", async () => {
    const l = limiters();
    for (let i = 0; i < 3; i++) await handleSignup(req(valid), dryEnv, l);
    const neutral = await handleSignup(req(valid), dryEnv, l);
    expect(neutral.status).toBe(202);
    expect(neutral.body.wouldWrite).toBeUndefined();
    await handleSignup(req(valid), dryEnv, l);
    const blocked = await handleSignup(req(valid), dryEnv, l);
    expect(blocked.status).toBe(429);
    expect(blocked.headers?.["retry-after"]).toBeTruthy();
  });

  test("honeypot recebe resposta neutra", async () => {
    const r = await handleSignup(req({ ...valid, website: "spam" }), dryEnv, limiters());
    expect(r.status).toBe(202);
    expect(r.body.wouldWrite).toBeUndefined();
  });
});
