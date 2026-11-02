import { expect, test } from "@playwright/test";

test("Club library links to the published Editions reader and labels forthcoming works", async ({ page }) => {
  await page.goto("/biblioteca");
  await expect(page.getByRole("heading", { name: "O conhecimento também constrói a próxima empresa." })).toBeVisible();
  const book = page.locator("article", { hasText: "Empresa Aumentada" });
  await expect(book.getByText("LEITURA ABERTA NA EDITIONS")).toBeVisible();
  await expect(book.getByRole("link", { name: /Abrir leitor de Empresa Aumentada/ }))
    .toHaveAttribute("href", "https://editions.atlashub.si/livros/empresa-aumentada/ler");
  await expect(page.locator("article").filter({ hasText: "Seu primeiro agente" }).getByText("CONTEÚDO A PRODUZIR")).toBeVisible();
});
