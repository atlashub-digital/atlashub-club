// Integração: percurso de matrícula (src/lib/genesis/checkout.ts) contra as funções SQL reais de 005
// num Postgres local descartável já preparado por scripts/test-sql-draft.sh (variável GENESIS_TEST_DB).
// ARO simulado. Nunca contra Supabase/produção.
import assert from "node:assert/strict";
import postgres from "postgres";
import { aroConfig } from "../src/lib/aro/client";
import type { GenesisBackend } from "../src/lib/genesis/backend";
import { getGenesisStatus, handleGenesisEvent, startGenesisCheckout, type GenesisDeps } from "../src/lib/genesis/checkout";
import { genesisTermsVersion } from "../src/lib/genesis/policy";
import { aroEnv, fakeAro } from "../tests/genesis-fakes";

const url = process.env.GENESIS_TEST_DB;
if (!url || !/localhost|127\.0\.0\.1|\/var\/|\/tmp\//.test(url)) { console.error("Recusado: GENESIS_TEST_DB tem de ser local"); process.exit(1); }
const sql = postgres(url, { prepare: false, onnotice: () => {} });

// Backend com as mesmas funções que supabaseGenesis chama, mas pelo papel service_role do Postgres local.
const as = async <T>(q: (tx: postgres.TransactionSql) => Promise<T>) => sql.begin(async (tx) => { await tx`set local role service_role`; return q(tx); }) as Promise<T>;
const db: GenesisBackend = {
  salesOpen: async () => (await as((tx) => tx`select sales_open from club.club_cohorts where cohort = 'genesis-01'`))[0].sales_open,
  offerCheck: async (u, o) => (await as((tx) => tx`select club.genesis_offer_check(${u}, ${o}) as r`))[0].r,
  start: async (u, o, t) => (await as((tx) => tx`select * from club.genesis_start_checkout(${u}, ${o}, ${t})`))[0] as never,
  attach: async (i, s, o, a, e) => { await as((tx) => tx`select club.genesis_attach_checkout(${i}, ${s}, ${o}, ${a}, ${e})`); },
  owner: async (i) => ((await as((tx) => tx`select * from club.genesis_checkout_owner(${i})`))[0] as never) ?? null,
  byOrder: async (o) => (await as((tx) => tx`select club.genesis_checkout_by_order(${o}) as r`))[0].r,
  confirm: async (i, o) => (await as((tx) => tx`select club.genesis_confirm(${i}, ${o}) as r`))[0].r,
  release: async (i, r) => { await as((tx) => tx`select club.genesis_release(${i}, ${r})`); },
  revoke: async (o, r) => (await as((tx) => tx`select club.genesis_revoke(${o}, ${r}) as r`))[0].r,
  recordEvent: async (i, t) => (await as((tx) => tx`select club.aro_record_event(${i}, ${t}) as r`))[0].r,
  requestStudent: async (u, i) => (await as((tx) => tx`select club.request_student_eligibility(${u}, ${i}) as r`))[0].r,
};

const aro = fakeAro();
const deps: GenesisDeps = { aro: aroConfig(aroEnv), db, env: aroEnv, fetch: aro.fetch, now: () => new Date() };
let n = 0; const ok = (m: string) => console.log(`OK ${++n} ${m}`);

await sql`update club.club_cohorts set sales_open = true, capacity = null where cohort = 'genesis-01'`;
await sql`insert into auth.users(id, email, email_confirmed_at) values ('00000000-0000-0000-0000-000000000201', 'gen@example.test', now()) on conflict do nothing`;
await sql`insert into club.club_profiles(user_id, display_name, age_band) values ('00000000-0000-0000-0000-000000000201', 'Gen', 'adult') on conflict do nothing`;
const member = { id: "00000000-0000-0000-0000-000000000201", email: "gen@example.test", name: "Gen" };

assert.deepEqual(await startGenesisCheckout(member, "genesis-01-student-br", genesisTermsVersion, deps), { ok: false, status: 403, error: "student_not_approved" }); ok("estudante sem aprovação recusado no servidor");
assert.deepEqual(await startGenesisCheckout(member, "genesis-01-br", null, deps), { ok: false, status: 400, error: "terms_required" }); ok("sem aceitar condições");
const r = await startGenesisCheckout(member, "genesis-01-br", genesisTermsVersion, deps);
assert.ok(r.ok); ok("matrícula padrão iniciada (R$ 490 do ARO)");
const again = await startGenesisCheckout(member, "genesis-01-br", genesisTermsVersion, deps);
assert.ok(again.ok && again.id === r.id && aro.sessions.size === 1); ok("dupla tentativa retoma a mesma sessão");
let s = await getGenesisStatus(r.id, member.id, r.checkoutSecret!, deps);
assert.ok(s?.state === "PENDING" && s.amountMinor === 49000 && s.payment?.qrSvg.startsWith("<svg")); ok("PIX QR + Copia e Cola");
assert.equal(await getGenesisStatus(r.id, "00000000-0000-0000-0000-000000000102", r.checkoutSecret!, deps), null); ok("outro membro não vê a matrícula");
aro.approve(member.email);
const order = (await sql`select aro_order_id from club.club_aro_checkouts where id = ${r.id}`)[0].aro_order_id;
const ev = { id: "gen-e1", type: "payment.approved" as const, created_at: "x", project: "atlas-club", data: { order_id: order } };
assert.equal(await handleGenesisEvent(ev, deps), "processed"); ok("webhook aprovado → re-resolve direito → member");
assert.equal(await handleGenesisEvent(ev, deps), "duplicate"); ok("webhook repetido sem efeito");
s = await getGenesisStatus(r.id, member.id, r.checkoutSecret!, deps);
assert.equal(s?.state, "ENROLLED");
assert.equal((await sql`select status from club.club_genesis_applications where user_id = ${member.id}`)[0].status, "member"); ok("candidatura = member");
assert.deepEqual(await startGenesisCheckout(member, "genesis-01-br", genesisTermsVersion, deps), { ok: false, status: 409, error: "already_enrolled" }); ok("sem segunda compra");
await handleGenesisEvent({ ...ev, id: "gen-e2", type: "payment.refunded" }, deps);
assert.equal((await sql`select status from club.club_genesis_applications where user_id = ${member.id}`)[0].status, "interested"); ok("reembolso retira a matrícula");
const bad = await startGenesisCheckout(member, "genesis-01-br", genesisTermsVersion, { ...deps, fetch: fakeAro({ amountOverride: 100 }).fetch });
assert.deepEqual(bad, { ok: false, status: 502, error: "price_mismatch" }); ok("valor divergente do catálogo recusado");
await sql.end();
console.log(`INTEGRAÇÃO GENESIS: ${n} verificações passaram`);
