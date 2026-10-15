import AtlasAvatar from "../brand/AtlasAvatar";
import Icon from "../ui/Icon";
import { LinkButton, StatusTag } from "../ui/primitives";
import { accessLevels, labStages } from "@/lib/content";
import { primaryCta } from "@/lib/flags";

/**
 * Destaque editorial "laboratório experimental e ecossistema próprio" (revisão Sérgio, PR #11 §C).
 * A consola é uma SIMULAÇÃO em DOM: não executa nada, não há VPS/SDK/infra ativos.
 * Realce sequencial opcional; estático com prefers-reduced-motion.
 */
export default function LabSection() {
  return (
    <section className="ca-section ca-container" aria-labelledby="laboratorio" id="laboratorio-atlas">
      <div className="ca-lab">
        <div className="ca-lab__copy">
          <span className="ca-eyebrow">Atlas Lab · laboratório experimental</span>
          <h2 id="laboratorio">
            Da tela vazia ao seu <span className="ca-hl">ecossistema vivo.</span>
          </h2>
          <p className="ca-lab__sub">
            Comece com uma ideia. Crie seu agente, dê a ele contexto e ferramentas, e aprenda a coordenar uma equipe de
            agentes que pesquisa, planeja, constrói e melhora projetos com você.
          </p>
          <p className="ca-lab__prop">
            Não é mais um chatbot. É o laboratório onde você aprende a criar, ensinar e coordenar seus próprios sistemas
            de inteligência — com liberdade para experimentar e supervisão para evoluir.
          </p>
          <ol className="ca-lab__path" aria-label="O caminho no laboratório">
            <li>Seu primeiro agente</li>
            <li>Sua primeira equipe</li>
            <li>Seu primeiro projeto</li>
          </ol>
          <div className="ca-lab__actions">
            <LinkButton href="/lab" variant={primaryCta}>
              Conhecer o laboratório
            </LinkButton>
            <LinkButton href="/genesis" variant="outline">
              Ver o Genesis
            </LinkButton>
          </div>
        </div>

        <figure className="ca-console" aria-labelledby="console-caption">
          <div className="ca-console__bar" aria-hidden="true">
            <span />
            <span />
            <span />
            <b>atlas-lab · demonstração</b>
          </div>
          <ol className="ca-console__stages">
            {labStages.map((s, i) => (
              <li key={s.title} className="ca-console__stage" style={{ ["--i" as string]: i }}>
                <span className="ca-console__icon">
                  <Icon name={s.icon} size={18} />
                </span>
                <div>
                  <p className="ca-console__title">
                    <span className="ca-console__n">{String(i + 1).padStart(2, "0")}</span> {s.title}
                  </p>
                  <p className="ca-console__detail">{s.detail}</p>
                  <code className="ca-console__line">
                    <span aria-hidden="true">› </span>
                    {s.line}
                  </code>
                </div>
              </li>
            ))}
          </ol>
          <figcaption id="console-caption" className="ca-console__caption">
            Simulação ilustrativa do percurso — não é um terminal real e nada aqui é executado.
          </figcaption>
          <div className="ca-console__atlas">
            <AtlasAvatar size={96} />
            <p className="ca-hand">Eu acompanho você em cada etapa.</p>
          </div>
        </figure>
      </div>

      <ul className="ca-levels" aria-label="Níveis de acesso">
        {accessLevels.map((l) => (
          <li key={l.name} className="ca-card ca-level">
            <h3>{l.name}</h3>
            <p>{l.what}</p>
            <StatusTag status={l.status}>{l.statusLabel}</StatusTag>
          </li>
        ))}
      </ul>
    </section>
  );
}
