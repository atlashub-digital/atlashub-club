import { expect, test } from "@playwright/test";

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
  const launcher = page.getByRole("button", { name: "Abrir conversa com o Atlas" });
  await launcher.click();
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
  await page.getByRole("button", { name: "Abrir conversa com o Atlas" }).click();
  await page.getByRole("button", { name: /Voz/ }).click();
  await expect(page.getByText(/só vou ouvir depois da sua autorização/)).toBeVisible();
  expect(await page.evaluate(() => (window as unknown as { __micCalls: number }).__micCalls)).toBe(0);
});

test("pode ser ocultado e reaparece pelo botão Mostrar Atlas", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Abrir conversa com o Atlas" }).click();
  await page.getByRole("button", { name: "Ocultar o Atlas" }).click();
  await page.reload();
  const pill = page.getByRole("button", { name: "Mostrar Atlas" });
  await expect(pill).toBeVisible();
  await pill.click();
  await expect(page.getByRole("button", { name: "Abrir conversa com o Atlas" })).toBeVisible();
});

test("API do Atlas é fail-closed", async ({ request }) => {
  const res = await request.post("/api/atlas/turn", { data: { text: "olá" } });
  expect(res.status()).toBe(503);
});
