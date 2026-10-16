import { expect, test } from "@playwright/test";

// Sem modo live nem ARO (estado atual de produção): matrícula fechada, sem cobrança possível.
test("matrícula Genesis fechada sem live/ARO: página informa e API recusa", async ({ page, request }) => {
  await page.goto("/genesis/inscricao");
  await expect(page.getByText("As matrículas ainda não estão abertas.")).toBeVisible();
  expect((await request.post("/api/genesis/checkout", { form: { offer: "standard" } })).status()).toBe(503);
  expect((await request.get("/api/genesis/checkout/00000000-0000-0000-0000-000000000000")).status()).toBe(503);
});
