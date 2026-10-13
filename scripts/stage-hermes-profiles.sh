#!/usr/bin/env bash
# STAGING LOCAL — não instala Hermes, não escreve no HERMES_HOME e não liga canais.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="/tmp/club-atlas-hermes-review"
mkdir -p "$DEST"
for name in atlas clara caio bia; do
  mkdir -p "$DEST/club-$name"
  cp "$ROOT/agents/$name/SOUL.md" "$DEST/club-$name/SOUL.md"
  cp "$ROOT/agents/$name/MISSION.md" "$DEST/club-$name/MISSION.md"
done
echo "Perfis candidatos copiados para $DEST"
echo "NENHUM perfil Hermes foi provisionado; solicitar autorização do Sérgio."
