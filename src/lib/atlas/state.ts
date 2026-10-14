/**
 * Máquina de estados da presença Atlas — porta TypeScript de
 * atlashub-digital/Atlas-Avatar-Presence `src/core/state.mjs` (contrato AAP v1, estados de
 * `contracts/avatar-event.schema.json`). Pura: não toca em microfone, câmara, renderer nem rede.
 */
export const ATLAS_STATES = ["idle", "listening", "thinking", "speaking", "paused", "error"] as const;
export type AtlasState = (typeof ATLAS_STATES)[number];
export type AtlasEvent = "ACTIVATE" | "SUBMIT" | "REPLY" | "DONE" | "CANCEL" | "PAUSE" | "RESUME" | "FAIL" | "RESET";

const NEXT: Record<AtlasState, Partial<Record<AtlasEvent, AtlasState>>> = {
  idle: { ACTIVATE: "listening", SUBMIT: "thinking", PAUSE: "paused", FAIL: "error" },
  listening: { SUBMIT: "thinking", CANCEL: "idle", PAUSE: "paused", FAIL: "error" },
  thinking: { REPLY: "speaking", CANCEL: "idle", PAUSE: "paused", FAIL: "error" },
  speaking: { DONE: "idle", CANCEL: "idle", PAUSE: "paused", FAIL: "error" },
  paused: { RESUME: "idle", FAIL: "error" },
  error: { RESET: "idle", PAUSE: "paused" },
};

/** Transição permitida ou o estado atual (a UI nunca rebenta por um evento fora de ordem). */
export function nextState(current: AtlasState, event: AtlasEvent): AtlasState {
  return NEXT[current]?.[event] ?? current;
}

export function canTransition(current: AtlasState, event: AtlasEvent): boolean {
  return Boolean(NEXT[current]?.[event]);
}
