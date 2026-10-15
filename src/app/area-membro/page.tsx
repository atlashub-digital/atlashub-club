import type { Metadata } from "next";
import Link from "next/link";
import AtlasAvatar from "@/components/brand/AtlasAvatar";
import Icon, { type IconName } from "@/components/ui/Icon";
import { IconBox, LinkButton, StatusTag } from "@/components/ui/primitives";
import { mission001 } from "@/lib/content";
import { genesisFacts, price } from "@/lib/offers";

export const metadata: Metadata = { title: "Prévia do dashboard", robots: { index: false, follow: false } };

const nav: { icon: IconName; label: string; href: string }[] = [
  { icon: "home", label: "Início", href: "/area-membro" },
  { icon: "seed", label: "Missão 001", href: "#missao" },
  { icon: "nodes", label: "Meu ecossistema", href: "#ecossistema" },
  { icon: "book", label: "Biblioteca", href: "/biblioteca" },
  { icon: "users", label: "Comunidade", href: "/comunidade" },
  { icon: "rocket", label: "Genesis", href: "/genesis" },
  { icon: "calendar", label: "Eventos", href: "/eventos" },
  { icon: "sparkle", label: "Atlas Lab", href: "/lab" },
];

/**
 * Prévia do dashboard pós-adesão (issue #14). Sem login, sem dados, sem progresso:
 * todos os estados são o ponto de partida de um membro novo. Operação autenticada → PR3.
 */
export default async function AreaMembro({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const { plan } = await searchParams;
  const genesisInterest = plan === "genesis";
  return (
    <div className="ca-container ca-dash">
      <p className="ca-notice ca-dash__notice" role="note">
        <span>
          <strong>Prévia demonstrativa.</strong> Sem conta, sem dados pessoais e sem progresso real: é assim que o seu espaço vai
          começar depois da adesão.
        </span>
      </p>

      <div className="ca-dash__layout">
        <nav className="ca-dash__nav" aria-label="Área de membros (prévia)">
          <ul>
            {nav.map((n) => (
              <li key={n.label}>
                <Link href={n.href} aria-current={n.href === "/area-membro" ? "page" : undefined}>
                  <Icon name={n.icon} size={18} /> {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="ca-dash__atlas">
            <AtlasAvatar size={88} />
            <p>O Atlas acompanha a sua jornada.</p>
          </div>
        </nav>

        <div className="ca-dash__main">
          <section className="ca-card ca-card--glow ca-dash__hero" aria-labelledby="dash-title">
            <div>
              <span className="ca-eyebrow">Club Atlas · membro novo</span>
              <h1 id="dash-title">
                O seu mundo começa <span className="ca-hl">por uma ideia.</span>
              </h1>
              <p>
                Continue a Missão 001 — O Meu Primeiro Agente — e descubra o laboratório, os desafios e as pessoas com quem pode
                construir.
              </p>
              <div className="ca-dash__status">
                <StatusTag status="free">Club grátis</StatusTag>
                {genesisInterest && <StatusTag status="soon">Genesis: pré-inscrição ainda não aberta</StatusTag>}
              </div>
            </div>
            <LinkButton href="#missao">Começar a Missão 001</LinkButton>
          </section>

          <section className="ca-card ca-dash__mission" id="missao" aria-labelledby="dash-missao">
            <header className="ca-dash__sechead">
              <div>
                <span className="ca-eyebrow ca-eyebrow--gold">Missão 001</span>
                <h2 id="dash-missao">O meu primeiro agente</h2>
              </div>
              <p className="ca-dash__progress" aria-label="Progresso: 0 de 4 etapas">
                <strong>0/4</strong> etapas
              </p>
            </header>
            <ol className="ca-dash__steps">
              {mission001.map((m) => (
                <li key={m.title}>
                  <IconBox name={m.icon} tone="gold" />
                  <div>
                    <span className="ca-mission__step">{m.step}</span>
                    <h3>{m.title}</h3>
                    <p>{m.detail}</p>
                  </div>
                  <StatusTag status="soon">Não iniciada</StatusTag>
                </li>
              ))}
            </ol>
            <p className="ca-dash__fine">
              Cada etapa só conta com evidência validada no servidor. Disponível quando as contas abrirem.
            </p>
          </section>

          <section className="ca-card ca-dash__eco" id="ecossistema" aria-labelledby="dash-eco">
            <header className="ca-dash__sechead">
              <div>
                <span className="ca-eyebrow">Meu ecossistema</span>
                <h2 id="dash-eco">Meus agentes</h2>
              </div>
              <StatusTag status="prep">Laboratório em preparação</StatusTag>
            </header>
            <ul className="ca-dash__slots">
              <li className="ca-dash__slot">
                <Icon name="seed" size={22} />
                <strong>Primeiro agente</strong>
                <span>Ainda não criado. Ele nasce na Missão 001.</span>
              </li>
              <li className="ca-dash__slot is-locked">
                <Icon name="nodes" size={22} />
                <strong>Equipe de agentes</strong>
                <span>Desbloqueia depois do primeiro agente.</span>
              </li>
              <li className="ca-dash__slot is-locked">
                <Icon name="folder" size={22} />
                <strong>Primeiro projeto</strong>
                <span>Um resultado que você mostra e melhora.</span>
              </li>
            </ul>
            <p className="ca-dash__fine">Nenhum agente está ativo: a execução real só começa com isolamento, quotas e supervisão aprovados.</p>
          </section>

          <section className="ca-dash__grid" aria-label="Atalhos">
            <Link href="/comunidade" className="ca-card ca-dash__tile">
              <IconBox name="users" tone="violet" />
              <strong>Comunidade</strong>
              <span>Fóruns e desafios — em preparação</span>
            </Link>
            <Link href="/biblioteca" className="ca-card ca-dash__tile">
              <IconBox name="book" />
              <strong>Biblioteca</strong>
              <span>Guias livres e Editions</span>
            </Link>
            <Link href="/eventos" className="ca-card ca-dash__tile">
              <IconBox name="calendar" />
              <strong>Eventos</strong>
              <span>Agenda prevista</span>
            </Link>
          </section>

          <aside className="ca-card ca-card--gold ca-dash__genesis" aria-labelledby="dash-genesis">
            <div>
              <span className="ca-eyebrow ca-eyebrow--gold">Opcional</span>
              <h2 id="dash-genesis">Quer construir um ecossistema em oito semanas? Conheça o Genesis.</h2>
              <p>
                {price.genesisStandard} valor padrão; {price.genesisStudent} para estudantes elegíveis, mediante validação. Início
                previsto {genesisFacts.start}. O Club continua grátis — com ou sem Genesis.
              </p>
            </div>
            <LinkButton href="/genesis" variant="gold">
              Conhecer o Genesis
            </LinkButton>
          </aside>
        </div>
      </div>
    </div>
  );
}
