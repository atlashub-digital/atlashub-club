# Port cirúrgico de autenticação — 21/10/2026

Branch: `fix/club-auth-reconcile-20261020`, base `a98effd`.
Origem: melhorias canónicas de #23 (`a032f89`, `6f7272b`, `0681b87`, `9a2b1f7`, `513351c`), portadas ficheiro a ficheiro, sem merge nem cherry-pick dos merge-syncs.

## Resultado

- Cadastro pendente em `club.club_pending_signups`, sem payload em `user_metadata`; `stash_signup` antes do OTP e `get_pending_signup` depois da confirmação.
- PKCE e callback por POST, aceitando código ou token hash; termos confirmados pelo dono do e-mail em `/conta/concluir` antes da criação de perfil e consentimentos.
- Interesse Genesis a partir da conta; função SQL idempotente e restrita ao servidor.
- Validador recusa qualquer campo de e-mail para criança; pedido sem e-mail continua para revisão do responsável.
- SQL 003/004 e ferramentas de auditoria/reconciliação versionados. Segundo o brief já existem na Master: nenhum SQL foi executado nesse banco.
- Formulário, página `/participar`, catálogo, `.env.example`, configurações live e remoção da rota debug preservados da main. O modo lead da main também foi preservado por instrução expressa de manter esses ficheiros.

## Provas e limites

`npm run verify`: validação de agentes, conteúdo, 10 unitários, typecheck e build passaram. `npm test`, `npm run lint`, `npm run typecheck`, `npm run build` e `npm run agents:validate` passaram. O comando lint aplica as regras de conteúdo existentes e `git diff --check`; não foi instalado ESLint.

`scripts/test-sql-draft.sh` e `scripts/test-sql-master-reconcile.sh`: passaram num container descartável da imagem Postgres 16 já existente, sem rede nem portas publicadas. Verificam RLS entre membros, utilizador externo sem perfil, três consentimentos, remoção do cadastro pendente, Genesis idempotente, purga que não toca em `auth.users`, pré-condições, reaplicação e reversão.

Playwright (`npm run test:e2e -- --workers=2`): **108 aprovados, 44 ignorados** (condições de projeto/mobile e funcionalidades desligadas). A primeira execução teve uma falha transitória `ERR_NETWORK_CHANGED` na navegação para `/conta`; a repetição integral passou. A suíte valida as páginas desktop/mobile e acessibilidade; os casos live usam duplos de Supabase/Turnstile. A asserção de privacidade verifica os argumentos enviados ao Auth (apenas `signup_source`, sem payload de cadastro); não inspeciona um JWT real. A entrega real do OTP, sessão PKCE no provedor e o percurso integrado contra a Master não foram executados. A prova de isolamento Master de #23 permanece em `17_PR2B_LIVE_SETUP.md` §6.1 como evidência histórica e procedimento de homologação, sem nova auditoria de outras aplicações.

O POST de conclusão é repetível após a remoção dos dados pendentes: um perfil existente devolve `existing` sem nova escrita. Os testes também recusam usar metadata antiga como fallback.

## Riscos e reversão

PKCE exige abrir o link no mesmo navegador do pedido. Cadastros antigos que só existam em metadata não são migrados: será necessário refazer o cadastro se não houver dados pendentes. Este port não altera modelos globais de e-mail, envs, infraestrutura ou dados de produção.

Reversão de código: reverter os commits deste PR em nova branch e PR. Não executar o rollback SQL na Master: os objetos já existiam antes deste port. Não houve merge ou deploy.
