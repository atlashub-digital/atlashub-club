# Comparação visual — PR1 (design system + landing)

Capturas com Chromium (Playwright 1.56.1), `prefers-reduced-motion: reduce`, build de produção local. Não se reclama "pixel-perfect": as referências são composições estáticas com copy ilustrativa; a implementação é DOM responsivo.

| Ficheiro | Referência | Implementação |
|---|---|---|
| `01_team-validado_vs_hero.jpg` | `CLUB_ATLAS_TEAM_VALIDADO.png` | `/` 1440 — hero + faixa do elenco + pilares |
| `02_web-ecossistema_vs_hero.jpg` | `WEB_ECOSISTEMA.png` | `/` 1440 — dobra |
| `03_design-system_vs_sistema-visual.jpg` | `DESIGN_SYSTEM_BOARD.png` | `/sistema-visual` 1440 |
| `04_legacy-mobile_vs_mobile.jpg` | `legacy_v1.1/01_Landing_Publica_Mobile.png` | `/` 390 |
| `05_board-ux_vs_landing.jpg` | `BOARD_UX.png` (bloco 1) | `/` 1440 — primeiros 2400 px |

## Fiel à referência
1. **Rostos e corpo de Sérgio e restantes personagens**: pixels da composição aprovada (recorte direto, sem retoque); proporções e ordem Sérgio · Lucas · Atlas · Clara · Lia mantidas.
2. **Atlas**: mascote 3D com rosto preservada no hero; símbolo institucional sem rosto no header/footer.
3. **Cores**: navy profundo, azul elétrico, ciano, dourado/âmbar dos nomes, papéis e citações manuscritas.
4. **Hierarquia do elenco**: nome (ciano, caixa alta) → papel (dourado) → palavras-chave (itálico) → citação manuscrita, alinhados por personagem como na arte.
5. **Notas manuscritas** nos cantos ("Pessoas · Ideias · Agentes · Resultados reais" / "O futuro é um projeto em construção…") e barra de pilares dourada.

## Divergências intencionais
| Área | Referência | Implementação | Motivo |
|---|---|---|---|
| Topo do hero | Wordmark gigante CLUB ATLAS | H1 com proposta + CTA; wordmark no header | CTA acima da dobra; texto real indexável; o wordmark gigante fica disponível (`ClubLogo variant="wordmark" size="xl"`) |
| Biografias | Idades e biografias pessoais | Resumos de função (só em `/mentores` e cartões) | Minimização de dados pessoais; personagens digitais declarados |
| Copy | "pessoas como tu", "Comunidade ativa" | "pessoas como você", "Comunidade acolhedora" | PT-BR; não afirmar comunidade ativa antes do lançamento |
| Etiquetas | — | "Pessoa real" / "Personagem digital" | Transparência obrigatória |
| CTA | "Entrar no Club (Gratuito)" ativo | Mesmo texto → `/participar` com aviso "inscrições em preparação" | Registo ainda fail-closed |
| Planos/preços (`BOARD_*`) | R$49/99/199 | Ausentes | Não homologados |
| Eventos (`BOARD_*`) | "Inscrições abertas", "09 JAN 2026" | Estados "Em preparação/Previsto", 09/01/2027 | Datas corrigidas; sem vagas |
| Mobile hero | Imagem de partículas (v1.1) | Composição completa (5 rostos, ~92 px de altura) + carrossel de retratos | Não cortar rostos; retratos legíveis no carrossel |
| Botão primário | Dourado no DS board | Azul (ação principal) + dourado (destaque) | Coerência com `WEB_ECOSISTEMA`; ver `design/README.md` |

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
