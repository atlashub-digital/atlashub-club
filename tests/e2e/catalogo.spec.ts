import { expect, test } from "@playwright/test";

test("catálogo do atendimento: 4 ofertas, códigos, links e guardrails", async ({ request }) => {
  const res = await request.get("/catalogo.json");
  expect(res.status()).toBe(200);
  expect(res.headers()["x-robots-tag"]).toBe("noindex");
  const cat = await res.json();
  expect(cat.offers.map((o: { code: string }) => o.code)).toEqual(["CLUB", "GEN-EA", "W01", "EL01"]);
  const text = JSON.stringify(cat);
  // Só os preços aprovados para publicação; workshops sem valor; nada de datas de dezembro nem local.
  expect(text.match(/R\$ \d+/g)?.sort()).toEqual(["R$ 190", "R$ 490"]);
  expect(JSON.stringify(cat.offers)).not.toMatch(/\b\d{1,2}\/12\b|vagas (abertas|limitadas)|inscrições abertas|espaço reservado/i);
  expect(cat.offers.find((o: { code: string }) => o.code === "GEN-EA").decemberDates).toBe("não definidas");
  for (const code of ["W01", "EL01"]) expect(cat.offers.find((o: { code: string }) => o.code === code).venue).toBe("a divulgar");
  expect(cat.paymentRouting.status).toBe("indisponivel");
  expect(cat.offers[0].signup.open).toBe(false);
  expect(cat.offers[1].whatsappUrl).toContain(encodeURIComponent("GEN-EA-SITE"));
  expect(text).not.toMatch(/@[a-z0-9-]+\.[a-z]/i); // nenhum e-mail
});
