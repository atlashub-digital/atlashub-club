import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Landing pública", () => {
  test("hero com h1, CTA honesto e elenco aprovado", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("O futuro se constrói");
    const cta = page.getByRole("main").getByRole("link", { name: /Entrar no Club \(gratuito\)/ });
    await expect(cta).toHaveAttribute("href", "/participar");
    await expect(page.getByText("Inscrições em preparação").first()).toBeVisible();
    const cast = page.getByRole("list", { name: "Quem constrói com você" });
    for (const name of ["Sérgio Monteiro", "Lucas", "Atlas", "Clara", "Lia"]) {
      await expect(cast.getByText(name, { exact: true })).toBeVisible();
    }
    // Declaração humano/digital explícita
    await expect(cast.getByText("Pessoa real")).toHaveCount(1);
    await expect(cast.getByText("Personagem digital")).toHaveCount(4);
  });

  test("não publica preços, métricas ou datas não homologadas", async ({ page }) => {
    await page.goto("/");
    const text = await page.locator("body").innerText();
    expect(text).not.toMatch(/R\$\s?\d|€\s?\d|\/m[eê]s/);
    expect(text).not.toMatch(/inscri[cç][oõ]es abertas|vagas abertas/i);
    expect(text).not.toMatch(/12\/01\/2027|21\/11/);
    expect(text).toContain("09/01/2027");
  });

  test("todas as imagens têm texto alternativo e nenhum link interno quebrado", async ({ page, request }) => {
    await page.goto("/");
    const missingAlt = await page.locator("img:not([alt])").count();
    expect(missingAlt).toBe(0);
    const hrefs = await page.locator('a[href^="/"]').evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute("href")!))]);
    for (const href of hrefs) {
      const res = await request.get(href.split("#")[0]);
      expect(res.status(), href).toBeLessThan(400);
    }
  });

  test("acessibilidade: sem violações axe sérias/críticas (WCAG 2.2 AA)", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
  });

  test("noindex mantido até homologação SEO", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("FAQ abre por teclado", async ({ page }) => {
    await page.goto("/");
    const summary = page.locator("summary", { hasText: "O Club Atlas é pago?" });
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText(/nenhum valor está definido hoje/)).toBeVisible();
  });
});

test.describe("Movimento reduzido", () => {
  test("mascote Atlas fica estática", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const anim = await page.locator(".ca-avatar--animated .ca-avatar__img").first().evaluate((el) => getComputedStyle(el).animationName);
    expect(anim).toBe("none");
  });
});
