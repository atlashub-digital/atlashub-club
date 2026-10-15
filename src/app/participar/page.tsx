import type { Metadata } from "next";
import AdesaoForm, { type Plan } from "@/components/adesao/AdesaoForm";
import { price } from "@/lib/offers";

export const metadata: Metadata = { title: "Entrar no Club" };

export default async function Participar({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const { plan } = await searchParams;
  const initialPlan: Plan = plan === "genesis" ? "genesis" : "club";
  return (
    <section className="ca-section ca-container" aria-labelledby="participar-title">
      <div className="ca-heading">
        <div>
          <span className="ca-eyebrow">Adesão · prévia navegável</span>
          <h1 id="participar-title" className="ca-page-title">
            Entre no Club. <span className="ca-hl">Decida até onde quer ir.</span>
          </h1>
          <p>
            Club grátis ou Genesis opcional ({price.genesisStandard} padrão · {price.genesisStudent} estudante elegível). Escolha o seu
            percurso, conte um pouco do que gostaria de construir e veja os próximos passos.
          </p>
        </div>
      </div>
      <p className="ca-notice" role="note">
        <span>
          <strong>Modo demonstração.</strong> Este formulário ainda não cria contas nem envia dados: nada sai do seu navegador. O cadastro
          real abre depois de aprovados autenticação, privacidade e anti-abuso.
        </span>
      </p>
      <AdesaoForm initialPlan={initialPlan} />
    </section>
  );
}
