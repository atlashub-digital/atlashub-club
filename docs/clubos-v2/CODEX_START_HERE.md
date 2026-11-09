# PROMPT INICIAL — COLAR NO CODEX CLOUD / WORK HANDOFF

Missão: implementar integralmente Atlas ClubOS V2, NÃO apenas escrever planos. Usa `docs/clubos-v2/README.md`, `EXECUTION_PLAN.md` e `ACCEPTANCE.md`, mais o pacote V2 completo entregue pela Direção.

Primeiro, confirma o HEAD de atlashub-club e estado das issues #29, #33, #34, #35. O portal permanece independente. Cria `atlashub-digital/atlas-club-campus` sob organização (não pessoal) ou reporta a permissão necessária. Usa o upstream LearnHouse e preserva AGPL, histórico, tags e capacidade de atualização. A primeira PR é um LearnHouse real e navegável em staging de teste com DB própria; não declare PASS por containers running.

Paralelamente prepara design system Atlas premium e inventário visual completo. Personalização V1 é **100% visual** sobre LearnHouse: arquitetura multiprograma, dois programas além de cursos, turmas, Free/paid, contratos de SSO e ARO. Não hardcodar Genesis.

Helena é a única responsável por segredos e deploy privilegiado em VPS. Não fazer mudanças em Supabase Master/ARO partilhados sem coordenação. Não instalar outro proxy em 80/443.

Evidências: README de setup e runbook, branch/PR, SHA, CI, screenshots desktop/mobile, testes de progresso/autorização/backup, matriz OSS/Enterprise/SSO, ADR de identidade, custos e blockers. Continuar até ter implementação demonstrada onde ferramentas/acessos permitirem; não prometer produção sem provas.
