# MISSÃO MASTER — CLAUDE CODE | CLUB ATLAS 1.0
## Plataforma completa, visual homologado, membros, aprendizagem, Genesis, Atlas Lab e comunidade
**Data-base:** 14/10/2026 | **Owner de produto e decisão:** Sérgio Monteiro | **Repositório:** https://github.com/atlashub-digital/atlashub-club | **Domínio exclusivo:** `club.atlashub.si`

**LÊ PRIMEIRO:** esta missão é um contrato de execução iterativa. Não é autorização para abrir pagamentos, publicar agentes com autonomia ou alterar produção. Deves executar análise, design implementation e código até ao máximo possível com os acessos já autorizados, criando PRs pequenos e testes. Sempre que uma dependência externa não esteja validada, usar integração preparada porém desligada, com indicação clara na interface. Não simular funcionalidades reais nem declarar sucesso sem prova.

## 0. FONTES, PRIORIDADE E ESTADO REAL

1. **Fonte técnica canónica:** branch `main` do repo `atlashub-digital/atlashub-club`. O PR #1 foi **integrado na main** em 14/10/2026 (commit de merge `19bc29672c8855ce265d8eafef160e53941eb4b8`). A fundação possui 57 ficheiros Next.js/React/TS, documentação, pages estáticas e SOULs de 4 personagens, **não um produto operacional**. Começa com `git status`, HEAD, leitura de `README.md`, `AGENTS.md`, `docs/00_PROJECT_CHARTER.md`, `docs/03_GOVERNANCE_AND_ACCESS.md`, `docs/07_QUALITY_RELEASE_GATES.md`, `docs/10_HANDOFF_HELENA.md`, `docs/11_DEPLOYMENT.md` e `agents/TEAM_MANIFEST.json`.
2. **Fonte visual prioritária:** `assets/approved/CLUB_ATLAS_TEAM_VALIDADO.png` neste pack: **composição do elenco expressamente validada**. Face e estrutura corporal do Sérgio nesta composição prevalecem sobre casting gerado anteriormente. Não alterar outros membros da imagem, personagens, proporções, composição, fundo e copy sem necessidade de reconstrução como componentes reais. A imagem não é substituto de layout HTML.
3. **Marca e presença Atlas:** `assets/approved/ATLAS_HUB_LOGO_FONTE.png` (referência de símbolo) e `ATLAS_LOGO_ENERGIA.png` (referência de energia), mais `assets/reference/BOARD_ECOSISTEMA.png`, `BOARD_UX.png`, `DESIGN_SYSTEM_BOARD.png`. **Distinguir** logótipo institucional geométrico e mascote animada Atlas (triângulo 3D expressivo, como a arte validada). Não trocar por um robot humano genérico, nem forçar rosto animado no logótipo corporativo.
4. **Maquetes de ecrãs recentes:** `assets/reference/DASHBOARD_NEON.png`, `COMUNIDADE.png`, `BIBLIOTECA.png`, `GENESIS.png`, `WEB_ECOSISTEMA.png`. São inspirações visuais de alto nível: **não tratar nomes, datas, preços, XP, métricas, estados de vendas e testemunhos desenhados como verdade**.
5. **Maquetes HTML v1.1:** `legacy_reference/Club_Atlas_Maquetes_v1.1` é fonte auxiliar de hierarquia/layout e comportamento mobile; a identidade aprovada mais recente e as orientações desta missão prevalecem em caso de conflito.
6. **Drive consultado:** https://drive.google.com/drive/folders/1_XKpF37IWPfRW8nqjdyV2KYPMA-AcT6P . A pasta principal contém `EMPRESA_AUMENTADA_2027-2030_WORKSHOPS`, cujo ramo `05_ATLAS_LAB_CLUB_ATLAS` agrega Genesis, pré-lançamento e alguns PNG. Este Drive é uma **fonte de contexto, não baseline sincronizado**: há artefactos antigos NEXO, divergências de personagens e data `12/01/2027` em materiais antigos. Ler `00_AUDITORIA_DRIVE_GITHUB.md` e `02_ASSET_MANIFEST.json` do pack. Não substituir automaticamente fontes nem apagar históricos.
7. Os screenshots e HTML devem estar em `design/` no repo para Claude Code os consultar. Se não tiveres o pack entregue no ambiente de trabalho, **solicita o pack** e bloqueia apenas a fase de fidelidade visual; podes entretanto auditar código, preparar componentes e testes. Nunca afirmar que vistas imagens que não foram disponibilizadas.
8. A arquitetura anterior de `app.atlashub.si` pertence à AtlasHub AI Workforce e Workspaces. **É proibido modificar esses projetos, rotas, DNS ou serviços.** A marca institucional e workshops B2B pertencem a `atlashub.si`; Editions é publicação editorial autónoma. O Club pode apresentar e redirecionar, mas não recriar a operação B2B.

