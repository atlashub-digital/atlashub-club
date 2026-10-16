import { expect, test } from "@playwright/test";

// Sem ARO configurado (estado atual), o webhook recusa tudo e nenhuma rota de checkout existe.
test("ARO desligado: webhook 503 e sem checkout exposto", async ({ request }) => {
  const hook = await request.post("/api/aro/webhook", { data: { id: "x", type: "entitlement.granted" } });
  expect(hook.status()).toBe(503);
  expect((await request.post("/api/aro/checkout", { data: {} })).status()).toBe(404);
});
