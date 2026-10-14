import Image from "next/image";
import heroTeam from "../../../public/assets/club/hero-team.webp";
import { cast } from "@/lib/cast";
import { primaryCta } from "@/lib/flags";
import { price } from "@/lib/offers";
import { LinkButton, StatusTag } from "../ui/primitives";

/**
 * Hero da landing — fiel à composição aprovada CLUB_ATLAS_TEAM_VALIDADO.png.
 * Elenco recortado da arte original (sem redesenhar rostos); copy, CTA, nomes e papéis em DOM.
 * Revisão PR #11 §B: equipa + Atlas dentro da primeira dobra em desktop e mobile.
 * Diretiva 2026-10-14 (referência Premium v3): H1 "Pessoas reais. Agentes próprios. Projetos vivos.";
 * "O futuro se constrói por pessoas como você." mantém-se como linha de apoio emocional.
 * Mobile: a fotografia sobe para o topo (ordem visual via CSS; o H1 continua primeiro no DOM)
 * e os cinco rostos aparecem em retratos legíveis logo abaixo.
 */
export default function HeroCollage() {
  return (
    <section className="ca-hero" aria-labelledby="hero-title">
      <div className="ca-container ca-hero__intro">
        <div className="ca-hero__headline">
          <p className="ca-hero__tagline">Aprender · Construir · Crescer · Realizar</p>
          <h1 id="hero-title" className="ca-hero__title">
            <span className="ca-hero__line">Pessoas reais.</span>{" "}
            <span className="ca-hero__line ca-hl">Agentes próprios.</span>{" "}
            <span className="ca-hero__line ca-hl-gold">Projetos vivos.</span>
          </h1>
          <p className="ca-hero__support">O futuro se constrói por pessoas como você.</p>
        </div>
        <div className="ca-hero__copy">
          <p className="ca-hero__lead">
            Não precisa começar sabendo programar. <strong>Comece por uma ideia.</strong> Conheça pessoas, construa seu
            primeiro agente e aprenda a evoluir para a sua própria equipe de IA.
          </p>
          <div className="ca-hero__actions">
            <LinkButton href="/participar" variant={primaryCta}>
              Entrar no Club gratuitamente
            </LinkButton>
            <LinkButton href="/genesis" variant="outline">
              Conhecer o Genesis
            </LinkButton>
          </div>
          <p className="ca-hero__status">
            <StatusTag status="prep" dot>
              Inscrições em preparação
            </StatusTag>
            <span>Club grátis · Genesis opcional a partir de {price.genesisStudent} (estudante elegível)</span>
          </p>
        </div>
      </div>

      <div className="ca-hero__stage">
        <div className="ca-hero__media">
          <Image
            src={heroTeam}
            alt="O elenco do Club Atlas num ambiente de estúdio tecnológico: Sérgio Monteiro, Lucas, a mascote Atlas sobre um pedestal luminoso, Marta e Bia."
            priority
            placeholder="blur"
            sizes="(max-width: 768px) 260vw, 100vw"
            className="ca-hero__img"
          />
          <span className="ca-hero__pulse" aria-hidden="true" />
          <p className="ca-hand ca-hero__note" aria-hidden="true">
            O futuro é um projeto em construção.
            <br />E você faz parte.
          </p>
        </div>
        <ul className="ca-container ca-cast" aria-label="Quem constrói com você">
          {cast.map((m) => (
            <li key={m.key} className={`ca-cast__item ca-cast__item--${m.key}`}>
              <Image src={m.portrait} alt="" width={64} height={64} className="ca-cast__thumb" />
              <div>
                <p className="ca-cast__name">{m.displayName}</p>
                <p className="ca-cast__role">{m.role}</p>
                <p className="ca-cast__keywords">{m.keywords}</p>
                <p className="ca-hand ca-cast__quote">“{m.quote}”</p>
                <StatusTag status={m.kind === "human" ? "human" : "digital"} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
