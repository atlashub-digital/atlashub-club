// Guarda de conteúdo público: falha se a UI contiver preços, datas desatualizadas ou
// promessas não homologadas (docs/handoff §0 "Conflitos", AGENTS.md §UX).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const roots = ["src"];
const rules = [
  { re: /R\$\s?(?!490\b|190\b)\d/, why: "preço em reais fora das ofertas aprovadas (R$ 490 / R$ 190, issue #14)" },
  { re: /€\s?\d|\d\s?€/, why: "preço em euros (não homologado)" },
  { re: /\/m[eê]s\b/i, why: "plano mensal (não homologado)" },
  { re: /12\/01\/2027|12 JAN 2027/i, why: "data antiga do Genesis (correto: 09/01/2027)" },
  { re: /09\/01\/2026|09 JAN 2026/i, why: "ano errado do Genesis (correto: 2027)" },
  { re: /\b21\/11\b|\b21 NOV\b/i, why: "Enterprise Lab em 21/11 (correto: 28/11)" },
  { re: /inscri[cç][oõ]es abertas|vagas abertas|[uú]ltimas vagas/i, why: "inscrições/vagas abertas não confirmadas" },
  { re: /\bNEXO\b/, why: "nome antigo NEXO (substituído por ATLAS)" },
  { re: /\+?\d[\d.,]*\s?mil (inscritos|membros)|\d+[.,]?\d*k membros/i, why: "métrica de membros inventada" },
];

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : /\.(tsx?|css|md)$/.test(p) ? [p] : [];
  });
}

const problems = [];
for (const file of roots.flatMap(walk)) {
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i) => {
      for (const r of rules) if (r.re.test(line)) problems.push(`${file}:${i + 1} — ${r.why}\n    ${line.trim().slice(0, 140)}`);
    });
}
// Ofertas da UI = catálogo ARO (aro.project.yaml): mesmos códigos, valores e direito; todas em draft.
const manifest = readFileSync("aro.project.yaml", "utf8");
const offersTs = readFileSync("src/lib/offers.ts", "utf8");
const aroOffers = [...manifest.matchAll(/- code: (\S+)\n(?:(?!\n  - code:)[\s\S])*?amount_minor: (\d+)(?:(?!\n  - code:)[\s\S])*?- (atlas-club:\S+)(?:(?!\n  - code:)[\s\S])*?status: (\w+)/g)].map(
  ([, code, amount, entitlement, status]) => ({ code, amount: Number(amount), entitlement, status }),
);
const uiOffers = [...offersTs.matchAll(/id: "([^"]+)",\s*priceMinor: (\d+)[\s\S]*?(?:entitlement: "([^"]+)")?,?\s*\},/g)]
  .map(([, code, amount, entitlement]) => ({ code, amount: Number(amount), entitlement }))
  .filter((o) => o.amount > 0);
if (!aroOffers.length) problems.push("aro.project.yaml — nenhuma oferta lida");
for (const a of aroOffers) {
  const u = uiOffers.find((o) => o.code === a.code);
  if (!u) problems.push(`src/lib/offers.ts — falta a oferta ARO ${a.code}`);
  else if (u.amount !== a.amount || u.entitlement !== a.entitlement)
    problems.push(`src/lib/offers.ts — ${a.code} diverge do aro.project.yaml (${u.amount}/${u.entitlement} ≠ ${a.amount}/${a.entitlement})`);
  if (a.status !== "draft") problems.push(`aro.project.yaml — ${a.code} está ${a.status}; ativar exige aprovação comercial e homologação E7`);
}
for (const u of uiOffers) if (!aroOffers.some((a) => a.code === u.code)) problems.push(`src/lib/offers.ts — ${u.code} não existe no catálogo ARO`);

if (problems.length) {
  console.error(`check-content: ${problems.length} problema(s)\n` + problems.join("\n"));
  process.exit(1);
}
console.log("check-content: OK");