### CONFLITOS A TRATAR EXPRESSAMENTE
- **Casting:** a composição visual *aprovada pelo proprietário* contém **Sérgio Monteiro / Lucas / Atlas / Clara / Lia (grafada LIA na peça)**, enquanto o `TEAM_MANIFEST` e os `SOUL.md` atuais usam **Sérgio / Atlas / Clara / Caio / Bia**. O nome LIA também surge noutro projeto AtlasHub. **Não decidir arbitrariamente identidade técnica nem sobrescrever agentes.** Propor `IDENTITY_DECISION.md` com tabela de mapeamento, recomendar nomes da arte aprovada para a **UI**, e solicitar validação de Sérgio antes de renomear perfis Hermes e IDs persistentes. Até lá: não ligar integrações de agentes baseadas nesses aliases.
- **Visual:** o brief antigo pede símbolo sem rosto e o brief mais recente do avatar prevê triângulo expressivo. Resolver como dois usos distintos: **logo corporativo = geometria fiel**; **mascote viva Club = variação animada compatível com a arte aprovada**, respeitando `prefers-reduced-motion` e fallback estático.
- **Datas:** Genesis abertura **09/01/2027 (sábado)**, não 09/01/2026 nem 12/01/2027. Demo Day março/2027 sujeito a confirmar. Enterprise Lab **28/11/2026**, jamais 21/11 como data ativa. Club inicia em novembro com sessões introdutórias, estreia formal em dezembro. Workshops B2B Anápolis 14/11, Clínica online 16/11; Goiânia em dezembro é apenas objetivo.
- **Preços:** nada de R$49/R$99/R$199/€ ou planos fictícios no checkout; valores e condições não estão homologados. Chamar CTA `Entrar gratuitamente` ou `Manifestar interesse no Genesis` apenas se formulário efetivamente seguro/ativo; caso contrário `Em preparação / Receber novidades` com comportamento honesto.

## 1. VISÃO E POSICIONAMENTO

Club Atlas é um **campus digital, comunidade de aprendizagem e laboratório de construção com inteligência operacional** para estudantes universitários de TODAS as áreas, iniciantes, jovens e adultos em transição, criadores, profissionais digitais, desenvolvedores e pequenos empreendedores.

**Promessa:** "Você não precisa saber programar. Precisa começar." / "O seu agente. O seu laboratório. O seu mundo." / "Aprender • Construir • Crescer • Realizar." O participante desenvolve conhecimentos, memória e ferramentas que controla e exporta, e aprende a dirigir projetos com pessoas e agentes de forma supervisionada.

A gamificação reconhece competências e realizações verificáveis, não cliques ou consumo passivo. A plataforma deve acolher quem só tem smartphone, sem prometer depuração avançada no telefone sem recursos remotos apropriados. Usar **PT-BR** no UI público, sem anglicismos evitáveis. UI acessível, divertida e séria; estética de campus tecnológico com profundidade e comunidade, não casino nem SaaS corporativo.

Separar fisicamente EXPERIÊNCIA PÚBLICA e CONTEÚDO PROTEGIDO; não confundir recursos conceptuais com serviços ativos.

## 2. ARQUITETURA E RESPONSABILIDADES

