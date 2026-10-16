import type { Metadata } from "next";
import Link from "next/link";
import { liveConfig } from "@/lib/club/mode";

export const metadata: Metadata = { title: "Confirmar e-mail", robots: { index: false, follow: false }, referrer: "no-referrer" };
export const dynamic = "force-dynamic";

/**
 * Destino do link do e-mail. Não confirma sozinho: pede um clique, para que os scanners de
 * segurança do e-mail (que abrem links) não gastem o link de uso único.
 */
export default async function Confirmar({ searchParams }: { searchParams: Promise<{ token_hash?: string }> }) {
  const { token_hash } = await searchParams;
  const ok = Boolean(liveConfig()) && typeof token_hash === "string" && token_hash.length >= 10 && token_hash.length <= 512;
  return (
    <section className="ca-section ca-container ca-narrow" aria-labelledby="confirmar-title">
      <span className="ca-eyebrow">Conta do Club</span>
      <h1 id="confirmar-title" className="ca-page-title">
        Confirmar o seu e-mail
      </h1>
      {ok ? (
        <form method="post" action="/api/club/auth/verify" className="ca-card ca-login">
          <input type="hidden" name="token_hash" value={token_hash} />
          <p>Falta só um passo: confirme que este e-mail é seu para entrar no Club Atlas.</p>
          <button type="submit" className="ca-btn ca-btn--primary">
            Confirmar e entrar
          </button>
        </form>
      ) : (
        <p className="ca-notice" role="alert">
          <span>
            Este link não é válido. <Link href="/entrar">Peça um novo link de entrada</Link>.
          </span>
        </p>
      )}
    </section>
  );
}
