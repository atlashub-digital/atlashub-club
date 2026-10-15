# PR2B — Auth, onboarding e CRM consentido (planeamento + implementação auditável)

**Autorização:** diretiva do Sérgio no PR #11 (14/10/2026): "Avançar com planeamento + implementação auditável em branch/PR isolado de Auth, onboarding e CRM, em coordenação técnica com Helena; não ativar captação real."
**Estado:** draft. **Nada aplicado, nada ativado.** Sem utilizadores reais, sem escrita em produção, sem DDL em nenhum Supabase.
**Fora de âmbito:** Clara Corporate, Evolution/Chatwoot, Hermes de produção, pagamentos (PR2C).

## 1. O que este PR entrega
| Peça | Ficheiro | Estado |
|---|---|---|
| Rascunho de schema + RLS | `docs/sql/drafts/002_club_auth_onboarding.sql` | **não aplicado**; testado em Postgres local/CI efémero; inclui `club_guardian_reviews` |
| Testes RLS (22 verificações, incl. revisão do responsável) | `docs/sql/drafts/tests/*.sql`, `scripts/test-sql-draft.sh`, job `sql-draft` no CI | recusa hosts remotos |
| Validação de dados mínimos | `src/lib/club/signup-schema.ts` | espelha o formulário PR2A; sem CPF/RG/telefone/preço |
| Rate limit | `src/lib/club/rate-limit.ts` (memória, preview) + `club.hit_rate_limit` (SQL, produção) | |
| Endpoint | `POST /api/club/signup` → `src/lib/club/signup-handler.ts` | **503** por defeito; `dry-run` só fora de produção; `live` (S3) com toda a configuração |
| Modo | `src/lib/club/mode.ts` | `live` acrescentado em S3 — ver `docs/17_PR2B_LIVE_SETUP.md`; produção exige `CLUB_AUTH_PRODUCTION_APPROVED=yes` |
| Testes TS | `tests/e2e/club-signup.spec.ts` | 12 testes (inclui menores: adolescente e criança) |

O formulário `/participar` só envia quando o servidor está em modo `live`; sem configuração continua "Prévia concluída — nada foi enviado." Configuração e testes de staging: `docs/17_PR2B_LIVE_SETUP.md`.

## 2. Decisão a tomar com a Helena antes de qualquer DDL
> **Decidido (ATL-D29, 15/10/2026): Opção B na DB Master AtlasHub, schema `club`.** As salvaguardas para `auth.users` partilhado estão em `docs/17_PR2B_LIVE_SETUP.md` §1.

| | **Opção A — projeto Supabase só do Club (recomendada)** | Opção B — reutilização governada |
|---|---|---|
| Isolamento | total: Auth, chaves, backups, logs separados da Holding | schema `club` num projeto existente; depende de disciplina de grants |
| Risco de mistura pedagógico × B2B | nulo por construção | mitigado por RLS/grants; erro humano possível |
| CRM | ponte servidor→CRM via outbox, só com opt-in | mesma ponte; tentação de joins diretos |
| Custo | +1 projeto | sem custo adicional |
| Auth | utilizadores do Club não partilham `auth.users` com a Holding | `auth.users` partilhado — exige revisão de quem pode ler o quê |
| Reversão | apagar projeto | `drop schema club cascade` + limpeza de `auth.users` |

**Perguntas para a Helena:**
1. Opção A ou B? Se B, qual projeto e quem detém `service_role`?
2. Onde vive o CRM (`crm_contact`, `crm_lead`, `crm_consent`, `crm_activity`, `concierge_session`, `crm_suppression`) e qual a interface aprovada para escrita externa (RPC, Edge Function, fila)? Âmbito por `source = 'club'`?
3. Fornecedor SMTP para emails de verificação (domínio remetente, SPF/DKIM) — sem usar contas pessoais.
4. Turnstile: chave para `club.atlashub.si` (o `/api/interesse` já a exige).
5. Política de retenção/backup e DPO/contacto para pedidos de titular.
6. Quem pode executar migrações (pessoa e via) e janela de manutenção.

