"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import AtlasFigure from "./AtlasFigure";
import Icon from "../ui/Icon";
import { atlasCopy, bubbleFor, guideTopics, type GuideTopic } from "@/lib/atlas/guide";
import { createAtlasAdapter, AtlasUnavailableError } from "@/lib/atlas/adapter";
import { nextState, type AtlasEvent, type AtlasState } from "@/lib/atlas/state";

/**
 * Atlas — companheiro digital (MVP). Briefing "Avatar Interativo ATLAS".
 * - Presença flutuante + balões contextuais (desligáveis, uma vez por sessão).
 * - Clique abre o painel de conversa: guia PRÉ-ESCRITO rotulado; texto livre só quando o
 *   agente real estiver ligado (adaptador fail-closed). Nunca simula respostas de IA.
 * - Microfone: nunca é pedido nesta versão (sem getUserMedia); só explica o consentimento.
 * - Pode ser silenciado, minimizado e fechado; respeita prefers-reduced-motion.
 */

type Msg = { id: number; from: "atlas" | "user"; kind: "guide" | "notice" | "text"; text: string; link?: GuideTopic["link"] };

const STORE = { hidden: "ca-atlas-hidden", muted: "ca-atlas-muted", bubbleSeen: "ca-atlas-bubble" };
const read = (s: Storage | undefined, k: string) => {
  try {
    return s?.getItem(k) ?? null;
  } catch {
    return null;
  }
};
const write = (s: Storage | undefined, k: string, v: string | null) => {
  try {
    if (!s) return;
    if (v === null) s.removeItem(k);
    else s.setItem(k, v);
  } catch {
    /* armazenamento indisponível: segue sem persistir */
  }
};

