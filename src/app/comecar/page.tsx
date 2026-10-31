import type { Metadata } from "next";
import MissionBuilder from "@/components/free/MissionBuilder";
import { LinkButton } from "@/components/ui/primitives";
import "../free-content.css";

export const metadata: Metadata = {
  title: "Comece aqui: da conversa à primeira missão",
  description: "Três lições originais, quatro perguntas de reflexão e uma ficha de missão para aprender com IA. Gratuito, sem login.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/comecar" },
};

export default function Comecar() {
  return <div className="ca-container ca-section free-stack">
    <header className="free-stack"><span className="ca-eyebrow">Conteúdo original Atlas · gratuito · sem login</span>
      <h1>Comece aqui: da conversa à primeira missão</h1>
      <p>Leia as três lições, reflita e monte uma missão pequena que você possa conferir. Não é necessário conectar contas ou instalar ferramentas.</p>
    </header>
    <article className="ca-card free-stack">
      <h2>Lição 1 — Chatbot, automação e agente</h2>
      <p>Um chatbot recebe uma mensagem e produz uma resposta. Pode ajudar a explicar um conceito, revisar um texto ou comparar ideias. A resposta, por si só, não prova que alguma ação aconteceu fora da conversa.</p>
      <p>Uma automação liga eventos e regras: quando chega uma mensagem, salvar o assunto em uma lista; quando muda uma data, preparar um lembrete. Pode funcionar sem inteligência artificial.</p>
      <p>Um agente usa um objetivo, contexto e ferramentas para escolher os próximos passos dentro de limites definidos. Se tiver permissão para agir, poderá alterar um sistema. Essa possibilidade exige saber quem autoriza, quais os dados corretos e como conferir o resultado.</p>
      <p>Imagine uma pequena loja. Pedir à IA uma explicação sobre reposição de estoque é uma conversa. Atualizar uma lista sempre que uma venda é registrada é uma automação. Analisar vendas e estoque para preparar uma sugestão de reposição pode fazer parte da missão de um agente. Enviar o pedido ao fornecedor é outra ação, que não deve ser presumida como autorizada.</p>
      <p>Faça agora: escolha uma tarefa repetida da sua rotina. Escreva o evento de início, a informação necessária e o resultado esperado. Depois marque: explicar, preparar ou executar? Comece pelo menor passo que você consegue conferir.</p>
    </article>
    <article className="ca-card free-stack">
      <h2>Lição 2 — Dê uma missão clara à IA</h2>
      <p>“Ajude a minha empresa” é um pedido amplo. Uma missão clara tem um resultado pequeno, informação conhecida e limites observáveis.</p>
      <p>Experimente esta estrutura:</p>
      <p>“Ajude-me a preparar [resultado]. Use apenas [informação]. Se faltar algum dado, indique o que falta. Não faça [ação proibida]. Entregue [formato]. Eu vou conferir [critério].”</p>
      <p>Exemplo com dados fictícios: “Prepare uma lista de prioridades de estudo para três temas: conceitos de IA, automação e agentes. Tenho 30 minutos por dia durante quatro dias. Não invente cursos ou links. Entregue uma tabela curta e explique como revisarei o que aprendi.”</p>
      <p>Revise a resposta: respeitou o tempo disponível? Acrescentou informação que não foi fornecida? O plano é fácil de executar? Se não for, ajuste uma instrução de cada vez.</p>
      <p>Faça agora: escreva a missão de um assistente para uma tarefa sua. Use informação fictícia ou pública. Inclua uma situação em que ele deve parar e pedir ajuda.</p>
    </article>
    <article className="ca-card free-stack">
      <h2>Lição 3 — Confira o resultado antes de confiar</h2>
      <p>Uma resposta convincente pode conter erros. Verificar é comparar o que foi entregue com uma fonte, um cálculo ou um critério que você consegue observar.</p>
      <p>Para uma lista de tarefas, confirme se os itens existem e se a ordem faz sentido. Para um cálculo, refaça a operação. Para uma referência, abra o original. Para uma ação em um sistema, confirme o registro no próprio sistema; uma mensagem “feito” não é prova suficiente.</p>
      <p>Comece com experiências de baixo impacto. Prepare um rascunho antes de enviar uma mensagem. Analise uma tabela fictícia antes de conectar dados de clientes. Peça uma recomendação antes de autorizar uma compra.</p>
      <p>Desafio final: escreva uma missão com quatro partes: objetivo, informação, limite e verificação. Descreva também uma falha que procurou no resultado. Guarde suas anotações localmente; os espaços de postagem ainda não estão ativos. Não publique senhas, documentos pessoais ou conversas privadas.</p>
    </article>
    <section className="ca-card free-stack" aria-labelledby="reflection-title">
      <h2 id="reflection-title">Perguntas de reflexão</h2>
      <p>Quatro perguntas para fixar o conteúdo. As marcações são apenas para reflexão nesta página: não há correção automática, nota, envio ou registro de progresso. Justifique suas escolhas com as lições antes de continuar.</p>
      <fieldset><legend>1. Uma resposta “pedido enviado” prova que o fornecedor o recebeu?</legend><label className="free-choice"><input type="radio" name="reflection-0" /> A) Sim, se parecer convincente.</label><label className="free-choice"><input type="radio" name="reflection-0" /> B) Não; é preciso verificar no sistema e no processo correspondente.</label></fieldset>

      <fieldset><legend>2. Qual é o melhor primeiro teste?</legend><label className="free-choice"><input type="radio" name="reflection-1" /> A) Dados fictícios e uma tarefa pequena.</label><label className="free-choice"><input type="radio" name="reflection-1" /> B) Acesso completo a todas as contas.</label></fieldset>

      <fieldset><legend>3. O que fazer quando falta informação?</legend><label className="free-choice"><input type="radio" name="reflection-2" /> A) Inventar para terminar.</label><label className="free-choice"><input type="radio" name="reflection-2" /> B) Indicar a falta e pedir esclarecimento.</label></fieldset>

      <fieldset><legend>4. Qual missão é mais verificável?</legend><label className="free-choice"><input type="radio" name="reflection-3" /> A) “Melhore tudo.”</label><label className="free-choice"><input type="radio" name="reflection-3" /> B) “Prepare três opções usando esta tabela, sem enviar mensagens.”</label></fieldset>

    </section>
    <MissionBuilder />
    <LinkButton href="/radar" variant="outline">Explorar o Radar Atlas</LinkButton>
    <LinkButton href="/comunidade" variant="outline">Ver propostas de conversa</LinkButton>
  </div>;
}
