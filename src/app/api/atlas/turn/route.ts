import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Ponto de entrada futuro da conversa com o Atlas (agente Hermes do Club).
 * FAIL-CLOSED: sem agente homologado, quotas, consentimento e kill switch, responde 503.
 * Nunca colocar credenciais de IA em variáveis NEXT_PUBLIC_*.
 */
export async function POST() {
  const configured = Boolean(process.env.ATLAS_AGENT_URL && process.env.ATLAS_AGENT_TOKEN);
  if (!configured) {
    return NextResponse.json({ message: "O Atlas conversacional ainda não está ligado." }, { status: 503 });
  }
  // Adaptador Hermes ainda não homologado (Atlas-Avatar-Presence v0.3). Não inventar formato de wire.
  return NextResponse.json({ message: "Integração do agente em homologação." }, { status: 501 });
}
