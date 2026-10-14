# Delta vs Premium v3: alinhamento de hero/copy/CTA (diretiva PR #11, 14/10/2026)

**Referências usadas:**
- Fonte editável v3, copiada do Drive para `design/handoff/premium-v3/`: `index.html`, `design.css` e o resto do pack (ver `PROVENIENCIA.md`).
- Imagem conceito `design/reference/v2/LANDING_V3_CONCEITO_DESKTOP.png`.

**Não recebidos:** os `assets/` e `screenshots/` do ZIP v3. Não se presume o seu conteúdo. A fotografia continua a ser a arte aprovada.

## Alterado (commits a7c6e79, f4d794a e seguinte)
| Item | Antes | Depois | Fonte v3 |
|---|---|---|---|
| Eyebrow | "Aprender · Construir · Crescer · Realizar" | "Club Atlas · comunidade aberta e laboratório experimental", com traço dourado | `.stamp` |
| H1 | "O futuro se constrói por pessoas como você." | **PESSOAS REAIS. / AGENTES PRÓPRIOS. / PROJETOS VIVOS.**, em branco, ciano e dourado. A caixa alta é só visual (`text-transform`); o DOM fica em caixa mista para leitores de ecrã | `.hero-title` |
| Linha de apoio | — | "O futuro se constrói por pessoas como você." (manuscrita) | diretiva do Sérgio |
| Lead | copy v2 | "Para quem acredita que o futuro não se espera: constrói-se. Comece gratuitamente, conheça pessoas, desenvolva seu primeiro agente e descubra como criar um ecossistema de inteligência que cresce com você." | `.lead` |
| Faixa de pilares | — | Uma comunidade · Sem programação · Online e presencial · Aprender construindo | `.hero-foot` |
| `<title>` | "O seu agente. O seu laboratório…" | "Club Atlas — Pessoas reais. Agentes próprios. Projetos vivos." | — |
| CTA | dourado primário | mantido; o secundário é outline azul/ciano | `.btn.gold` / `.btn.ghost` |
| Handoff | SPEC em falta | `01_SPEC…` e os 9 ficheiros v3 copiados para o branch | — |

**Não foram tocados:**
- o formulário de adesão, as ofertas, `/genesis` e a área-membro;
- o Atlas companion;
- os endpoints fail-closed;
- o casting (Sérgio·Lucas·Atlas·Marta·Bia).

## Diferenças que permanecem face à v3 (para decisão)
1. **Faixa da equipa.** A v3 tem uma banda de 375 px de altura, com cantos arredondados e nomes sobrepostos. A implementação mantém a imagem a toda a largura e cartões em DOM com nome, papel, citação e a etiqueta "Pessoa real"/"Personagem digital", tal como aprovado na revisão §B.
2. **Papéis.** A v3 usa "Builder digital · Co-mentor digital · Comunidade digital · Exploradora digital"; a implementação mantém os papéis já aprovados ("O Builder", "O Engenheiro-chefe", "Mentora de comunidade", "A Exploradora"). Mudar isto afeta `src/lib/cast.ts`, que é o mapa de identidades, por isso fica para decisão.
3. **Rótulos de CTA.**
   - Hero: a v3 diz "Entrar no Club · grátis" / "Explorar o Genesis"; a implementação diz "Entrar no Club gratuitamente" / "Conhecer o Genesis", alinhado com a SPEC v2.
   - Cabeçalho: a v3 diz "Fazer parte"; a implementação diz "Entrar no Club".
4. **Navegação.** A v3 tem O Club · Laboratório · Genesis · Comunidade + "Área de membros · demo"; a implementação tem 7 entradas.
5. **Ordem das secções abaixo da dobra.** A v3 segue Lab → "A sua ideia encontra outras ideias" → ofertas → pergunta. A implementação tem as mesmas secções, mas a ordem e a densidade são as já aprovadas.
6. **/genesis.** A v3 tem os CTAs "Quero participar" e "Quero a condição estudante" e a nota "Economia de R$ 300". Mantidos "Pré-inscrição (prévia)" e os textos atuais, por não haver captação real; o `content:check` só autoriza R$ 490/R$ 190.
7. **Tokens.** A paleta v3 (`--gold #edb463`, `--cyan #60d9f6`) é ligeiramente mais suave do que os tokens atuais (`#ffc857`, `#00d4ff`). Não alterei os tokens globais para não mexer no contraste AA já validado em todo o site.
8. **Claim "Online e presencial conforme agenda".** Vem da fonte v3 do Sérgio e foi adotado tal como está. Se o formato presencial ainda não estiver confirmado, convém rever.

## QA
- 1440/768/390: `design/screenshots/v3/`. Comparações: `01_v3_vs_hero.jpg`, `02_antes_vs_depois_desktop.jpg`, `03_antes_vs_depois_mobile.jpg`.
- Playwright: 48 passados e 2 ignorados, em desktop e Pixel 7. Inclui:
  - axe WCAG 2.2 AA sem violações sérias nem críticas;
  - reduced-motion;
  - equipa e Atlas na 1.ª dobra;
  - verificação do eyebrow e da faixa de pilares.
- Mobile 390: a ordem é foto → retratos → eyebrow → H1 → apoio → lead → CTAs, com os dois CTAs visíveis na 1.ª dobra. A faixa de pilares vem depois da intro.
- Atlas companion a 390 px: o lançador toca a borda direita do botão secundário, sem cobrir o texto nem o alvo de clique, e pode ser ocultado. Não é crítico.

## Riscos
- A caixa alta reduz ligeiramente a legibilidade em mobile. O tamanho foi ajustado para 1.8rem e cabe sem cortar a 390 px.
- O lead v3 usa "constrói-se", uma construção mais PT-PT numa página PT-BR. Mantido por fidelidade à fonte do Sérgio.

## Reversão
`git revert` dos commits do hero no branch. Nada em produção foi alterado: a main está intacta e o PR continua em draft.