export default function AtlasCompanion() {
  const pathname = usePathname();
  const adapter = useMemo(() => createAtlasAdapter(), []);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [state, setState] = useState<AtlasState>("idle");
  const [messages, setMessages] = useState<Msg[]>([{ id: 0, from: "atlas", kind: "guide", text: atlasCopy.intro }]);
  const [draft, setDraft] = useState("");
  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const seq = useRef(1);
  const panelId = useId();
  const titleId = useId();

  const dispatch = useCallback((e: AtlasEvent) => setState((s) => nextState(s, e)), []);

  useEffect(() => {
    setMounted(true);
    setHidden(read(globalThis.localStorage, STORE.hidden) === "1");
    setMuted(read(globalThis.localStorage, STORE.muted) === "1");
  }, []);

  // Balão contextual: uma vez por sessão, depois de alguns segundos, se não estiver silenciado.
  useEffect(() => {
    if (!mounted || hidden || muted || open) return;
    if (read(globalThis.sessionStorage, STORE.bubbleSeen) === "1") return;
    const show = setTimeout(() => setBubble(bubbleFor(pathname)), 5000);
    const hide = setTimeout(() => setBubble(null), 17000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [mounted, hidden, muted, open, pathname]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function dismissBubble() {
    setBubble(null);
    write(globalThis.sessionStorage, STORE.bubbleSeen, "1");
  }

  function openPanel() {
    dismissBubble();
    setOpen(true);
    dispatch("ACTIVATE");
  }

  function closePanel() {
    setOpen(false);
    dispatch("CANCEL");
    setState("idle");
    launcherRef.current?.focus();
  }

  function push(m: Omit<Msg, "id">) {
    setMessages((prev) => [...prev, { ...m, id: seq.current++ }]);
  }

  /** Fala "encenada" só para o guia pré-escrito: thinking → speaking → idle. */
  function atlasSays(m: Omit<Msg, "id" | "from">) {
    dispatch("SUBMIT");
    window.setTimeout(() => {
      dispatch("REPLY");
      push({ ...m, from: "atlas" });
      window.setTimeout(() => dispatch("DONE"), 900);
    }, 350);
  }

  function askTopic(t: GuideTopic) {
    push({ from: "user", kind: "text", text: t.question });
    atlasSays({ kind: "guide", text: t.answer, link: t.link });
  }

  async function submitDraft(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    push({ from: "user", kind: "text", text });
    if (!adapter.available) {
      atlasSays({ kind: "notice", text: atlasCopy.offline });
      return;
    }
    dispatch("SUBMIT");
    try {
      const reply = await adapter.sendTurn({ sessionRef: "club-web", text });
      dispatch("REPLY");
      push({ from: "atlas", kind: "text", text: reply.text });
      window.setTimeout(() => dispatch("DONE"), 900);
    } catch (err) {
      dispatch("FAIL");
      push({ from: "atlas", kind: "notice", text: err instanceof AtlasUnavailableError ? atlasCopy.offline : "Algo falhou. Tente novamente mais tarde." });
      window.setTimeout(() => dispatch("RESET"), 600);
    }
  }

  function toggleMute() {
    const v = !muted;
    setMuted(v);
    write(globalThis.localStorage, STORE.muted, v ? "1" : null);
    if (v) setBubble(null);
  }

  function hide() {
    setOpen(false);
    setBubble(null);
    setHidden(true);
    write(globalThis.localStorage, STORE.hidden, "1");
  }

  function restore() {
    setHidden(false);
    write(globalThis.localStorage, STORE.hidden, null);
  }

  if (!mounted) return null;

  if (hidden) {
    return (
      <button type="button" className="ca-atlas-pill" onClick={restore}>
        <Icon name="sparkle" size={14} /> Mostrar Atlas
      </button>
    );
  }

  return (
    <div className="ca-atlas" data-open={open || undefined}>
      {bubble && !open && (
        <div className="ca-atlas__bubble" role="status">
          <button type="button" className="ca-atlas__bubble-text" onClick={openPanel}>
            {bubble}
          </button>
          <button type="button" className="ca-atlas__bubble-close" onClick={dismissBubble} aria-label="Fechar mensagem do Atlas">
            <Icon name="close" size={14} />
          </button>
        </div>
      )}

      {open && (
        <div ref={panelRef} id={panelId} className="ca-atlas__panel" role="dialog" aria-modal="false" aria-labelledby={titleId}>
          <header className="ca-atlas__head">
            <AtlasFigure state={state} size={44} />
            <div>
              <h2 id={titleId}>Atlas</h2>
              <p className="ca-atlas__status">
                <span className="ca-atlas__dot" aria-hidden="true" />
                {adapter.available ? "Agente ligado" : "Guia pré-escrito · IA em preparação"}
              </p>
            </div>
            <div className="ca-atlas__tools">
              <button type="button" onClick={toggleMute} aria-pressed={muted} title={muted ? "Reativar mensagens" : "Silenciar mensagens"}>
                <Icon name="chat" size={16} />
                <span className="ca-sr-only">{muted ? "Reativar mensagens automáticas" : "Silenciar mensagens automáticas"}</span>
              </button>
              <button type="button" onClick={hide} title="Ocultar o Atlas">
                <Icon name="eyeOff" size={16} />
                <span className="ca-sr-only">Ocultar o Atlas</span>
              </button>
              <button type="button" onClick={closePanel} data-autofocus title="Fechar">
                <Icon name="close" size={16} />
                <span className="ca-sr-only">Fechar conversa</span>
              </button>
            </div>
          </header>

          <div ref={logRef} className="ca-atlas__log" role="log" aria-live="polite" aria-label="Mensagens">
            {messages.map((m) => (
              <div key={m.id} className={`ca-atlas__msg ca-atlas__msg--${m.from} ca-atlas__msg--${m.kind}`}>
                {m.from === "atlas" && (
                  <span className="ca-atlas__label">{m.kind === "notice" ? "Aviso" : m.kind === "guide" ? "Guia pré-escrito" : "Atlas"}</span>
                )}
                <p>{m.text}</p>
                {m.link && (
                  <Link href={m.link.href} onClick={() => setOpen(false)}>
                    {m.link.label} →
                  </Link>
                )}
              </div>
            ))}
            {state === "thinking" && (
              <div className="ca-atlas__typing" aria-label="O Atlas está a preparar a resposta">
                <span />
                <span />
                <span />
              </div>
            )}
          </div>

          <div className="ca-atlas__topics" role="group" aria-label="Temas do guia">
            {guideTopics.map((t) => (
              <button key={t.id} type="button" onClick={() => askTopic(t)}>
                {t.question}
              </button>
            ))}
          </div>

          <form className="ca-atlas__input" onSubmit={submitDraft}>
            <label htmlFor={`${panelId}-text`} className="ca-sr-only">
              Escrever ao Atlas
            </label>
            <input
              id={`${panelId}-text`}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onFocus={() => dispatch("ACTIVATE")}
              placeholder={adapter.available ? "Escreva ao Atlas…" : "Conversa livre em preparação"}
              maxLength={500}
              autoComplete="off"
            />
            <button type="button" className="ca-atlas__mic" onClick={() => atlasSays({ kind: "notice", text: atlasCopy.voice })} title="Falar com o Atlas (em preparação)">
              <Icon name="mic" size={16} />
              <span className="ca-sr-only">Voz (em preparação, exige autorização)</span>
            </button>
            <button type="submit" className="ca-atlas__send" disabled={!draft.trim()}>
              <Icon name="arrow" size={16} />
              <span className="ca-sr-only">Enviar</span>
            </button>
          </form>
          <p className="ca-atlas__fine">Nada do que escreve aqui é enviado ou guardado nesta versão.</p>
        </div>
      )}

      <button
        ref={launcherRef}
        type="button"
        className="ca-atlas__launcher"
        onClick={() => (open ? closePanel() : openPanel())}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={open ? "Fechar conversa com o Atlas" : "Abrir conversa com o Atlas"}
      >
        <AtlasFigure state={state} size={84} />
      </button>
    </div>
  );
}
