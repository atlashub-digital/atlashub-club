import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LinkButton } from "@/components/ui/primitives";
import { architectureCourse as course, architecturePrice, architectureCheckout, architectureContactUrl } from "@/lib/courses/architecture";
import styles from "./sales.module.css";
import StickyOffer from "./StickyOffer";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "A Arquitetura da Superinteligência Agêntica | Atelier F01",
  description: "Parta de uma operação real e desenhe a primeira missão do seu agente. Três lives de 90 minutos, exercícios e materiais progressivos. " + architecturePrice + ", pagamento único.",
  alternates: { canonical: "/formacoes/arquitetura-superinteligencia-agentica" },
  openGraph: { title: course.title, description: course.subtitle, images: [{ url: "/assets/formacoes/atlasclub-ecosistema.png", width: 2172, height: 724, alt: "AtlasClub: formação, comunidade e operações inteligentes" }] },
};
const outcomes = [
  ["01", "Enxergue a operação", "Escolha um processo e identifique pessoas, informação, decisões e o ponto em que o trabalho deixa de avançar.", "Um mapa da operação atual"],
  ["02", "Desenhe uma missão", "Defina o objetivo do agente, as fontes que pode consultar, o que pode fazer e quando precisa de revisão humana.", "Uma missão com limites claros"],
  ["03", "Prepare o primeiro piloto", "Experimente com dados fictícios, introduza uma falha e decida como verificar o resultado antes de ligar sistemas reais.", "Um exercício e um plano de testes"],
];
const sessions = [
  ["A operação real", "Diagnóstico do processo, informação disponível e oportunidades para uma primeira missão."],
  ["A arquitetura", "Operação, informação, ferramentas, coordenação e supervisão. Do objetivo às permissões do agente."],
  ["O primeiro piloto", "Exercício com dados fictícios, teste de falha e revisão humana para preparar o próximo passo."],
];

