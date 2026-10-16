#!/usr/bin/env bash
# Simula a Master tal como a auditoria de 15/10 a descreve (002 aplicado; 003/004 em falta) e prova que
# apply_003_004.sql resolve os achados, é reexecutável, reverte e passa os testes do modo live.
# Uso: PGHOST=<socket-dir> PGPORT=<porta> PGUSER=postgres scripts/test-sql-master-reconcile.sh
set -euo pipefail
case "${PGHOST:-}" in /*|localhost|127.0.0.1) ;; *) echo "Recusado: PGHOST tem de ser local"; exit 1;; esac
db="club_reconcile_test_$$"
createdb "$db"
trap 'dropdb --if-exists "$db"' EXIT
run() { psql -q -v ON_ERROR_STOP=1 -d "$db" "$@"; }
count() { psql -At -d "$db" -f docs/sql/drafts/tools/club_schema_audit.sql | grep -cE "\|(FALTA|RISCO)$" || true; }
run -f docs/sql/drafts/tests/000_supabase_stub.sql
run -f docs/sql/drafts/002_club_auth_onboarding.sql
before=$(count); echo "Achados antes (FALTA/RISCO): $before"; [ "$before" -gt 0 ]
# Pré-condição recusa um schema sem 002
psql -q -d "$db" -c "alter table club.club_rate_limits rename to club_rate_limits_tmp" >/dev/null
if run -f docs/sql/drafts/reconcile/apply_003_004.sql 2>/dev/null; then echo "FALHA: pré-condição não travou"; exit 1; fi
psql -q -d "$db" -c "alter table club.club_rate_limits_tmp rename to club_rate_limits" >/dev/null
[ "$(count)" -eq "$before" ] || { echo "FALHA: tentativa recusada alterou o schema"; exit 1; }
echo "OK: pré-condição recusa e não deixa alterações"
run -f docs/sql/drafts/reconcile/apply_003_004.sql
after=$(count); echo "Achados depois: $after"; [ "$after" -eq 0 ]
run -f docs/sql/drafts/reconcile/apply_003_004.sql >/dev/null && echo "OK: reexecutável"
run -f docs/sql/drafts/reconcile/rollback_003_004.sql
psql -At -d "$db" -c "select to_regclass('club.club_pending_signups') is null" | grep -q t && echo "OK: reversão remove objetos novos"
psql -At -d "$db" -c "select has_table_privilege('authenticated','club.club_profiles','INSERT')" | grep -q f && echo "OK: reversão não reabre INSERT"
run -f docs/sql/drafts/reconcile/apply_003_004.sql
run -f docs/sql/drafts/tests/003_live_test.sql
run -f docs/sql/drafts/tests/004_genesis_interest_test.sql
echo "RECONCILIAÇÃO DA MASTER: TODOS OS TESTES PASSARAM"
