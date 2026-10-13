# Handoff / Pedido a Helena — para Sérgio autorizar

## Contexto
Repo Club Atlas novo, público. Infra e acesso existentes da Holding são separados. Helena coopera **por intermédio de Sérgio**, não numa cadeia de chefia dos agentes Club.

## Pedido de avaliação, sem executar automaticamente
1. Inventário redigido de capacidade para nova aplicação Vercel club.atlashub.si; DNS e subdomínio sob controle de AtlasHub.
2. Preparar proposta de Supabase isolado/schema Club, com Auth/RLS e acesso de engenharia mínimo.
3. Inventário de VPS com CPU/RAM/disco/recursos sem consultar ou expor segredos; opções de sandbox para 2, 10 e 20 membros em simultâneo.
4. Ambiente Hermes Club **staging distinto** dos agentes já ativos; backups prévios e plano de rollback.
5. Orientações seguras para criar e configurar bots Telegram e Discord, tokens via cofre e allowlists; grupos/chat IDs apenas fora do GitHub.
6. Recolher dependências e aprovações humanas necessárias; custos previstos e riscos.

## Entregáveis esperados
- Matriz de recursos, responsabilidades e riscos.
- Lista dos acessos solicitados, objetivo, mínimo privilégio, prazo e revogação.
- Diagrama deployment e URLs; nenhum DNS alterado antes de autorização.
- Prova de conceito Atlas em DM Telegram; depois em grupo privado.
- Prova de conceito Discord, segregação canais e moderação.
- Documento de custos por utilizador e limite de incidentes.
- PR técnico, evidências QA, confirmação final por Sérgio.

## Proibições
Não imprimir credenciais; não reconfigurar gateways existentes dos projetos, não criar contas bancárias nem WhatsApp automatizado, não conceder root a estudantes, não reatribuir intervenientes noutras unidades.
