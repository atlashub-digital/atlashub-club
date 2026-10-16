import type { ClubBackend } from "./backend";
import { clientIp, sha } from "./hash";
import type { HandlerResult } from "./signup-handler";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const neutral: HandlerResult = { status: 202, body: { ok: true, next: "check_email" } };

/**
 * POST /api/club/login — link de entrada para quem já tem conta. Nunca cria conta e responde
 * sempre da mesma forma, exista ou não o e-mail (sem enumeração).
 */
export async function handleLogin(
  req: { headers: Headers; text(): Promise<string> },
  origin: string,
  backend: ClubBackend,
): Promise<HandlerResult> {
  if (req.headers.get("origin") !== origin) return { status: 403, body: { message: "Pedido inválido." } };
  if (!req.headers.get("content-type")?.startsWith("application/json")) return { status: 415, body: { message: "Formato inválido." } };
  const ip = clientIp(req.headers);
  if (!(await backend.hitRateLimit(`login:ip:${sha(ip)}`, 10, 600)))
    return { status: 429, body: { message: "Muitas tentativas. Aguarde alguns minutos." }, headers: { "retry-after": "600" } };
  const raw = await req.text();
  if (raw.length > 1024) return { status: 413, body: { message: "Pedido demasiado grande." } };
  let b: Record<string, unknown>;
  try {
    b = JSON.parse(raw);
    if (!b || typeof b !== "object") throw new Error();
  } catch {
    return { status: 400, body: { message: "Pedido inválido." } };
  }
  if (b.website) return neutral;
  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
  if (email.length > 190 || !EMAIL.test(email)) return { status: 400, body: { message: "Informe um e-mail válido.", errors: { email: "invalid" } } };
  if (typeof b.turnstileToken !== "string" || !(await backend.verifyTurnstile(b.turnstileToken, ip)))
    return { status: 400, body: { message: "Não foi possível confirmar que você não é um robô. Tente de novo.", errors: { turnstile: "failed" } } };
  if (!(await backend.hitRateLimit(`login:email:${sha(email)}`, 3, 3600))) return neutral;
  if ((await backend.sendLink(email)) === "rate_limited")
    return { status: 429, body: { message: "Muitos e-mails enviados agora. Tente de novo em alguns minutos." } };
  return neutral;
}
