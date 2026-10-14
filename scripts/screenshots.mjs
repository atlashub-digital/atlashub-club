// Captura screenshots da implementação nos viewports de referência do prompt master (§4.6).
// Uso: npm run build && npm start (porta 3000) e depois `node scripts/screenshots.mjs [saida] [rotas...]`.
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const out = process.argv[2] || "design/screenshots/current";
const routes = process.argv.slice(3).length ? process.argv.slice(3) : ["/"];
const base = process.env.BASE_URL || "http://localhost:3000";
const viewports = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "mobile-390", width: 390, height: 844 },
];

mkdirSync(out, { recursive: true });
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
for (const route of routes) {
  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, reducedMotion: "reduce" });
    await page.goto(base + route, { waitUntil: "networkidle" });
    // Força o carregamento de imagens lazy antes da captura de página inteira.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState("networkidle");
    const slug = route === "/" ? "home" : route.replace(/\//g, "_").replace(/^_/, "");
    await page.screenshot({ path: `${out}/${slug}-${vp.name}-fold.png` });
    await page.screenshot({ path: `${out}/${slug}-${vp.name}-full.png`, fullPage: true });
    await page.close();
  }
}
await browser.close();
console.log(`Screenshots em ${out}`);
