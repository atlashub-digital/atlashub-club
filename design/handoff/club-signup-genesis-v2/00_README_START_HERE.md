# CLUB ATLAS · Adesão, Genesis e Dashboard — Pack de maquetes v2.0

**Data:** 14/10/2026  
**Estado:** CANDIDATO A HOMOLOGAÇÃO — não publicado, não entregue a produção  
**Repo-alvo:** https://github.com/atlashub-digital/atlashub-club  
**PR atualmente sob revisão:** https://github.com/atlashub-digital/atlashub-club/pull/11

## Decisões de produto presentes neste pack
1. Uma só entrada em `club.atlashub.si`: **Club Atlas gratuito** e um convite transparente para o **Genesis de 8 semanas**.
2. Genesis: **R$ 490 preço padrão** ou **R$ 190 para estudante elegível**, sujeito a validação, sem cobrança enquanto a infraestrutura/condições não estiverem aprovadas.
3. Club grátis **não está condicionado a comprar Genesis**. Participar na comunidade faz parte da experiência Genesis, mas a comunidade livre continua gratuita.
4. Primeiro foco: jovens e adultos, estudantes de todas as áreas, iniciantes sem programação, criadores e builders. Menores de 18 anos necessitam de fluxo apropriado aprovado.
5. Oferta Genesis: 8 semanas, **24 ateliers previstos**, agentes pessoais, equipes agentic, laboratório progressivo e projetos; início **previsto** 09/01/2027 em Anápolis + online.
6. Conservação da composição visual validada e do símbolo AtlasHub. A imagem usada na landing foi cortada **sem gerar ou modificar rostos** para retirar o texto embutido na arte de equipa. O recorte é derivado de `team_approved.png`.
7. Casting em reconciliação: UI futura Sérgio, Lucas, Atlas, Marta, Bia, sujeita a aprovação expressa e verificação de identidades Hermes. NÃO renomear perfis ativos por automatismo.

## Ficheiros editáveis de maquete
- `index.html` — landing Club + Atlas Lab + duas ofertas, com CTA de inscrição.
- `aderir.html` — formulário interativo de 4 etapas: percurso, dados, interesses, revisão; simula preço estudante/padrão/grátis.
- `genesis.html` — página comercial do programa de 8 semanas, com benefícios e quadro de preços.
- `dashboard.html` — pré-visualização do dashboard pós-registo, com Missão 001, Meu Ecossistema e convite Genesis.
- `style.css`, `flow.js` — UI e transições front-end, **sem API, sem recolha nem pagamento**.

## Referências visuais / screenshots
Em `screenshots/` encontram-se versões desktop **1440 px** e mobile **390 px**. O formulário inclui estados adicionais: dados, interesses, revisão com estudante validável, preço padrão e Club grátis. Todos foram renderizados de HTML, não são simulações gráficas sem fonte.

## Nota de implementação crítica
O formulário HTML é **unicamente um protótipo de interface**. Não funciona como registo real, não submete nem persiste informações. A integração com Auth, o CRM AtlasHub, a validação de estudante, o backend de preços e o checkout devem ser implementados e auditados em PRs próprios. 

**Fonte de verdade:** repositório existente + ativos aprovados da pasta `design/reference/approved` + decisões expressas nesta revisão. Esta versão deve complementar, não substituir às cegas, o trabalho de Claude Code no PR #11.

## Como o Claude deve trabalhar
1. Ler `01_SPEC_FUNCIONAL_ADESAO_E_GENESIS.md` e `02_PROMPT_CLAUDE_CODE.md`.
2. Rever `/`, `/participar`, `/genesis`, `/area-membro`, `src/lib/cast.ts`, `docs/IDENTITY_DECISION.md`, `src/styles/tokens.css`, e a branch do PR #11.
3. Anexar este pack em `design/handoff/club-signup-genesis-v2/` num PR independente ou como follow-up aprovado. Não fazer merge.
4. Implementar primeiro a interface, preservar design, e depois integrações server-side separadas com gates de segurança.
5. Entregar screenshots, delta vs baseline, CI, verificação de acesso, riscos e plano de rollback.
