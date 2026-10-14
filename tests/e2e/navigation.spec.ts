import { expect, test } from "@playwright/test";

test("menu móvel: abre, navega e fecha com Escape", async ({ page, isMobile }) => {
  test.skip(!isMobile, "apenas mobile");
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Abrir menu" });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  const panel = page.getByRole("navigation", { name: "Navegação principal (móvel)" });
  await expect(panel).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(page.getByRole("button", { name: "Abrir menu" })).toBeFocused();
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await panel.getByRole("link", { name: "Mentores" }).click();
  await expect(page).toHaveURL(/\/mentores$/);
  await expect(panel).toBeHidden();
});

test("navegação desktop marca a página atual", async ({ page, isMobile }) => {
  test.skip(isMobile, "apenas desktop");
  await page.goto("/mentores");
  await expect(page.getByRole("navigation", { name: "Navegação principal" }).getByRole("link", { name: "Mentores" })).toHaveAttribute("aria-current", "page");
});

test("skip link leva ao conteúdo", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Pular para o conteúdo" })).toBeFocused();
});

test("API de interesse continua fail-closed sem configuração", async ({ request }) => {
  const res = await request.post("/api/interesse", { data: { name: "Teste", email: "teste@example.com" } });
  expect(res.status()).toBe(503);
});
