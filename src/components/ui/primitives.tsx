import Link from "next/link";
import type { ReactNode } from "react";
import Icon, { type IconName } from "./Icon";

type ButtonVariant = "primary" | "gold" | "outline" | "ghost";

type LinkButtonProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: "md" | "sm";
  icon?: IconName | null;
  external?: boolean;
  className?: string;
};

/** Botão de navegação (é sempre um link real; ações com efeitos usam <button>). */
export function LinkButton({ href, children, variant = "primary", size = "md", icon = "arrow", external, className = "" }: LinkButtonProps) {
  const cls = `ca-btn ca-btn--${variant} ${size === "sm" ? "ca-btn--sm" : ""} ${className}`;
  const content = (
    <>
      {children}
      {icon && <Icon name={external ? "external" : icon} className="ca-btn__icon" />}
    </>
  );
  if (external)
    return (
      <a className={cls} href={href} target="_blank" rel="noopener noreferrer">
        {content}
        <span className="ca-sr-only"> (abre em nova janela)</span>
      </a>
    );
  return (
    <Link className={cls} href={href}>
      {content}
    </Link>
  );
}

export type Status =
  | "free"
  | "premium"
  | "new"
  | "soon"
  | "prep"
  | "planned"
  | "precandidatura"
  | "external"
  | "demo"
  | "digital"
  | "human";

const statusMap: Record<Status, { cls: string; label: string }> = {
  free: { cls: "ca-tag--free", label: "Gratuito" },
  premium: { cls: "ca-tag--premium", label: "Premium" },
  new: { cls: "ca-tag--new", label: "Novo" },
  soon: { cls: "ca-tag--soon", label: "Em breve" },
  prep: { cls: "ca-tag--prep", label: "Em preparação" },
  planned: { cls: "ca-tag--new", label: "Previsto" },
  precandidatura: { cls: "ca-tag--soon", label: "Pré-candidatura em breve" },
  external: { cls: "", label: "AtlasHub.SI" },
  demo: { cls: "ca-tag--prep", label: "Demonstração" },
  digital: { cls: "ca-tag--digital", label: "Personagem digital" },
  human: { cls: "ca-tag--human", label: "Pessoa real" },
};

/** Etiqueta de estado. O texto é sempre explícito: a cor nunca é a única pista. */
export function StatusTag({ status, children, dot }: { status: Status; children?: ReactNode; dot?: boolean }) {
  const s = statusMap[status];
  return (
    <span className={`ca-tag ${s.cls}`}>
      {dot && <span className="ca-tag__dot" aria-hidden="true" />}
      {children ?? s.label}
    </span>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return <span className="ca-tag">{children}</span>;
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  action,
  id,
  gold,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  action?: ReactNode;
  id?: string;
  gold?: boolean;
}) {
  return (
    <div className="ca-heading">
      <div>
        <span className={`ca-eyebrow ${gold ? "ca-eyebrow--gold" : ""}`}>{eyebrow}</span>
        <h2 id={id}>{title}</h2>
        {lead && <p>{lead}</p>}
      </div>
      {action}
    </div>
  );
}

export function IconBox({ name, tone = "cyan" }: { name: IconName; tone?: "cyan" | "gold" | "violet" }) {
  return (
    <span className={`ca-icon-box ${tone === "gold" ? "ca-icon-box--gold" : tone === "violet" ? "ca-icon-box--violet" : ""}`}>
      <Icon name={name} />
    </span>
  );
}
