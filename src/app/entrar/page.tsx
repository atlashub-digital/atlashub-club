import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/club/LoginForm";
import { liveConfig } from "@/lib/club/mode";

export const metadata: Metadata = { title: "Entrar na conta", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const errors: Record<string, string> = {
  link: "Este link já foi usado, expirou ou foi aberto noutro navegador. Peça um novo abaixo, neste navegador.",
};

export default async function Entrar({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams;
  const cfg = liveConfig();
  return (
    <section className="ca-section ca-container ca-narrow" aria-labelledby="entrar-title">
      <span className="ca-eyebrow">Conta do Club</span>
      <h1 id="entrar-title" className="ca-page-title">
        Entrar no Club Atlas
      </h1>
      {!cfg ? (
        <p className="ca-notice" role="note">
          <span>
            <strong>As contas do Club ainda não estão ativas.</strong> Enquanto isso, conheça o Club e veja como{" "}
            <Link href="/participar">participar</Link>.
          </span>
        </p>
      ) : (
        <>
          <p>Sem senha: enviamos um link de entrada para o e-mail que você usou no cadastro.</p>
          {erro && errors[erro] && (
            <p className="ca-notice" role="alert">
              <span>{errors[erro]}</span>
            </p>
          )}
          <LoginForm siteKey={cfg.turnstileSiteKey} />
          <p>
            Ainda não tem conta? <Link href="/participar">Entre no Club gratuitamente</Link>.
          </p>
        </>
      )}
    </section>
  );
}
