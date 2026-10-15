import type { Metadata } from "next";
import Link from "next/link";
import AdesaoForm, { type Plan } from "@/components/adesao/AdesaoForm";
import { liveConfig } from "@/lib/club/mode";
import { price } from "@/lib/offers";

export const metadata: Metadata = { title: "Entrar no Club" };

export default async function Participar({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const { plan } = await searchParams;
  const initialPlan: Plan = plan === "genesis" ? "genesis" : "club";
  // Cadastro real só quando o servidor está em modo live (PR2B); caso contrário, demonstração.
  const cfg = liveConfig();
  return (
    <section className="ca-section ca-container" aria-labelledby="participar-title">
      <div className="ca-heading">
        <div>
          <span className="ca-eyebrow">{cfg ? "Adesão · Club gratuito" : "Adesão · prévia navegável"}</span>
          <h1 id="participar-title" className="ca-page-title">
            Entre no Club. <span className="ca-hl">Decida até onde quer ir.</span>
          </h1>
          <p>
            Club grátis ou Genesis opcional ({price.genesisStandard} padrão · {price.genesisStudent} estudante elegível). Escolha o seu
            percurso, conte um pouco do que gostaria de construir e veja os próximos passos.
          </p>
        </div>
      </div>
      {cfg ? (
        <p className="ca-notice" role="note">
          <span>
            <strong>Cadastro gratuito, sem pagamento.</strong> No fim enviamos um link para o seu e-mail; a conta só é criada depois de
            confirmar. Já tem conta? <Link href="/entrar">Entrar</Link>.
          </span>
        </p>
      ) : (
        <p className="ca-notice" role="note">
          <span>
            <strong>Modo demonstração.</strong> Este formulário ainda não cria contas nem envia dados: nada sai do seu navegador. O cadastro
            real abre depois de aprovados autenticação, privacidade e anti-abuso.
          </span>
        </p>
      )}
      <AdesaoForm initialPlan={initialPlan} live={cfg ? { turnstileSiteKey: cfg.turnstileSiteKey } : null} />
    </section>
  );
}
