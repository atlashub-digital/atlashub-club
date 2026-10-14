# CLUB ATLAS · by AtlasHub.SI

**Comunidade e laboratório de aprendizagem, construção e experimentação com agentes de IA.**
Projeto em preparação para club.atlashub.si. Repo público: não contém segredos, dados pessoais nem infra de produção.

> Pessoas reais + inteligência operacional + aprendizagem prática + projetos vivos.

## Ponto de partida
- Comunidade Club Atlas: entrada gratuita, encontros, desafios e discussão; fase introdutória em novembro de 2026, lançamento em dezembro.
- Atlas Lab: ambientes computacionais isolados e agentes pessoais, inicialmente sob capacidade e aprovação.
- Genesis Turma 01: abertura prevista sábado 09/01/2027; programa de 8 semanas, 24 ateliers; pré-candidatura não vinculativa.
- Atlas Ventures: seleção e incubação propostas, sem prémios societários garantidos.
- Workshops Enterprise Transformation independentes: Anápolis 14/11 presencial, 16/11 Clínica online; Enterprise Lab E-commerce em 28/11; Goiânia alvo dezembro.

## Produtos e URLs
- Club público e área de membros futura: **club.atlashub.si**, deploy separado.
- **app.atlashub.si continua reservado à AI Workforce/Workspaces**; não alterar.
- Editions é motor editorial transversal: apenas integração por API/permissões, sem mover fontes/editoriais para este repo.
- WhatsApp e Discord são plataformas comunitárias; Telegram é canal operacional para mentoria e agentes.

## Estado do repositório
A fundação v0.1 (PR #1) está integrada na `main` e publicada em club.atlashub.si (com `noindex`). O PR0/PR1 acrescenta o design system v1.0, a landing fiel à composição aprovada e a pasta `design/` com as referências visuais. **Não existe ainda** registo ativo, contas, checkout, bots online nem gateway Hermes. A página de membro é apenas uma pré-visualização; não existe acesso pago simulado.

- Auditoria, arquitetura e plano de PRs: [docs/13_AUDITORIA_ARQUITETURA_PLANO.md](docs/13_AUDITORIA_ARQUITETURA_PLANO.md)
- Decisão de identidade (Lucas/Lia vs Caio/Bia, logo vs mascote): [docs/IDENTITY_DECISION.md](docs/IDENTITY_DECISION.md)
- Fontes visuais e regras de uso: [design/README.md](design/README.md)

> **Atenção:** o projeto Vercel faz deploy de produção automático a partir de `main`. Um merge publica em club.atlashub.si.

Começar em [docs/00_PROJECT_CHARTER.md](docs/00_PROJECT_CHARTER.md), [docs/03_GOVERNANCE_AND_ACCESS.md](docs/03_GOVERNANCE_AND_ACCESS.md), [docs/10_HANDOFF_HELENA.md](docs/10_HANDOFF_HELENA.md) e [agents/README.md](agents/README.md).

### Instalação local
Node.js 22 recomendado; configurar .env.local a partir de .env.example. 
~~~bash
npm ci
npm run dev            # http://localhost:3000
npm run verify         # agentes + guarda de conteúdo + typecheck + build
npm run test:e2e       # Playwright (desktop + mobile) + axe; requer build
~~~
A captação de leads está **desativada por defeito**, até existir Supabase, anti-abuso e consentimentos aprovados. Não colocar chaves API no browser, repo, screenshots, logs ou mensagens.

## Autoridade
**Sérgio Monteiro é responsável direto pelas decisões e missões.** Atlas, Clara, Caio e Bia não formam cadeia hierárquica. Helena facilita acesso e infraestrutura **só mediante autorização expressa de Sérgio**; não atua como chefe dos restantes. Mudanças de produção, custos, distribuição pública, pagamentos e acessos exigem aprovação humana.

## Licença e cautelas
Material interno em revisão, publicado num repo público: consultar direitos de imagem, de marca e de conteúdo antes de republicar. Não existe licença de exploração de material terceiro implícita. Personagens virtuais devem ser identificadas como tal.

© AtlasHub — People | Technology | Results.
