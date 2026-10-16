/**
 * Verificação Cloudflare Turnstile no servidor. Lança em falha de rede (o chamador responde 503);
 * devolve false se o desafio não passou ou veio de outro hostname.
 */
export async function verifyTurnstile(
  secret: string,
  token: string,
  ip: string,
  expectedHostname: string,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  if (token.length < 10 || token.length > 4000) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip && ip !== "unknown") body.set("remoteip", ip);
  const r = await fetchImpl("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });
  if (!r.ok) throw new Error(`turnstile ${r.status}`);
  const verdict = (await r.json()) as { success?: boolean; hostname?: string };
  if (!verdict.success) return false;
  return !verdict.hostname || verdict.hostname === expectedHostname;
}