### Website e aplicação
- Manter **Next.js App Router + TypeScript** já existentes no repo e Vercel ligado ao subdomínio `club.atlashub.si`, em projeto independente. Respeitar estrutura em produção; não resetar configuração, não migrar frameworks sem RFC.
- Organizar por `(public)`, `(auth)`, `(member)`, `(admin)` via route groups quando adequado; componentes por domínio. Reutilizar sistema atual durante migração, sem quebrar links existentes ou histórico Git.
- Design system próprio: tokens da marca, tipografia, componentes, micro-interações, assets individuais, contrastes WCAG 2.2 AA, foco e teclado, mobile 360/390/430, tablet 768 e desktop 1280/1440/1920.
- Imagens hero e casting como mídia, mas copy, menus, CTA, tabs, cards, tabelas e formulários **em HTML/React acessíveis**, não elementos desenhados permanentemente dentro do PNG.

### Dados e autenticação
- Inspecionar Supabase AtlasHub existente sem modificar projectos alheios. **Escolher projeto Club separado, ou esquema isolado com RLS rigoroso e autorização específica**, depois de auditoria e validação humana. Primeiro propor migração; não executar DDL na Workforce.
- Supabase Auth (ou IdP aprovado), validação de e-mail, recuperação de senha, perfis e consentimentos. SSO AtlasHub só com contrato explicitamente validado; não partilhar cookies ou service-role indevidamente.
- Conceito de tabelas (proposta, não migrar sem plano): `club_profiles`, `interests`, `memberships`, `membership_grants`, `member_consent`, `content_items`, `content_entitlements`, `reader_progress`, `events`, `event_registrations`, `cohorts`, `cohort_enrollments`, `lessons`, `mission_definitions`, `mission_progress`, `mission_evidence`, `achievements`, `member_achievements`, `projects`, `project_members`, `agent_definitions`, `agent_context_entries`, `agent_jobs`, `agent_job_approvals`, `resource_quotas`, `billing_orders`, `billing_payments`, `moderation_reports`, `audit_events`. Modelo normalizado, migrations reversíveis, índices, deletes e histórico coerente.
- RBAC server-side com identidades **VISITOR**, **FREE**, **GENESIS_ENROLLED**, **LAB_ENABLED**, **EDITOR/MODERATOR**, **ADMIN**; separar compra editorial individual e entitlement de workshop. Planos *Explorer/Builder/Founder* apenas desenho até aprovação comercial. RLS, SSR/server actions/route handlers; mostrar botão bloqueado no browser **não equivale a autorização**.
- LGPD: consentimento informado, minimização, opt-out, retenção/eliminações, pedidos de dados, anti-abuso, rate limiting, logs sem PII. Não aceitar leads sem termos aprovados e proteção de bot. Inauguração de turma 18+ por defeito até análise separada.

### Conteúdo editorial
- Editions continua proprietário dos masters e Reader. Criar **adapter/content provider** para catálogo e leitores autenticados com entitlements, sem copiar PDFs comerciais para pasta pública ou reescrever livros. Inicialmente catálogo metadata mock **marcado como exemplo**, depois integração real com contratos e autorização.
- O Club possui guias gratuitos, aulas Genesis, gravações consentidas, tutoriais, missões, projetos e descrições públicas de workshops B2B com redirecionamento.