## 3. Fluxo proposto (SPEC 01)
`VISITOR → FREE_ACCOUNT → GENESIS_INTEREST → (STUDENT_PENDING → QUOTE_READY → AWAITING_PAYMENT → PAID_CONFIRMED → GENESIS_MEMBER)`; os estados entre parênteses pertencem ao PR2C.

1. Formulário (4 etapas) → `POST /api/club/signup` (Origin, JSON ≤ 4 KB, honeypot, Turnstile, rate limit por IP e por email com resposta neutra).
2. Servidor chama Supabase Auth `signUp`/magic link → **email de verificação obrigatório**. Nenhum perfil existe antes da verificação.
3. No callback verificado, o servidor grava `club_profiles`, `club_signup_intents`, `club_consent_events` (termos + privacidade com versão; marketing separado, **desmarcado por defeito**) e, se plano Genesis, `club_genesis_applications(status='interested')`.
4. Só se `marketing = true`: linha em `club_crm_outbox` com `{email, display_name, source:'club'}`; um worker servidor envia ao CRM. **Interesses, missão, área, equipamento e progresso nunca saem do Club** (restrição `CHECK` no SQL).
5. Opt-out → evento `marketing=false` + `contact_opt_out` no outbox → `crm_suppression`.

## 4. Requisitos da diretiva → controlo
| Requisito | Controlo |
|---|---|
| RLS | RLS em todas as tabelas; `revoke all` de anon/authenticated; políticas por `auth.uid()`; outbox e rate limit sem políticas |
| Verificação de email | `club.is_verified()` em todas as escritas do membro; perfis só após callback verificado |
| Anti-fraude / rate limit | Origin, tamanho, honeypot, Turnstile, limite por IP (5/10 min) e por email (3/h) com resposta neutra (sem enumeração); `club.hit_rate_limit` partilhado em produção |
| Dados mínimos | nome de apresentação, email, faixa etária; opcionais validados por lista; campos de preço/CPF/RG/telefone recusados |
| Opt-in marketing separado e desmarcado | `marketingOptIn` só `true` se explícito; evento próprio; CRM só com opt-in |
| Menores (decisão de 14/10) | **Sem bloqueio**: `pending_guardian_review` em `club.club_guardian_reviews` (só servidor). Até aprovação: sem conta/perfil, consentimentos, CRM ou Genesis. Criança (<12): e-mail da criança nunca guardado (`CHECK`). Aprovação exige decisor + data + `evidence_ref`; decisões finais (trigger). Perfil de menor e avanço Genesis bloqueados sem aprovação (triggers). Marketing forçado a `false` para menores |
| Acesso / apagamento / opt-out | `club_data_requests`; `ON DELETE CASCADE` desde `auth.users`; consentimento de marketing revogável pelo membro |
| Não misturar pedagógico × B2B | perfis em `club.*`; outbox com `CHECK` que rejeita chaves pedagógicas |
| Sem segredos no browser | `service_role` só no servidor; nenhum `NEXT_PUBLIC_*` novo |
| Promoções de estado | membro não pode `UPDATE` candidatura; estados seguintes só pelo servidor (PR2C) |
| Consentimento auditável | `club_consent_events` append-only (sem `UPDATE`/`DELETE` para membros + trigger) |

## 4-A. Plano de execução em staging com a Helena (autorizado pelo Sérgio a 14/10/2026)
O Sérgio autorizou o desenvolvimento técnico **em staging**, em coordenação com a Helena. A Helena valida infraestrutura, permissões, a relação com o Supabase existente e os procedimentos de segurança. **Nada em bases produtivas sem aprovação.** O Claude Code não cria projetos, chaves ou utilizadores por iniciativa própria.

