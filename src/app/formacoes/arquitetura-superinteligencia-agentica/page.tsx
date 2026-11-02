import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LinkButton } from "@/components/ui/primitives";
import { architectureCourse as course, architecturePrice, architectureCheckout, architectureContactUrl } from "@/lib/courses/architecture";
import styles from "./sales.module.css";

export const dynamic = "force-dynamic";
const path = "/formacoes/arquitetura-superinteligencia-agentica";
export const metadata: Metadata = {
  title: "A Arquitetura da Superinteligência Agêntica",
  description: `Uma formação com Sérgio Monteiro e a agente digital Diana. Três lives em novembro, exercícios e materiais progressivos. ${architecturePrice}, pagamento único.`,
  alternates: { canonical: path },
  openGraph: {
    title: course.title, description: course.subtitle,
    images: [{ url: "/assets/formacoes/arquitetura-superinteligencia.png", width: 1122, height: 1402, alt: course.title }],
  },
};

const outcomes = [
  ["Enxergue a operação", "Escolha um processo e identifique quem participa, que informação usa e o que comprova o resultado."],
  ["Desenhe uma missão", "Defina objetivo, ferramentas, permissões e situações em que o agente precisa parar e pedir ajuda."],
  ["Prepare o primeiro piloto", "Comece com dados fictícios, teste uma falha e reveja o desenho antes de ligar sistemas reais."],
];
const content = [
  { n: "00", title: "Antes da primeira live", lessons: ["Boas-vindas e orientação", "Diagnóstico inicial: escolha um processo"] },
  { n: "01", title: "As cinco camadas da infraestrutura", lessons: ["Operação, informação, ferramentas, coordenação e supervisão", "Desenhe a primeira missão do seu agente"] },
];

