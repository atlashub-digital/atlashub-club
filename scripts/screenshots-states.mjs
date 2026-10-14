// Capturas de estados interativos (formulário de adesão e Atlas) para revisão visual.
// Uso: servidor em BASE_URL (padrão http://localhost:3000); `node scripts/screenshots-states.mjs <saida>`.
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const out = process.argv[2] || "design/screenshots/v2";
const base = process.env.BASE_URL || "http://localhost:3000";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
for (const vp of [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "mobile-390", width: 390, height: 844 },
]) {
  const page = await browser.newPage({ viewport: vp, reducedMotion: "reduce" });
  await page.addInitScript(() => sessionStorage.setItem("ca-atlas-bubble", "1"));

  await page.goto(base + "/participar?plan=genesis", { waitUntil: "networkidle" });
  await page.getByLabel(/Sou estudante/).check();
  await page.screenshot({ path: `${out}/participar-genesis-estudante-${vp.name}.png`, fullPage: true });

  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByLabel("Nome", { exact: true }).fill("Pessoa Exemplo");
  await page.getByLabel("E-mail", { exact: true }).fill("pessoa@example.com");
  await page.getByLabel("18 anos ou mais").check();
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByLabel(/primeira missão/).fill("Organizar o meu semestre e lembrar das entregas");
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.screenshot({ path: `${out}/participar-revisao-${vp.name}.png`, fullPage: true });

  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Abrir conversa com o Atlas" }).click();
  await page.getByRole("button", { name: "Como funciona o Genesis?" }).click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${out}/atlas-painel-${vp.name}.png` });
  await page.close();
}
// Balão contextual (sem sessionStorage)
const p = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
await p.goto(base + "/", { waitUntil: "networkidle" });
await p.waitForTimeout(5600);
await p.screenshot({ path: `${out}/atlas-balao-desktop-1440.png` });
await browser.close();
console.log("Estados em " + out);
