import { expect, test, type Page } from "@playwright/test";

async function fillData(page: Page) {
  await page.getByLabel("Nome", { exact: true }).fill("Pessoa Teste");
  await page.getByLabel("E-mail", { exact: true }).fill("pessoa@example.com");
  await page.getByLabel("18 anos ou mais").check();
}

test.describe("Ofertas", () => {
  test("landing compara Club grátis e Genesis com os preços aprovados", async ({ page }) => {
    await page.goto("/");
    const offers = page.locator("#ofertas");
    await expect(offers.getByText("Grátis", { exact: true })).toBeVisible();
    await expect(offers.getByText("R$ 490", { exact: true })).toBeVisible();
    await expect(offers.getByText("R$ 190", { exact: true })).toBeVisible();
    await expect(offers.getByText(/sujeita a validação antes de qualquer pagamento/)).toBeVisible();
  });

  test("/genesis mostra preço padrão, estudante e ausência de cobrança", async ({ page }) => {
    await page.goto("/genesis");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("8 semanas");
    await expect(page.getByText("R$ 490").first()).toBeVisible();
    await expect(page.getByText("R$ 190").first()).toBeVisible();
    await expect(page.getByText("Sem cobrança nesta fase")).toBeVisible();
    await expect(page.getByRole("link", { name: /Pré-inscrição/ }).first()).toHaveAttribute("href", "/participar?plan=genesis");
  });
});

test.describe("Formulário de adesão (prévia)", () => {
  test("abre com Club grátis por defeito e sem exigir plano pago", async ({ page }) => {
    await page.goto("/participar");
    await expect(page.getByRole("radio", { name: /Club Atlas/ })).toBeChecked();
    await expect(page.locator(".ca-adesao__price")).toHaveText("Grátis");
    await expect(page.getByText(/Modo demonstração/)).toBeVisible();
  });

  test("?plan=genesis seleciona Genesis; estudante fica pendente de validação", async ({ page }) => {
    await page.goto("/participar?plan=genesis");
    await expect(page.getByRole("radio", { name: /Genesis Turma 01/ })).toBeChecked();
    await expect(page.locator(".ca-adesao__price")).toContainText("R$ 490");
    await page.getByLabel(/Sou estudante/).check();
    await expect(page.locator(".ca-adesao__price")).toContainText("R$ 190 (pendente de validação)");
    await expect(page.getByText(/não garante o valor/)).toBeVisible();
  });

  test("valida campos, permite voltar sem perder o rascunho e nunca envia dados", async ({ page }) => {
    const apiCalls: string[] = [];
    page.on("request", (r) => {
      if (r.url().includes("/api/")) apiCalls.push(r.url());
    });
    await page.goto("/participar");
    await page.getByRole("button", { name: "Continuar" }).click();
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.locator(".ca-adesao__errors")).toContainText("Informe o seu nome");
    await fillData(page);
    await page.getByRole("button", { name: "Continuar" }).click();
    await page.getByRole("button", { name: "Voltar" }).click();
    await expect(page.getByLabel("Nome", { exact: true })).toHaveValue("Pessoa Teste");
    await page.getByRole("button", { name: "Continuar" }).click();
    await page.getByLabel(/primeira missão/).fill("Organizar o meu semestre");
    await page.getByRole("button", { name: "Continuar" }).click();
    const marketing = page.getByLabel(/Quero receber novidades/);
    await expect(marketing).not.toBeChecked();
    await page.getByRole("button", { name: /Concluir prévia/ }).click();
    await expect(page.locator(".ca-adesao__errors")).toContainText("aceite os termos");
    await page.getByLabel(/Li e aceito/).check();
    await page.getByRole("button", { name: /Concluir prévia/ }).click();
    await expect(page.getByRole("heading", { name: /nada foi enviado/ })).toBeVisible();
    expect(apiCalls).toEqual([]);
  });

  test("menores de 18 anos não avançam", async ({ page }) => {
    await page.goto("/participar?plan=genesis");
    await page.getByRole("button", { name: "Continuar" }).click();
    await page.getByLabel("Nome", { exact: true }).fill("Pessoa Teste");
    await page.getByLabel("E-mail", { exact: true }).fill("pessoa@example.com");
    await page.getByLabel("Menos de 18 anos").check();
    await expect(page.getByText(/autorização de responsável, que ainda não existe/)).toBeVisible();
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.locator(".ca-adesao__errors")).toContainText("só para maiores de 18 anos");
  });
});

test("prévia do dashboard: Missão 001 a zero e Genesis opcional", async ({ page }) => {
  await page.goto("/area-membro");
  await expect(page.getByText(/Prévia demonstrativa/)).toBeVisible();
  await expect(page.getByText("0/4")).toBeVisible();
  await expect(page.getByText("Não iniciada")).toHaveCount(4);
  await expect(page.getByText(/Nenhum agente está ativo/)).toBeVisible();
  const text = await page.locator("main").innerText();
  expect(text).not.toMatch(/\d+\s?XP|\d+%|membros ativos|agente criado/i);
});
