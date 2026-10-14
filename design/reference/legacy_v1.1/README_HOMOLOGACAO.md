# CLUB ATLAS — Maquetes de Base v1.1

**Data:** 13 de outubro de 2026
**Estado:** `VISUAL CANDIDATE` — proposta para homologação por Sérgio Monteiro. Não é deploy, UI integrada, área autenticada ou agente operacional.

## Decisão de posicionamento

- `atlashub.si`: Enterprise Transformation, diagnósticos e workshops B2B, AI Workforce e serviços empresariais.
- `AtlasHub Editions`: obras, publicações, catálogo e Reader; fonte editorial independente e conteúdos consumidos via contratos e direitos de acesso.
- `club.atlashub.si`: comunidade, aprendizagem, estudantes universitários de qualquer área, jovens e adultos iniciantes, builders, tutores/agentes pessoais, desafios e projetos; workshops institucionais podem ser mencionados e encaminhados por link para AtlasHub.SI.
- `app.atlashub.si`: permanece reservado à experiência empresarial da Workforce/Workspaces.

## Entregas de maquete

| Nº | Artefacto | Objetivo |
| --- | --- | --- |
| 01 | `01_Landing_Publica_Desktop.png` / `.html` | Entrada pública, promessa de criar o próprio agente e 4 percursos (tutor, projeto, negócio, ideia). |
| 02 | `02_Dashboard_Membro_Desktop.png` / `.html` | Área pessoal, biblioteca, agenda, desafios e direitos de acesso representados de forma conceptual. |
| 03 | `03_Genesis_Lab_Desktop.png` / `.html` | Espaço Genesis, terminal do Atlas como simulação e 8 semanas/24 ateliers. |
| 04 | `04_Campus_Comunidade_Desktop.png` / `.html` | Fóruns, comunidade multidisciplinar, Build Nights e mentores humanos/digitais. |
| Mobile | `01_Landing_Publica_Mobile.png` e `02_Dashboard_Membro_Mobile.png` | Referências responsivas para homologação. |

Os `.html` são protótipos estáticos que podem ser abertos localmente juntamente com o diretório `assets/`; não possuem formulário operacional, autenticação, banco de dados, interações ou conteúdos pagos. O script `build_mockups.py` regenera as screenshots em Chromium/Playwright quando instalado.

## Design System — candidato

- Navy profundo `#030B18` e painel `#08192D`.
- Azul elétrico `#0879FF`, ciano `#44DFFF`, branco `#F4F9FF`, azul de leitura `#8DA9C8`.
- Triângulo vivo derivado do logo AtlasHub, sem humanização infantil; imagem 2 (luz/partículas) como referência para comunicação e hero, imagem 1 (emblema) para avatar/identidade.
- Hierarquia legível, ênfase em copy/PT-BR para público brasileiro, respostas mobile, contraste e movimento moderado.
- Sem preços ou métricas falsas. Sem demonstrações apresentadas como funcionalidades disponíveis.

## Personas em evidência

- Sérgio Monteiro — mentor humano / autoridade e visão; 
- Atlas — símbolo triangular SI, co-mentor e engenheiro-chefe *pedagógico*, não autoridade de produção;
- Clara — mentora digital de comunidade;
- Caio — builder digital;
- Bia — exploradora digital e perspetiva iniciante.

Todos respondem diretamente a Sérgio. Helena presta colaboração técnica conforme instruções e autorizações dele, sem relação hierárquica com os outros agentes. Personagens digitais identificadas como tais na comunicação.

## O que falta antes de engenharia

1. **Homologação visual:** layout, copy PT-BR, marca do Club e uso oficial das imagens e perfis.
2. **Contratos de produto:** visitante/free, membro, Genesis, direitos do Editions e futuras opções financeiras (ainda não aprovadas).
3. **Identidade e dados:** design de Supabase/Auth isolado da Workforce, LGPD, antispam e RLS em servidor, sem recolha real antes de aprovação.
4. **Handoff de engenharia:** apenas após homologação, missão Claude Code e PR de implementação em branch, com screenshot QA desktop/mobile.
5. **Perfis Hermes:** preparação documental por Helena; não provisionar bots, tokens nem criar grupos sem autorização expressa.

## Referências operacionais no GitHub

- Repo: https://github.com/atlashub-digital/atlashub-club
- PR #1 — foundation, draft: https://github.com/atlashub-digital/atlashub-club/pull/1
- Issue #10 — homologação visual: https://github.com/atlashub-digital/atlashub-club/issues/10
- Issue #5 — preparação Helena/Hermes: https://github.com/atlashub-digital/atlashub-club/issues/5

**Atenção:** estes ficheiros são maquetes; o website já ligado ao Vercel, segundo informação do Sérgio, não foi modificado nesta tarefa.