### Comunidade, agentes e laboratório
- Discord: integração e links voluntários, conteúdo da comunidade e canais sob moderação humana. Telegram privado para teste operacional dos mentores; WhatsApp com adesão voluntária e validação de API/política, não criar bot de grupo usando bypass de sessão pessoal.
- Atlas é co-mentor SI: **persona/Hermes deve rodar isolada fora do frontend**. Interface pode iniciar chat quando backend e chave/quotas forem homologados; sem respostas falsas disfarçadas de modelo real. Voice/STT/TTS apenas após consentimento, orçamento e segurança. Ref. Drive: documento `CLUB ATLAS — Avatar Interativo ATLAS | Briefing para Claude Code` na pasta `05_ATLAS_LAB_CLUB_ATLAS`.
- Clara/Builder/Explorer: apenas SOUL/MISSION draft; não migrar automaticamente produção de agentes da Holding. Sem hierarquia: todos respondem a Sérgio; Helena coopera em infra/acessos somente após autorização específica.
- Atlas Lab pessoais: ambientes isolados, armazenamento privado, quotas CPU/RAM/disco/rede/tokens/tempo, revogação e exportação. NÃO dar root à VPS partilhada, nem usar VPS de pagamentos/Workforce. Antes de VM real: construir somente interface e adapters stub claramente rotulados.
- **Pagamentos** PixGo/MisticPay/cartão/boleto como integrações futuras desligadas, apenas após homologação jurídica, financeira e técnica. Totais e encargos visíveis antes da aceitação. Sem cobrança/simulador que confirme pagamentos ou vagas inexistentes.

## 3. MAPA DE PÁGINAS OBRIGATÓRIAS

### Públicas — obrigatórias
`/` Hero com identidade visual validada, CTA de adesão, explicação para estudantes de todos os cursos, 4 cenários de projetos, como começar, mentores, agenda, comunidade, FAQ, comunicação AtlasHub.SI e Editions.
`/participar` captação gratuita em conformidade LGPD; formulário com estados disabled/loading/error/success, sem falsa inscrição quando serviço offline.
`/genesis` objetivo, 8 semanas/24 ateliers, projetos possíveis, inclusão mobile e bolsa, pré-candidatura, 09/01/2027 (provisional), ausência de promessas de startup/emprego.
`/mentores` cards consistentes e declarações de personagem digital; Sérgio humano, Atlas mascote, Clara, Lucas e Lia conforme arte aprovada e decisão de casting.
`/eventos` calendário distinto de Club Open Forums e workshops executivos externos.
`/biblioteca` vitrine editorial + conteúdos FREE + gated com metadados claros.
`/comunidade` fóruns, regras, canais verificados, Build Nights, desafios; não sugerir Discord/WA já operacionais sem confirmação.
`/projetos` showcases apenas autorizados ou projetos fictícios rotulados; onboarding de proposta.
`/atlas` explicação e presença animada do Atlas (futuro chat real).
`/privacidade`, `/termos`, `/acessibilidade`, `/contacto` com conteúdo jurídico validado antes de release.

### Autenticadas — construir UI e autenticação real quando autorizado
`/entrar`, `/registar`, `/recuperar-acesso`, `/onboarding`.
`/home` Dashboard real: saudação, objetivos, próximo atelier, Missão 001, biblioteca, projetos, agenda, CTA Atlas, estado de níveis e acessos.
`/minha-jornada`, `/missoes/[slug]`, `/conquistas` — progressão baseada em evidência.
`/biblioteca/meus-conteudos`, `/reader/[contentId]` — Reader via entitlement;
`/genesis/turma-01` — trilha, calendário, capítulos, materiais e entregas;
`/meu-agente`, `/lab`, `/lab/projetos`, `/projetos/meus`, `/perfil`, `/preferencias`, `/privacidade/dados`.
`/admin` com auth/role, gestão conteúdo/membros/inscrições/eventos/questões, logs e políticas.

**A primeira publicação pode conter placeholder funcional honesto onde há dependências; não tornar páginas incompletas visíveis como produto pronto.**

## 4. PRIORIDADE VISUAL E COMPONENTES

### Baseline das páginas
- `CLUB_ATLAS_TEAM_VALIDADO.png`: rostos, casting, atmosfera, mistura warm amber + navy + cyan, tom luso-brasileiro, hierarquia da marca; **não redesenhar as faces** por CSS ou imagens geradas ao acaso.
- `BOARD_ECOSISTEMA.png`, `BOARD_UX.png`: arquitetura visual multi-page, ritmo das secções.
- `DASHBOARD_NEON.png`: dashboard/learning com hero pessoal, cards, barra de progresso, layouts.
- `COMUNIDADE.png`: activity feed, salas, fóruns, participação.
- `BIBLIOTECA.png`: catálogo, filtros, progresso, cards, níveis e conteúdo Editions.
- `GENESIS.png`: percurso, ateliers e projetos com a turma.
- `DESIGN_SYSTEM_BOARD.png`: tokens e exemplos de UI, apenas como referência; converter em biblioteca de componentes coerente, sem replicar números/comercial fictícios.

