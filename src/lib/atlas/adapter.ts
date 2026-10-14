/**
 * Porta de conversa do Atlas — segue `AgentAdapter.sendTurn({sessionRef,text,signal})` do
 * contrato AAP-CONTRACT-001 (Atlas-Avatar-Presence/docs/04-contracts.md).
 *
 * Hoje só existe o adaptador OFFLINE: não há agente Hermes do Club homologado, logo o Atlas
 * não "responde" a texto livre. O adaptador HTTP fala com /api/atlas/turn (servidor), que é
 * fail-closed — credenciais de IA nunca chegam ao browser.
 */
export type AtlasTurn = { sessionRef: string; text: string; signal?: AbortSignal };
export type AtlasReply = { text: string };

export interface AtlasAgentAdapter {
  readonly kind: "offline" | "http";
  readonly available: boolean;
  sendTurn(turn: AtlasTurn): Promise<AtlasReply>;
}

export class AtlasUnavailableError extends Error {
  constructor(message = "atlas_agent_unavailable") {
    super(message);
    this.name = "AtlasUnavailableError";
  }
}

export function createOfflineAdapter(): AtlasAgentAdapter {
  return Object.freeze({
    kind: "offline" as const,
    available: false,
    async sendTurn(): Promise<AtlasReply> {
      throw new AtlasUnavailableError();
    },
  });
}

export function createHttpAdapter(endpoint = "/api/atlas/turn"): AtlasAgentAdapter {
  return Object.freeze({
    kind: "http" as const,
    available: true,
    async sendTurn({ sessionRef, text, signal }: AtlasTurn): Promise<AtlasReply> {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ schema_version: "1.0", session_ref: sessionRef, text }),
        signal,
      });
      if (!res.ok) throw new AtlasUnavailableError(`http_${res.status}`);
      const data = (await res.json()) as { text?: unknown };
      if (typeof data.text !== "string") throw new AtlasUnavailableError("invalid_reply");
      return { text: data.text };
    },
  });
}

/** Seleção por flag de build. Só ativar quando o backend estiver homologado (PR6). */
export function createAtlasAdapter(): AtlasAgentAdapter {
  return process.env.NEXT_PUBLIC_ATLAS_CHAT === "on" ? createHttpAdapter() : createOfflineAdapter();
}