| Fase | O quê | Responsável | Entregável / prova | Bloqueia |
|---|---|---|---|---|
| S0 | Decisão Supabase A (projeto Club) ou B (schema `club` em projeto existente) + quem detém `service_role` | Helena → Sérgio aprova | Registo em `docs/DECISIONS.md` | tudo |
| S1 | Criar projeto/branch **staging** (sem dados reais), SMTP de teste, Turnstile de teste; envs só no ambiente *Preview* da Vercel | Helena | Lista de envs (nomes, sem valores), screenshot do painel sem segredos | S2 |
| S2 | Aplicar `002_club_auth_onboarding.sql` **em staging** e repetir os 22 testes RLS contra staging (`scripts/test-sql-draft.sh` adaptado, só leitura de resultados) + advisor de segurança Supabase | Claude Code prepara; Helena executa ou autoriza | Log dos testes + output do advisor | S3 |
| S3 | Implementar modo `live` **só para staging**: `signUp` com verificação de e-mail, callback que grava perfil/consentimentos, `club_guardian_reviews` para menores, rate limit SQL | Claude Code (PR próprio) | Testes e2e contra staging com contas `@example.test` | S4 |
| S4 | Área de membros protegida (sessão Supabase, middleware), perfil, onboarding de interesses/objetivos, escolha Club/Genesis, pré-candidatura | Claude Code | Preview com login de teste; nenhum dado real | S5 |
| S5 | Ponte CRM: contrato de escrita aprovado (RPC/Edge Function/fila), `source='club'`, só opt-in, `crm_suppression` no opt-out | Helena define interface; Claude Code implementa o worker | Teste com CRM de staging; amostra de payload sem dados pedagógicos | S6 |
| S6 | Procedimento manual de revisão (responsável e estudante): quem revê, canal verificado, prazos, registo de evidência, contestação | Sérgio + jurídico; Helena para acessos | Runbook aprovado | ativação |
| S7 | Ativação controlada (produção) | Sérgio | Aprovação explícita por escrito | — |

**Pedidos concretos à Helena (S0–S1):**
1. Opção A ou B? Se B, qual projeto, e confirmação de que `auth.users` do Club não se mistura com utilizadores da Holding.
2. Interface aprovada para escrita no CRM (`crm_contact`, `crm_lead`, `crm_consent`, `crm_activity`, `concierge_session`, `crm_suppression`) e âmbito `source='club'`.
3. Remetente de e-mail (domínio, SPF/DKIM) para verificação; Turnstile para `club.atlashub.si`.
4. Quem pode aplicar migrações em staging e em produção, e por que via.
5. Política de backups/retenção e contacto DPO para pedidos de titular.

## 5. Gates de ativação (todos necessários, por esta ordem)
1. Decisão A/B com a Helena registada em `docs/DECISIONS.md` e aprovada pelo Sérgio.
2. Textos de termos/privacidade revistos (versões `club-terms-*`, `club-privacy-*`).
3. Migração aplicada **primeiro num projeto/branch de staging**, testes RLS repetidos lá.
4. Variáveis no ambiente Preview apenas; teste com contas de teste `@example.test`, nunca dados reais.
5. Implementação do modo "live" (Supabase Auth + gravação no callback) num PR próprio, revisto.
6. Ligar o formulário só após 1–5 e aprovação explícita do Sérgio. Sem anúncio de "inscrições abertas".

## 6. Riscos
- Rate limit em memória não protege em serverless multi-instância → só para dry-run; produção usa a função SQL.
- `ON DELETE CASCADE` apaga também prova de consentimento — validar com jurídico se há prazo de retenção.
- Opção B partilha `auth.users` com a Holding — exige revisão de acessos pela Helena.
- `security definer` em `is_verified`/`hit_rate_limit` com `search_path = ''` e grants restritos; rever no advisor do Supabase ao aplicar.

## 7. Reversão
Fechar/reverter este PR. Nada foi aplicado em base de dados, nenhum env criado, nenhum utilizador criado. O endpoint novo responde 503 em qualquer ambiente sem `CLUB_AUTH_MODE=dry-run`, e sempre em produção.