### Asset pipeline
1. Criar `design/README.md`, `design/assets/manifest.json`, `public/assets/club/` com nomes estáveis. Preservar originais como `design/reference` (não servir arquivos grandes desnecessariamente na web).
2. Otimizar formatos web (AVIF/WebP) com dimensões corretas, LCP preload do hero, uso `next/image`; preservar os originais e anotá-los no manifest com hashes.
3. Componentes reais: `ClubLogo`, `AtlasAvatar`, `HeroCollage`, `MentorCard`, `ProgressRing`, `MissionCard`, `CourseCard`, `LibraryCard`, `EventCard`, `MembershipAccessBadge`, `MemberSidebar`, `DashboardTopbar`, `CommunityPost`, `AchievementBadge`, `GenesisTimeline`, `ProjectCard`, `ConsentDialog`, `EmptyState`, `PaywallInfo`, `AgentStatus`.
4. Animar Atlas suavemente (flutuar/pulsar/glow); fallback estático em mobile baixo desempenho/reduced motion; nunca capturar microfone ao entrar na página; ações externas só após consentimento e permissão.
5. Garantir arte hero respeitada mas modular: nunca usar screenshot inteiro como UI clicável. Tipografia e copy são DOM nativo. Estados loading/error/empty/offline sem perda de design.
6. Usar um snapshot baseline de cada maquete (1440×900 e 390×844, 768×1024), screenshots das implementações lado a lado + relatório de divergências (grid, espaçamento, tamanho de texto, imagem, mobile, legibilidade). Não reclamar "pixel-perfect" sem evidência.

## 5. MISSÃO 001 — 'O MEU PRIMEIRO AGENTE' (OBRIGATÓRIA NO DASHBOARD)

Essa é a primeira jornada real do membro e prova de valor do Club, não um cartão decorativo.

**Etapa 1 — Plantar a semente:** escolher objetivo/problema, contexto e primeira tarefa mensurável. Conclusão: objetivo claro, contexto e tarefa pequena registados e confirmados.
**Etapa 2 — Dar identidade:** nome, função, tom, pelo menos três comportamentos e limites. Conclusão: ficha do agente persistida e confirmada.
**Etapa 3 — Ensinar contexto:** introduzir três elementos de informação consentidos (ou dados fictícios), editar e apagar, executar teste que recupere dois corretamente. Conclusão: prova de recuperação e compreensão de controlo sobre memória. Não guardar segredos/PII sensíveis por defeito.
**Etapa 4 — Primeira realização:** produzir um artefacto (plano de estudos, catálogo fictício, conteúdo), comparar com o objetivo, fazer pelo menos uma revisão e obter confirmação do membro. Conclusão: evidência de artefacto, feedback, nova versão, aprovação.

**Gamificação sugerida:** 25 XP por etapa após **validação de servidor e evidência**; conquista `Primeiro Agente Criado` 100 XP. Não dar XP só por marcar checkbox; prevenir abuso, replay e contagem duplicada. Percurso retomável em mobile, estados draft/in-progress/review/completed, revisão de etapas e auditoria. Dados por utilizador com RLS.

Três trilhas/contextos de exemplo: estudante (tutor), pequeno negócio/marketplace (assistente catálogo fictício), criador (parceiro conteúdo). São variantes de uma missão única e devem usar mesmos contratos de dados.

**Sem runtime Hermes validado:** permitir DEMO GUIDADA explicitamente fictícia, não dizer "agente criado" real; evidência pedagógica distinta do provisionamento técnico. Guardar definição do agente com `runtime_status = not_provisioned`; futuro provisionamento apenas via workflow autorizado com quota.

