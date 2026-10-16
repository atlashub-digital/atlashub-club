# ARO — integração do Club (Genesis) e dos workshops AtlasHub.SI

**Estado:** mapeamento para o contrato **real** do ARO; nada implementado, nenhuma chamada, nenhuma cobrança.
**Não há contratos próprios.** Fontes canónicas (`atlashub-digital/atlashub-finance`):
- `openapi/aro-v1.yaml`
- `docs/35_PROJECT_INTEGRATION_CONTRACT_V1.md`
- kit `docs/developer/` (`START_HERE.md`, `PROJECT_COMMERCE_BOOTSTRAP.md`, `INTEGRATION_RECIPES.md`, `ACCEPTANCE_CHECKLIST.md`, `ENVIRONMENTS.md`)
- `schemas/project-commerce-manifest.schema.json` e `examples/typescript/*`

Se este documento divergir dessas fontes, **valem as fontes**.
**Ativação:** fluxo ARO homologado no EspelhoMeu + nova aprovação comercial do Sérgio.

## 1. Fronteira (do contrato V1)
| ARO | Projeto (Club / AtlasHub.SI) |
|---|---|
| autoridade da oferta, roteamento, provedores, sessão de checkout, estado de pedido/pagamento, webhooks de provedores, eventos de receita, estado dos direitos | página de venda, UI de checkout, escolha da oferta, estado mostrado ao cliente, fulfillment, área protegida |

Projetos **não** contêm credenciais nem lógica de PixGo, MisticPay ou Stripe.

## 2. Catálogo (`aro.project.yaml`)
Configuração desejada versionada no repositório do projeto, revista e sincronizada no catálogo central do ARO (`PROJECT_COMMERCE_BOOTSTRAP.md`). Rascunhos preparados, todos com `status: draft`:
- Club: `aro.project.yaml` na raiz deste repositório (projeto `atlas-club`).
- Workshops: `aro.project.yaml` em `atlashub-digital/AtlasHub.Si` (projeto `atlashub-si`, **a registar no ARO**).

| Projeto | Oferta | Valor | Direitos (entitlements) |
|---|---|---|---|
| `atlas-club` | `genesis-01-br` | 49000 BRL, `once` | `atlas-club:course:genesis-01` |
| `atlas-club` | `genesis-01-student-br` | 19000 BRL, `once` | `atlas-club:course:genesis-01` |
| `atlashub-si` | `workshop-01-empresa-aumentada-antecipado-br` / `-regular-br` | 29700 / 34700 BRL (base de planeamento, sujeita a aprovação) | `atlashub-si:workshop:workshop-01-empresa-aumentada` |
| `atlashub-si` | `enterprise-lab-01-ecommerce-antecipado-br` / `-regular-br` | 99000 / 129000 BRL por empresa, 1 representante (idem) | `atlashub-si:workshop:enterprise-lab-01-ecommerce` |

Convenção do catálogo ARO (exemplos de `atlashub-finance`): ofertas `<produto>-<mercado>` (p. ex. `course-a-br`) e direitos `<projeto>:<tipo>:<produto>` (p. ex. `academia-x:course:course-a`).
**Identificadores unificados:** `src/lib/offers.ts` usa os mesmos códigos do catálogo (`genesis-01-br`, `genesis-01-student-br`) e o mesmo direito; `npm run content:check` falha se ids, valores ou direito divergirem de `aro.project.yaml`, ou se alguma oferta deixar de estar `draft`.

**Consumidor preparado (fail-closed):** `src/lib/aro/client.ts` (criar sessão com `X-ARO-Public-Key` + `Idempotency-Key`; polling com `X-ARO-Checkout-Secret`; `entitlements/resolve` com a chave de servidor; só `ACTIVE` não expirado desbloqueia, qualquer erro nega) e `src/lib/aro/webhook.ts` + `POST /api/aro/webhook` (HMAC `v1=` sobre `timestamp.corpo`, janela de 300 s, comparação em tempo constante, id/projeto/tipo validados; 503 sem segredo). Sem configuração completa nada é chamado; o checkout exige ainda `ARO_PAYMENTS_ENABLED=yes`, que só se liga após a homologação E7 no EspelhoMeu e o GO comercial. Nenhuma rota de checkout está exposta neste PR. Testes: `npm run test:unit`.

Notas:
- **A oferta padrão do Genesis não exige elegibilidade estudantil;** só `genesis-01-student-br`. O ARO não conhece elegibilidade: o Club aplica a regra antes de criar o checkout (RFC `docs/19` §2) e, por isso, cria-o sempre a partir do servidor.
- O Club Atlas gratuito não passa pelo ARO.
- Lotes (antecipado/regular) são ofertas separadas do mesmo produto, ativadas/desativadas no catálogo; capacidade e prazos de lote ficam com a operação até o ARO os suportar no catálogo.

## 3. Endpoints e cabeçalhos usados
| Passo | Chamada ARO | Autenticação / cabeçalhos |
|---|---|---|
| Criar checkout | `POST /v1/checkout-sessions` | `X-ARO-Public-Key` (escopo público, origem na allowlist) **ou** via backend do projeto (obrigatório no Genesis); `Idempotency-Key: <uuid>` |
| Ler estado | `GET /v1/checkout-sessions/{id}` | `X-ARO-Checkout-Secret: <checkout_secret>` |
| Pedido | `GET /v1/orders/{order_id}` | conforme `aro-v1.yaml` |
| Resolver direitos | `POST /v1/entitlements/resolve` | `Authorization: Bearer <ARO_SERVER_KEY>`; corpo `{project, customer_id}` ou, transitório, `{project, identity:{email}}` |

