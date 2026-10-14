# Comparação visual — PR1 (design system + landing)

Capturas com Chromium (Playwright 1.56.1), `prefers-reduced-motion: reduce`, build de produção local. Não se reclama "pixel-perfect": as referências são composições estáticas com copy ilustrativa; a implementação é DOM responsivo.

| Ficheiro | Referência | Implementação |
|---|---|---|
| `01_team-validado_vs_hero.jpg` | `CLUB_ATLAS_TEAM_VALIDADO.png` | `/` 1440 — hero + faixa do elenco + pilares |
| `02_web-ecossistema_vs_hero.jpg` | `WEB_ECOSISTEMA.png` | `/` 1440 — dobra |
| `03_design-system_vs_sistema-visual.jpg` | `DESIGN_SYSTEM_BOARD.png` | `/sistema-visual` 1440 |
| `04_legacy-mobile_vs_mobile.jpg` | `legacy_v1.1/01_Landing_Publica_Mobile.png` | `/` 390 |
| `05_board-ux_vs_landing.jpg` | `BOARD_UX.png` (bloco 1) | `/` 1440 — primeiros 2400 px |
| `06_cta-variantes.jpg` | `DESIGN_SYSTEM_BOARD §05` vs `WEB_ECOSISTEMA` | Hero com CTA dourado (A, padrão) e azul (B) |
| `07_dashboard-neon_vs_hero.jpg` | `DASHBOARD_NEON.png` | `/` 1440 — dobra |
| `08_team-validado_vs_mobile-fold.jpg` | `CLUB_ATLAS_TEAM_VALIDADO.png` | `/` 390 — dobra |

## Revisão do Sérgio (PR #11, 14/10/2026) — o que mudou
- **Primeira dobra:** a intro passou a duas colunas compactas; em 1440×900 a fotografia do elenco e a faixa de nomes ficam dentro da dobra. Em 390×844 a fotografia sobe para o topo (ordem visual por CSS; o H1 continua primeiro no DOM) e os cinco rostos aparecem em retratos de 64 px. Há um teste e2e que verifica isto em desktop e em mobile.
- **Casting na UI:** Sérgio · Lucas · Atlas · Marta · Bia. A arte não foi retocada; só mudam os nomes em DOM. O OG foi regenerado sem os nomes gravados da arte.
- **CTA:** duas variantes comparadas em `06_cta-variantes.jpg`. A **A (dourado/âmbar)** é o padrão desta revisão; a B (azul) ativa-se com `NEXT_PUBLIC_HERO_CTA=blue`. Contraste: dourado 12:1, azul 5,1:1.
- **Laboratório:** nova secção "Da tela vazia ao seu ecossistema vivo." com consola **simulada e rotulada**, Atlas como co-mentor, o caminho primeiro agente → equipe → projeto e os níveis de acesso (Club, Atlas Lab, Genesis), todos com estado honesto.
- **Exemplos:** os 6 casos têm tarefa, evidência e limite humano; os marketplaces aparecem só como cenário fictício.

## Fiel à referência
1. **Rostos e corpo de Sérgio e restantes personagens**: pixels da composição aprovada (recorte direto, sem retoque); proporções e ordem das figuras mantidas (nomes de UI: Sérgio · Lucas · Atlas · Marta · Bia).
2. **Atlas**: mascote 3D com rosto preservada no hero; símbolo institucional sem rosto no header/footer.
3. **Cores**: navy profundo, azul elétrico, ciano, dourado/âmbar dos nomes, papéis e citações manuscritas.
4. **Hierarquia do elenco**: nome (ciano, caixa alta) → papel (dourado) → palavras-chave (itálico) → citação manuscrita, alinhados por personagem como na arte.
5. **Nota manuscrita** "O futuro é um projeto em construção…" sobre a fotografia (desktop) e barra de pilares dourada.

## Divergências intencionais
| Área | Referência | Implementação | Motivo |
|---|---|---|---|
| Topo do hero | Wordmark gigante CLUB ATLAS | H1 com proposta + CTA; wordmark no header | CTA acima da dobra; texto real indexável; o wordmark gigante fica disponível (`ClubLogo variant="wordmark" size="xl"`) |
| Biografias | Idades e biografias pessoais | Resumos de função (só em `/mentores` e cartões) | Minimização de dados pessoais; personagens digitais declarados |
| Copy | "pessoas como tu", "Comunidade ativa" | "pessoas como você", "Comunidade acolhedora" | PT-BR; não afirmar comunidade ativa antes do lançamento |
| Nomes | CLARA, LIA | Marta, Bia | Preferência do Sérgio; evitar colisão com a Clara Corporate e a LIA do LeveLab |
| Etiquetas | — | "Pessoa real" / "Personagem digital" | Transparência obrigatória |
| CTA | "Entrar no Club (Gratuito)" ativo | "Conhecer o laboratório" / "Ver o Genesis"; no header "Como participar" | O endpoint continua fail-closed: não se anuncia captação nem lista de espera |
| Planos/preços (`BOARD_*`) | R$49/99/199 | Ausentes | Não homologados |
| Eventos (`BOARD_*`) | "Inscrições abertas", "09 JAN 2026" | Estados "Em preparação/Previsto", 09/01/2027 | Datas corrigidas; sem vagas |
| Mobile hero | Imagem de partículas (v1.1) | Fotografia 16:10 centrada no Atlas + fila com os 5 retratos e nomes, tudo na 1.ª dobra | Rostos legíveis sem cortar ninguém |
| Botão primário | Dourado no DS board | Dourado por padrão (A), azul em alternativa (B) | Decisão pendente do Sérgio |

## Divergências por resolver (próximos PRs)
- A arte foi exportada a 1672 px de largura: em ecrãs ≥ 1680 px o hero é ligeiramente ampliado. Pedido: exportação 2560 px ou camadas separadas.
- Wordmark: a arte do elenco usa um "A" dourado/prismático; o PR1 usa o símbolo azul/branco do logo-fonte até haver SVG oficial.
- Mascote no `AtlasAvatar` usa recorte com fundo de estúdio mascarado em círculo; uma versão isolada (PNG transparente) melhoraria a integração.
- `DASHBOARD_NEON`, `COMUNIDADE`, `BIBLIOTECA`, `GENESIS` → PR2.

## Acessibilidade verificada (automática)
- axe-core WCAG 2.0/2.1/2.2 A/AA: **0 violações sérias/críticas** em desktop e mobile.
- Contraste: texto secundário 6,6–12,4:1; botões ≥ 5:1; dourado sobre navy 12,8:1.
- Teclado: skip link, foco visível ciano, menu móvel com `aria-expanded`/Escape/retorno de foco, FAQ com `<details>`, carrossel do elenco focável.
- `prefers-reduced-motion`: mascote e pulso do pedestal estáticos (teste e2e).