**UX de missão:** 4 cards de etapas, progress ring, checklist, botões de continuar/retomar, salvaguarda, exemplos, intervenção Atlas contextual e próxima missão `Ensinar uma nova capacidade`. Pausar ou desistir sem perder dados indevidamente.

## 6. NÍVEIS DE ACESSO, BOLSAS E VENDAS

- Entrada `Club Free` é pública/sem preço. Atividades públicas gratuitas, opt-in Discord/WA, calendário, guias livres.
- Percursos pagos e infra reservada só mediante plano homologado; **não publicar preços originados em mockups**.
- Genesis pré-candidatura independente de cobrança e sem vaga automática. Programa prevê bolsas integrais e parciais conforme orçamento; nenhum candidato excluído da comunidade por falta de dinheiro.
- Bolsas NÃO implicam trabalho gratuito à AtlasHub, nem cessão de IP ou sociedade. Atlas Ventures exige seleção e acordo separado.
- Pagamentos PixGo/MisticPay/cartão/boleto: adapters e testes sandbox futuros, webhooks autenticados/idempotentes, reconciliação, reembolso e faturação. Encargos previamente visíveis e aceites. Não implementar cobranças reais até owner autorizar.
- Em componentes UI, `Free`, `Genesis`, `Lab Enabled`, `Purchased Edition` e admin roles devem refletir permissões válidas, não cosméticas.

## 7. CAMPANHA E INSTRUMENTAÇÃO

- Preparar áreas reutilizáveis de conteúdo e social CTA com UTM, origens e consentimento; sem pixel de tracking não aprovado.
- Templates de OpenGraph/social cards e conteúdos para apresentar `Sérgio + Atlas + mentores digitais`, chamada ao Club gratuito, Genesis em janeiro, desafios e pequenas demonstrações.
- Não afirmar que existe turma concluída, projetos financiados, 60% de progresso de membros reais, vários milhares de membros, vagas/pagamentos abertos ou provas sociais sem dados.
- Painel admin básico com consent-based conversion analytics; eventos: landing_view, signup_started, signup_completed, genesis_interest, mission_step_completed, mission_001_completed, library_open, event_interest (sem dados sensíveis no analytics).

## 8. PLANO DE EXECUÇÃO E PRs — NÃO TENTAR TUDO NUM ÚNICO MERGE

**PR0 | Auditoria/Design freeze (primeiro e obrigatório)**
- Inventariar repo real, confirmar estado Vercel e branch, fotos/logos, materiais de Drive, design pack e inconsistências.
- Entregar `docs/IDENTITY_DECISION.md`, `design/README.md`, manifesto dos assets e capturas baselines. Discrepâncias de Lucas/Lia vs Caio/Bia, mascote vs logo, 09/01/27 vs 12/01/27, entidades Editions vs Club.
- Atualizar docs descritivos sem substituir decisões não homologadas. Nenhum deploy.

**PR1 | Design System + Landing 1.0**
- Tokens, typography, assets, nav/footer, landing responsiva, mentor section e CTA honesto, sem preço falso; screenshots comparativos.

**PR2 | UI de produto completa com dados demonstrativos identificados**
- Dashboards, biblioteca, Genesis, comunidade, eventos, projetos, Atlas Lab, detalhe de mentores, onboarding, empty states e mobile. Não expor demo como área privada protegida; proteger rotas ou rotular preview.

**PR3 | Auth + Dados + Área de Membros**
- Schema/migrations testadas e **sujeitas à autorização para DB**, Supabase Auth, perfil/onboarding, RLS, acesso server-side, consentimentos, rate limit, painel real, dados de teste segregados.

**PR4 | Mission Engine + Missão 001**
- 4 etapas, validação de evidência, XP server-side, histórico, retomada, edição e eliminação contexto, UI e testes; modo demo se Hermes não provisionado.

**PR5 | Biblioteca Editions + turmas Genesis**
- Contrato do catálogo, direitos, Reader quando autorizado, aulas/ateliers, eventos/tarefas, candidaturas e admin básico.

**PR6 | Conectores e presença Atlas**
- Avatar animado acessível, chat seguro via backend, indicação de ativo/inativo, status da fila, Hermes e Telegram/Discord **somente em staging com Helena e Sérgio**. Feature flags, budgets e kill switch.

