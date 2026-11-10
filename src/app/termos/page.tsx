import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos de Uso do Club Atlas — Rascunho para revisão jurídica",
};
export default function Termos() {
  return (
    <>
      <section className="wrap subhero">
        <p className="kicker">JURÍDICO</p>
        <h1>Termos de Uso</h1>
        <p>Rascunho para revisão jurídica. Sujeito a aprovação legal final antes do lançamento.</p>
      </section>
      <article className="wrap privacy">
        <div className="notice">
          Esta versão é um rascunho de engenharia e não substitui os termos legais finais. 
          O formulário de registo permanece desativado até à aprovação jurídica e técnica.
        </div>

        <h2>1. Aceitação dos Termos</h2>
        <p>
          Ao aceder ou utilizar o Club Atlas ("o Club"), você concorda em ficar vinculado a estes Termos de Uso. 
          Se não concordar com qualquer parte destes termos, não poderá utilizar o Club.
        </p>

        <h2>2. Descrição do Serviço</h2>
        <p>
          O Club Atlas é uma plataforma de comunidade e aprendizagem para construir com agentes de IA. 
          Inclui acesso gratuito à comunidade, programas guiados (como o Genesis), 
          laboratórios experimentais (Atlas Lab) e recursos educacionais.
        </p>

        <h2>3. Elegibilidade</h2>
        <p>
          Você deve ter pelo menos 16 anos para usar o Club. 
          Ao utilizar o Club, declara e garante que cumpre este requisito.
        </p>

        <h2>4. Contas de Utilizador</h2>
        <p>
          Algumas funcionalidades podem exigir criação de conta. Você é responsável por manter 
          a confidencialidade das suas credenciais e por todas as atividades na sua conta.
        </p>

        <h2>5. Personagens Digitais</h2>
        <p>
          Atlas, Lucas, Marta e Bia são personas digitais sintéticas. 
          São claramente identificadas como tal e não têm autorização implícita 
          para copiar memórias privadas de membros para outros ou para treino externo.
        </p>

        <h2>6. Diretrizes da Comunidade</h2>
        <p>
          Espera-se que os membros se tratem com respeito. Assédio, discurso de ódio, 
          spam e atividades ilegais são proibidos. Reservamo-nos o direito de moderar 
          conteúdo e suspender contas que violem estas diretrizes.
        </p>

        <h2>7. Propriedade Intelectual</h2>
        <p>
          Conteúdo, marca e personagens digitais do Club Atlas pertencem à AtlasHub.SI. 
          Conteúdo gerado por membros permanece propriedade do membro, 
          com licença concedida à AtlasHub.SI para operação da plataforma.
        </p>

        <h2>8. Programas Pagos</h2>
        <p>
          Certos programas (ex.: Genesis) podem requerer pagamento. 
          Preços, políticas de reembolso e termos serão comunicados claramente antes da compra. 
          Nenhuma cobrança ocorre sem consentimento explícito.
        </p>

        <h2>9. Isenções de Responsabilidade</h2>
        <p>
          O Club é fornecido "como está" sem garantias de qualquer tipo. 
          A AtlasHub.SI não garante acesso ininterrupto ou isento de erros. 
          Conteúdo gerado por IA pode conter imprecisões.
        </p>

        <h2>10. Limitação de Responsabilidade</h2>
        <p>
          Nos limites máximos permitidos por lei, a AtlasHub.SI não será responsável 
          por danos indiretos, incidentais ou consequentes decorrentes do uso do Club.
        </p>

        <h2>11. Lei Aplicável</h2>
        <p>
          Estes termos são regidos pelas leis do Brasil. 
          Litígios serão resolvidos nos tribunais de Anápolis, Goiás.
        </p>

        <h2>12. Alterações aos Termos</h2>
        <p>
          Podemos atualizar estes termos periodicamente. 
          O uso continuado após alterações constitui aceitação dos novos termos.
        </p>

        <h2>13. Contacto</h2>
        <p>
          Dúvidas sobre estes termos: <a href="mailto:legal@atlashub.si">legal@atlashub.si</a>
        </p>
      </article>
    </>
  );
}