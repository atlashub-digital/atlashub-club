import Icon from "../ui/Icon";
import { LinkButton, SectionHeading, StatusTag } from "../ui/primitives";
import { genesisFacts, price, priceNotes } from "@/lib/offers";

/**
 * Comparação de ofertas (issue #14): Club grátis e independente + Genesis opcional.
 * Preços vêm de src/lib/offers.ts. Sem checkout: os CTAs levam à página do programa
 * e ao formulário de adesão em modo de pré-visualização.
 */
export function ClubOfferCard({ compact = false }: { compact?: boolean }) {
  return (
    <article className="ca-card ca-offer ca-offer--club" aria-labelledby="offer-club">
      <StatusTag status="new">Comunidade aberta</StatusTag>
      <h3 id="offer-club">Club Atlas</h3>
      <p className="ca-offer__price">
        <strong>{price.club}</strong>
        <span>sem obrigação de comprar outro programa</span>
      </p>
      {!compact && (
        <ul className="ca-offer__list">
          <li>
            <Icon name="check" size={16} /> Comunidade, conversas e projetos partilhados, conforme os canais forem abrindo
          </li>
          <li>
            <Icon name="check" size={16} /> Conteúdos introdutórios e desafios
          </li>
          <li>
            <Icon name="check" size={16} /> Missão 001 — O meu primeiro agente
          </li>
        </ul>
      )}
      <LinkButton href="/participar" variant="outline" className="ca-offer__cta">
        Quero entrar no Club
      </LinkButton>
    </article>
  );
}

export function GenesisOfferCard({ compact = false }: { compact?: boolean }) {
  return (
    <article className="ca-card ca-card--gold ca-offer ca-offer--genesis" aria-labelledby="offer-genesis">
      <StatusTag status="premium">Jornada guiada · {genesisFacts.weeks} semanas</StatusTag>
      <h3 id="offer-genesis">Atlas Lab Genesis · Turma 01</h3>
      <dl className="ca-offer__prices">
        <div>
          <dt>Valor padrão</dt>
          <dd>{price.genesisStandard}</dd>
        </div>
        <div>
          <dt>Estudante elegível</dt>
          <dd>{price.genesisStudent}</dd>
        </div>
      </dl>
      <p className="ca-offer__note">{priceNotes.student}</p>
      {!compact && (
        <ul className="ca-offer__list">
          <li>
            <Icon name="check" size={16} /> {genesisFacts.ateliers} ateliers previstos ao longo de {genesisFacts.weeks} semanas
          </li>
          <li>
            <Icon name="check" size={16} /> Agentes pessoais, equipes de agentes e laboratório progressivo
          </li>
          <li>
            <Icon name="check" size={16} /> Projeto real com mentoria e comunidade Club incluída
          </li>
        </ul>
      )}
      <p className="ca-offer__meta">
        Início previsto <time dateTime={genesisFacts.startIso}>{genesisFacts.start}</time> · {genesisFacts.format}
      </p>
      <div className="ca-offer__actions">
        <LinkButton href="/participar?plan=genesis" variant="gold" className="ca-offer__cta">
          Inscrições abertas
        </LinkButton>
        <LinkButton href="/genesis" variant="outline" className="ca-offer__cta">
          Ver o programa
        </LinkButton>
      </div>
      <p className="ca-offer__fine">{priceNotes.noCharge}</p>
    </article>
  );
}

export default function OffersSection() {
  return (
    <section className="ca-section ca-container" aria-labelledby="ofertas" id="ofertas">
      <SectionHeading
        id="ofertas"
        eyebrow="Escolha o seu ritmo"
        gold
        title={
          <>
            Entre gratuitamente. <span className="ca-hl-gold">Cresça com o Genesis.</span>
          </>
        }
        lead="O Club é a porta de entrada e continua gratuito. O Genesis é um percurso opcional e acompanhado para quem quer construir em oito semanas."
      />
      <div className="ca-offers">
        <ClubOfferCard />
        <GenesisOfferCard />
      </div>
    </section>
  );
}
