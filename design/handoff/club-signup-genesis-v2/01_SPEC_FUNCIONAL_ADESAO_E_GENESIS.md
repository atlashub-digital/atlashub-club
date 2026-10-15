# Especificação de produto · Club Atlas Enrollment + Genesis Offer v2.0

## 1. Objetivo e métricas
Converter interesse social em **membros gratuitos reais**, apresentar Genesis como percurso guiado facultativo e captar **pré-candidaturas qualificadas** sem criar fricção nem induzir estudantes a compras desnecessárias. Medir separadamente: vista da oferta, início de registo, conta criada, consentimento marketing opt-in, interesse Genesis, elegibilidade iniciada/aprovada, checkout iniciado, pagamento confirmado, primeira missão iniciada/concluída, retenção D7.

## 2. Dois produtos e limites
| Produto | Público | Preço | Conteúdo e situação |
|---|---|---|---|
| Club Atlas | Qualquer membro elegível | **R$ 0** | Comunidade, fóruns e conteúdos abertos conforme disponibilização real. Conta sem obrigatoriedade Genesis. |
| Atlas Lab Genesis Turma 01 | Membro inscrito e aprovado | **R$ 490** padrão | Programa formativo de 8 semanas, 24 ateliers previstos, experiência de comunidade incluída, desafios e mentoria em grupo conforme condições aprovadas. |
| Genesis condição estudante | Estudante conforme política homologada | **R$ 190** se elegível e verificado | Mesmo programa Genesis, sem redução de direitos pelo desconto. **R$ 300 de diferença** em relação ao preço padrão. |

Não afirmar acesso vitalício, descontos por tempo limitado, vagas escassas ou funcionalidades já ativas sem base. Agenda: início **previsto** 09/01/2027, híbrido Anápolis + online. Contrato, calendário confirmado, política de cancelamento e recursos computacionais devem ser divulgados antes de cobrar. Oferta de estudante não deve ser rotulada como direito legal automático; é condição comercial a estabelecer pela AtlasHub.

## 3. Experiência desejada
### A. Landing (`/`)
Hero visual baseado na composição de elenco aprovada; duas CTAs: **Entrar gratuitamente** e **Conhecer Genesis**. Apresentar o Atlas Lab e a jornada `ideia → 1º agente → ferramentas → equipe → projeto`. Secção comparativa clara Club grátis vs Genesis. Para estudantes, tratar R$ 190 como **valor sujeito à validação**, não como preço indiscriminado.

### B. Landing comercial (`/genesis`)
História de oportunidade prática, 8 semanas, 24 ateliers previstos, exemplos concretos, calendário proposto, mentoria humana/digital explicitamente identificada, FAQs; cartão lateral com R$ 490 normal / R$ 190 estudante elegível. CTAs **Quero pré-inscrever-me** e **Entrar no Club grátis**. Sem promessa de emprego, empresa pronta ou lucro garantido.

### C. Formulário único (`/participar` ou `/aderir`)
Progressão em quatro etapas, com salvamento de rascunho apenas após autenticação e consentimento apropriados:
1. **Percurso:** Club grátis (default) OU interesse Genesis. Opção estudante quando Genesis selecionado. Resumo de preço sempre visível e recalculado no servidor. Não impor Genesis. 
2. **Dados mínimos:** nome de apresentação, email, país/fuso ou localidade opcional, faixa etária (fluxo adulto vs autorização de responsável); WhatsApp opcional. Não solicitar CPF, RG nem documentos no registo inicial.
3. **Contexto:** motivo, interesse (estudo, conteúdo, negócio, tecnologia) e objetivo livre opcional. Perfil pedagógico sem questionário invasivo.
4. **Revisão:** percurso, condição estudante pendente, valor, produto, data prevista, termos e privacidade (obrigatórios quando aplicáveis) e marketing opt-in separado (desmarcado). **Club** encaminha para autenticação + boas-vindas sem checkout. **Genesis** encaminha para pré-candidatura e posterior verificação/checkout; não cria acesso pago imediatamente.

Após criar conta grátis: apresentar cartão opcional «Conheça o Genesis», com preço transparente e possibilidade de dispensar. Quem declina continua a usar comunidade.

