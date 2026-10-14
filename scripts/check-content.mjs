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
if (problems.length) {
  console.error(`check-content: ${problems.length} problema(s)\n` + problems.join("\n"));
  process.exit(1);
}
console.log("check-content: OK");