Corpo mínimo do checkout: `{project, offer, market, currency, payment_method (PIX|CARD), payer{name,email[,document só se o meio exigir]}, attribution{utm_*}, metadata}`. Estados mostrados: `CREATED, PENDING, APPROVED, FAILED, CANCELED, EXPIRED, REFUNDED, CHARGEBACK`. O `qr_payload` PIX é renderizado sem alteração.

Atribuição: o código de origem das campanhas (`GEN-EA-IG`, `W01-LI`, …) vai em `attribution.utm_campaign`/`utm_source` ou `metadata.campaign_code`.

## 4. Webhook do ARO para o projeto
- `POST https://club.atlashub.si/api/aro/webhook` (e `https://atlashub.si/api/aro/webhook` para os workshops), configurado no registo do projeto.
- Cabeçalhos: `X-ARO-Event-Id`, `X-ARO-Timestamp`, `X-ARO-Signature: v1=<hex>`.
- Verificação: `HMAC-SHA256(ARO_WEBHOOK_SECRET, timestamp + "." + corpo_bruto)`, tolerância de timestamp, comparação em tempo constante, deduplicação por event id, 2xx rápido, processamento assíncrono. Exemplo de referência: `examples/typescript/verify-aro-webhook.ts`.
- Eventos V1: `checkout.started`, `payment.pending`, `payment.approved`, `payment.failed`, `payment.refunded`, `payment.chargeback`, `order.approved`, `entitlement.granted`, `entitlement.revoked`.
- Entrega *at least once*; o webhook é notificação — o acesso decide-se re-resolvendo os direitos.

## 5. Direitos → acesso
| Direito ACTIVE | Club / AtlasHub.SI |
|---|---|
| `atlas-club:course:genesis-01` | `club_genesis_applications.status = 'member'`; acesso às áreas Genesis |
| `atlashub-si:workshop:workshop-01-empresa-aumentada` | bilhete W01 + convite para a Clínica de Ideias (16/11); comunidade de 30 dias só com adesão própria |
| `atlashub-si:workshop:enterprise-lab-01-ecommerce` | bilhete EL01 por empresa |

`REVOKED`/`EXPIRED` → retirar acesso conforme a política.

## 6. Ambiente
Só servidor: `ARO_API_URL`, `ARO_PROJECT_SLUG`, `ARO_PUBLIC_KEY`, `ARO_SERVER_KEY`, `ARO_WEBHOOK_SECRET`. Nenhum segredo de provedor.

## 7. Aceitação (do contrato V1)
Checkout criado · instrução de pagamento visível · `PENDING` visível · pagamento controlado passa a `APPROVED` · webhook verificado · direito `ACTIVE` resolvido · produto desbloqueado · webhook duplicado inofensivo · reembolso/revogação retira acesso · trocar de provedor não exige código no projeto. Mais, do lado do Club: oferta de estudante recusada sem elegibilidade; menor sem aprovação do responsável não chega ao checkout.

## 8. Gates
1. Fluxo ARO homologado no EspelhoMeu.
2. Projetos `atlas-club` e `atlashub-si` registados; manifestos revistos e sincronizados.
3. Preços e políticas aprovados pelo Sérgio (workshops: decisão comercial W01 a 20/10/2026).
4. Teste de pagamento controlado.
5. Aprovação comercial explícita antes de qualquer cobrança.

## Implementação da matrícula Genesis (#29)
- Base: `docs/sql/drafts/005_club_genesis_checkout.sql` (depois de 002–004; reexecutável). Elegibilidade de estudante com decisão humana (`club.decide_student_eligibility`, evidência + revisor + validade), matrícula viva única por membro, limite de turma opcional (`club_cohorts.capacity`), deduplicação de eventos, RLS só leitura do próprio membro.
- Percurso: `/genesis/inscricao` (membro com conta; condições `src/lib/genesis/policy.ts` aceites e versionadas) → `POST /api/genesis/checkout` (oferta validada no servidor; `Idempotency-Key` = matrícula + oferta; valor do ARO tem de bater com `offers.ts`) → `/genesis/inscricao/<id>` (QR + Copia e Cola; segredo em cookie httpOnly) → **`member` só com ARO APPROVED + `atlas-club:course:genesis-01` ACTIVE re-resolvido** (polling ou webhook) → reembolso/estorno/revogação devolvem a `interested`.
- Pedido de validação de estudante: `POST /api/genesis/student` (sem upload). A equipe decide em `club.decide_student_eligibility` (SQL/service_role).
- Interruptores (todos necessários): Club `live`, `ARO_*` com `ARO_PAYMENTS_ENABLED=yes`, `GENESIS_SALES_OPEN=yes`, `club_cohorts.sales_open = true`. Reversão: qualquer um deles a desligado.
- Testes: `docs/sql/drafts/tests/005_genesis_checkout_test.sql`, `scripts/test-genesis-integration.mts` (percurso real contra as funções SQL, ARO simulado), e2e `genesis-matricula.spec.ts` (fechado sem live/ARO).
