# IDENTITY_DECISION — elenco, marca e mascote

**Estado:** PROPOSTA · aguarda decisão de Sérgio Monteiro · 14/10/2026
**Âmbito:** nomes exibidos na UI, IDs persistentes, perfis Hermes, logótipo vs mascote.
**Nada neste documento renomeia perfis, SOULs, IDs ou integrações.** Apenas regista o mapeamento provisório usado pela interface pública (PR1) e pede uma decisão.

## 1. Conflito de casting

| Fonte | Membro 1 | Membro 2 | Membro 3 | Membro 4 | Membro 5 |
|---|---|---|---|---|---|
| Arte aprovada `CLUB_ATLAS_TEAM_VALIDADO.png` (prioridade visual máxima) | Sérgio Monteiro — mentor humano | **Lucas** — o builder | Atlas — engenheiro-chefe | Clara — mentora de comunidade | **Lia** ("LIA") — a exploradora |
| `agents/TEAM_MANIFEST.json` + `agents/*/SOUL.md` (main) | — (humano, sem perfil) | `club-caio` — **Caio**, builder educator | `club-atlas` | `club-clara` | `club-bia` — **Bia**, newcomer explorer |
| `docs/08_DESIGN_CASTING.md`, Drive `CASTING_BIBLIA_v1.0.md` | Sérgio | Caio (~30 anos) | Atlas (sem rosto no símbolo) | Clara | Bia (~20 anos) |
| `WEB_ECOSISTEMA.png` | Sérgio | rótulo **CAIO** sobre o rosto do Lucas | Atlas | Clara | rótulo **LIA** |
| `BOARD_ECOSISTEMA.png` (landing antiga) | Sérgio (rosto diferente do aprovado) | rótulo CAIO | Atlas | Clara | rótulo **BIA** |
| `DASHBOARD_NEON.png`, `GENESIS.png`, `COMUNIDADE.png`, `BIBLIOTECA.png` | Sérgio | Lucas | Atlas | Clara | Lia |

Observações:
- A maioria das maquetes recentes usa **Lucas/Lia**; só `WEB_ECOSISTEMA` mistura (CAIO + LIA).
- O nome **LIA** é usado noutro projeto AtlasHub (LeveLab). Risco de confusão de marca/identidade de agente.
- `BOARD_ECOSISTEMA.png` mostra um Sérgio com rosto diferente da composição aprovada → **não usar** como referência de rosto.

## 2. O que foi feito no PR1 (reversível)

`src/lib/cast.ts` define `displayName` (UI) separado de `profileId` (persistente):

| key (UI) | displayName | profileId (inalterado) | Estado |
|---|---|---|---|
| sergio | Sérgio Monteiro | `null` (pessoa real, sem perfil de agente) | — |
| lucas | Lucas | `club-caio` | **provisório — `identityPending: true`** |
| atlas | Atlas | `club-atlas` | estável |
| clara | Clara | `club-clara` | estável (reconciliar com Clara da Holding) |
| lia | Lia | `club-bia` | **provisório — `identityPending: true`** |

- Retratos recortados **diretamente** da composição aprovada (sem redesenho, sem IA generativa).
- Todos os personagens digitais exibem a etiqueta "Personagem digital"; Sérgio exibe "Pessoa real".
- Idades e biografias pessoais da arte (ex.: "quase 42 anos") **não** foram publicadas; usam-se resumos de função.
- `agents/` não foi tocado. Nenhuma integração usa `displayName` como chave.

**Reversão:** alterar dois campos `displayName` em `src/lib/cast.ts` (e `alt`), sem impacto em dados.

## 3. Logótipo institucional vs mascote viva

| Uso | Componente | Regra |
|---|---|---|
| Logótipo corporativo/institucional | `AtlasMark`, `ClubLogo` | Geometria fiel a `ATLAS_HUB_LOGO_FONTE.png` (três peças), **sem rosto**, sem animação de personagem |
| Mascote Atlas (co-mentor do Club) | `AtlasAvatar` | Triângulo 3D expressivo **com rosto**, recortado da arte aprovada; flutuar/brilho suaves; estático com `prefers-reduced-motion`; nunca ativa microfone/câmara |

Pendente: SVG de origem do símbolo (a vetorização atual é manual e provisória) e mascote isolada (PNG transparente/GLB) para animação de qualidade. Algumas maquetes (`COMUNIDADE`, `DASHBOARD_NEON`) mostram a mascote com braços/pose diferente — tratar como variações a aprovar, não como canon.

## 4. Decisões pedidas ao Sérgio (bloqueiam apenas integrações de agentes)

1. **Casting definitivo:** (a) adotar Lucas/Lia também nos perfis (renomear `club-caio`→`club-lucas`, `club-bia`→`club-lia` num PR próprio, com backup dos SOULs); (b) manter Caio/Bia como identidades técnicas e Lucas/Lia só como nomes de UI; ou (c) outro nome para "Lia" por causa do LeveLab. **Recomendação:** (a) com nome alternativo para Lia só se o conflito LeveLab for real.
2. Confirmar que os retratos recortados da composição podem ser publicados (direitos de imagem do Sérgio e das personagens digitais).
3. Confirmar se o "A" dourado do wordmark (arte do elenco) é variante oficial ou só peça de campanha; o PR1 usa o símbolo azul/branco do logo-fonte.

Até haver decisão: **não ligar** Hermes/Telegram/Discord a aliases Lucas/Lia.
