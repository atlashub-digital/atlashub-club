# Delta vs Premium v3 — alinhamento de hero/copy/CTA (diretiva PR #11, 14/10/2026)

Referência visual usada: `design/reference/v2/LANDING_V3_CONCEITO_DESKTOP.png` (imagem enviada no chat).
O ZIP `Club_Atlas_Maquetes_Premium_v3_CANDIDATO.zip` **não foi recebido**; nada aqui presume o seu conteúdo.

## Alterado neste commit
| Item | Antes | Depois |
|---|---|---|
| H1 | "O futuro se constrói por pessoas como você." | "Pessoas reais. / Agentes próprios. / Projetos vivos." (branco frio · ciano · dourado, uma linha cada) |
| Linha de apoio | — | "O futuro se constrói por pessoas como você." (manuscrita, abaixo do H1) |
| `<title>` | "Club Atlas — O futuro se constrói…" | "Club Atlas — Pessoas reais. Agentes próprios. Projetos vivos." |
| CTA primário | dourado (já) | dourado mantido; secundário outline azul/ciano |
| Casting | Sérgio·Lucas·Atlas·Marta·Bia | inalterado (a v3 mostra "Clara" — reservado ao corporate, não usado) |
| Handoff | SPEC em falta | `01_SPEC_FUNCIONAL_ADESAO_E_GENESIS.md` copiado do Drive |

Módulos funcionais aprovados (formulário de adesão, ofertas, Genesis, área-membro, Atlas companion, endpoints fail-closed) **não foram tocados**.

## Diferenças que permanecem face à v3 (para decisão)
1. **Composição do hero:** a v3 sobrepõe texto à fotografia (texto à esquerda, elenco à direita, numa só faixa). A implementação mantém intro em duas colunas + faixa de equipa com nomes/papéis em DOM (aprovado na revisão §B). Mudar exige nova homologação.
2. **H1 em maiúsculas** na v3; aqui em caixa mista (legibilidade, leitores de ecrã). Trivial de mudar via CSS se preferido.
3. **Eyebrow** v3 "Club Atlas — comunidade aberta e laboratório experimental" vs tagline "Aprender · Construir · Crescer · Realizar".
4. **Lead** v3 ("Para quem acredita que o futuro não se espera…") vs lead do copy v2. Mantido o v2 até validação do texto v3 completo.
5. **Faixa de 4 pilares sob os CTAs** (v3) — não adicionada: "Online e presencial conforme agenda" é um claim operacional não confirmado.
6. **Header:** a v3 tem "Explorar o Genesis" como botão secundário e menu O Clube/Laboratório/Genesis/Comunidade/Projetos Reais; mantida a navegação atual.
7. **Rótulos de CTA:** v3 "Entrar no Clube Grátis"/"Explorar o Genesis"; SPEC "Entrar gratuitamente"/"Conhecer Genesis"; implementação "Entrar no Club gratuitamente"/"Conhecer o Genesis". Na /genesis a SPEC propõe "Quero pré-inscrever-me" — mantido "Pré-inscrição (prévia)" enquanto não há captação real.
8. **Blocos abaixo da dobra** (Atlas Lab "Da tela vazia…", "A sua ideia encontra outras ideias", "Entre gratuitamente. Cresça com o Genesis.") existem com conteúdo equivalente em secções próprias, não no layout compacto da v3.

## QA
- 1440/768/390: `design/screenshots/v3/`; comparações em `design/comparisons/v3/` (01 v3 vs hero, 02/03 antes vs depois).
- Playwright 48 passed / 2 skipped (desktop + Pixel 7), incl. axe WCAG 2.2 AA sem violações sérias/críticas, reduced-motion, equipa na 1.ª dobra.
- Atlas companion a 390 px: o lançador (canto inferior direito) toca a borda do botão secundário na 1.ª dobra, sem cobrir texto nem o alvo do clique; pode ser ocultado pelo utilizador. Risco baixo, não crítico.

## Riscos
- O H1 novo muda o título de partilha; OG image continua a versão sem texto (sem impacto).
- Diferenças 1–8 dependem da leitura do ZIP v3 para fidelidade final.

## Reversão
`git revert <este commit>` no branch; nada em produção foi alterado (main intacto, PR em draft).
