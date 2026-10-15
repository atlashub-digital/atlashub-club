import { expect, test } from "@playwright/test";

test.describe("Genesis Early Access e agenda", () => {
  test("Genesis mostra o Early Access com os 2 ateliers e a linha do tempo, sem cobrança", async ({ page }) => {
    await page.goto("/genesis");
    const ea = page.locator("section#early-access");
    await expect(ea.getByRole("heading", { name: "Comece antes da Turma 01." })).toBeVisible();
    await expect(ea.getByText("até 30/11/2026").first()).toBeVisible();
    await expect(ea.getByText("Híbrido: Anápolis + online · data a confirmar")).toBeVisible();
    await expect(ea.getByText("Online · data a confirmar", { exact: true })).toBeVisible();
    await expect(ea.getByText("09/01/2027").first()).toBeVisible();
    await expect(ea.getByText(/não é matrícula/)).toBeVisible();
    await expect(ea.getByRole("link", { name: "Registrar interesse pelo WhatsApp" })).toHaveAttribute("href", /^https:\/\/wa\.me\//);
    await expect(page.getByText("R$ 490").first()).toBeVisible();
    await expect(page.getByText("R$ 190").first()).toBeVisible();
  });

  test("workshops aparecem na agenda como AtlasHub.SI pagos, fora do Club gratuito", async ({ page }) => {
    await page.goto("/eventos");
    for (const title of ["Empresa Aumentada 2027–2030", "Enterprise Lab — E-commerce e Operações Vivas"]) {
      const card = page.locator("article", { hasText: title });
      await expect(card.getByText(/WORKSHOP ATLASHUB\.SI/)).toBeVisible();
      await expect(card.getByText(/Não faz parte do Club gratuito/)).toBeVisible();
    }
    // Páginas publicadas em atlashub.si: links ativos (atlashubWorkshopsLive).
    await expect(page.locator("a[href='https://atlashub.si/workshops/empresa-aumentada-2027-2030']")).toHaveCount(2);
    await expect(page.locator("a[href='https://atlashub.si/workshops/enterprise-lab-ecommerce']")).toHaveCount(1);
  });

  test("Comunidade aponta para o canal real (WhatsApp assistido)", async ({ page }) => {
    await page.goto("/comunidade");
    await expect(page.getByRole("link", { name: /Falar com a equipe no WhatsApp/ })).toHaveAttribute("href", /^https:\/\/wa\.me\//);
    await expect(page.getByText("Contato ativo · grupos em preparação")).toBeVisible();
  });
});

test("links de WhatsApp levam código de captação verificável", async ({ page }) => {
  await page.goto("/genesis");
  const href = await page.getByRole("link", { name: "Registrar interesse pelo WhatsApp" }).getAttribute("href");
  expect(decodeURIComponent(href!.split("text=")[1])).toContain("(código GEN-EA-SITE)");
  await page.goto("/comunidade");
  const club = await page.getByRole("link", { name: /Falar com a equipe no WhatsApp/ }).getAttribute("href");
  expect(decodeURIComponent(club!.split("text=")[1])).toContain("(código CLUB-SITE)");
});
