#!/usr/bin/env bash
# Comparações do handoff v2 (maquetes enviadas no chat a 14/10) vs implementação.
set -euo pipefail
S=${1:?dir screenshots (png)}; T=${2:?dir estados (png)}; O=${3:-design/comparisons/v2}
R=design/reference/v2
mkdir -p "$O"
pair() { local ref=$1 impl=$2 geo=$3 out=$4 label=$5 h=${6:-900}
  convert "$impl" -crop "$geo" +repage /tmp/_i.png
  convert "$ref" -resize x$h -background '#050b17' -gravity north -splice 0x40 -fill white -pointsize 22 -annotate +0+8 "REFERÊNCIA — $label" /tmp/_a.png
  convert /tmp/_i.png -resize x$h -background '#050b17' -gravity north -splice 0x40 -fill '#00d4ff' -pointsize 22 -annotate +0+8 "IMPLEMENTAÇÃO" /tmp/_b.png
  convert /tmp/_a.png /tmp/_b.png -background '#050b17' -splice 20x0 +append -quality 82 "$O/$out"; rm -f /tmp/_i.png /tmp/_a.png /tmp/_b.png; }
pair $R/LANDING_V3_CONCEITO_DESKTOP.png $S/home-desktop-1440-fold.png 1440x900+0+0 01_landing-v3_vs_hero.jpg "Landing v3 (conceito)"
W=$(identify -format %h $S/home-desktop-1440-full.png)
pair $R/LANDING_V2_CANDIDATA_LONGA.png $S/home-desktop-1440-full.png 1440x${W}+0+0 02_landing-v2_vs_landing-completa.jpg "Landing v2 candidata" 2400
pair $R/LANDING_V2_CANDIDATA_LONGA.png $T/participar-genesis-estudante-desktop-1440.png 1440x1300+0+0 03_oferta-v2_vs_formulario.jpg "Oferta Genesis (v2)" 1300
pair design/reference/approved/ATLAS_MASCOTE_TRANSPARENTE.png $T/atlas-painel-desktop-1440.png 1440x900+0+0 04_mascote_vs_atlas-companion.jpg "Mascote Atlas aprovada"
echo "Comparações v2 em $O"
