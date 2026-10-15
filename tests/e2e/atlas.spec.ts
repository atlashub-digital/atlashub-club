import { expect, test, type Page } from "@playwright/test";

/** Abre o Atlas por teclado: em mobile o lançador pode estar recolhido por cima de um CTA, mas o foco trá-lo de volta. */
async function openAtlas(page: Page) {
  const launcher = page.getByRole("button", { name: "Abrir conversa com o Atlas" });
  await launcher.focus();
  await page.keyboard.press("Enter");
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    (window as unknown as { __micCalls: number }).__micCalls = 0;
    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia = async () => {
        (window as unknown as { __micCalls: number }).__micCalls++;
        throw new Error("blocked in test");
      };
    }
  });
});

test("Atlas abre, responde só com guia rotulado e fecha com Escape", async ({ page }) => {
  await page.goto("/");
  await openAtlas(page);
  const dialog = page.getByRole("dialog", { name: "Atlas" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(/IA em preparação/)).toBeVisible();
  await dialog.getByRole("button", { name: "Quanto custa?" }).click();
  await expect(dialog.getByText("Guia pré-escrito").last()).toBeVisible();
  await expect(dialog.getByText(/R\$ 490 valor padrão/)).toBeVisible();
  await dialog.getByLabel("Escrever ao Atlas").fill("Olá Atlas");
  await dialog.getByRole("button", { name: "Enviar" }).click();
  await expect(dialog.getByText(/Ainda não consigo conversar livremente/)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("button", { name: "Abrir conversa com o Atlas" })).toBeFocused();
});

test("microfone nunca é pedido sem consentimento", async ({ page }) => {
  await page.goto("/");
  await openAtlas(page);
  await page.getByRole("button", { name: /Voz/ }).click();
  await expect(page.getByText(/só vou ouvir depois da sua autorização/)).toBeVisible();
  expect(await page.evaluate(() => (window as unknown as { __micCalls: number }).__micCalls)).toBe(0);
});

test("pode ser ocultado e reaparece pelo botão Mostrar Atlas", async ({ page }) => {
  await page.goto("/");
  await openAtlas(page);
  await page.getByRole("button", { name: "Ocultar o Atlas" }).click();
  await page.reload();
  const pill = page.getByRole("button", { name: "Mostrar Atlas" });
  await expect(pill).toBeVisible();
  await pill.click();
  await expect(page.getByRole("button", { name: "Abrir conversa com o Atlas" })).toBeAttached();
});

test("API do Atlas é fail-closed", async ({ request }) => {
  const res = await request.post("/api/atlas/turn", { data: { text: "olá" } });
  expect(res.status()).toBe(503);
});

test.describe("Atlas não tapa CTAs nem campos", () => {
  test("mobile: recolhe-se por cima dos CTAs do hero e deixa-os clicáveis", async ({ page, isMobile }) => {
    test.skip(!isMobile, "apenas mobile");
    await page.goto("/");
    await expect(page.locator(".ca-atlas")).toHaveAttribute("data-ducked", "true");
    for (const name of [/Entrar no Club gratuitamente/, /Conhecer o Genesis/]) {
      const cta = page.locator(".ca-hero").getByRole("link", { name });
      await cta.scrollIntoViewIfNeeded();
      const box = (await cta.boundingBox())!;
      const hit = await page.evaluate(
        ([x, y]) => document.elementFromPoint(x, y)?.closest("a")?.textContent ?? "",
        [box.x + box.width - 12, box.y + box.height / 2],
      );
      expect(hit).toMatch(name);
    }
  });

  test("mobile: recolhe-se enquanto se preenche um campo do formulário", async ({ page, isMobile }) => {
    test.skip(!isMobile, "apenas mobile");
    await page.goto("/participar");
    await page.getByRole("button", { name: "Continuar" }).click();
    await page.getByLabel("18 anos ou mais").check();
    await page.getByLabel("E-mail", { exact: true }).focus();
    await expect(page.locator(".ca-atlas")).toHaveAttribute("data-ducked", "true");
  });

  test("desktop: lançador sempre visível", async ({ page, isMobile }) => {
    test.skip(isMobile, "apenas desktop");
    await page.goto("/");
    await expect(page.locator(".ca-atlas")).not.toHaveAttribute("data-ducked", /.*/);
    await expect(page.getByRole("button", { name: "Abrir conversa com o Atlas" })).toBeVisible();
  });
});
