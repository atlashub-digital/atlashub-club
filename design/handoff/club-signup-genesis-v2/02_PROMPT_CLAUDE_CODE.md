# MISSÃO CLAUDE CODE — Club Atlas Sign-up & Genesis Offer PR2 (Design + Product)

**Prioridade:** incorporar inscrição gratuita do Club + oferta Genesis de 8 semanas e desconto estudante à plataforma do repo oficial.

**Repositório**: https://github.com/atlashub-digital/atlashub-club  
**Preview sob revisão**: https://github.com/atlashub-digital/atlashub-club/pull/11  
**Fonte de assets**: Este pack, `assets/`, `screenshots/`, e imagens já versionadas em `design/reference/approved/` no PR #11.

## Mandato inicial
1. Lê o estado real do PR #11 e da `main`. **Não trabalhes sobre uma suposição** de merge já realizado; o PR #11 está em DRAFT à data deste pack. Não causes conflitos com o trabalho em curso.
2. Preserva baseline visual aprovado da composição do Club e a evolução atual do design system. Usa `index.html`, `aderir.html`, `genesis.html`, `dashboard.html`, `style.css`, `flow.js` e screenshots deste pack como **maquetes funcionais editáveis**, adaptando-as ao Next.js e aos componentes existentes.
3. Implementa em PR separado, sem merge: página principal (modificações orientadas), `/genesis` sales com preço transparente, `/participar` com percurso gratuito + upsell Genesis + edição do perfil, e dashboard preview/estrutura de membros. Nenhum indicador fictício.
4. Implementa primeiro design e navegação; depois entregar proposta técnica de Auth, CRM, student verification e checkout em PRs e gates independentes. Não ativar pagamentos ou registo incompleto no domínio em produção.

## Política comercial definida para design
- Club Atlas comunidade: **gratuito**.
- Genesis Turma 01: **8 semanas**, 24 ateliers **previstos**, acesso à comunidade Club, valor padrão **R$ 490**.
- Estudante elegível, após comprovação: **R$ 190** pelo mesmo Genesis. Nenhuma outra taxa ou parcelamento está aprovado para exibição automática.
- Data de início Genesis **prevista** 09/01/2027, Anápolis + online. Não afirmar vagas abertas, capacidade, benefício vitalício, sucesso financeiro garantido ou atendimento individual irrestrito.
- A adesão gratuita não pode ser bloqueada por interesse comercial. Escolha Club grátis deve ser default no formulário acessado genericamente, e Genesis pode ser recomendado como alternativa clara sem dark patterns.

## Experiência de UI e dados
- Formulário em 4 etapas: (1) percurso + estudante, (2) dados mínimos, (3) interesse/objetivo, (4) revisão e consentimentos.
- Quando estudante marcado, mostrar R$ 190 **“sujeito à validação de elegibilidade”**. Atualizar resumo e CTA; bloquear cobrança até validado. Sem depender exclusivamente do checkbox client-side.
- Termos/privacidade e consentimento de marketing em separado, marketing **desmarcado por padrão**. Menores de 18 anos: encaminhar para fluxo autorizado ou bloquear contratação até existir.
- Após adesão gratuita, mostrar no dashboard uma promoção contextual discreta: “Genesis · 8 semanas, R$ 490 padrão ou R$ 190 estudante elegível”. Não ocultar o acesso livre.
- Prever Supabase Auth, aplicação Genesis, prova de estudante com minimização, ofertas/cotações server-only, gateway financeiro aprovado, entitlements e CRM AtlasHub. **Não instalar nem migrar estes serviços sem aval da Helena e do Sérgio**.
- O telefone oficial da AtlasHub é [número oficial omitido no repositório público], com Clara Corporate no front office, mas Clara do Club poderá evoluir para Marta. Não misturar personagens, perfis ou memórias. Não adicionar bot WhatsApp real nesta missão.

## Casting
Composição visual original `assets/team_approved.png` continua aprovada. Este pack usa um recorte de **rostos intactos** para permitir textos HTML reais. Nomes definitivos a confirmar com Sérgio: **Sérgio, Lucas, Atlas, Marta, Bia**, evitando confusões com Clara Corporate/LIA LeveLab. Não renomear IDs Hermes ativos (se houver) e não sobrepor masters de identidade. Não usar nomes Clara/LIA que estejam embutidos numa arte como DOM reutilizável após a decisão de casting.

## Gates obrigatórios
- CI verde + testes tipo/unit/e2e, WCAG AA, mobile 390/768/1440 e evidência visual lado a lado.
- Testar Club grátis independente; preço padrão 490; estudante pendente 190 indicativo; rejeição da verificação; edição de dados; consentimento marketing desligado; voltar sem perder rascunho; falhas do backend; webhook duplicado; pagamento pendente/cancelado/reembolsado; downgrade de entitlements; menores de idade.
- `noindex` mantém-se até autorizar lançamento; Registo API `fail-closed` se não estiver habilitada; não exibir páginas enganadoras sobre inscrições e pagamentos.
- Não mexer em `app.atlashub.si`, AI Workforce, Hermes staging, Evolution/Chatwoot ou banco Enterprise.
- Atenção: Vercel publica automaticamente `main` em `club.atlashub.si`. **Nunca fazer merge/deploy sem aprovação explícita.**

## Ordem de trabalho solicitada
1. **PR2A:** design/layout + copy comercial + formulário em modo visual de demonstração (sem recolha real) e screenshots.
2. **PR2B:** autenticação Club + onboarding e registo CRM consentido, depois de arquitetura Supabase aprovada.
3. **PR2C:** elegibilidade estudante + pricing quote + checkout aprovado, com testes de segurança.
4. **PR3:** dashboard autenticado + Missão 001 e Meu Ecossistema, direitos de acesso e progresso real.
5. **PR4+:** Genesis, Lab, agentes e comunidade conforme backlog/gates.

## Primeira resposta esperada
Envia-me plano com estado da branch, arquivos a alterar, rotas, riscos, e uma sequência em que possamos rever a landing e o formulário no Preview antes de ligares autenticação e pagamento. Depois começa o PR visual e informa quando as screenshots estiverem prontas. **Não antecipar merge.**
