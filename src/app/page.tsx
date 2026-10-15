import Link from "next/link";
import HeroCollage from "@/components/landing/HeroCollage";
import MentorCard from "@/components/landing/MentorCard";
import EventCard from "@/components/landing/EventCard";
import Faq from "@/components/landing/Faq";
import LabSection from "@/components/landing/LabSection";
import OffersSection from "@/components/landing/OffersSection";
import AtlasAvatar from "@/components/brand/AtlasAvatar";
import Icon from "@/components/ui/Icon";
import { IconBox, LinkButton, SectionHeading, StatusTag } from "@/components/ui/primitives";
import { cast } from "@/lib/cast";
import { primaryCta } from "@/lib/flags";
import { price } from "@/lib/offers";
import {
  audiences,
  channels,
  events,
  genesisPhases,
  mission001,
  pillarsBar,
  buildExamples,
  startSteps,
  universes,
} from "@/lib/content";

export default function Home() {
  return (
    <>
      <HeroCollage />

      {/* Pilares — rodapé da composição aprovada */}
      <section className="ca-pillars" aria-label="Pilares do Club Atlas">
        <ul className="ca-container ca-pillars__list">
          {pillarsBar.map((p) => (
            <li key={p.title}>
              <Icon name={p.icon} size={28} />
              <span>
                <strong>{p.title}</strong>
                <small>{p.detail}</small>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* v3: o Laboratório Experimental vem logo a seguir ao hero (diretiva de 14/10: grande destaque). */}
      <LabSection />

      {/* Para quem */}
      <section className="ca-section ca-container" aria-labelledby="para-quem">
        <SectionHeading
          id="para-quem"
          eyebrow="Para quem é"
          title={
            <>
              Para quem quer aprender <span className="ca-hl">fazendo</span>.
            </>
          }
          lead="Estudantes universitários de todas as áreas, jovens e adultos em transição, criadores, desenvolvedores e pequenos empreendedores. Começar com o que você tem — até só um celular."
        />
        <ul className="ca-grid ca-grid--5">
          {audiences.map((a) => (
            <li key={a.title} className="ca-card ca-audience">
              <IconBox name={a.icon} />
              <h3>{a.title}</h3>
              <p>{a.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Exemplos concretos: tarefa, evidência e limite humano */}
      <section className="ca-section ca-container" aria-labelledby="construir">
        <SectionHeading
          id="construir"
          eyebrow="Diferentes percursos, o mesmo ecossistema"
          title="O que você gostaria de construir?"
          lead="Exemplos próximos do dia a dia. Cada um mostra a tarefa, a evidência de que funcionou e o que continua nas suas mãos."
        />
        <ul className="ca-grid ca-grid--3">
          {buildExamples.map((x) => (
            <li key={x.title} className={`ca-card ca-scenario ca-scenario--${x.tone}`}>
              <IconBox name={x.icon} tone={x.tone} />
              <h3>{x.title}</h3>
              <dl className="ca-example">
                <div>
                  <dt>Tarefa</dt>
                  <dd>{x.task}</dd>
                </div>
                <div>
                  <dt>Evidência</dt>
                  <dd>{x.evidence}</dd>
                </div>
                <div>
                  <dt>Limite humano</dt>
                  <dd>{x.limit}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </section>


      <OffersSection />

      {/* Como começar + Missão 001 */}
      <section className="ca-section ca-container" aria-labelledby="comecar">
        <SectionHeading id="comecar" eyebrow="Como começar" title="Quatro passos até o seu primeiro agente." />
        <ol className="ca-steps">
          {startSteps.map((s) => (
            <li key={s.n} className="ca-card ca-step">
              <span className="ca-step__n" aria-hidden="true">
                {s.n}
              </span>
              <h3>{s.title}</h3>
              <p>{s.detail}</p>
              <StatusTag status={s.status}>{s.statusLabel}</StatusTag>
            </li>
          ))}
        </ol>

        <div className="ca-card ca-card--gold ca-mission" aria-labelledby="missao-001">
          <div className="ca-mission__intro">
            <span className="ca-eyebrow ca-eyebrow--gold">Missão 001</span>
            <h3 id="missao-001">O meu primeiro agente</h3>
            <p>
              A primeira jornada de todo membro. Cada etapa só conta quando há evidência real do que você fez — não basta
              marcar uma caixa. Seu progresso fica salvo e pode ser retomado no celular.
            </p>
            <StatusTag status="prep" dot>
              Disponível com a abertura das contas
            </StatusTag>
          </div>
          <div className="ca-mission__avatar">
            <AtlasAvatar size={170} />
            <p className="ca-hand ca-mission__bubble">Vamos construir isso juntos?</p>
          </div>
          <ol className="ca-mission__steps">
            {mission001.map((m) => (
              <li key={m.title}>
                <IconBox name={m.icon} tone="gold" />
                <div>
                  <span className="ca-mission__step">{m.step}</span>
                  <h4>{m.title}</h4>
                  <p>{m.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Mentores */}
      <section className="ca-section ca-container" aria-labelledby="mentores">
        <SectionHeading
          id="mentores"
          eyebrow="Quem constrói com você"
          title={
            <>
              Um mentor humano. <span className="ca-hl">Quatro personagens digitais.</span>
            </>
          }
          lead="Sérgio Monteiro é uma pessoa real. Atlas, Lucas, Marta e Bia são personagens digitais, sempre identificados como tais — todos trabalham lado a lado, sem hierarquia entre eles."
          action={
            <LinkButton href="/mentores" variant="ghost">
              Conhecer os mentores
            </LinkButton>
          }
        />
        <div className="ca-mentors">
          {cast.map((m) => (
            <MentorCard key={m.key} member={m} />
          ))}
        </div>
      </section>

      {/* Genesis */}
      <section className="ca-section ca-container" aria-labelledby="genesis">
        <div className="ca-genesis">
          <div className="ca-genesis__copy">
            <span className="ca-eyebrow ca-eyebrow--gold">Atlas Lab · Genesis Turma 01</span>
            <h2 id="genesis">
              8 semanas para construir o seu <span className="ca-hl-gold">ecossistema vivo.</span>
            </h2>
            <p>
              24 ateliers práticos previstos para criar agentes, fluxos e um projeto real com a comunidade e os mentores do Club.
              Formato híbrido: Anápolis + online. Sem promessa de emprego, startup ou investimento — o compromisso é com
              o que você aprende e constrói.
            </p>
            <dl className="ca-genesis__facts">
              <div>
                <dt>Abertura prevista</dt>
                <dd>
                  <time dateTime="2027-01-09">Sábado, 09/01/2027</time>
                </dd>
              </div>
              <div>
                <dt>Formato</dt>
                <dd>Híbrido · Anápolis + online</dd>
              </div>
              <div>
                <dt>Investimento</dt>
                <dd>
                  {price.genesisStandard} padrão · {price.genesisStudent} estudante elegível
                </dd>
              </div>
            </dl>
            <div className="ca-hero__actions">
              <LinkButton href="/genesis" variant="gold">
                Ver o programa
              </LinkButton>
              <LinkButton href="/participar?plan=genesis" variant="outline" icon={null}>
                Pré-inscrição (prévia)
              </LinkButton>
            </div>
          </div>
          <ol className="ca-phases" aria-label="As quatro fases do Genesis">
            {genesisPhases.map((p) => (
              <li key={p.n} className={`ca-phase ca-phase--${p.n}`}>
                <span className="ca-phase__n" aria-hidden="true">
                  {p.n}
                </span>
                <div>
                  <h3>{p.title}</h3>
                  <p className="ca-phase__weeks">{p.weeks}</p>
                  <p>{p.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Agenda */}
      <section className="ca-section ca-container" aria-labelledby="agenda">
        <SectionHeading
          id="agenda"
          eyebrow="Agenda"
          title="Próximos encontros e marcos."
          lead="Datas previstas, sujeitas a confirmação. Workshops executivos são da AtlasHub.SI e não fazem parte do Club."
          action={
            <LinkButton href="/eventos" variant="ghost">
              Agenda completa
            </LinkButton>
          }
        />
        <div className="ca-grid ca-grid--3">
          {events.map((e) => (
            <EventCard key={e.title} event={e} />
          ))}
        </div>
      </section>

      {/* Comunidade */}
      <section className="ca-section ca-container" aria-labelledby="comunidade">
        <SectionHeading
          id="comunidade"
          eyebrow="Comunidade"
          title="Comunidade que faz acontecer."
          lead="Espaços com regras claras e moderação humana. Nenhum canal é anunciado como ativo antes de estar pronto."
          action={
            <LinkButton href="/comunidade" variant="ghost">
              Regras e canais
            </LinkButton>
          }
        />
        <ul className="ca-grid ca-grid--4">
          {channels.map((c) => (
            <li key={c.title} className="ca-card ca-channel">
              <IconBox name={c.icon} tone="violet" />
              <h3>{c.title}</h3>
              <p>{c.detail}</p>
              <StatusTag status={c.status}>{c.statusLabel}</StatusTag>
            </li>
          ))}
        </ul>
      </section>

      {/* Ecossistema AtlasHub */}
      <section className="ca-section ca-container" aria-labelledby="ecossistema">
        <SectionHeading
          id="ecossistema"
          eyebrow="Ecossistema AtlasHub"
          title="Três universos, papéis diferentes."
          lead="O Club é a casa da comunidade e da aprendizagem. A empresa e a editora continuam com os seus próprios espaços."
        />
        <ul className="ca-grid ca-grid--3">
          {universes.map((u) => (
            <li key={u.name} className={`ca-card ca-universe ${u.current ? "ca-card--glow" : ""}`}>
              <p className="ca-universe__tag">{u.tag}</p>
              <h3>{u.name}</h3>
              <p>{u.detail}</p>
              {u.current ? (
                <span className="ca-universe__here" aria-current="true">
                  <Icon name="pin" size={16} /> {u.cta}
                </span>
              ) : u.external ? (
                <a className="ca-btn ca-btn--ghost" href={u.href} target="_blank" rel="noopener noreferrer">
                  {u.cta} <Icon name="external" className="ca-btn__icon" />
                  <span className="ca-sr-only"> (abre em nova janela)</span>
                </a>
              ) : (
                <Link className="ca-btn ca-btn--ghost" href={u.href}>
                  {u.cta} <Icon name="arrow" className="ca-btn__icon" />
                </Link>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className="ca-section ca-container ca-faq-section" aria-labelledby="faq">
        <SectionHeading id="faq" eyebrow="Perguntas frequentes" title="Antes de começar." />
        <Faq />
      </section>

      {/* CTA final */}
      <section className="ca-section ca-container" aria-labelledby="cta-final">
        <div className="ca-cta">
          <AtlasAvatar size={140} className="ca-cta__avatar" />
          <div>
            <p className="ca-eyebrow">O futuro começa com uma pergunta</p>
            <h2 id="cta-final">
              Se você pudesse criar uma equipe de agentes só sua, <span className="ca-hl">o que construiria?</span>
            </h2>
            <p>Essa é a primeira conversa do Club Atlas. Comece gratuitamente e leve a sua ideia para a Missão 001.</p>
          </div>
          <LinkButton href="/participar" variant={primaryCta}>
            Começar agora
          </LinkButton>
        </div>
      </section>
    </>
  );
}
