#!/usr/bin/env bash
# Aplica o rascunho PR2B numa base Postgres LOCAL e descartável e corre os testes RLS.
# Uso: PGHOST=<socket-dir> PGPORT=<porta> PGUSER=postgres scripts/test-sql-draft.sh
# Nunca apontar para Supabase/produção: o script recusa hosts remotos.
set -euo pipefail
case "${PGHOST:-}" in /*|localhost|127.0.0.1) ;; *) echo "Recusado: PGHOST tem de ser local"; exit 1;; esac
db="club_pr2b_test_$$"
createdb "$db"
trap 'dropdb --if-exists "$db"' EXIT
psql -q -v ON_ERROR_STOP=1 -d "$db" -f docs/sql/drafts/tests/000_supabase_stub.sql
psql -q -v ON_ERROR_STOP=1 -d "$db" -f docs/sql/drafts/002_club_auth_onboarding.sql
psql -q -v ON_ERROR_STOP=1 -d "$db" -f docs/sql/drafts/tests/002_rls_test.sql
psql -q -v ON_ERROR_STOP=1 -d "$db" -f docs/sql/drafts/003_club_signup_live.sql
psql -q -v ON_ERROR_STOP=1 -d "$db" -f docs/sql/drafts/tests/003_live_test.sql
