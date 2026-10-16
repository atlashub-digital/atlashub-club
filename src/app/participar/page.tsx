import type { Metadata } from "next";
import Link from "next/link";
import AdesaoForm, { type Plan } from "@/components/adesao/AdesaoForm";
import { LinkButton } from "@/components/ui/primitives";
import { liveConfig } from "@/lib/club/mode";
import { clubWhatsAppUrl, genesisWhatsAppUrl } from "@/lib/contact";
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
      {/* WhatsApp assistido (PR #17): mantém-se nos dois modos como canal humano de reserva. */}
      <div className="ca-card" style={{ marginBlock: "1.25rem" }}>
        <h2>{cfg ? "Prefere falar com a equipe?" : "Quer participar desde já?"}</h2>
        <p>
          {cfg
            ? "A equipe AtlasHub também atende pelo WhatsApp oficial."
            : "Enquanto preparamos o cadastro online, a equipe AtlasHub recebe pedidos de interesse pelo WhatsApp oficial."}{" "}
          A conversa é assistida: ela não cria automaticamente uma conta nem reserva uma vaga no Genesis.
        </p>
        <p>Se você tem menos de 18 anos, peça a um responsável legal para fazer o contato. Não envie documentos pessoais nesta primeira mensagem.</p>
        <div className="ca-hero__actions">
          <LinkButton href={initialPlan === "genesis" ? genesisWhatsAppUrl : clubWhatsAppUrl} variant="gold" external>
            {initialPlan === "genesis" ? "Conversar sobre o Genesis" : "Falar sobre o Club Atlas"}
          </LinkButton>
        </div>
      </div>
      <AdesaoForm initialPlan={initialPlan} live={cfg ? { turnstileSiteKey: cfg.turnstileSiteKey } : null} />
    </section>
  );
}
