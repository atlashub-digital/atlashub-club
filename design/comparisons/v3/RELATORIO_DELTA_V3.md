# Relatório de diferenças vs Premium v3 — fecho visual do PR #11

**Referências:**
- Fonte editável v3 (`design/handoff/premium-v3/`, 9 ficheiros do Drive), renderizada localmente em Chromium a 1440/768/390.
- Imagem conceito `design/reference/v2/LANDING_V3_CONCEITO_DESKTOP.png`.
- Composição de equipa aprovada (`design/reference/approved/CLUB_ATLAS_TEAM_VALIDADO.png`).

**Limitação:** os `assets/` e `screenshots/` do ZIP v3 não foram recebidos. Por isso, os renders da maquete aparecem sem imagens (caixas vazias com o texto `alt`). Comparam-se composição, tipografia, cor e microcopy, não fotografia.

## Ficheiros
- `home-*.jpg`, `participar-*.jpg`, `genesis-*.jpg`, `area-membro-*.jpg`: maquete v3 (esquerda) vs implementação (direita), 1.º ecrã, em `desktop-1440`, `tablet-768` e `mobile-390`.
- `design/screenshots/v3/`: páginas completas (`*-fold`, `*-full`) e estados:
  - `participar-genesis-estudante-*`, `participar-revisao-*`;
  - `participar-menor-dados-*`, `participar-menor-concluido-*` (fluxo `pending_guardian_review`);
  - `atlas-recolhido-hero-*`, `atlas-painel-*`, `atlas-balao-desktop-1440`.

## Já alinhado com a v3
| Elemento | Estado |
|---|---|
| H1 "Pessoas reais. Agentes próprios. Projetos vivos." (branco · ciano · dourado, caixa alta visual) | ✔ |
| Frase complementar "O futuro se constrói por pessoas como você." | ✔ (linha manuscrita sob o H1) |
| Eyebrow "Club Atlas · comunidade aberta e laboratório experimental" | ✔ |
| Lead v3 | ✔ |
| Faixa de 4 pilares (`.hero-foot`) | ✔ (no mobile vem depois da intro) |
| CTA principal dourado; secundário outline azul/ciano | ✔ |
| **Laboratório Experimental logo a seguir ao hero** ("Da tela vazia ao seu ecossistema vivo", percurso agente → equipe → projeto, consola de simulação) | ✔ subiu para 2.ª secção, como na ordem v3 |
| Oferta: Club grátis · Genesis R$ 490 / R$ 190 estudante elegível · 8 semanas · 24 ateliers · 09/01/2027 | ✔ |
| Elenco Sérgio · Lucas · Atlas · Marta · Bia, rostos e Avatar da arte aprovada | ✔ sem alterações |

## Diferenças que se mantêm (por decisão ou dependência)
1. **Escala e largura do H1.** Na v3, o H1 ocupa a largura total com até 85 px, e o lead e os CTAs ficam numa linha por baixo. Isto empurra a fotografia da equipa para baixo do 1.º ecrã: na v3 a banda começa aos ~590 px. A implementação mantém o requisito validado na revisão §B — **equipa e Atlas completos no 1.º ecrã a 1440×900** — com o H1 numa coluna (até 56 px). *Decisão pendente:* trocar a regra da 1.ª dobra pelo H1 gigante.
2. **Banda da equipa.** A v3 tem uma banda de 375 px com cantos arredondados e nomes sobrepostos. A implementação mantém a fotografia a toda a largura e os cartões em DOM (nome, papel, citação, "Pessoa real"/"Personagem digital"), tal como validado.
3. **Papéis.** A v3 usa "Builder digital · Co-mentor digital · Comunidade digital · Exploradora digital"; a implementação mantém "O Builder · O Engenheiro-chefe · Mentora de comunidade · A Exploradora".
4. **Marca no cabeçalho.** A v3 tem "CLUB **ATLAS** (dourado) / BY ATLASHUB.SI" com o PNG original; a implementação usa o vetor institucional sem rosto, em branco. O SVG oficial do símbolo continua pendente.
5. **Navegação e rótulos.**
   - Menu: a v3 tem 4 itens + "Área de membros · demo" + "Fazer parte"; a implementação tem 7 itens + "Entrar no Club".
   - CTAs do hero: a v3 diz "Entrar no Club · grátis" / "Explorar o Genesis"; a implementação segue a SPEC v2 ("Entrar no Club gratuitamente" / "Conhecer o Genesis").
6. **/participar.**
   - A v3 tem o título "Este é o seu ponto de partida.", cartões de escolha lado a lado e uma sidebar com o preço em grande.
   - A implementação mantém o formulário validado: radios grandes, resumo lateral, resumo de erros acessível e o novo fluxo de menores.
   - Diferenças de campos face à v3:
     - a v3 pede "Nome completo", "Perfil" e "Cidade"; aqui são "Nome" e faixa etária, mais o WhatsApp opcional só para adultos (dados mínimos da SPEC);
     - a v3 não tem faixa etária.
7. **/genesis.** A v3 tem o H1 "GENESIS." com a métrica 08/24/01 e os CTAs "Quero participar" / "Quero a condição estudante". A implementação mantém "Pré-inscrição (prévia)" e textos sem promessa de inscrição, porque não há captação real.
8. **/area-membro.** A v3 usa o nome fictício "Ana" e uma barra de progresso de 25 % rotulada "ilustrativo". A implementação mantém a Missão 001 a 0/4 e nenhuma métrica, seguindo a regra de não inventar progresso.
9. **Tokens.** A v3 tem `--gold #edb463` e `--cyan #60d9f6`, mais suaves; a implementação mantém `#ffc857` e `#00d4ff`, já validados para contraste AA em todo o site.
10. **"Online e presencial conforme agenda"** (pilar v3). Foi adotado tal como está na fonte; falta confirmar o formato presencial.

## Atlas companion
- Em mobile e tablet (≤ 900 px), o lançador **recolhe-se** quando há um CTA, campo ou link por baixo, ou enquanto um campo do formulário está em foco (teclado aberto).
- Volta quando a zona fica livre e continua acessível por teclado: ao receber foco, reaparece.
- Os testes confirmam que os CTAs do hero ficam clicáveis a 390 px.
- O painel mantém a etiqueta "Guia pré-escrito · IA em preparação".
- Desktop: sem alteração.

## QA
- `npm run verify` ✔ — agents:validate, content:check, typecheck, build.
- Playwright: **58 passados**, 8 ignorados (testes exclusivos de um projeto), em desktop 1440 e Pixel 7. Inclui:
  - axe WCAG 2.2 AA, reduced-motion e 1.ª dobra;
  - percursos gratuito, Genesis, estudante e **menor em `pending_guardian_review`** (sem pedidos `/api`);
  - Atlas sem tapar CTAs e campos.

## Reversão
Fazer `git revert` dos commits deste fecho. A `main` e a produção não foram tocadas.
