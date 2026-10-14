#!/usr/bin/env bash
# Gera comparações lado a lado (referência | implementação) com ImageMagick.
# Uso: scripts/compare.sh <dir-screenshots> <dir-saida>
set -euo pipefail
S=${1:-design/screenshots/pr1}  # PNG de scripts/screenshots.mjs (antes da conversão para JPG)
O=${2:-design/comparisons/pr1}
R=design/reference
mkdir -p "$O"
pair() { # ref impl crop_geometry_impl out label
  local ref=$1 impl=$2 geo=$3 out=$4 label=$5
  convert "$impl" -crop "$geo" +repage /tmp/_impl.png
  convert "$ref" -resize x900 -background '#050b17' -gravity north -splice 0x40 -fill white -pointsize 22 -annotate +0+8 "REFERÊNCIA — $label" /tmp/_a.png
  convert /tmp/_impl.png -resize x900 -background '#050b17' -gravity north -splice 0x40 -fill '#00d4ff' -pointsize 22 -annotate +0+8 "IMPLEMENTAÇÃO PR1" /tmp/_b.png
  convert /tmp/_a.png /tmp/_b.png -background '#050b17' -splice 20x0 +append -quality 82 "$O/$out"
  rm -f /tmp/_impl.png /tmp/_a.png /tmp/_b.png
}
pair $R/approved/CLUB_ATLAS_TEAM_VALIDADO.png $S/home-desktop-1440-full.png 1440x1240+0+0 01_team-validado_vs_hero.jpg "CLUB_ATLAS_TEAM_VALIDADO"
pair $R/screens/WEB_ECOSISTEMA.png $S/home-desktop-1440-fold.png 1440x900+0+0 02_web-ecossistema_vs_hero.jpg "WEB_ECOSISTEMA (hero)"
pair $R/screens/DESIGN_SYSTEM_BOARD.png $S/sistema-visual-desktop-1440-full.png 1440x1900+0+0 03_design-system_vs_sistema-visual.jpg "DESIGN_SYSTEM_BOARD"
pair $R/legacy_v1.1/01_Landing_Publica_Mobile.png $S/home-mobile-390-full.png 390x1678+0+0 04_legacy-mobile_vs_mobile.jpg "Landing v1.1 mobile"
pair $R/screens/BOARD_UX.png $S/home-desktop-1440-full.png 1440x2400+0+0 05_board-ux_vs_landing.jpg "BOARD_UX (1. Landing)"
pair $R/screens/DASHBOARD_NEON.png $S/home-desktop-1440-fold.png 1440x900+0+0 07_dashboard-neon_vs_hero.jpg "DASHBOARD_NEON (faixa da equipa)"
pair $R/approved/CLUB_ATLAS_TEAM_VALIDADO.png $S/home-mobile-390-fold.png 390x844+0+0 08_team-validado_vs_mobile-fold.jpg "Elenco validado"
# Variantes do CTA principal (gold = padrão; blue = NEXT_PUBLIC_HERO_CTA=blue) — requer $S_BLUE
if [ -n "${S_BLUE:-}" ]; then
  convert "$S/home-desktop-1440-fold.png" -crop 1440x340+0+70 +repage -background '#050b17' -gravity north -splice 0x40 -fill '#ffc857' -pointsize 22 -annotate +0+8 "VARIANTE A — CTA DOURADO (padrão desta revisão)" /tmp/_ga.png
  convert "$S_BLUE/home-desktop-1440-fold.png" -crop 1440x340+0+70 +repage -background '#050b17' -gravity north -splice 0x40 -fill '#00d4ff' -pointsize 22 -annotate +0+8 "VARIANTE B — CTA AZUL ELÉTRICO" /tmp/_gb.png
  convert /tmp/_ga.png /tmp/_gb.png -background '#050b17' -splice 0x20 -append -quality 85 "$O/06_cta-variantes.jpg"
  rm -f /tmp/_ga.png /tmp/_gb.png
fi
echo "Comparações em $O"
