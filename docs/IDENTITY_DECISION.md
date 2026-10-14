# IDENTITY_DECISION — elenco, marca e mascote

**Estado:** PREFERÊNCIA EDITORIAL DO SÉRGIO REGISTADA (revisão PR #11, 14/10/2026) · UI atualizada · migração de IDs/SOULs **não executada** — aguarda homologação de identidade
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

## 1-A. Preferência editorial do Sérgio (revisão PR #11, 14/10/2026)

Elenco do Club: **Sérgio · Lucas · Atlas · Marta · Bia**.

| Figura na arte aprovada | Antes (UI PR1) | Antes (perfil/SOUL) | **Agora (UI)** | Motivo |
|---|---|---|---|---|
| Builder | Lucas | Caio (`club-caio`) | **Lucas** | Mantém rosto e papel builder |
| Mentora de comunidade | Clara | Clara (`club-clara`) | **Marta** | "Clara" fica reservada à Clara CORPORATE (receção global WhatsApp da Holding) |
| Exploradora | Lia | Bia (`club-bia`) | **Bia** | Evita colisão com a LIA do LeveLab |
| Atlas, Sérgio | — | — | sem alteração | — |

Regras: a arte-base aprovada é **imutável** (nomes mudam só em DOM, nunca se retocam rostos); não misturar SOUL/memória da Clara Corporate nem de antigos perfis "Marta" (registos PaperClip históricos, assinalados como legado no Organization Master Notion de 10/10) com a mentora do Club. **Antes de provisionar, confirmar que não existe nenhuma instância ativa chamada "Marta".**

## 2. O que foi feito no PR1 (reversível)

`src/lib/cast.ts` define `displayName` (UI) separado de `profileId` (persistente):

| key (UI) | displayName | profileId (inalterado) | Estado |
|---|---|---|---|
| sergio | Sérgio Monteiro | `null` (pessoa real, sem perfil de agente) | — |
| lucas | Lucas | `club-caio` | `identityPending: true` |
| atlas | Atlas | `club-atlas` | estável |
| marta | Marta | `club-clara` | `identityPending: true` |
| bia | Bia | `club-bia` | `identityPending: true` |

- Retratos recortados **diretamente** da composição aprovada (sem redesenho, sem IA generativa).
- Todos os personagens digitais exibem a etiqueta "Personagem digital"; Sérgio exibe "Pessoa real".
- Idades e biografias pessoais da arte (ex.: "quase 42 anos") **não** foram publicadas; usam-se resumos de função.
- `agents/` não foi tocado. Nenhuma integração usa `displayName` como chave.

**Reversão:** alterar os campos `displayName`/`portraitAlt` em `src/lib/cast.ts` (e os textos de FAQ/mentores), sem impacto em dados.

Guardas automáticas: o teste e2e `sem colisão pública de nomes` falha se "Clara", "Lia" ou "LIA" aparecerem na landing.

## 3. Logótipo institucional vs mascote viva

| Uso | Componente | Regra |
|---|---|---|
| Logótipo corporativo/institucional | `AtlasMark`, `ClubLogo` | Geometria fiel a `ATLAS_HUB_LOGO_FONTE.png` (três peças), **sem rosto**, sem animação de personagem |
| Mascote Atlas (co-mentor do Club) | `AtlasAvatar` | Triângulo 3D expressivo **com rosto**, recortado da arte aprovada; flutuar/brilho suaves; estático com `prefers-reduced-motion`; nunca ativa microfone/câmara |

Pendente: SVG de origem do símbolo (a vetorização atual é manual e provisória) e mascote isolada (PNG transparente/GLB) para animação de qualidade. Algumas maquetes (`COMUNIDADE`, `DASHBOARD_NEON`) mostram a mascote com braços/pose diferente — tratar como variações a aprovar, não como canon.

## 4. Decisões ainda pendentes

1. ~~Casting definitivo~~ → preferência registada (§1-A); falta a **homologação** que autoriza a migração técnica (§5).
2. Confirmar que os retratos recortados da composição podem ser publicados (direitos de imagem do Sérgio e das personagens digitais).
3. Confirmar se o "A" dourado/prismático do wordmark é variante oficial; até lá usa-se o símbolo azul/branco do logo-fonte e **não** se apresenta a variante prismática como identidade oficial.

Até à homologação: **não ligar** Hermes/Telegram/Discord a nenhum destes nomes.

## 5. Mapa de migração técnica (PROPOSTA — não executado)

Executar num PR dedicado, só após homologação, com backup prévio dos SOULs e sem tocar em perfis Hermes ativos (todos estão `not_provisioned`).

| Passo | De | Para | Ficheiros | Reversão |
|---|---|---|---|---|
| 1 | `agents/caio/` · `club-caio` · "Caio" | `agents/lucas/` · `club-lucas` · "Lucas" | `TEAM_MANIFEST.json`, `SOUL.md`, `MISSION.md`, `scripts/stage-hermes-profiles.sh`, `validate-agent-manifest.mjs` | `git revert` do PR |
| 2 | `agents/clara/` · `club-clara` · "Clara" | `agents/marta/` · `club-marta` · "Marta" | idem + remover referência "reconcile existing identity" com a Clara da Holding | idem |
| 3 | `agents/bia/` · `club-bia` · "Bia" | sem renomear (nome mantém-se Bia) | apenas copy/role "exploradora" | — |
| 4 | `profileId` em `src/lib/cast.ts` | novos IDs | UI | idem |
| 5 | Docs: `08_DESIGN_CASTING.md`, `DECISIONS.md`, README | nomes novos | docs | idem |

Pré-condições: (i) confirmar que não há instância ativa "Marta" (PaperClip legado); (ii) confirmar que nenhuma memória/SOUL da Clara Corporate é copiada; (iii) aliases antigos (`club-caio`, `club-clara`) ficam documentados como *retired* durante um ciclo para evitar reutilização acidental do ID.
