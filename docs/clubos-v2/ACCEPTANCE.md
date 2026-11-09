# Matriz GO/NO-GO — Atlas ClubOS

| Gate | Prova requerida |
|---|---|
| G0 | Aprende: admin cria curso/atividade, aluno consome, grava progresso; Web/API/Collab/DB/Redis, backup e restore reais |
| G1 | Login único Master UUID; criação idempotente LH user; logout, suspensão, revogação; sem partilha de passwords nem token admin no browser |
| G2 | 2+ programas e turmas, acessos independentes, conteúdo partilhável, progresso e tarefa por contexto, isolamento entre membros |
| G3 | Club Free sem ARO; Genesis Student R$190 por autodeclaração e Standard R$490; ARO PIX real aprovado → matrícula/entitlement; retries e webhooks duplicados |
| G4 | 100% visual Atlas das telas *em escopo V1*, incluindo dashboard, editor, aula, discussões, admin, mobile; a11y, estados vazios, loading |
| G5 | CI, segurança, backups/restore, proxy, DNS/TLS staging, logs, rollback, upstream upgrade simulado |
| G6 | Jornada real de Free e Genesis paga; comunicação comercial alinhada; autorização Helena+Direção para produção |

**Manual refund**: atendimento gerirá operação; eventos externos REFUNDED/CHARGEBACK devem retirar direitos. Não implementar acionamento de refund automático.

**Conflito contratual**: para qualquer divergência de preço/entitlement, prevalece catálogo ARO; jamais frontend.

Relatório por gate: PASS/FAIL, SHA, URLs, artefactos de teste, screenshots, risco e blocker; E2E com usuários distintos e tentativas de violação de acesso.
