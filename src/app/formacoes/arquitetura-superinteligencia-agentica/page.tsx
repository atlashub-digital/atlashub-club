import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { architectureCourse as course, architecturePrice, architectureContactUrl } from "@/lib/courses/architecture";
import styles from "./sales.module.css";
import StickyOffer from "./StickyOffer";
import { HotmartCheckoutButton, HotmartCheckoutProvider } from "./HotmartCheckout";

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
  const ctaUrl = course.checkoutUrl;
  const ctaLabel = "Quero participar do atelier";
  return (
    <HotmartCheckoutProvider checkoutUrl={ctaUrl} offerCode={course.offerCode}><div className={styles.page}>
      <div className={styles.heroArtwork}><div className={styles.heroArtworkCrop}><Image src="/assets/formacoes/f01-hero-clean.png" width={1783} height={882} alt="Atelier A Arquitetura da Superinteligência Agêntica, com Sérgio Monteiro, a agente digital Architect Diana e a representação de uma empresa aumentada." priority sizes="(max-width: 1600px) 100vw, 1600px" /></div></div>
      <section id="course-intro" className={[styles.hero, "ca-container"].join(" ")} aria-labelledby="course-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Atelier prático · F01 · Online</p>
          <p className={styles.courseName}>{course.title}</p>
          <h1 id="course-title">Da sua operação real<br />ao primeiro projeto com <span>agentes de IA.</span></h1>
          <p className={styles.lead}>Mapeie um processo, desenhe a missão do seu agente e prepare um primeiro piloto com supervisão humana. Um atelier para transformar ideias em um plano prático.</p>
          <ul className={styles.badges}><li>3 lives de 90 minutos</li><li>6 cenários práticos</li><li>12 meses de AtlasClub</li><li>Sem programação no início</li></ul>
          <div className={styles.actions}><HotmartCheckoutButton href={ctaUrl}>Quero começar</HotmartCheckoutButton><a href="#programa">Explorar o programa ↓</a></div>
          <p className={styles.people}>Com <strong>Sérgio Monteiro</strong> e a agente digital <strong>Architect Diana</strong></p>
        </div>
        <aside className={styles.heroOffer} aria-label="Formato e participação">
          <p className={styles.eyebrow}>Sua próxima etapa começa aqui</p>
          <h2>Atelier prático F01</h2>
          <p className={styles.heroDates}>9, 12 e 19 de novembro de 2026<br /><span>19h às 20h30 · Horário de Brasília</span></p>
          <ul className={styles.checkList}><li>3 encontros ao vivo de 90 minutos</li><li>6 cenários, prompts e exercícios</li><li>12 meses de acesso ao AtlasClub</li></ul>
          <p className={styles.price}>{architecturePrice}<span>pagamento único</span></p>
          <HotmartCheckoutButton href={ctaUrl}>{ctaLabel}</HotmartCheckoutButton>
          <p className={styles.micro}>Pagamento seguro pela Hotmart · Garantia de 7 dias</p>
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

      <section className={[styles.section,"ca-container"].join(" ")} aria-labelledby="cases-title"><div className={styles.sectionHead}><p className={styles.eyebrow}>A metodologia em diferentes contextos</p><h2 id="cases-title">Seis cenários.<br />Um jeito de pensar a operação.</h2><p>Escolha o cenário mais próximo do seu trabalho e aplique a metodologia. São exemplos educativos, com fichas e recursos disponibilizados progressivamente.</p></div><div className={styles.casesGrid}>{course.cases.map((name,i)=><article className={styles.caseCard} key={name}><span>C0{i+1}</span><h3>{name}</h3></article>)}</div></section>

      <section className={[styles.section,"ca-container"].join(" ")} aria-labelledby="result-title"><div className={styles.deliverable}><div><p className={styles.eyebrow}>Aprendizagem com um entregável</p><h2 id="result-title">Construa o seu<br />Caderno do Arquiteto.</h2><p>Reúna o mapa da operação atual (AS-IS), a proposta de evolução (TO-BE), a missão do agente, as permissões e o plano de testes. Um desenho para discutir, experimentar e melhorar.</p></div><div className={styles.blueprint}><div><span>01</span><strong>A operação como é hoje</strong></div><div><span>02</span><strong>A missão e seus limites</strong></div><div><span>03</span><strong>O teste e a revisão humana</strong></div><p>Dados fictícios nos exercícios iniciais.</p></div></div></section>

      <section className={[styles.section,"ca-container"].join(" ")} aria-labelledby="audience-title"><div className={styles.sectionHead}><p className={styles.eyebrow}>Para quem constrói</p><h2 id="audience-title">Um ponto de partida acessível.</h2></div><div className={styles.audience}><p><strong>Empreendedores e gestores</strong> que querem compreender um processo antes de investir numa solução.</p><p><strong>Profissionais e criadores</strong> que querem desenhar uma aplicação de IA no trabalho.</p><p><strong>Estudantes e iniciantes</strong> que procuram uma introdução orientada por exemplos e exercícios.</p></div><p className={styles.note}>Os exercícios iniciais não exigem programação. Implementações em sistemas reais dependem do contexto, de permissões e de trabalho adicional.</p></section>

      <section className={[styles.section,"ca-container"].join(" ")} aria-labelledby="host-title"><div className={styles.sectionHead}><p className={styles.eyebrow}>AtlasHub Academy · AtlasClub</p><h2 id="host-title">Pessoas, agentes<br />e operações inteligentes.</h2><p>Sérgio Monteiro conduz a formação com a participação da Architect Diana, identificada como agente digital. A tecnologia entra no processo com objetivos claros e acompanhamento humano.</p></div><Image className={styles.brandBanner} src="/assets/formacoes/atlasclub-ecosistema.png" width={2172} height={724} alt="Sérgio Monteiro e a representação visual do ecossistema AtlasClub: formação, comunidade e operações inteligentes." sizes="(max-width:800px) 100vw, 1240px" /></section>

      <section id="inscricao" className={[styles.section,"ca-container"].join(" ")} aria-labelledby="enrollment-title"><div className={styles.offer}><div><p className={styles.eyebrow}>O próximo passo</p><h2 id="enrollment-title">Escolha o processo.<br />Venha desenhar a missão.</h2><p>Atelier F01 com três lives de 90 minutos, seis cenários práticos e materiais publicados progressivamente. Inclui 12 meses de acesso ao AtlasClub para acompanhar esta formação.</p><ul className={styles.checkList}><li>Orientação e diagnóstico inicial</li><li>Missão de agente e teste de falha</li><li>Prompts, modelos, exercícios e quizzes</li><li>Biblioteca com seis cenários educativos</li></ul></div><div className={styles.offerAction}><p className={styles.price}>{architecturePrice}<span>pagamento único</span></p><HotmartCheckoutButton href={ctaUrl}>{ctaLabel}</HotmartCheckoutButton><p className={styles.micro}>Cartão, Pix e boleto conforme disponibilidade no checkout. O valor final é apresentado antes da compra.</p><a href="#condicoes">Condições da formação</a><a href={ctaUrl} target="_blank" rel="noopener noreferrer">Prefiro abrir o checkout direto ↗</a></div></div></section>

      <section id="condicoes" className={[styles.section,"ca-container"].join(" ")} aria-labelledby="conditions-title"><div className={styles.conditions}><p className={styles.eyebrow}>Sua participação, com clareza</p><h2 id="conditions-title">O que esta oferta inclui.</h2><dl><div><dt>Investimento</dt><dd>{architecturePrice}, pagamento único.</dd></div><div><dt>Ao vivo</dt><dd>9, 12 e 19/11/2026, das 19h às 20h30 de Brasília.</dd></div><div><dt>Acesso</dt><dd>12 meses de AtlasClub para esta formação e os materiais incluídos. Outras formações, como Genesis, têm direitos próprios.</dd></div><div><dt>Garantia</dt><dd>7 dias, conforme a oferta na Hotmart.</dd></div></dl><p>Os seis cenários, prompts, modelos, exercícios e demais materiais são disponibilizados progressivamente. Acompanhamento de perguntas e orientação sobre os exercícios; atendimento personalizado mediante agendamento e condições específicas.</p><p>Apresentação e organização: Sérgio Monteiro / AtlasHub. A compra é processada pela Hotmart em nome de Sara Talia de Carvalho Campelo, responsável pela conta vendedora.</p><a href={ctaUrl} target="_blank" rel="noopener noreferrer">Consultar o checkout e suas condições ↗</a></div></section>

      <section className={[styles.section,styles.faq,"ca-container"].join(" ")} aria-labelledby="faq-title"><div className={styles.sectionHead}><p className={styles.eyebrow}>Antes de participar</p><h2 id="faq-title">As respostas que você precisa.</h2></div>
        <details><summary>Preciso saber programar?</summary><p>Não para os exercícios iniciais. Você começa por compreender um processo, desenhar uma missão e testar um exemplo com dados fictícios.</p></details>
        <details><summary>Onde vou estudar?</summary><p>Na área de membros AtlasClub, inicialmente hospedada na Hotmart. Após a compra aprovada, siga as instruções enviadas pela plataforma. Se já comprou, <a href={course.loginUrl}>acesse sua formação na Hotmart</a>.</p></details>
        <details><summary>Preciso esperar pela primeira live?</summary><p>O acesso começa pelos materiais efetivamente publicados após a aprovação da compra. Os próximos conteúdos são disponibilizados progressivamente.</p></details>
        <details><summary>O valor é uma mensalidade?</summary><p>Não. O preço desta oferta é {architecturePrice}, em pagamento único.</p></details>
        <details><summary>Vou sair com uma empresa automatizada?</summary><p>O resultado proposto é o desenho de um processo e de uma primeira missão, com exercício e teste. Uma implementação em produção exige análise e trabalho adicionais.</p></details>
        <details><summary>Como confirmar gravações, acompanhamento e prazo de acesso?</summary><p>A oferta inclui 12 meses de acesso ao AtlasClub para esta formação. Os materiais são progressivos. Gravações e acompanhamento seguem as condições comunicadas na área de membros; sessões personalizadas dependem de agendamento e condições específicas. Para esclarecer dúvidas, <a href={architectureContactUrl} target="_blank" rel="noopener noreferrer">fale com a equipe</a>.</p></details>
      </section>
      <aside className={[styles.organizer,"ca-container"].join(" ")} aria-label="Organização e atendimento"><strong>AtlasHub Brasil</strong><p>CNPJ 66.991.513/0001-10 · Goiânia, Brasil</p><a href="mailto:contact@atlashub.si">contact@atlashub.si</a><Link href="/privacidade">Aviso de privacidade</Link></aside>
      <StickyOffer price={architecturePrice} checkoutUrl={ctaUrl} />
    </div></HotmartCheckoutProvider>
  );
}
