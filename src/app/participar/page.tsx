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
  // Contas reais (modo live PR2B) só quando as env vars do Supabase master (ATL-D29: aakdyumavlzgyklbrsrw,
  // schema `club`) estiverem configuradas; caso contrário o formulário fica na prévia ou no modo lead
  // (POST /api/interesse, ao vivo).
  const cfg = liveConfig();
  // Site key pública do Turnstile: sem modo live de contas, alimenta a captura de interesse no /api/interesse.
  const leadSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || null;
  return (
    <section className="ca-section ca-container" aria-labelledby="participar-title">
      <div className="ca-heading">
        <div>
          <span className="ca-eyebrow">{cfg ? "Adesão · Club gratuito" : "Adesão · interesse"}</span>
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
            <strong>Interesse no Club, sem pagamento.</strong> Registamos o seu pedido e a equipe entra em contato por e-mail. A criação de
            contas ainda não está aberta: é ativada quando autenticação, privacidade e anti-abuso forem homologados.
          </span>
        </p>
      )}
      <div className="ca-card" style={{ marginBlock: "1.25rem" }}>
        <h2>Quer falar com a equipe desde já?</h2>
        <p>A equipe AtlasHub recebe pedidos de interesse pelo WhatsApp oficial. A conversa é assistida: ela não cria automaticamente uma conta nem reserva uma vaga no Genesis.</p>
        <p>Se você tem menos de 18 anos, peça a um responsável legal para fazer o contato. Não envie documentos pessoais nesta primeira mensagem.</p>
        <div className="ca-hero__actions">
          <LinkButton href={initialPlan === "genesis" ? genesisWhatsAppUrl : clubWhatsAppUrl} variant="gold" external>
            {initialPlan === "genesis" ? "Conversar sobre o Genesis" : "Falar sobre o Club Atlas"}
          </LinkButton>
        </div>
      </div>
      <AdesaoForm
        initialPlan={initialPlan}
        live={cfg ? { turnstileSiteKey: cfg.turnstileSiteKey } : null}
        leadSiteKey={leadSiteKey}
      />
    </section>
  );
}