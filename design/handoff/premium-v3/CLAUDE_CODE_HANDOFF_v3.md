# CLAUDE CODE — CLUB ATLAS | MAQUETES PREMIUM v3

**STATUS: CANDIDATO A REVISÃO. Não fazer merge/deploy sem aprovação de Sérgio.**

## Contexto

O pack v2 tinha direção de produto correta, mas falta de presença da marca, estilo demasiado genérico e distanciamento das composições homologadas. Este v3 propõe uma experiência premium, jovem, imersiva e ligada ao Club Atlas original.

- Repo: https://github.com/atlashub-digital/atlashub-club
- URL público pretendido: `club.atlashub.si`; main publica automaticamente, portanto **não fazer merge**.
- PR #11 é o baseline de código a preservar; este pack é **contrato de design** para um PR de revisão, não um substituto automático do trabalho em andamento.
- Não alterar `app.atlashub.si`, AI Workforce, Clara Corporate ou Hermes em produção.

## Entregáveis visuais do pack

- `index.html` — landing institucional Club, manifesto/casting, Laboratório Experimental, benefícios e entrada gratuita/Genesis.
- `genesis.html` — programa de oito semanas/24 ateliers previstos, percurso, preço regular e condição estudante.
- `aderir.html` — wizard de quatro etapas navegável **apenas em browser**; preço calculado localmente somente para demonstração.
- `dashboard.html` — demo área pessoal: Missão 001 e Meu Ecossistema.
- `design.css` — sistema visual v3 com tokens, layout e quebras mobile.
- `onboard.js` — protótipo de mudanças de estado sem rede e sem guardar dados.
- `assets/` — material aprovado, recortes de imagem; **nenhum rosto gerado novamente**.
- `screenshots/` — **pré-renders** de referência; renderizar screenshots browser Chrome/Playwright reais com PR antes de afirmar paridade.

## Identidade visual

- Ambiente: deep navy/black `#050b13`, superfície `#0b1a2a`, texto `#f5f8fb`, secundário `#a3b9c9`, ciano `#60d9f6`, azul de apoio `#1da4e7`, dourado `#edb463`.
- Tipografia: título grande, denso, editorial, com linhas quebradas deliberadamente, mínimo de três níveis hierárquicos.
- Usar **fotografia original aprovada** da equipa e avatar Atlas. Não substituir por robô genérico, não regenerar ou alterar rosto de Sérgio, Lucas, Marta e Bia.
- Nomes públicos: **Sérgio · Lucas · Atlas · Marta · Bia**. Conferir homologação definitiva e mapeamento técnico antes de renomear perfis Hermes/IDs, sobretudo colissões com Clara Corporate e LIA LeveLab.
- Substituir futuramente `logo_original.png` por símbolo/fonte oficial SVG com direitos homologados, sem alterar geometria aprovada.
- A mascote Atlas (com expressões luminosas) é separada do logo institucional; não tornar o logo oficial um emoji.

## Conteúdo / produto

- **Club Atlas grátis**, sem obrigação de adquirir Genesis, com espaço introdutório de comunidade e desafios.
- **Genesis**: R$ 490 regular e R$ 190 estudante **elegível após comprovação validada no backend**; 8 semanas, 24 ateliers previstos; 09/01/2027 previsto. Não afirmar matrícula/pagamento ativo ou promessa de vagas.
- Priorizar **criar o primeiro agente → dar memória/contexto e ferramentas → coordenar uma equipa de agentes → desenvolver projeto real**. Não reduzir oferta a chatbot ou treino de prompts.
- Público: estudantes de todos os cursos, jovens e adultos sem experiência prévia, criadores, pequenos empreendedores e builders.
- Altas normas de inclusão mobile, redução de movimento e acessibilidade.

## Regras de implementação

1. Analisar PR #11 e dividir o delta visual em componentes React reais. Não fazer crop original como foto de página inteira; colocar texto, CTAs e cartões no DOM.
2. Produzir UI de landing, sales, form e dashboard com tokens/components comuns; layouts desktop 1440, tablet 768 e mobile 390.
3. Registo real: Auth/CRM só depois de consentimentos, anti-spam, RLS, limites por tenant e revisão da Helena. O HTML não faz POST.
4. Condição estudantil: não confiar em checkbox. Criar estado pendente, prova mínima, revisão ou mecanismo verificável, elegibilidade armazenada server-side. Não aceitar upload de documentos sensíveis sem necessidade e política de retenção.
5. Criar ofertas/cotações server-side, preço assinado, gateways PIX/cartão mediante homologação; webhooks idempotentes; nunca marcar acesso concedido antes de pagamento confirmado.
6. Club grátis nunca é bloqueado por escolha de Genesis. Nenhuma comunicação promocional sem opt-in.
7. Um membro menor de idade não pode atravessar automaticamente fluxo de pagamento sem solução legal apropriada.
8. Progressão e Missão 001 só persistem após login, provas, validação server-side. Não inventar percentagens, testemunhos, vagas, contador de membros ou cursos publicados.
9. Entregar screenshots **reais de browser** desktop/mobile, delta contra a maquete e evidências de QA; a geração estática deste pack não substitui esse teste.
10. Sem merge e publicação até aprovação do Sérgio.

## Prioridade de revisão

**P0** Casting/identidade e primeira dobra. **P1** Landing + Genesis premium. **P2** wizard navegável sem backend. **P3** dashboard visual. **P4** backend/CRM/eligible student. **P5** pagamentos e agentes reais.

## Critério de aceite visual

- O primeiro ecrã deixa óbvio que é uma comunidade de pessoas e agentes, e não um SaaS genérico.
- A paleta não perde o ciano/azul da AtlasHub, com dourado como acento premium contido.
- Atlas Lab/Genesis aparecem como progressão de capacidade, não botão 'comprar curso'.
- Persona e avatars consistentes; texto PT-BR sem promessas de capacidades disponíveis quando não estão.
- Acessível, mobile, sem sobreposição de botões ou texto cortado; QA visual real obrigatório.
