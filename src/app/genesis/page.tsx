import type { Metadata } from "next";
import Image from "next/image";
import heroTeam from "../../../public/assets/club/hero-team.webp";
import Icon, { type IconName } from "@/components/ui/Icon";
import { IconBox, LinkButton, SectionHeading, StatusTag } from "@/components/ui/primitives";
import { ClubOfferCard, GenesisOfferCard } from "@/components/landing/OffersSection";
import { genesisPhases } from "@/lib/content";
import { earlyAccess, earlyAccessAteliers, genesisFacts, genesisTimeline, price, priceNotes } from "@/lib/offers";
import { genesisWhatsAppUrl } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Genesis Turma 01",
  description: `Oito semanas para construir o seu ecossistema de agentes. ${price.genesisStandard} valor padrão · ${price.genesisStudent} para estudantes elegíveis. Início previsto ${genesisFacts.start}. Early Access para quem registrar interesse até ${earlyAccess.deadline}.`,
};

/** Programa semanal — docs/09_GENESIS_24_ATELIERS.md (3 ateliers por semana, previstos). */
const weeks: { n: number; title: string; ateliers: string; delivery: string }[] = [
  { n: 1, title: "Nascimento do agente", ateliers: "Ideia → identidade → primeira conversa", delivery: "Primeiro agente e objetivos" },
  { n: 2, title: "Memória e contexto", ateliers: "Contexto → memória → privacidade", delivery: "Base de conhecimento autorizada" },
  { n: 3, title: "Primeiro trabalho", ateliers: "Pesquisa → escrita → revisão", delivery: "Um resultado útil e verificável" },
  { n: 4, title: "Ferramentas", ateliers: "Ferramentas → APIs → sandbox", delivery: "Primeira capacidade reutilizável" },
  { n: 5, title: "Iniciativa responsável", ateliers: "Iniciativa → agenda → aprovação", delivery: "Rotina que propõe e espera aprovação" },
  { n: 6, title: "Equipe de agentes", ateliers: "Papéis → colaboração → segurança", delivery: "Equipe multiagente supervisionada" },
  { n: 7, title: "Projeto vivo", ateliers: "Projeto → testes → documentação", delivery: "Protótipo com evidências" },
  { n: 8, title: "Demo Day", ateliers: "Melhorias → apresentação → próximos passos", delivery: "Portfólio e roteiro pessoal" },
];

const benefits: { icon: IconName; title: string; detail: string }[] = [
  { icon: "users", title: "Comunidade Club incluída", detail: "Fóruns, desafios e pessoas para construir junto." },
  { icon: "nodes", title: "Agentes e equipes", detail: "Do primeiro agente a uma equipe coordenada por você." },
  { icon: "folder", title: "Projeto real", detail: "Um protótipo demonstrável, documentado e apresentado." },
  { icon: "bulb", title: "Mentoria humana + IA", detail: "Sérgio Monteiro e os mentores digitais do Club." },
  { icon: "phone", title: "Começa no celular", detail: "Ateliers pensados para quem tem só um celular, com alternativas para o resto." },
  { icon: "shield", title: "Com limites claros", detail: "Privacidade, supervisão e nada publicado sem você aprovar." },
];

const faq = [
  {
    q: "O que é o Early Access?",
    a: `${earlyAccess.summary} ${earlyAccess.fine} A Turma 01 continua prevista para ${genesisFacts.start}, com ${genesisFacts.weeks} semanas e ${genesisFacts.ateliers} ateliers. Se você já falou com a equipe pelo WhatsApp oficial sobre o Genesis, seu interesse já conta.`,
  },
  {
    q: "Como funciona a condição de estudante?",
    a: `Quem é estudante pode pedir o valor de ${price.genesisStudent}. A condição é declarativa no ato da inscrição (sem comprovativo, sem análise documental, sem aprovação manual). Se não for elegível, você escolhe entre o valor padrão de ${price.genesisStandard} ou continuar só no Club grátis — sem cobrança automática.`,
  },
  {
    q: "Já posso pagar ou reservar vaga?",
    a: "Sim. As inscrições estão abertas. O pagamento é processado via checkout hospedado ARO (PIX). As condições comerciais (pagamento, cancelamento e reembolso) estão publicadas no momento da matrícula. A condição de estudante é declarativa no ato da inscrição.",
  },
  {
    q: "Preciso do Genesis para entrar no Club?",
    a: "Não. O Club Atlas é gratuito e independente. O Genesis é um percurso opcional para quem quer ir mais longe em oito semanas.",
  },
  {
    q: "Tenho menos de 18 anos. Posso participar?",
    a: "Pode manifestar interesse. Para menores de 18 anos, a pré-candidatura fica em revisão do responsável: a equipe do Club valida a autorização do responsável legal antes de qualquer matrícula ou pagamento. Se também for estudante, essa validação é feita à parte.",
  },
  {
    q: "O Genesis garante emprego, empresa ou investimento?",
    a: "Não. O compromisso é com o que você aprende e constrói. Projetos de destaque poderão ser convidados para acompanhamento extra, sempre com seleção e acordo próprio.",
  },
];