### D. Condição estudante
- Primeiro recolher **autodeclaração** e apresentar o valor indicativo R$ 190 claramente condicionado.
- Definir política comercial objetiva antes do lançamento: tipos de instituição, matrícula ativa, prazos, validade e revisão. Exigir prova **mínima e proporcional**, p.ex. validação institucional, ou verificação manual restrita se necessário. Não copiar documentos para logs, WhatsApp aberto, analytics ou CRM genérico.
- A aprovação de desconto ocorre **no servidor**, por operador humano ou verificador autorizado, com status `PENDING/APPROVED/REJECTED/EXPIRED` e registo auditável; opção de contestação quando recusado.
- Não permitir ao utilizador alterar o montante no browser para comprar com desconto indevido; cotação assinada e vinculada a oferta/escopo/validade. Não fazer pagamento automático quando a verificação é recusada.
- Menores de idade: pedir aprovação jurídica e processo apropriado de consentimento do responsável antes de concluir venda; no MVP, bloquear checkout para menores sem fluxo validado.

### E. Checkout / segurança
Depois de elegibilidade verificada e condições comerciais confirmadas: apresentar valor final e eventuais encargos de forma clara ANTES da confirmação, condições de cancelamento, política aplicável e meios disponíveis. Escolher PixGo/MisticPay e cartões APENAS após auditoria e aprovação. O montante depende do backend, não da seleção visual. Ativação Genesis apenas por confirmação autenticada/idempotente do provedor. Webhooks assinados, retries, proteção duplicados, reconciliação, pedido de reembolso e revogação de entitlements. Sem enviar chaves ou dados de pagamento para frontend/CRM.

## 4. Dados e integração AtlasHub
Considerar uso do **CRM transversal Supabase AtlasHub** para contactos consentidos (`crm_contact`, `crm_lead`, `crm_consent`, `crm_activity`, `crm_suppression`) e criar **domínio de membros Club separado** para identidade pedagógica, progresso, acessos e candidaturas, com scoping e RLS. Verificar com Helena antes de criar outro projeto DB ou sobrecarregar a estrutura de Enterprise/Workforce. Nunca fazer join client-side com tabelas de clientes B2B.

Entidades candidatas: `club_profiles`, `club_signup_intents`, `club_genesis_applications`, `club_student_eligibility`, `club_offers`, `club_price_quotes`, `club_payment_orders`, `club_entitlements`, `club_consent_events`, `club_attribution`, `club_mission_progress`.

Origem (UTM/referral) deve ser guardada apenas se disponível, sem inventar canal. Consentimento de receber mensagens não está implícito no preenchimento do formulário nem na mensagem enviada via WhatsApp.

## 5. Permissões e estados de sistema
`VISITOR → FREE_ACCOUNT → GENESIS_INTEREST → STUDENT_PENDING(optional) → QUOTE_READY → AWAITING_PAYMENT → PAID_CONFIRMED → GENESIS_MEMBER`. Pré-candidatura ≠ reserva de vaga; intenção de pagar ≠ pagamento; prova estudantil submetida ≠ elegibilidade aprovada.

Interface deverá declarar estados desativados como `em preparação` e oferecer um contacto oficial acessível, em vez de receber dados num formulário e perder informação. Caso o backend de captação não esteja pronto, fluxo deve manter-se `fail-closed`, com aviso e sem falso recibo.

## 6. Dashboard após adesão
- Free: missão 001, comunidade, biblioteca aberta, próximo encontro e teaser Genesis opcional.
- Genesis interessado: estado da candidatura, elegibilidade e próximos passos claros.
- Genesis pago: acesso autenticado à turma e materiais; progresso, ateliers, lab só conforme rollout real.
- `Meu Ecossistema` expõe evolução: semente → agente → contexto/ferramentas → equipe → projeto; não permitir shell/exec sem ambiente multi-tenant seguro homologado.

## 7. Acessibilidade
PT-BR, UX mobile-first (390px), teclado, WCAG AA, autofill, input errors, focus restore entre etapas, reduced-motion, contraste navy/ciano/dourado adequado, retorno para editar, preços claros, estados vazios, política de privacidade, linguagem compreensível a quem nunca programou.
