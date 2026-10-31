import type { Metadata } from "next";
import { LinkButton } from "@/components/ui/primitives";
import "../free-content.css";

export const metadata: Metadata = {
  title: "Comunidade — propostas de conversa",
  description: "Temas e regras para preparar futuras conversas do Atlas Club, com exemplos fictícios e respeito.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/comunidade" },
};

export default function Comunidade() {
  return <div className="ca-container ca-section free-stack">
    <header className="free-stack">
      <span className="ca-eyebrow">Propostas de conversa</span>
      <h1>Aprender, experimentar e construir com IA</h1>
      <p>Estes são temas para preparar conversas: os espaços de postagem e a moderação ainda não estão ativos neste portal. Não há envio de respostas nesta página nem convite para grupos externos.</p>
    </header>
    <article className="ca-card free-stack">
      <h2>Boas-vindas ao Atlas Club</h2>
      <p>Prepare uma apresentação curta: o que você faz ou estuda, o que gostaria de aprender e uma tarefa que quer melhorar. Guarde suas anotações localmente por enquanto.</p>
      <h3>Regras para as futuras conversas</h3>
      <p>Use exemplos fictícios ao falar de clientes ou empresas. Não compartilhe credenciais, documentos pessoais, conversas privadas ou informações confidenciais.</p>
      <p>Discuta ideias com respeito, identifique publicidade e evite publicar o mesmo conteúdo repetidamente. Quando houver um canal de moderação disponível, sinalize por ele conteúdos que precisem de atenção.</p>
    </article>
    <article className="ca-card free-stack">
      <h2>Conversa 1 — Qual tarefa merece seu primeiro agente?</h2>
      <p>Escolha uma tarefa repetida, pequena e fácil de conferir. Reflita: o que a inicia, de que informação precisa e o que continuaria dependendo de você? Ainda não precisa saber qual ferramenta usar.</p>
    </article>
    <article className="ca-card free-stack">
      <h2>Desafio 1 — Uma missão, um limite, uma prova</h2>
      <p>Escreva três frases: “Meu assistente vai ajudar a…”, “Ele não pode…” e “Eu confirmo o resultado por meio de…”. Teste com dados fictícios e anote o que precisou corrigir.</p>
      <p>Temas sugeridos para os futuros espaços: Apresentações · Dúvidas e descobertas · Projetos e desafios.</p>
    </article>
    <LinkButton href="/comecar">Preparar minha missão</LinkButton>
    <LinkButton href="/radar" variant="outline">Explorar ideias no Radar Atlas</LinkButton>
  </div>;
}
