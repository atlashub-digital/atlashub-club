import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { hasClubProfile, loadPendingSignup } from "@/lib/club/complete-signup";
import { liveConfig } from "@/lib/club/mode";
import { memberClient, serviceClient } from "@/lib/club/supabase";

export const metadata: Metadata = { title: "Concluir cadastro", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const errors: Record<string, string> = {
  termos: "Para entrar no Club é preciso aceitar os termos e o aviso de privacidade.",
  expirado: "O seu cadastro pendente expirou ou não foi encontrado. Faça o cadastro de novo.",
};

/**
 * Último passo do registo, já com o e-mail verificado: o dono do e-mail confirma os termos
 * (obrigatório, desmarcado) e escolhe receber novidades. Só depois nasce o perfil do Club.
 */
export default async function Concluir({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams;
  const cfg = liveConfig();
  if (!cfg) redirect("/conta");
  const { data: auth } = await (await memberClient(cfg)).auth.getUser();
  if (!auth.user) redirect("/entrar");
  const service = serviceClient(cfg);
  if (await hasClubProfile(service, auth.user.id)) redirect("/conta");
  const pending = await loadPendingSignup(service, auth.user);

  return (
    <section className="ca-section ca-container ca-narrow" aria-labelledby="concluir-title">
      <span className="ca-eyebrow">Cadastro gratuito · último passo</span>
      <h1 id="concluir-title" className="ca-page-title">
        E-mail confirmado. Falta só aceitar os termos.
      </h1>
      {(erro && errors[erro]) || !pending ? (
        <p className="ca-notice" role="alert">
          <span>{erro && errors[erro] ? errors[erro] : errors.expirado}</span>
        </p>
      ) : null}
      {pending ? (
        <form method="post" action="/api/club/complete" className="ca-card ca-login">
          <dl>
            <dt>Nome</dt>
            <dd>{pending.displayName}</dd>
            <dt>E-mail</dt>
            <dd>{auth.user.email}</dd>
            <dt>Percurso</dt>
            <dd>{pending.plan === "genesis" ? "Club Atlas gratuito + interesse no Genesis (sem cobrança)" : "Club Atlas · gratuito"}</dd>
          </dl>
          <label className="check-inline">
            <input type="checkbox" name="terms" value="yes" required />
            <span>
              Li e aceito os termos de participação e o <Link href="/privacidade">aviso de privacidade</Link> (obrigatório).
            </span>
          </label>
          <label className="check-inline">
            <input type="checkbox" name="marketing" value="yes" defaultChecked={pending.marketingOptIn} />
            <span>Quero receber novidades do Club Atlas e do Genesis por e-mail (opcional; pode cancelar quando quiser).</span>
          </label>
          <button type="submit" className="ca-btn ca-btn--primary">
            Concluir cadastro
          </button>
        </form>
      ) : (
        <p>
          <Link href="/participar">Fazer o cadastro gratuito</Link>
        </p>
      )}
    </section>
  );
}
