import type { Metadata } from "next";
import { LinkButton } from "@/components/ui/primitives";
import "../free-content.css";

export const metadata: Metadata = {
  title: "Radar Atlas — ideias que vale explorar",
  description: "Vídeos de outros criadores, com contexto e atividades originais do Atlas Club. Gratuito e sem login.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/radar" },
};

const videos = [
  {
    id: "F8NKVhkZZWI", title: "O que torna um agente diferente de um chatbot?",
    original: "What are AI Agents?", creator: "IBM Technology",
    language: "Idioma: inglês. Verifique no player as legendas disponíveis; não há promessa de tradução específica.",
    profile: "Introdução conceitual",
    context: "Antes de escolher uma ferramenta, vale separar uma resposta de uma tarefa executada. Use este conteúdo para observar como objetivo, ferramentas e decisões se relacionam.",
    activity: "Escolha uma tarefa simples da sua rotina. Escreva o que um chatbot apenas explicaria e o que um agente precisaria consultar ou executar. Termine com uma ação que exigiria aprovação humana.",
  },
  {
    id: "Eaf1UxvGmlE", title: "Explore automações e agentes com n8n",
    original: "Curso Completo de N8N | Crie Agentes com IA", creator: "Eli Rigobeli - IA",
    language: "Idioma observado na descrição e nos capítulos: português; confirme áudio e legendas no player.",
    profile: "Percurso prático extenso; pode ser visto por etapas",
    context: "Observar um fluxo visual ajuda a distinguir o evento que inicia o trabalho, os dados que circulam e o resultado esperado. Comece por compreender a interface antes de conectar serviços reais.",
    activity: "Desenhe um fluxo com três caixas: quando acontece → o que consultar → que resultado preparar. Use dados fictícios. A atividade não exige comprar hospedagem nem conectar credenciais.",
  },
];

export default function Radar() {
  return <div className="ca-container ca-section free-stack">
    <header className="free-stack">
      <span className="ca-eyebrow">Conteúdo gratuito · sem login</span>
      <h1>Radar Atlas — ideias que vale explorar</h1>
      <p>Uma seleção de vídeos e ideias de outros criadores para compreender a IA, descobrir ferramentas e experimentar com propósito. Os vídeos pertencem aos respectivos autores; a seleção, o contexto e as atividades são do Atlas Club.</p>
      <p>Entender IA · Construir na prática · IA nos negócios · Criatividade e estudo</p>
    </header>
    {videos.map(video => <article key={video.id} className="ca-card free-stack">
      <h2>{video.title}</h2>
      <p><strong>{video.original}</strong> — {video.creator}</p>
      <p>{video.profile}. {video.language}</p>
      <details>
        <summary>Abrir player oficial do YouTube</summary>
        <p>O player usa o modo de privacidade aprimorada. Ao abri-lo, você acessa conteúdo externo do YouTube. Se a incorporação estiver indisponível, use o link original abaixo.</p>
        <iframe className="free-video" src={`https://www.youtube-nocookie.com/embed/${video.id}`} title={`${video.original} — ${video.creator}`} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
      </details>
      <LinkButton href={`https://www.youtube.com/watch?v=${video.id}`} external variant="outline">Assistir no YouTube</LinkButton>
      <h3>Contexto Atlas</h3><p>{video.context}</p>
      <h3>Atividade Atlas</h3><p>{video.activity}</p>
      {video.id === "Eaf1UxvGmlE" ? <p>O acesso ao vídeo é gratuito; ferramentas, infraestrutura ou APIs mencionadas pelo autor podem ter custos próprios. Recomendações comerciais do criador não são recomendações comerciais Atlas.</p> : <p>Guarde sua tarefa para reflexão. Os espaços de postagem da comunidade ainda não estão ativos. Use exemplos fictícios, sem dados pessoais ou documentos confidenciais.</p>}
    </article>)}
    <p>Títulos, autores e resposta de incorporação foram verificados no oEmbed oficial do YouTube em 31/10/2026. Isso não equivale a uma revisão integral dos vídeos nem garante disponibilidade futura. Não hospedamos nem transcrevemos os vídeos.</p>
    <LinkButton href="/comecar">Comece aqui: da conversa à primeira missão</LinkButton>
  </div>;
}
