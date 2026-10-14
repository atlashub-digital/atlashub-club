# Plataforma, níveis e experiência

## Endereços
- club.atlashub.si = aplicação independente: landing, conteúdo público, login futuro e área membro.
- app.atlashub.si = Workforce / Workspaces empresariais. Nenhuma partilha de sessão implícita.
- atlashub.si = portal-mãe e SEO institucional.
- Editions = origem editorial externa; integrações com Reader e direitos de acesso sob contrato API.

## Jornadas
VISITANTE → conhece personagens, manifesto, eventos, lê conteúdos gratuitos → opt-in explícito no Club.
MEMBRO FREE → eventos abertos, clube Discord/WA por adesão voluntária, desafios, biblioteca aberta, perfil mínimo.
EXPLORER / CONTRIBUTOR → níveis comunitários propostos, contribuições não compram votos, dados de terceiros ou acesso privilegiado.
BUILDER / LAB → quota de compute/IA e espaço pessoal isolado quando serviço efetivamente disponível.
GENESIS → vagas, calendário, aulas, mentores, progresso e recursos do percurso contratado/bolsa.
VENTURE → candidatura opcional pós-projeto; nenhuma participação societária pré-atribuída.

**Preços exibidos em mockups anteriores não estão homologados.** Não inserir tiers financeiros no frontend como se estivessem à venda.

## Módulos da plataforma
1 Landing e manifesto; 2 ficha de mentores com declaração explícita de identidade digital; 3 calendário de fóruns e workshops; 4 formulário de interesse gratuito; 5 acesso por identidade/entitlements futuro; 6 biblioteca Editions e conteúdos Club; 7 comunidade via Discord/Telegram/WA; 8 desafios/gamificação; 9 Atlas Lab com gateway de execução isolado; 10 Genesis; 11 projetos/portfolio; 12 Atlas Ventures.

## Segurança do gating
Esconder links no frontend nunca equivale a controlo de acesso. Implementação futura requer proteção **servidor/BD** com auth, RBAC/ABAC, RLS, pagamento validado por webhook assinado, revogação e trilho de auditoria.

## Novos membros sem computador
Entrada por smartphone para conversar com agente **remoto**; para tarefas avançadas prever browser remoto/postos partilhados. Não prometer desenvolvimento irrestrito num telemóvel.
