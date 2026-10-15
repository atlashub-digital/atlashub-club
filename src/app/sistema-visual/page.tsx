import type { Metadata } from "next";
import ClubLogo from "@/components/brand/ClubLogo";
import AtlasMark from "@/components/brand/AtlasMark";
import AtlasAvatar from "@/components/brand/AtlasAvatar";
import Icon, { type IconName } from "@/components/ui/Icon";
import { LinkButton, StatusTag, Tag } from "@/components/ui/primitives";
import EventCard from "@/components/landing/EventCard";
import MentorCard from "@/components/landing/MentorCard";
import { cast } from "@/lib/cast";
import { events } from "@/lib/content";

export const metadata: Metadata = {
  title: "Sistema visual (referência interna)",
  robots: { index: false, follow: false },
};

const colors = [
  ["Fundo", "--ca-bg", "#050B17"],
  ["Superfície", "--ca-surface", "#0B1424"],
  ["Superfície 2", "--ca-surface-2", "#111C31"],
  ["Borda", "--ca-border-strong", "#334155"],
  ["Azul elétrico", "--ca-electric", "#007BFF"],
  ["Azul profundo", "--ca-electric-deep", "#0B3BFF"],
  ["Ciano Atlas", "--ca-cyan", "#00D4FF"],
  ["Azul claro", "--ca-blue-light", "#60A5FA"],
  ["Dourado Atlas", "--ca-gold", "#FFC857"],
  ["Âmbar", "--ca-amber", "#FF9F0A"],
  ["Roxo IA", "--ca-violet", "#8B5CF6"],
  ["Texto", "--ca-text", "#F9FAFB"],
  ["Texto secundário", "--ca-text-2", "#CBD5E1"],
  ["Texto suave", "--ca-text-3", "#94A3B8"],
] as const;

const icons: IconName[] = ["home", "users", "rocket", "folder", "nodes", "calendar", "book", "user", "gear", "bulb", "chart", "chat", "shield", "cap", "phone", "sparkle", "seed", "id", "brain", "trophy", "pin", "lock", "play", "check"];

export default function SistemaVisual() {
  return (
    <div className="ca-container ca-section ca-ds">
      <div className="ca-notice" role="note">
        <strong>Referência interna.</strong> Página de documentação viva do design system v1.0 (PR1). Não é conteúdo público
        nem contém dados reais.
      </div>

      <section aria-labelledby="ds-marca">
        <h1 id="ds-marca" className="ca-page-title">Sistema visual Club Atlas</h1>
        <h2 className="ca-ds__h">01 · Logo e mascote</h2>
        <div className="ca-ds__row">
          <div className="ca-card ca-ds__tile">
            <ClubLogo variant="wordmark" size="lg" tagline />
            <small>Wordmark (A = símbolo)</small>
          </div>
          <div className="ca-card ca-ds__tile">
            <ClubLogo size="md" />
            <small>Horizontal (navegação)</small>
          </div>
          <div className="ca-card ca-ds__tile">
            <AtlasMark size={72} />
            <small>Símbolo institucional — sem rosto</small>
          </div>
          <div className="ca-card ca-ds__tile">
            <AtlasAvatar size={120} />
            <small>Mascote viva — com rosto, animação suave</small>
          </div>
        </div>
      </section>

      <section aria-labelledby="ds-cores">
        <h2 id="ds-cores" className="ca-ds__h">02 · Paleta</h2>
        <ul className="ca-ds__swatches">
          {colors.map(([name, token, hex]) => (
            <li key={token}>
              <span className="ca-ds__swatch" style={{ background: `var(${token})` }} />
              <b>{name}</b>
              <code>{hex}</code>
              <code>{token}</code>
            </li>
          ))}
        </ul>
        <div className="ca-ds__row">
          {["atlas", "premium", "ai", "energy"].map((g) => (
            <div key={g} className="ca-ds__grad" style={{ background: `var(--ca-grad-${g})` }}>
              --ca-grad-{g}
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="ds-tipo">
        <h2 id="ds-tipo" className="ca-ds__h">03 · Tipografia</h2>
        <div className="ca-card ca-ds__type">
          <p className="ca-ds__h1">
            H1. O teu futuro <span className="ca-hl-gold">em construção.</span>
          </p>
          <p className="ca-ds__h2">H2. Aprender · Construir · Crescer · Realizar</p>
          <p className="ca-ds__h3">H3. Títulos de card</p>
          <p>Corpo — Inter Variable, legível, claro e confortável.</p>
          <p className="ca-hand" style={{ fontSize: "1.8rem" }}>
            Caveat — notas manuscritas e citações
          </p>
        </div>
      </section>

      <section aria-labelledby="ds-botoes">
        <h2 id="ds-botoes" className="ca-ds__h">04 · Botões e etiquetas</h2>
        <div className="ca-ds__row">
          <LinkButton href="/sistema-visual">Primário</LinkButton>
          <LinkButton href="/sistema-visual" variant="gold">
            Destaque
          </LinkButton>
          <LinkButton href="/sistema-visual" variant="outline" icon={null}>
            Secundário
          </LinkButton>
          <LinkButton href="/sistema-visual" variant="ghost">
            Terciário
          </LinkButton>
          <button className="ca-btn ca-btn--primary" type="button" disabled>
            Desativado
          </button>
        </div>
        <div className="ca-ds__row">
          <StatusTag status="free" />
          <StatusTag status="premium" />
          <StatusTag status="new" />
          <StatusTag status="soon" />
          <StatusTag status="prep" dot />
          <StatusTag status="demo" />
          <StatusTag status="human" />
          <StatusTag status="digital" />
          <Tag>Workshop</Tag>
          <Tag>Curso</Tag>
          <Tag>Projeto</Tag>
        </div>
      </section>

      <section aria-labelledby="ds-form">
        <h2 id="ds-form" className="ca-ds__h">05 · Campos de formulário</h2>
        <form className="ca-ds__form" aria-describedby="ds-form-note">
          <p id="ds-form-note" className="ca-ds__note">
            Exemplo estático: este formulário não envia dados.
          </p>
          <label className="ca-field">
            <span>Normal</span>
            <input className="ca-input" type="email" placeholder="Digite seu e-mail" />
          </label>
          <label className="ca-field">
            <span>Com erro</span>
            <input className="ca-input" type="email" aria-invalid="true" defaultValue="email-invalido" aria-describedby="ds-err" />
            <small id="ds-err" className="ca-field__error">
              Por favor, insira um e-mail válido.
            </small>
          </label>
          <label className="ca-field">
            <span>Com sucesso</span>
            <input className="ca-input ca-input--success" type="email" defaultValue="exemplo@example.com" />
          </label>
          <label className="ca-field">
            <span>Desativado</span>
            <input className="ca-input" type="email" disabled placeholder="Em preparação" />
          </label>
        </form>
      </section>

      <section aria-labelledby="ds-icones">
        <h2 id="ds-icones" className="ca-ds__h">06 · Ícones</h2>
        <ul className="ca-ds__icons">
          {icons.map((n) => (
            <li key={n}>
              <Icon name={n} size={26} />
              <small>{n}</small>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="ds-cards">
        <h2 id="ds-cards" className="ca-ds__h">07 · Cartões</h2>
        <div className="ca-ds__cards">
          <MentorCard member={cast[1]} />
          <EventCard event={events[5]} />
        </div>
      </section>
    </div>
  );
}