export default function Genesis() {
  return (
    <>
      <section className="ca-gen-hero" aria-labelledby="genesis-title">
        <div className="ca-container ca-gen-hero__grid">
          <div className="ca-gen-hero__copy">
            <span className="ca-eyebrow ca-eyebrow--gold">Atlas Lab · Genesis Turma 01</span>
            <h1 id="genesis-title">
              {genesisFacts.weeks} semanas para construir o seu <span className="ca-hl-gold">ecossistema vivo.</span>
            </h1>
            <p className="ca-gen-hero__lead">
              Um percurso prático para explorar agentes, equipes de agentes e projetos — com {genesisFacts.ateliers} ateliers
              previstos, mentoria e a comunidade Club ao seu lado. Não precisa saber programar.
            </p>
            <div className="ca-hero__actions">
              <LinkButton href={genesisWhatsAppUrl} variant="gold" external>
                Falar com a equipe sobre Genesis
              </LinkButton>
              <LinkButton href="/participar?plan=genesis" variant="outline">
                Inscrições abertas
              </LinkButton>
              <LinkButton href="#programa" variant="outline">
                Ver o programa
              </LinkButton>
            </div>
          </div>
          <aside className="ca-card ca-card--gold ca-gen-price" aria-labelledby="genesis-price">
            <p className="ca-eyebrow ca-eyebrow--gold" id="genesis-price">
              Início previsto
            </p>
            <p className="ca-gen-price__date">
              <time dateTime={genesisFacts.startIso}>{genesisFacts.start}</time>
            </p>
            <p className="ca-gen-price__place">
              <Icon name="pin" size={16} /> {genesisFacts.format}
            </p>
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
            <p className="ca-offer__note">
              <strong>Early Access:</strong> registre interesse até {earlyAccess.deadline} e receba convite para 2 ateliers
              extras e gratuitos em dezembro (datas a confirmar). <a href="#early-access">Saiba mais</a>
            </p>
            <StatusTag status="prep" dot>
              Sem cobrança nesta fase
            </StatusTag>
          </aside>
        </div>
        <div className="ca-gen-hero__media">
          <Image
            src={heroTeam}
            alt="Sérgio Monteiro, Lucas, a mascote Atlas, Marta e Bia — a equipe que acompanha o Genesis."
            sizes="100vw"
            placeholder="blur"
            className="ca-hero__img"
          />
        </div>
      </section>

      <section className="ca-section ca-container" aria-labelledby="early-access-title" id="early-access">
        <SectionHeading
          id="early-access-title"
          eyebrow={`Early Access · até ${earlyAccess.deadline}`}
          gold
          title="Comece antes da Turma 01."
          lead={`${earlyAccess.summary} Se você já falou com a equipe pelo WhatsApp oficial sobre o Genesis, seu interesse já conta.`}
        />
        <ul className="ca-grid ca-grid--2">
          {earlyAccessAteliers.map((a) => (
            <li key={a.title} className="ca-card ca-card--gold">
              <StatusTag status="new" dot>
                {a.format} · data a confirmar
              </StatusTag>
              <h3>{a.title}</h3>
              <p>{a.detail}</p>
            </li>
          ))}
        </ul>
        <ol className="ca-grid ca-grid--4" aria-label="Linha do tempo do Genesis Turma 01" style={{ marginTop: "1.5rem" }}>
          {genesisTimeline.map((t) => (
            <li key={t.when} className="ca-card">
              <p className="ca-eyebrow ca-eyebrow--gold">{t.when}</p>
              <p>{t.what}</p>
            </li>
          ))}
        </ol>
        <p className="ca-offer__note" style={{ marginTop: "1rem" }}>{earlyAccess.fine}</p>
        <div className="ca-hero__actions">
          <LinkButton href="/participar?plan=genesis" variant="gold" external>
            Inscrições abertas
          </LinkButton>
          <LinkButton href={genesisWhatsAppUrl} variant="outline" external>
            Falar com a equipe
          </LinkButton>
        </div>
      </section>

      <section className="ca-section ca-container" aria-labelledby="genesis-fases">
        <SectionHeading id="genesis-fases" eyebrow="A sua jornada em 4 etapas" title="Do conhecimento ao impacto real." />
        <ol className="ca-gen-phases">
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
      </section>

      <section className="ca-section ca-container" aria-labelledby="programa" id="programa">
        <SectionHeading
          id="programa"
          eyebrow={`${genesisFacts.ateliers} ateliers previstos`}
          title="O programa, semana a semana."
          lead="Três ateliers por semana (previstos). Calendário, horários e local definitivos serão confirmados antes da abertura."
        />
        <ol className="ca-weeks">
          {weeks.map((w) => (
            <li key={w.n} className="ca-card ca-week">
              <span className="ca-week__n">Semana {w.n}</span>
              <h3>{w.title}</h3>
              <p>{w.ateliers}</p>
              <p className="ca-week__delivery">
                <Icon name="check" size={16} /> {w.delivery}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="ca-section ca-container" aria-labelledby="beneficios">
        <SectionHeading id="beneficios" eyebrow="Benefícios" title="Mais do que um curso." />
        <ul className="ca-grid ca-grid--3">
          {benefits.map((b) => (
            <li key={b.title} className="ca-card">
              <IconBox name={b.icon} tone="gold" />
              <h3>{b.title}</h3>
              <p>{b.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="ca-section ca-container" aria-labelledby="investimento">
        <SectionHeading
          id="investimento"
          eyebrow="Investimento"
          gold
          title="Club grátis sempre. Genesis quando você quiser."
          lead={`${priceNotes.noCharge} ${priceNotes.noInstallments}`}
        />
        <div className="ca-offers">
          <ClubOfferCard compact />
          <GenesisOfferCard />
        </div>
      </section>

      <section className="ca-section ca-container ca-faq-section" aria-labelledby="genesis-faq">
        <SectionHeading id="genesis-faq" eyebrow="Perguntas frequentes" title="Antes de se inscrever." />
        <div className="ca-faq">
          {faq.map((item) => (
            <details key={item.q} className="ca-faq__item">
              <summary>
                <span>{item.q}</span>
                <span className="ca-faq__chev" aria-hidden="true" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
