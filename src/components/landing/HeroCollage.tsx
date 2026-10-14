import Image from "next/image";
import heroTeam from "../../../public/assets/club/hero-team.webp";
import { cast } from "@/lib/cast";
import { LinkButton, StatusTag } from "../ui/primitives";

/**
 * Hero da landing — fiel à composição aprovada CLUB_ATLAS_TEAM_VALIDADO.png:
 * elenco recortado da arte original (sem redesenhar rostos) + toda a copy, CTA,
 * nomes e papéis em DOM. A imagem é mídia; nada clicável está "pintado" nela.
 */
export default function HeroCollage() {
  return (
    <section className="ca-hero" aria-labelledby="hero-title">
      <div className="ca-container ca-hero__top">
        <p className="ca-hand ca-hero__note ca-hero__note--left" aria-hidden="true">
          Pessoas
          <br />
          Ideias
          <br />
          Agentes
          <br />
          Resultados reais
        </p>
        <div className="ca-hero__copy">
          <p className="ca-hero__tagline">Aprender · Construir · Crescer · Realizar</p>
          <h1 id="hero-title">
            O futuro se constrói
            <br />
            por <span className="ca-hl">pessoas como você.</span>
          </h1>
          <p className="ca-hero__lead">
            Uma comunidade para estudantes de todas as áreas, iniciantes e criadores que querem aprender, construir com
            agentes de IA e transformar ideias em projetos reais — com mentoria humana e inteligência viva.{" "}
            <strong>Você não precisa saber programar. Precisa começar.</strong>
          </p>
          <div className="ca-hero__actions">
            <LinkButton href="/participar">Entrar no Club (gratuito)</LinkButton>
            <LinkButton href="/genesis" variant="outline" icon="play">
              Conhecer o Genesis
            </LinkButton>
          </div>
          <p className="ca-hero__status">
            <StatusTag status="prep" dot>
              Inscrições em preparação
            </StatusTag>
            <span>Sessões introdutórias em novembro · estreia em dezembro de 2026</span>
          </p>
        </div>
        <p className="ca-hand ca-hero__note ca-hero__note--right" aria-hidden="true">
          O futuro é um projeto
          <br />
          em construção.
          <br />E você faz parte.
        </p>
      </div>

      <div className="ca-hero__stage">
        <div className="ca-hero__media">
          <Image
            src={heroTeam}
            alt="O elenco do Club Atlas num ambiente de estúdio tecnológico: Sérgio Monteiro, Lucas, a mascote Atlas sobre um pedestal luminoso, Clara e Lia."
            priority
            placeholder="blur"
            sizes="100vw"
            className="ca-hero__img"
          />
          <span className="ca-hero__pulse" aria-hidden="true" />
        </div>
        {/* tabIndex: no mobile a lista é um carrossel com scroll horizontal e precisa de ser alcançável por teclado. */}
        <ul className="ca-container ca-cast" aria-label="Quem constrói com você" tabIndex={0}>
          {cast.map((m) => (
            <li key={m.key} className={`ca-cast__item ca-cast__item--${m.key}`}>
              <Image src={m.portrait} alt="" width={56} height={56} className="ca-cast__thumb" />
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
