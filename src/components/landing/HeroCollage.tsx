import Image from "next/image";
import heroTeam from "../../../public/assets/club/hero-team.webp";
import { cast } from "@/lib/cast";
import { primaryCta } from "@/lib/flags";
import { LinkButton, StatusTag } from "../ui/primitives";

/**
 * Hero da landing — fiel à composição aprovada CLUB_ATLAS_TEAM_VALIDADO.png.
 * Elenco recortado da arte original (sem redesenhar rostos); copy, CTA, nomes e papéis em DOM.
 * Revisão PR #11 §B: equipa + Atlas dentro da primeira dobra em desktop e mobile.
 * Mobile: a fotografia sobe para o topo (ordem visual via CSS; o H1 continua primeiro no DOM)
 * e os cinco rostos aparecem em retratos legíveis logo abaixo.
 */
export default function HeroCollage() {
  return (
    <section className="ca-hero" aria-labelledby="hero-title">
      <div className="ca-container ca-hero__intro">
        <div className="ca-hero__headline">
          <p className="ca-hero__tagline">Aprender · Construir · Crescer · Realizar</p>
          <h1 id="hero-title">
            O futuro se constrói por <span className="ca-hl">pessoas como você.</span>
          </h1>
        </div>
        <div className="ca-hero__copy">
          <p className="ca-hero__lead">
            Comunidade e laboratório para estudantes de todas as áreas, iniciantes e criadores aprenderem a construir com
            agentes de IA. <strong>Você não precisa saber programar. Precisa começar.</strong>
          </p>
          <div className="ca-hero__actions">
            <LinkButton href="#laboratorio-atlas" variant={primaryCta}>
              Conhecer o laboratório
            </LinkButton>
            <LinkButton href="/genesis" variant="outline" icon="play">
              Ver o Genesis
            </LinkButton>
          </div>
          <p className="ca-hero__status">
            <StatusTag status="prep" dot>
              Inscrições em preparação
            </StatusTag>
            <span>Club gratuito · sessões introdutórias em nov/2026</span>
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
