"use client";
import { useEffect, useId, useRef, useState } from "react";
import Icon from "../ui/Icon";
import NavLinks from "./NavLinks";

/** Menu móvel: botão com aria-expanded, fecha com Escape e ao navegar, devolve o foco ao botão. */
export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="ca-mobilenav">
      <button
        ref={buttonRef}
        type="button"
        className="ca-mobilenav__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name={open ? "close" : "menu"} size={22} />
        <span className="ca-sr-only">{open ? "Fechar menu" : "Abrir menu"}</span>
      </button>
      <nav id={panelId} className="ca-mobilenav__panel" aria-label="Navegação principal (móvel)" hidden={!open}>
        <NavLinks onNavigate={() => setOpen(false)} />
      </nav>
    </div>
  );
}