**PR7 | Lab executável + pagamentos + operação avançada**
- Só quando homologados isolamento, compliance, backups, quotas, testes adversariais e fornecedores financeiros. Não bloquear lançamento gratuito por esta fase.

Se existir dependência pendente, concluir código/testes dos módulos que não dependem dela, documentar bloqueio e enviar pergunta exata ao Sérgio. **NÃO inventar configurações.**

## 9. TESTES, QUALIDADE E DEFINITION OF DONE

Todas as PRs devem apresentar: scope, base HEAD, ficheiros alterados, migrations, comandos executados/outputs, evidências, screenshots desktop/mobile, contraste/teclado/reduced motion, testes positivos/negativos de auth e entitlements, logs e rollback.

**Fundação:** `npm ci` (criar lockfile uma vez que não consta atualmente do repo), `npm run agents:validate`, `npm run typecheck`, `npm run build`; configurar lint/testes de componentes, Playwright e CI incrementais. Não desativar ESLint/TS para ter build verde. Validar versões e compatibilidade de Next/React sem upgrades desnecessários.

**Segurança:** RLS cross-user negativo; sem service role em browser; rate limit; webhook assinado; autenticação e direitos não controlados apenas por UI; isolamento real para código não confiável; fuga de informações; consentimento e export/delete; sessões terminadas; no insecure direct object references; dependency scanning.

**Visual:** comparar hero/landing, membro/dashboard, Genesis, Campus, Library com fontes aprovadas. Manter 1) face e corpo Sérgio; 2) identidade Atlas; 3) personagens restantes; 4) cores navy/cyan/amber; 5) layout; 6) copy funcional e acessível. Corrigir textos de maquete errados, não replicar erros. Se não dispuser de imagem separada válida de um personagem, usar composição autorizada ou placeholder neutro e pedir asset; **não inventar novo rosto.**

**Aprovadores:** Sérgio decide e dá o aceite. Helena só prepara/acede à infraestrutura por ordem dele; agentes/personagens cooperam horizontalmente e respondem diretamente ao Sérgio. Claude Code não tem autoridade para delegar permissões ou alterar produção.

**Releases:** Preview Vercel obrigatório, sem merge/main/deploy produtivo sem aceite explícito. `club.atlashub.si` é o único alvo; não alterar `app.atlashub.si`. Manter recurso `noindex` até autorização SEO e até evitar exposição de páginas incompletas. Estratégia de feature flag e rollback.

## 10. FORMATO DO TEU PRIMEIRO RETORNO (SEM ADIAR TODA A EXECUÇÃO)

1. `AUDITORIA`: HEAD, stack, funcionalidades reais, itens placeholders, Vercel e materiais de design acessíveis.
2. `IDENTITY & VISUAL DECISIONS`: 3–6 conflitos concretos e recomendação; pedir uma decisão específica ao Sérgio apenas quando bloquear execução segura.
3. `ARQUITETURA`: módulos, tabelas, autenticação, permissões, integrações, fronteira Editions/Workforce.
4. `BACKLOG EM PRs`: ordem, estimativa por complexidade/risco e dependências.
5. `PR0/PR1`: começar de imediato numa branch nova, produzir artefactos verificáveis, testes e screenshots; abrir draft PR e deixar `main` intacta.
6. `PEDIDOS À HELENA`: lista mínima de serviços/acessos e ambientes staging, sem segredos em GitHub público.
7. `RELATÓRIO GO/NO-GO`: declarar o que realmente funciona, o que continua concept/placeholder e o que falta para lançamento público.

**RESULTADO ESPERADO:** entregar uma experiência Club Atlas fiel ao casting e maquetes aprovados, com landing e área de membros elegantes, onboarding real quando seguro, biblioteca/Genesis/campus coerentes, Missão 001 gamificada verificável e infraestrutura agentic evolutiva — mantendo segurança, direitos dos membros, governança e distinção da AtlasHub empresarial.
