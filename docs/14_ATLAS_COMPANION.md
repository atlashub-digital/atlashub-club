# Atlas Companion — MVP e arquitetura

**Estado:** MVP visual e de interação (PR2A). Sem IA, sem voz, sem microfone. Integração real só na PR6, com aprovação do Sérgio e da Helena.

## O que existe
| Peça | Ficheiro | Notas |
|---|---|---|
| Presença flutuante + balões | `src/components/atlas/AtlasCompanion.tsx` | Balão contextual por rota, 1×/sessão, silenciável; pode ser ocultado ("Mostrar Atlas" repõe) |
| Renderer | `src/components/atlas/AtlasFigure.tsx` | PNG transparente aprovado + animação CSS por estado (idle/listening/thinking/speaking/error); estático com reduced-motion |
| Máquina de estados | `src/lib/atlas/state.ts` | Porta de `Atlas-Avatar-Presence/src/core/state.mjs` (contrato AAP v1) |
| Porta de conversa | `src/lib/atlas/adapter.ts` | `AgentAdapter.sendTurn` do AAP-CONTRACT-001; adaptador **offline** por defeito; HTTP só com `NEXT_PUBLIC_ATLAS_CHAT=on` |
| Endpoint servidor | `src/app/api/atlas/turn/route.ts` | **Fail-closed**: 503 sem `ATLAS_AGENT_URL`/`ATLAS_AGENT_TOKEN`; 501 enquanto o adaptador Hermes não estiver homologado |
| Guia pré-escrito | `src/lib/atlas/guide.ts` | Respostas fixas, sempre rotuladas "Guia pré-escrito" na UI |

## Regras respeitadas
- Nunca simula respostas de IA: texto livre recebe um **aviso** de que a conversa ainda não está ligada.
- Microfone: `getUserMedia` nunca é chamado; o botão de voz só explica o consentimento futuro (teste e2e garante).
- Credenciais de IA nunca em `NEXT_PUBLIC_*`; o browser só fala com `/api/atlas/turn`.
- Nada do que se escreve no painel é enviado ou guardado; só preferências (oculto/silenciado) ficam em `localStorage`.

## Evolução prevista (sem retrabalho)
1. **GLB 3D**: novo renderer `AtlasFigure3D` com a mesma interface `{ state, size }`, carregado com `next/dynamic` só quando o modelo `.glb` existir (React Three Fiber entra como dependência nesse PR, não antes).
2. **Conversa real (PR6)**: adaptador Hermes no servidor (`/api/atlas/turn`) seguindo o contrato AAP; quotas, rate limit, kill switch e logs sem PII; ligar `NEXT_PUBLIC_ATLAS_CHAT=on` só em staging primeiro.
3. **Voz**: STT/TTS pertencem ao Hermes (ADR-0002 do AAP: um só dono de áudio). O companion só reflete o estado do microfone, após consentimento explícito.
4. **Dashboard**: o mesmo componente acompanha membros com contexto da Missão 001 quando houver Auth (PR3).
