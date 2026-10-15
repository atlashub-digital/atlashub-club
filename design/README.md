# design/ — fontes visuais do Club Atlas

Pasta de referência para engenharia. **Não é servida pela web** (só `public/` é público); os originais ficam aqui intactos.

| Pasta | Conteúdo | Autoridade |
|---|---|---|
| `reference/approved/` | `CLUB_ATLAS_TEAM_VALIDADO.png` (elenco validado), `ATLAS_HUB_LOGO_FONTE.png`, `ATLAS_LOGO_ENERGIA.png` | **Aprovado pelo owner** — prioridade máxima |
| `reference/screens/` | Boards e ecrãs recentes (landing, dashboard, comunidade, biblioteca, Genesis, design system) | Direção visual; nomes, datas, preços e métricas são **ilustrativos** |
| `reference/legacy_v1.1/` | Maquetes HTML/PNG v1.1 | Auxiliar (hierarquia, mobile, estados) |
| `handoff/` | Prompt master, auditoria Drive/GitHub, reconciliação, manifesto original | Especificação da missão |
| `assets/manifest.json` | Originais + derivados com SHA-256, recortes e estado | Rastreabilidade |
| `screenshots/pr1/` | Capturas da implementação (1440×900, 768×1024, 390×844; fold e página inteira) | Evidência do PR |
| `comparisons/pr1/` | Referência × implementação lado a lado + relatório de divergências | Evidência do PR |

## Regras
1. Rostos e personagens vêm **só** de `reference/approved/`. Nada de redesenhar, gerar ou "melhorar" rostos.
2. Imagens são mídia; texto, CTA, menus e cartões são DOM acessível.
3. Logótipo institucional (`AtlasMark`, sem rosto) ≠ mascote viva (`AtlasAvatar`, com rosto).
4. Não copiar preços, métricas, vagas, testemunhos ou datas das maquetes. `npm run content:check` falha se aparecerem.

## Derivados (`public/assets/club/`)
Recortes diretos da composição aprovada, WebP q88; `next/image` entrega AVIF/WebP redimensionados. Caixas de recorte em `assets/manifest.json`. Regenerar: ver o script descrito no manifesto (PIL `crop` + `save`).

## Divergências entre boards (decididas no PR1)
- Botão primário: em avaliação. Variante A **dourada** (`DESIGN_SYSTEM_BOARD §05`, padrão) e variante B **azul elétrico** (`WEB_ECOSISTEMA`) via `NEXT_PUBLIC_HERO_CTA=blue`; comparação em `comparisons/pr1/06_cta-variantes.jpg`.
- Fundo: board indica `#0A0F1A`/`#0A0F1F`; usado `#050B17` (mais profundo, mais próximo das fotos) — token `--ca-bg`.
- Azul elétrico `#007BFF` com texto branco dá 3,98:1 (falha AA); botões usam `--ca-electric-ui #0066EE` (5,08:1) em gradiente com `#0B3BFF`.

## Ferramentas
```bash
npm run build && npx next start -p 3000 &
node scripts/screenshots.mjs design/screenshots/pr1 / /mentores /sistema-visual
scripts/compare.sh design/screenshots/pr1 design/comparisons/pr1   # requer ImageMagick
```

## Assets pendentes (pedido ao owner)
SVG de origem do símbolo/wordmark · retratos individuais em alta resolução · mascote Atlas isolada (PNG transparente/GLB) · confirmação de direitos de imagem.
