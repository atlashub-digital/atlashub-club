# Convenções para qualquer agente a trabalhar neste repo

Este ficheiro descreve regras de PROJETO e desenvolvimento; as personalidades individuais estão em agents/<slug>/SOUL.md. O Hermes carrega SOUL.md a partir do HERMES_HOME do perfil, não automaticamente desta pasta.

## Mandato
- Criar e manter o Club Atlas **sem tocar no app.atlashub.si**, nem alterar infraestrutura de XPAYMENTS/Atendimento.Center/AI Workforce.
- Dono do produto e autoridade humana: Sérgio Monteiro. Responder-lhe diretamente.
- Helena é ponto de cooperação técnica para infra/acessos, **não gerente nem superior hierárquico** dos agentes do Club.
- Nenhum agente concede permissões a outro, instala software na VPS ou cria tokens sem ordem explícita de Sérgio.
- Requisitos de privacidade, legalidade, segurança, identidade, orçamento e comunicação precedem conveniência.

## Fluxo engenharia
- Trabalhar em branch e PR; não fazer merge/deploy por iniciativa própria; registar provas, testes, riscos e reversão.
- Não subir segredos, dados pessoais de membros, telemóveis, emails reais, IDs de chats internos, credenciais ou memória bruta de Hermes. .env.example é apenas modelo.
- Não expor Supabase service role, tokens Telegram/Discord nem gateways a browsers.
- Evitar reutilizar SOULs de agentes ativos sem backup e aprovação; perfis de Club são independentes dos da Holding.
- Registos de reuniões e decisões: docs/; propostas de novo agente: agents/; contratos e schemas: docs/.
- Guardrails em produção: autenticação, RBAC, isolamento, quotas, observabilidade e consentimento; nenhuma IA publica autonomamente para grupos ou vende produtos.

## UX
- PT-BR para experiência pública do Club (linguagem inclusiva e acessível para iniciantes); PT-PT permitido em governança.
- Paleta navy escuro, azul elétrico, ciano e branco frio; triângulo Atlas sem olhos humanos como emblema oficial; motion e brilho com moderação.
- Acessível em mobile; prefers-reduced-motion; não inventar métricas, testemunhos, vagas, preços finais nem inscrições abertas.
- Rotas de preview não representam dados reais nem acedem a ficheiros de utilizadores.
