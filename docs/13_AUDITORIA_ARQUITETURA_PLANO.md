# Auditoria técnica, documental e visual · Arquitetura · Plano de PRs

**Data:** 14/10/2026 · **Base auditada:** `main` @ `19bc29672c8855ce265d8eafef160e53941eb4b8` (merge do PR #1)
**Pacote recebido:** `Club_Atlas_ClaudeCode_Handoff_COMPLETO_2026-10-14.zip` — conteúdo integral copiado para `design/handoff/` e `design/reference/`; os 11 SHA-256 do manifesto do pacote conferem.
**Autor:** Claude Code, sob a autoridade de Sérgio Monteiro. Nenhum merge, deploy, DDL, criação de token ou alteração de infraestrutura foi feito.

---

## 1. AUDITORIA

### 1.1 Repositório (main)
| Item | Estado real |
|---|---|
| Stack | Next.js 15.5 (App Router) · React 19 · TypeScript 5.9 strict · Node ≥ 22 · sem CSS framework (CSS global único, minificado à mão) |
| Lockfile | **inexistente** em main (CI usava `npm install`) → criado neste PR (`package-lock.json`, `npm ci` verificado) |
| Lint/testes | Sem ESLint, sem testes. CI: `agents:validate` + `typecheck` + `build` |
| Páginas | `/`, `/participar`, `/genesis`, `/mentores`, `/eventos`, `/biblioteca`, `/comunidade`, `/lab`, `/area-membro` (maquete), `/privacidade` (minuta) — todas estáticas |
| API | `POST /api/interesse` — **fail-closed** (503 sem env), valida origem, tamanho, honeypot, Turnstile, insere em Supabase via service role server-side. Bom ponto de partida |
| Dados | `docs/sql/001_club_interest.sql` só proposta; nenhuma migração aplicada |
| Auth/RBAC/membros | **Inexistente** (área de membro é maquete rotulada) |
| Agentes | 4 SOUL/MISSION draft (`atlas`, `clara`, `caio`, `bia`), `state: not_provisioned`; validador de manifesto OK |
| Visual | Paleta navy/azul/ciano aproximada, símbolo SVG provisório, sem imagens do elenco, sem `design/` |
| Idioma | Mistura PT-PT ("telemóvel", "tu/teu") em páginas públicas — o prompt pede PT-BR |
| SEO | `noindex, nofollow` global (correto para a fase) |

### 1.2 Vercel (consultado em modo só-leitura)
| Item | Valor |
|---|---|
| Projeto | `atlashub-club` (`prj_hVvOGW3JriTKnM9iAuoHKFEbBlFt`), team `atlas-hub1`, framework `nextjs`, Node **24.x** |
| Domínios | `club.atlashub.si` (**verificado**), `atlashub-club.vercel.app`, alias `git-main` |
| Produção | **Ativa:** deploy `READY` do commit `19bc296` (main). O 1.º deploy (`Initial commit`) falhou (`ERROR`) |
| Proteção | SSO (Vercel Authentication) em todos os deploys **exceto domínios custom** → `club.atlashub.si` é público; previews de PR exigem login Vercel |
| Implicação | **Qualquer merge em `main` vai a produção em `club.atlashub.si` automaticamente.** Por isso: nada de merge sem aceite explícito; considerar desligar auto-deploy de produção ou usar "Promote" manual |

Divergência: Vercel usa Node 24.x, `package.json` declara `>=22`, CI usa 22. Compatível; recomendo fixar 22 LTS no Vercel ou 24 no CI para paridade (decisão do owner).

### 1.3 Documentação
- `README.md` e docs de design antigos referem o PR #1 como draft — **obsoleto** (já foi merged).
- `docs/08_DESIGN_CASTING.md` usa Caio/Bia e "Atlas sem rosto" — conflita com a arte aprovada (ver `IDENTITY_DECISION.md`).
- Datas corretas em `DECISIONS.md` e `content.ts` (09/01/2027, 28/11). O Drive ainda tem 12/01/2027 e 21/11 (fora do repo; ver `design/handoff/03_RECONCILIACAO_DRIVE_PROPOSTA.md`).

### 1.4 Material de design acessível
| Ficheiro | Papel | Visto |
|---|---|---|
| `approved/CLUB_ATLAS_TEAM_VALIDADO.png` | Casting + atmosfera (prioridade 1) | ✔ |
| `approved/ATLAS_HUB_LOGO_FONTE.png`, `ATLAS_LOGO_ENERGIA.png` | Símbolo e energia | ✔ |
| `screens/WEB_ECOSISTEMA.png`, `BOARD_ECOSISTEMA.png`, `BOARD_UX.png` | Arquitetura multipágina | ✔ |
| `screens/DESIGN_SYSTEM_BOARD.png` | Tokens e componentes | ✔ |
| `screens/DASHBOARD_NEON.png`, `COMUNIDADE.png`, `BIBLIOTECA.png`, `GENESIS.png` | Ecrãs de produto (PR2) | ✔ |
| `legacy_v1.1/*` (HTML + PNG) | Hierarquia, mobile e estados | ✔ (PNG) |
| Drive | Não acedido nesta sessão (o pack consolida o necessário; o Drive é contexto, não baseline) | — |

---

## 2. IDENTITY & VISUAL DECISIONS (conflitos concretos)

| # | Conflito | Decisão aplicada no PR1 | Pedido ao Sérgio |
|---|---|---|---|
| C1 | **Lucas/Lia** (arte aprovada) vs **Caio/Bia** (SOULs, manifesto) | **Revisto:** UI = Sérgio · Lucas · Atlas · Marta · Bia (preferência do Sérgio); `profileId` inalterado | Homologar migração (`IDENTITY_DECISION.md §5`) |
| C2 | "LIA" (LeveLab) e "Clara" (Clara Corporate) colidem com outras unidades | **Revisto:** UI usa Bia e Marta; teste e2e impede Clara/Lia na landing | Confirmar que não há instância "Marta" ativa |
| C3 | Logo sem rosto vs mascote expressiva | Dois componentes: `AtlasMark` (sem rosto) e `AtlasAvatar` (mascote animada, reduced-motion) | Fornecer SVG de origem e mascote isolada |
| C4 | Botão primário: azul (`WEB_ECOSISTEMA`) vs dourado (`DESIGN_SYSTEM_BOARD §05`) | **Revisto:** duas variantes comparadas (`06_cta-variantes.jpg`); padrão = dourado; azul com `NEXT_PUBLIC_HERO_CTA=blue` | Escolher a variante |
| C5 | Datas antigas nas maquetes: Genesis "09 JAN **2026**" (`GENESIS.png`, `BOARD_*`), "Vagas limitadas", "Inscrições abertas" | Só **09/01/2027 (previsto)**, sem vagas/inscrições; guarda automática `content:check` | — |
| C6 | Preços R$49/99/199 e planos Explorer/Builder/Founder nas maquetes antigas | **Não publicados.** Decisão de 14/10 (issue #14): Club grátis + Genesis R$ 490 padrão / R$ 190 estudante elegível — exibidos via `src/lib/offers.ts`, sem cobrança | Homologar checkout (PR2C) |
| C7 | Métricas fictícias (12.4K membros, 127 participantes, XP, "60%") | Não publicadas; Missão 001 sem progresso falso | — |
| C8 | Copy PT-PT ("por pessoas como **tu**") vs exigência PT-BR | "por pessoas como **você**" | — |
| C9 | "Comunidade ativa" (arte) antes do lançamento | "Comunidade acolhedora" | — |
| C10 | `BIBLIOTECA.png` usa um robot humanoide genérico numa miniatura | Não reproduzido (o prompt proíbe robot genérico) | — |
| C11 | `BOARD_ECOSISTEMA.png` mostra Sérgio com outro rosto | Rostos só da composição aprovada | — |

---

## 3. ARQUITETURA PROPOSTA

```
club.atlashub.si (Vercel, projeto isolado)
└─ Next.js App Router
   ├─ (public)  /, /participar, /genesis, /mentores, /eventos, /biblioteca, /comunidade, /projetos, /atlas, legais
   ├─ (auth)    /entrar, /registar, /recuperar-acesso, /onboarding          ← Supabase Auth (projeto Club isolado)
   ├─ (member)  /home, /minha-jornada, /missoes/[slug], /conquistas, /biblioteca/meus-conteudos,
   │            /reader/[contentId], /genesis/turma-01, /meu-agente, /lab, /projetos/meus, /perfil, /preferencias, /privacidade/dados
   ├─ (admin)   /admin/*                                                       ← role ADMIN/EDITOR/MODERATOR, server-side
   ├─ route handlers / server actions  → validação + RBAC + RLS (nunca autorização só no browser)
   └─ adapters (server-only, feature-flagged, desligados por defeito)
        ├─ EditionsCatalogProvider   (metadata + entitlement; master fica na Editions)
        ├─ HermesAgentGateway        (Atlas/Marta/…; fora do frontend; staging primeiro)
        ├─ LabProvisioner            (stub até isolamento homologado)
        └─ PaymentsProvider          (PixGo/MisticPay/cartão/boleto — desligado até G6)
Supabase "club" (NOVO projeto ou schema isolado — decisão do owner, sem DDL na Workforce)
```

**Tabelas (proposta, não migrada):** as 29 do prompt master §2, agrupadas em: identidade (`club_profiles`, `member_consent`, `interests`), acesso (`memberships`, `membership_grants`, `content_entitlements`), conteúdo (`content_items`, `reader_progress`, `lessons`), turmas/eventos (`events`, `event_registrations`, `cohorts`, `cohort_enrollments`), gamificação (`mission_definitions`, `mission_progress`, `mission_evidence`, `achievements`, `member_achievements`), projetos (`projects`, `project_members`), agentes (`agent_definitions` com `runtime_status`, `agent_context_entries`, `agent_jobs`, `agent_job_approvals`, `resource_quotas`), pagamentos (`billing_orders`, `billing_payments`), governança (`moderation_reports`, `audit_events`).

**Papéis:** `VISITOR`, `FREE`, `GENESIS_ENROLLED`, `LAB_ENABLED`, `EDITOR`/`MODERATOR`, `ADMIN` + entitlements independentes (`PURCHASED_EDITION:<id>`, `WORKSHOP:<id>`).

**XP da Missão 001:** concedido só por função server-side (`security definer`) após validação de evidência, idempotente por `(member_id, mission_id, step)`, com `audit_events`.

**Fronteiras:** nenhum cookie/sessão/serviço partilhado com `app.atlashub.si` (Workforce). Editions mantém masters e Reader; o Club guarda apenas metadados e entitlements. Workshops B2B são links para `atlashub.si`.

---

## 4. MATRIZ — existente vs pendente

Legenda: ✅ feito · 🟡 parcial/placeholder honesto · ⛔ não existe · 🔒 bloqueado por decisão/acesso

| Área | Antes (main) | Depois deste PR | Próximo PR |
|---|---|---|---|
| Design tokens / componentes base | 🟡 CSS único | ✅ tokens, botões, tags, cards, campos, ícones, `/sistema-visual` | PR2: sidebar, topbar, ProgressRing, LibraryCard, CommunityPost… |
| Logo / mascote | 🟡 SVG provisório | ✅ `AtlasMark` revisto + `ClubLogo` + `AtlasAvatar` animado (🔒 SVG de origem) | PR6 mascote animada avançada |
| Landing `/` | 🟡 genérica | ✅ fiel à composição aprovada, 12 secções, PT-BR | — |
| `/mentores` | 🟡 monogramas | ✅ retratos aprovados + declaração humano/digital | — |
| `/genesis`, `/eventos`, `/biblioteca`, `/comunidade`, `/lab`, `/participar`, `/privacidade` | 🟡 v0.1 | 🟡 herdam tokens/header/footer novos; layout e copy v0.1 (PT-PT) | PR2 |
| `/projetos`, `/atlas`, `/termos`, `/acessibilidade`, `/contacto` | ⛔ | ⛔ (não linkados) | PR2 (legais 🔒 validação jurídica) |
| Registo de interesse | 🟡 fail-closed | 🟡 igual (503 testado) | PR3 🔒 Supabase + Turnstile + texto LGPD |
| Auth / onboarding / perfis / RLS | ⛔ | ⛔ | PR3 🔒 projeto Supabase Club |
| Dashboard `/home` | 🟡 maquete | 🟡 maquete | PR2 (demo rotulado) → PR3 (real) |
| Missão 001 | ⛔ | 🟡 apresentação pública das 4 etapas | PR4 motor + evidências + XP server-side |
| Biblioteca/Editions/Reader | 🟡 lista estática | 🟡 | PR5 🔒 contrato Editions |
| Comunidade/Discord/Telegram/WA | 🟡 texto | 🟡 canais com estado honesto | PR5/PR6 🔒 G4 |
| Hermes/Atlas chat | ⛔ | ⛔ | PR6 🔒 staging Helena + Sérgio |
| Lab executável | ⛔ | ⛔ | PR7 🔒 G5 |
| Pagamentos | ⛔ | ⛔ | PR7 🔒 G6 |
| Qualidade | typecheck+build | ✅ lockfile, `npm ci`, `content:check`, Playwright (desktop+mobile), axe WCAG 2.2 AA, screenshots, comparações | ESLint (PR2) |

---

## 5. BACKLOG EM PRs

| PR | Âmbito | Complexidade | Risco | Depende de |
|---|---|---|---|---|
| **PR0+PR1 (este)** | Auditoria, `IDENTITY_DECISION`, `design/` + manifesto, design system, landing, `/mentores`, testes, CI | M | Baixo | — |
| PR2 | UI de produto com dados demo rotulados: `/home` (com camada **Meus agentes / Meu ecossistema**), comunidade, biblioteca, Genesis, eventos, projetos, onboarding, empty states; migrar páginas v0.1 para PT-BR; ESLint | L | Baixo | PR1 |
| **PR2A (feito, issue #14)** | Adesão Club em 4 etapas (prévia), `/genesis` comercial R$ 490 / R$ 190 estudante, ofertas na landing, prévia do dashboard, Atlas companion MVP — ver `docs/15_PR2A_ADESAO_GENESIS.md` e `docs/14_ATLAS_COMPANION.md` | M | Médio (comercial) | PR1 |
| PR2b | `/lab` aprofundado: tela vazia → agente → memória/ferramentas → equipa → projeto; níveis de acesso realistas; sem claims de VPS/SDK | M | Baixo | PR1 |
| PR3 | Supabase Auth + schema `club` + RLS + consentimentos + rate limit + `/participar` ativo | L | **Alto** (dados pessoais) | 🔒 projeto Supabase, Turnstile, textos LGPD, decisão Vercel prod |
| PR4 | Mission engine + Missão 001 (4 etapas, evidência, XP idempotente, retomar/editar/apagar contexto, modo demo `not_provisioned`) | L | Médio | PR3 |
| PR5 | Biblioteca/Editions (adapter + entitlements), turmas Genesis, candidaturas, admin básico | L | Médio | PR3 · 🔒 contrato Editions |
| PR6 | Atlas animado avançado, chat via backend, Hermes/Telegram/Discord em staging, feature flags, kill switch | L | Alto | 🔒 Helena + Sérgio, G4 |
| PR7 | Lab executável, pagamentos, operação avançada | XL | Muito alto | 🔒 G5/G6 |

O lançamento gratuito (nov/dez 2026) depende de PR1–PR4; PR5 parcial; PR6/PR7 não bloqueiam.

---

## 6. PEDIDOS À HELENA (via autorização do Sérgio)

1. **Supabase:** criar projeto **dedicado ao Club** (recomendado) ou schema isolado com RLS — região, plano, backups PITR; entregar apenas URL + anon key em ambiente Vercel; service role só em env server-side de Preview/Production.
2. **Cloudflare Turnstile:** site key + secret para `club.atlashub.si` e domínio de preview.
3. **Vercel:** confirmar quem aprova promoções a produção; decidir se `main` continua a fazer auto-deploy de produção; variáveis `CLUB_SITE_ORIGIN` por ambiente.
4. **E-mail transacional** (verificação/recuperação de conta) com domínio `atlashub.si` (SPF/DKIM) — fornecedor a aprovar.
5. **Staging Hermes Club** separado dos agentes ativos (só para PR6).
6. Nada disto entra no GitHub; segredos apenas no cofre/env Vercel.

---

## 7. RELATÓRIO GO/NO-GO (estado após este PR)

**Funciona de verdade:** landing (com destaque do laboratório e equipa na primeira dobra) e mentores responsivos e acessíveis (axe sem violações sérias), navegação desktop/móvel por teclado, `noindex`, API de interesse fail-closed, guarda de conteúdo no CI.

**Continua conceito/placeholder (rotulado como tal):** registo, contas, dashboard, Missão 001 executável, biblioteca com direitos, comunidade/canais, agentes, Lab, pagamentos.

**Falta para lançamento público gratuito:** PR2 (páginas restantes PT-BR), PR3 (Auth + dados + LGPD + Turnstile), PR4 (Missão 001), textos legais validados, decisão de casting, aceite visual do Sérgio, retirada do `noindex` após revisão de SEO. **Veredicto atual: NO-GO para lançamento; GO para revisão em Preview.**
