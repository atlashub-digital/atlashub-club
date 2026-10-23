# Execução — Atlas ClubOS V2

## Primeiro mandato Codex
1. Criar repo privado `atlashub-digital/atlas-club-campus` (não existe hoje), se permissões permitirem; de outro modo pedir ao proprietário criação sob a organização e NÃO usar repo pessoal. Derivar de LearnHouse upstream preservando licença/histórico, fixar versão e remote upstream.
2. Ler pacote canónico V2/AGENTS. Branch feat/clubos-bootstrap com um writer; instalar OSS de forma reproduzível, testando Web/FastAPI/Collab/DB/Redis, conteúdos, editor, progressos, discussões, backup e restore.
3. Seed real em staging: uma organização LearnHouse, Academy IA com Genesis 01/02, Academy Criadores com outro programa; turmas, conteúdo partilhado+privado e membros Free/paid, isolamento E2E. Não assumir equivalência entre User Groups e edições sem testes.
4. Provar licenciamento/SSO e API: OSS vs Pro/Enterprise, bridge Supabase Master UUID → LH user ID, sem segundo login nem tocar em auth.users; emitir ADR. Não alterar flags para escapar a restrições de licença.
5. Fazer full visual redesign Atlas de TODAS telas V1 com design system premium consistente, responsivo e acessível; backend LH preservado onde possível; documentar patches upstream.
6. Integrar ARO Hosted Checkout por contrato e matrícula/entitlement, sem checkout nativo LearnHouse. Reembolso processado manualmente pelo atendimento, com direitos reconciliados.
7. PRs incrementais com SHA, CI GREEN, screenshots 390/1440, E2E negativos, migrações, dados sanitizados, rollback. Sem deploy direto de produção.

## Parallel stream portal + Helena
Portal: concluir Club Free E2E e Genesis checkout. Helena: inventário VPS, staging Docker/Caddy/DNS/TLS/isolamento, segredos e rollout. Sem dois writers na mesma branch.