export default function ArchitectureSalesPage() {
  const checkout = architectureCheckout(process.env);
  const ctaUrl = checkout?.checkoutUrl ?? architectureContactUrl;
  const ctaLabel = checkout ? `Participar por ${architecturePrice}` : "Quero saber como participar";
  return (
    <div className={styles.page}>
      <section className={`${styles.hero} ca-container`} aria-labelledby="course-title">
        <div className={styles.heroCopy}>
          <p className="ca-eyebrow ca-eyebrow--gold">AtlasHub Academy · Formação de arranque</p>
          <h1 id="course-title">A Arquitetura da <span>Superinteligência Agêntica</span></h1>
          <p className={styles.subtitle}>{course.subtitle}</p>
          <p className={styles.lead}>Entenda como pessoas, processos, informação e agentes de IA podem trabalhar juntos. Comece por uma operação concreta e desenhe uma missão com objetivos, limites e resultados que você consegue conferir.</p>
          <ul className={styles.badges} aria-label="Formato da formação"><li>3 lives de 90 minutos</li><li>Exercícios práticos</li><li>Materiais progressivos</li></ul>
          <div className={styles.actions}><LinkButton href="#inscricao" variant="gold">Conhecer a formação</LinkButton><Link href="#programa">Ver o conteúdo <span aria-hidden="true">↓</span></Link></div>
          <p className={styles.people}>Com <strong>Sérgio Monteiro</strong> e <strong>Agente Architect — Diana</strong><br /><span>Diana é uma agente digital, identificada como tal durante a formação.</span></p>
        </div>
        <figure className={styles.cover}><Image src="/assets/formacoes/arquitetura-superinteligencia.png" width={1122} height={1402} alt="Capa da formação A Arquitetura da Superinteligência Agêntica, com Sérgio Monteiro e a representação visual de uma empresa aumentada." priority sizes="(max-width: 800px) 90vw, 440px" /><figcaption>A Arquitetura da Superinteligência Agêntica</figcaption></figure>
      </section>

      <section className={`${styles.section} ca-container`} aria-labelledby="outcomes-title">
        <p className="ca-eyebrow">Compreender · Desenhar · Experimentar</p><h2 id="outcomes-title">Uma ideia de IA começa com uma tarefa real.</h2>
        <div className={styles.threeColumns}>{outcomes.map(([title, text]) => <article className={styles.card} key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
        <p className={styles.note}>Para empresários, profissionais, estudantes e iniciantes. Os primeiros exercícios não exigem programação nem acesso a sistemas de clientes.</p>
      </section>

      <section id="programa" className={`${styles.section} ca-container`} aria-labelledby="program-title">
        <p className="ca-eyebrow ca-eyebrow--gold">O começo da formação</p><h2 id="program-title">Do diagnóstico à primeira missão.</h2>
        <p className={styles.intro}>O material é disponibilizado progressivamente. Após a confirmação do pagamento e da matrícula, você começa pelo conteúdo publicado no Campus, sem esperar pela primeira live.</p>
        <div className={styles.twoColumns}>{content.map((chapter) => <article className={styles.card} key={chapter.n}><span className={styles.chapter}>Capítulo {chapter.n}</span><h3>{chapter.title}</h3><ul>{chapter.lessons.map((lesson) => <li key={lesson}>{lesson}</li>)}</ul></article>)}</div>
        <div className={styles.exercise}><p className="ca-eyebrow">Seu primeiro entregável</p><h3>Um processo, uma missão e um teste de falha.</h3><p>Prepare um mapa simples da operação, escreva o que o seu agente pode fazer e indique como ele deve reagir quando faltar informação. Um quiz inicial de quatro questões ajuda a rever os conceitos.</p></div>
        <p className={styles.note}>Esta oferta é o curso de arranque. O programa ampliado com oito módulos e seis cases é um produto separado.</p>
      </section>

      <section className={`${styles.section} ca-container`} aria-labelledby="live-title">
        <p className="ca-eyebrow">Novembro de 2026</p><h2 id="live-title">Três encontros para aprender e avançar.</h2>
        <div className={styles.threeColumns}>{course.sessions.map((session) => <article className={styles.session} key={session.date}><span>Live {session.number}</span><h3><time dateTime={`${session.date}T19:00:00-03:00`}>{session.label}</time></h3><p>19h às 20h30 · Horário de Brasília</p><strong>90 minutos</strong></article>)}</div>
        <p className={styles.note}>Conteúdo escrito, atividades e quiz acompanham a jornada. Vídeos e materiais complementares serão disponibilizados progressivamente.</p>
      </section>

      <section id="inscricao" className={`${styles.section} ca-container`} aria-labelledby="enrollment-title">
        <div className={styles.offer}><div><p className="ca-eyebrow ca-eyebrow--gold">Sua participação</p><h2 id="enrollment-title">Comece pelo próximo passo.</h2><p className={styles.price}>{architecturePrice}<span>pagamento único</span></p><p>Curso de arranque + três lives de 90 minutos + atividades e materiais progressivos.</p></div><div className={styles.offerAction}><LinkButton href={ctaUrl} variant="gold" external>{ctaLabel}</LinkButton><p>{checkout ? "O pagamento é concluído no checkout. O acesso depende da confirmação e da matrícula no Campus." : "A inscrição online está em preparação. Fale com a equipe para consultar as condições de participação."}</p>{checkout ? <a href={checkout.termsUrl} target="_blank" rel="noopener noreferrer">Consultar condições de acesso, gravações e cancelamento</a> : <p>Consulte com a equipe o prazo de acesso, as gravações e o canal e período do acompanhamento antes de pagar.</p>}</div></div>
      </section>

      <section className={`${styles.section} ${styles.faq} ca-container`} aria-labelledby="faq-title"><h2 id="faq-title">Antes de participar</h2>
        <details><summary>Preciso saber programar?</summary><p>Não para os exercícios iniciais. Você começa por compreender a operação e desenhar uma missão com informações e limites claros.</p></details>
        <details><summary>O que recebo ao entrar?</summary><p>Acesso ao material efetivamente publicado depois da confirmação do pagamento e da matrícula. A formação tem entregas progressivas; o Campus identifica o conteúdo disponível.</p></details>
        <details><summary>O pagamento é uma assinatura?</summary><p>Não. Esta oferta tem pagamento único de {architecturePrice}.</p></details>
        <details><summary>O pacote completo de oito módulos está incluído?</summary><p>Não. Esse programa ampliado é separado deste curso de arranque e das três lives de novembro.</p></details>
        <details><summary>Já tenho conta no Atlas Club. Preciso de outra?</summary><p>Use a sua conta existente. A inscrição acrescenta o acesso a esta formação. Para entrar no Campus, <a href={course.loginUrl}>acesse o login</a>.</p></details>
        <details><summary>Como confirmar gravações, acompanhamento e prazo de acesso?</summary><p>Consulte as condições da oferta antes de concluir o pagamento. Para esclarecer qualquer condição ainda não publicada, <a href={architectureContactUrl} target="_blank" rel="noopener noreferrer">fale com a equipe</a>.</p></details>
      </section>

      <aside className={`${styles.organizer} ca-container`} aria-label="Responsável e atendimento"><strong>AtlasHub Brasil</strong><p>CNPJ 66.991.513/0001-10 · Goiânia, Brasil</p><p><a href="mailto:contact@atlashub.si">contact@atlashub.si</a> · +55 (62) 99190-3462</p><Link href="/privacidade">Consultar aviso de privacidade</Link></aside>
    </div>
  );
}
