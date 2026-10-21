import type { Metadata } from "next";
import Link from "next/link";
import { liveConfig } from "@/lib/club/mode";

export const metadata: Metadata = { title: "Confirmar e-mail", robots: { index: false, follow: false }, referrer: "no-referrer" };
export const dynamic = "force-dynamic";

/**
 * Destino do link do e-mail. Não confirma sozinho: pede um clique, para que os scanners de
 * segurança do e-mail (que abrem links) não gastem o link de uso único.
 */
const valid = (v: unknown): v is string => typeof v === "string" && v.length >= 10 && v.length <= 512;

export default async function Confirmar({ searchParams }: { searchParams: Promise<{ code?: string; token_hash?: string }> }) {
  const { code, token_hash } = await searchParams;
  // `code`: fluxo PKCE com os modelos de e-mail padrão da Master; `token_hash`: modelo próprio.
  const field = valid(code) ? { name: "code", value: code } : valid(token_hash) ? { name: "token_hash", value: token_hash } : null;
  const ok = Boolean(liveConfig()) && field !== null;
  return (
    <section className="ca-section ca-container ca-narrow" aria-labelledby="confirmar-title">
      <span className="ca-eyebrow">Conta do Club</span>
      <h1 id="confirmar-title" className="ca-page-title">
        Confirmar o seu e-mail
      </h1>
      {ok && field ? (
        <form method="post" action="/api/club/auth/verify" className="ca-card ca-login">
          <input type="hidden" name={field.name} value={field.value} />
          <p>Falta só um passo: confirme que este e-mail é seu para entrar no Club Atlas.</p>
          <p>Abra este link no mesmo navegador em que pediu o cadastro ou a entrada.</p>
          <button type="submit" className="ca-btn ca-btn--primary">
            Confirmar e entrar
          </button>
        </form>
      ) : (
        <p className="ca-notice" role="alert">
          <span>
            Este link não é válido ou já foi usado. <Link href="/entrar">Peça um novo link de entrada</Link>.
          </span>
        </p>
      )}
    </section>
  );
}
