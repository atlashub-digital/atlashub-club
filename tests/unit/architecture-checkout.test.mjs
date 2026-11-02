import { test } from "node:test";
import assert from "node:assert/strict";
import { architectureCheckout, architectureCourse } from "../../src/lib/courses/architecture.ts";

const valid = { ARCHITECTURE_CHECKOUT_READY: "true", ARCHITECTURE_CHECKOUT_URL: "https://pay.hotmart.com/PRODUCT?off=OFFER", ARCHITECTURE_TERMS_URL: "https://club.atlashub.si/condicoes/formacao" };

test("a oferta é de compra única no escopo aprovado e a publicação não inventa checkout", () => {
  assert.equal(architectureCourse.priceMinor, 14700);
  assert.equal(architectureCheckout({}), null);
  assert.equal(architectureCheckout({ ...valid, ARCHITECTURE_CHECKOUT_READY: "false" }), null);
  assert.equal(architectureCheckout({ ...valid, ARCHITECTURE_TERMS_URL: "" }), null);
});

test("links de pagamento/condições exigem HTTPS, sem credenciais ou placeholders", () => {
  for (const unsafe of ["javascript:alert(1)", "http://pay.hotmart.com/PRODUCT", "https://user:secret@pay.hotmart.com/PRODUCT", "https://example.com/pay", "https://localhost/pay", "not a url"]) {
    assert.equal(architectureCheckout({ ...valid, ARCHITECTURE_CHECKOUT_URL: unsafe }), null);
    assert.equal(architectureCheckout({ ...valid, ARCHITECTURE_TERMS_URL: unsafe }), null);
  }
  assert.deepEqual(architectureCheckout(valid), { checkoutUrl: valid.ARCHITECTURE_CHECKOUT_URL, termsUrl: valid.ARCHITECTURE_TERMS_URL });
});
