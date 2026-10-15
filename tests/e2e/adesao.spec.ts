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

  test("menor de 18 avança sem bloqueio e termina em pending_guardian_review", async ({ page }) => {
    const apiCalls: string[] = [];
    page.on("request", (r) => {
      if (r.url().includes("/api/")) apiCalls.push(r.url());
    });
    await page.goto("/participar?plan=genesis");
    await page.getByLabel(/Sou estudante/).check();
    await page.getByRole("button", { name: "Continuar" }).click();
    await page.getByLabel("Entre 12 e 17 anos").check();
    // Mensagem positiva, sem bloqueio e sem consentimento simulado
    const note = page.getByRole("note").filter({ hasText: "Que bom ter você aqui!" });
    await expect(note).toContainText("autorização de um responsável");
    await expect(page.getByText(/só para maiores de 18 anos/)).toHaveCount(0);
    await expect(page.getByLabel(/autoriza|autorização do responsável/i)).toHaveCount(0);
    // Minimização: sem WhatsApp para menores
    await expect(page.getByLabel("WhatsApp (opcional)")).toHaveCount(0);
    await page.getByLabel("Nome ou apelido").fill("Pessoa Jovem");
    await page.getByLabel("E-mail", { exact: true }).fill("jovem@example.com");
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.locator(".ca-adesao__errors")).toHaveCount(0);
    await page.getByLabel(/primeira missão/).fill("Organizar os meus estudos");
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.locator(".ca-adesao__review")).toContainText("pending_guardian_review");
    await page.getByLabel(/Li e aceito/).check();
    await page.getByRole("button", { name: /Concluir prévia/ }).click();
    const outcome = page.locator(".ca-adesao__outcome");
    await expect(outcome).toContainText("Revisão do responsável pendente");
    await expect(outcome).toContainText("Revisão do responsável:");
    await expect(outcome).toContainText("Validação de estudante:");
    await expect(outcome).toContainText(/Pré-candidatura Genesis, matrícula e qualquer cobrança/);
    expect(apiCalls).toEqual([]);
  });

  test("menor de 12 anos vê a nota de participação do responsável desde o início", async ({ page }) => {
    await page.goto("/participar");
    await page.getByRole("button", { name: "Continuar" }).click();
    await page.getByLabel("Menos de 12 anos").check();
    await expect(page.getByRole("note").filter({ hasText: "Que bom ter você aqui!" })).toContainText(
      "o responsável participa desde o início",
    );
  });

  test("menor de 12 anos: o e-mail não é pedido e o percurso segue para revisão do responsável", async ({ page }) => {
    await page.goto("/participar");
    await page.getByRole("button", { name: "Continuar" }).click();
    await page.getByLabel("Menos de 12 anos").check();
    await expect(page.getByLabel("E-mail", { exact: true })).toHaveCount(0);
    await expect(page.getByText("Não pedimos o seu e-mail.")).toBeVisible();
    await page.getByLabel("Nome ou apelido").fill("Criança");
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.locator(".ca-adesao__errors")).toHaveCount(0);
    await page.getByLabel(/primeira missão/).fill("Aprender a criar jogos");
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.locator(".ca-adesao__review")).not.toContainText("E-mail");
    await page.getByLabel(/Li e aceito/).check();
    await page.getByRole("button", { name: /Concluir prévia/ }).click();
    await expect(page.locator(".ca-adesao__outcome")).toContainText("pending_guardian_review");
  });

  test("adulto no Club grátis não precisa de revisão manual", async ({ page }) => {
    await page.goto("/participar");
    await page.getByRole("button", { name: "Continuar" }).click();
    await fillData(page);
    await expect(page.getByRole("note").filter({ hasText: "Que bom ter você aqui!" })).toHaveCount(0);
    await page.getByRole("button", { name: "Continuar" }).click();
    await page.getByLabel(/primeira missão/).fill("Organizar o meu semestre");
    await page.getByRole("button", { name: "Continuar" }).click();
    await page.getByLabel(/Li e aceito/).check();
    await page.getByRole("button", { name: /Concluir prévia/ }).click();
    await expect(page.locator(".ca-adesao__outcome")).toContainText("club_free");
    await expect(page.locator(".ca-adesao__outcome")).toContainText("Sem revisão manual");
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