export default function ArchitectureSalesPage() {
  const checkout = architectureCheckout(process.env);
  const ctaUrl = checkout?.checkoutUrl ?? architectureContactUrl;
  const ctaLabel = checkout ? "Quero participar do atelier" : "Quero saber como participar";
  return (
    <div className={styles.page}>
      <section id="course-intro" className={[styles.hero, "ca-container"].join(" ")} aria-labelledby="course-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Atelier prático · F01 · Online</p>
          <p className={styles.courseName}>{course.title}</p>
          <h1 id="course-title">Uma operação real.<br />O primeiro projeto com <span>agentes de IA.</span></h1>
          <p className={styles.lead}>Entenda onde a IA pode ajudar, desenhe uma missão e prepare o primeiro piloto com supervisão humana. Comece com um processo do seu negócio, trabalho ou projeto.</p>
          <ul className={styles.badges}><li>3 lives de 90 minutos</li><li>Exercícios guiados</li><li>Sem programação no início</li></ul>
          <div className={styles.actions}><LinkButton href="#inscricao" variant="gold">Conhecer a formação</LinkButton><a href="#programa">Explorar o programa ↓</a></div>
          <p className={styles.people}>Com <strong>Sérgio Monteiro</strong> e a agente digital <strong>Architect Diana</strong></p>
        </div>
        <aside className={styles.heroOffer} aria-label="Formato e participação">
          <p className={styles.eyebrow}>Da operação real à empresa aumentada</p>
          <h2>Comece por um processo.<br />Saia com um desenho.</h2>
          <ul className={styles.checkList}><li>Mapa da operação e diagnóstico inicial</li><li>Missão do agente, permissões e limites</li><li>Exercício prático e teste de falha</li><li>Encontros com orientação e perguntas</li></ul>
          <p className={styles.price}>{architecturePrice}<span>pagamento único</span></p>
          <LinkButton href={ctaUrl} variant="gold" external>{ctaLabel}</LinkButton>
          <p className={styles.micro}>{checkout ? "Pagamento no checkout. Entrada após a compra aprovada." : "Consulte a equipe sobre a participação. A inscrição online está em atualização."}</p>
        </aside>
      </section>

      <div className={[styles.proofBar, "ca-container"].join(" ")} aria-label="Formato"><span><strong>3 encontros</strong> Aprender e aplicar</span><span><strong>4h30 ao vivo</strong> Horário de Brasília</span><span><strong>Um processo</strong> Seu ponto de partida</span><span><strong>Supervisão humana</strong> Do desenho ao teste</span></div>

      <section className={[styles.section,"ca-container"].join(" ")} aria-labelledby="outcomes-title">
        <div className={styles.sectionHead}><p className={styles.eyebrow}>Onde começa a mudança</p><h2 id="outcomes-title">Você não precisa começar<br />por mais uma ferramenta.</h2><p>Comece por compreender o trabalho. O atelier organiza a passagem da ideia de IA para uma missão que você consegue explicar, acompanhar e testar.</p></div>
        <div className={styles.threeColumns}>{outcomes.map(([n,title,text,result]) => <article className={styles.card} key={n}><span className={styles.chapter}>{n}</span><h3>{title}</h3><p>{text}</p><div className={styles.cardResult}>{result}</div></article>)}</div>
      </section>

      <section id="programa" className={[styles.section,"ca-container"].join(" ")} aria-labelledby="program-title">
        <div className={styles.sectionHead}><p className={styles.eyebrow}>O percurso</p><h2 id="program-title">Do diagnóstico ao primeiro piloto.</h2><p>Prepare seu exemplo, participe dos encontros e desenvolva os exercícios. Os materiais entram progressivamente na área de membros.</p></div>
        <div className={styles.prework}><span className={styles.moduleTag}>Comece aqui</span><div><h3>Boas-vindas e diagnóstico inicial</h3><p>Orientações, calendário e escolha de um processo. Comece pelos materiais publicados após a aprovação da compra.</p></div></div>
        <div className={styles.threeColumns}>{course.sessions.map((session,i) => <article className={[styles.card,styles.session].join(" ")} key={session.date}><span className={styles.chapter}>Live {session.number}</span><time dateTime={session.date+"T19:00:00-03:00"}>{session.label}</time><h3>{sessions[i][0]}</h3><p>{sessions[i][1]}</p><div className={styles.cardResult}>19h às 20h30 · Brasília · 90 minutos</div></article>)}</div>
        <p className={styles.note}>Encontros em novembro de 2026. As orientações e os links das lives serão disponibilizados na área de membros.</p>
      </section>

      <section className={[styles.section,"ca-container"].join(" ")} aria-labelledby="result-title"><div className={styles.deliverable}><div><p className={styles.eyebrow}>Aprendizagem com um entregável</p><h2 id="result-title">A ideia ganha forma<br />quando você a coloca no papel.</h2><p>Reúna o diagnóstico, a missão do agente e o teste de falha. Tenha um desenho que possa discutir, experimentar e melhorar.</p></div><div className={styles.blueprint}><div><span>01</span><strong>A operação como é hoje</strong></div><div><span>02</span><strong>A missão e seus limites</strong></div><div><span>03</span><strong>O teste e a revisão humana</strong></div><p>Dados fictícios nos exercícios iniciais.</p></div></div></section>

      <section className={[styles.section,"ca-container"].join(" ")} aria-labelledby="audience-title"><div className={styles.sectionHead}><p className={styles.eyebrow}>Para quem constrói</p><h2 id="audience-title">Um ponto de partida acessível.</h2></div><div className={styles.audience}><p><strong>Empreendedores e gestores</strong> que querem compreender um processo antes de investir numa solução.</p><p><strong>Profissionais e criadores</strong> que querem desenhar uma aplicação de IA no trabalho.</p><p><strong>Estudantes e iniciantes</strong> que procuram uma introdução orientada por exemplos e exercícios.</p></div><p className={styles.note}>Os exercícios iniciais não exigem programação. Implementações em sistemas reais dependem do contexto, de permissões e de trabalho adicional.</p></section>

      <section className={[styles.section,"ca-container"].join(" ")} aria-labelledby="host-title"><div className={styles.sectionHead}><p className={styles.eyebrow}>AtlasHub Academy · AtlasClub</p><h2 id="host-title">Pessoas, agentes<br />e operações inteligentes.</h2><p>Sérgio Monteiro conduz a formação com a participação da Architect Diana, identificada como agente digital. A tecnologia entra no processo com objetivos claros e acompanhamento humano.</p></div><Image className={styles.brandBanner} src="/assets/formacoes/atlasclub-ecosistema.png" width={2172} height={724} alt="Sérgio Monteiro e a representação visual do ecossistema AtlasClub: formação, comunidade e operações inteligentes." sizes="(max-width:800px) 100vw, 1240px" /></section>

      <section id="inscricao" className={[styles.section,"ca-container"].join(" ")} aria-labelledby="enrollment-title"><div className={styles.offer}><div><p className={styles.eyebrow}>O próximo passo</p><h2 id="enrollment-title">Escolha o processo.<br />Venha desenhar a missão.</h2><p>Curso de arranque, três lives de 90 minutos e materiais progressivos. O programa ampliado de oito módulos e seis cases é separado desta oferta.</p><ul className={styles.checkList}><li>Orientação e diagnóstico inicial</li><li>Missão de agente e teste de falha</li><li>Atividades para rever os conceitos</li></ul></div><div className={styles.offerAction}><p className={styles.price}>{architecturePrice}<span>pagamento único</span></p><LinkButton href={ctaUrl} variant="gold" external>{ctaLabel}</LinkButton><p className={styles.micro}>{checkout ? "Os métodos e o valor final aparecem no checkout antes de concluir a compra." : "Fale com a equipe para consultar as condições e a abertura da inscrição online."}</p>{checkout && <a href={checkout.termsUrl} target="_blank" rel="noopener noreferrer">Consultar condições da oferta</a>}</div></div></section>

      <section className={[styles.section,styles.faq,"ca-container"].join(" ")} aria-labelledby="faq-title"><div className={styles.sectionHead}><p className={styles.eyebrow}>Antes de participar</p><h2 id="faq-title">As respostas que você precisa.</h2></div>
        <details><summary>Preciso saber programar?</summary><p>Não para os exercícios iniciais. Você começa por compreender um processo, desenhar uma missão e testar um exemplo com dados fictícios.</p></details>
        <details><summary>Onde vou estudar?</summary><p>Na área de membros AtlasClub, inicialmente hospedada na Hotmart. A compra aprovada dá acesso às orientações e aos conteúdos publicados para esta formação.</p></details>
        <details><summary>Preciso esperar pela primeira live?</summary><p>O acesso começa pelos materiais efetivamente publicados após a aprovação da compra. Os próximos conteúdos são disponibilizados progressivamente.</p></details>
        <details><summary>O valor é uma mensalidade?</summary><p>Não. O preço desta oferta é {architecturePrice}, em pagamento único.</p></details>
        <details><summary>Vou sair com uma empresa automatizada?</summary><p>O resultado proposto é o desenho de um processo e de uma primeira missão, com exercício e teste. Uma implementação em produção exige análise e trabalho adicionais.</p></details>
        <details><summary>Como confirmar gravações, acompanhamento e prazo de acesso?</summary><p>Consulte as condições da oferta antes de comprar. Para esclarecer prazo de acesso, gravações e acompanhamento, <a href={architectureContactUrl} target="_blank" rel="noopener noreferrer">fale com a equipe</a>.</p></details>
      </section>
      <aside className={[styles.organizer,"ca-container"].join(" ")} aria-label="Organização e atendimento"><strong>AtlasHub Brasil</strong><p>CNPJ 66.991.513/0001-10 · Goiânia, Brasil</p><a href="mailto:contact@atlashub.si">contact@atlashub.si</a><Link href="/privacidade">Aviso de privacidade</Link></aside>
      <StickyOffer price={architecturePrice} />
    </div>
  );
}
