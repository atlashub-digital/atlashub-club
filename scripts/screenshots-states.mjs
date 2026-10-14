// Capturas de estados interativos (formulário de adesão e Atlas) para revisão visual.
// Uso: servidor em BASE_URL (padrão http://localhost:3000); `node scripts/screenshots-states.mjs <saida>`.
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const out = process.argv[2] || "design/screenshots/v3";
const base = process.env.BASE_URL || "http://localhost:3000";
mkdirSync(out, { recursive: true });
// Capturas de página inteira começam no topo (senão o cabeçalho fixo aparece a meio da imagem).
const full = async (page, path) => {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path, fullPage: true });
};
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});

async function fillAndReview(page, { age, name }) {
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByLabel(age).check();
  await page.getByLabel(name, { exact: true }).fill("Pessoa Exemplo");
  await page.getByLabel("E-mail", { exact: true }).fill("pessoa@example.com");
  return page;
}

for (const vp of [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "mobile-390", width: 390, height: 844 },
]) {
  const page = await browser.newPage({ viewport: vp, reducedMotion: "reduce" });
  await page.addInitScript(() => sessionStorage.setItem("ca-atlas-bubble", "1"));

  // Adulto · Genesis · estudante (validação de estudante pendente)
  await page.goto(base + "/participar?plan=genesis", { waitUntil: "networkidle" });
  await page.getByLabel(/Sou estudante/).check();
  await full(page, `${out}/participar-genesis-estudante-${vp.name}.png`);
  await fillAndReview(page, { age: "18 anos ou mais", name: "Nome" });
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByLabel(/primeira missão/).fill("Organizar o meu semestre e lembrar das entregas");
  await page.getByRole("button", { name: "Continuar" }).click();
  await full(page, `${out}/participar-revisao-${vp.name}.png`);

  // Menor (12–17) · Genesis · estudante → pending_guardian_review
  await page.goto(base + "/participar?plan=genesis", { waitUntil: "networkidle" });
  await page.getByLabel(/Sou estudante/).check();
  await fillAndReview(page, { age: "Entre 12 e 17 anos", name: "Nome ou apelido" });
  await full(page, `${out}/participar-menor-dados-${vp.name}.png`);
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByLabel(/primeira missão/).fill("Criar um agente que me ajude a estudar para as provas");
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByLabel(/Li e aceito/).check();
  await page.getByRole("button", { name: /Concluir prévia/ }).click();
  await full(page, `${out}/participar-menor-concluido-${vp.name}.png`);

  // Atlas: painel aberto (por teclado, pois em mobile o lançador recolhe-se sobre CTAs)
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.screenshot({ path: `${out}/atlas-recolhido-hero-${vp.name}.png` });
  await page.getByRole("button", { name: "Abrir conversa com o Atlas" }).focus();
  await page.keyboard.press("Enter");
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
