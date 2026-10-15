# ARO — contratos de oferta, pedido, pagamento e direito de acesso (candidatos)

**Estado:** contratos **candidatos**, para validar com o dono do ARO (Atlas Revenue Operations). Nada implementado, nenhuma chamada ao ARO, nenhuma cobrança.
**Decisão (Sérgio, 15/10/2026):** toda a cobrança de **Genesis** e **Workshops** usa o ARO. Não criar checkouts nem integrações financeiras paralelas. Ativação condicionada à **homologação do piloto financeiro EspelhoMeu**.
**Consumidores:** Club Atlas (`club.atlashub.si`, Genesis) e AtlasHub.SI (`atlashub.si/workshops/*`). Cada consumidor só conhece o ARO; nenhum fala com provedores de pagamento.

## 1. Fronteira de responsabilidades
| ARO | Consumidor (Club / AtlasHub.SI) |
|---|---|
| Catálogo comercial (oferta, preço, moeda, lotes, janela) | Mostra a oferta; nunca define o montante |
| Pedido, checkout alojado, meios de pagamento, provedores, KYC | Cria o pedido no servidor com `offer_id` + `buyer_ref`; redireciona para o checkout do ARO |
| Confirmação de pagamento, reembolso, chargeback, recibos/NF | Recebe eventos assinados; mostra estado |
| Emissão e revogação de **direitos** (entitlements) | Aplica o direito (acesso Genesis, bilhete de workshop) só a partir do evento do ARO |
| Dados de pagamento | **Nunca** recebe dados de cartão/PIX/documento fiscal |

## 2. `aro.offer.v1` — oferta
```json
{
  "offer_id": "genesis-01-standard",
  "seller": "club-atlas",
  "title": "Genesis Turma 01",
  "amount_minor": 49000,
  "currency": "BRL",
  "status": "draft | approved | active | closed",
  "valid_from": "2026-12-01T00:00:00-03:00",
  "valid_to": "2027-01-08T23:59:59-03:00",
  "requires": ["student_approved"],
  "requires_guardian_approval_for_minors": true,
  "capacity": null,
  "entitlement_kind": "GENESIS_COHORT_01",
  "policy_refs": { "cancellation": "url-versionada", "terms": "url-versionada" }
}
```
| `offer_id` | Vendedor | Montante | Requisitos | Direito |
|---|---|---|---|---|
| `genesis-01-standard` | club-atlas | 49000 BRL | — | `GENESIS_COHORT_01` |
| `genesis-01-student` | club-atlas | 19000 BRL | `student_approved` | `GENESIS_COHORT_01` |
| `workshop-01-empresa-aumentada` | atlashub-si | **a aprovar** | — | `WORKSHOP_TICKET` (W01 + Clínica 16/11 + comunidade 30 dias) |
| `enterprise-lab-01-ecommerce` | atlashub-si | **a aprovar** (por empresa) | — | `WORKSHOP_TICKET` (EL01) |

Os IDs Genesis coincidem com `src/lib/offers.ts`; os de workshops com `aroOfferId` em `atlashub-digital/AtlasHub.Si` `lib/workshops.ts`. Os montantes dos workshops só entram no ARO depois da aprovação do Sérgio (propostas em `AtlasHub.Si/docs/WORKSHOPS.md`). O Club Atlas gratuito (`club-free-v1`) **não** passa pelo ARO.

## 3. `aro.order.v1` — pedido (servidor → ARO)
Pedido criado **só no servidor do consumidor**, autenticado com credencial de serviço do ARO (nunca no browser).
```json
{
  "idempotency_key": "quote_7f3c… | ws_req_…",
  "offer_id": "genesis-01-student",
  "buyer_ref": "club:user:<uuid>",
  "buyer_contact": { "email": "…", "name": "…" },
  "eligibility": { "student": "approved:<eligibility_id>", "guardian": "not_required | approved:<review_id>" },
  "return_url": "https://club.atlashub.si/conta?pedido=",
  "metadata": { "campaign_code": "GEN-EA-SITE" }
}
```
Resposta: `{ "aro_order_id", "status": "awaiting_payment", "amount_minor", "currency", "checkout_url", "expires_at" }`.
**Recusas obrigatórias do ARO:** oferta não `active`; `genesis-01-student` sem `student: approved`; comprador menor sem `guardian: approved` (o Club envia o estado do PR2B `club_guardian_reviews`; nenhum menor chega aqui sem aprovação); `idempotency_key` repetida devolve o mesmo pedido.

## 4. `aro.payment.v1` — eventos de pagamento (ARO → consumidor)
`POST /api/aro/events` (Club) e equivalente na AtlasHub.SI. Cabeçalhos `ARO-Signature: t=<unix>,v1=<hmac-sha256(secret, t + "." + body)>`, `ARO-Event-Id`.
```json
{ "event_id": "evt_…", "type": "payment.confirmed | payment.failed | payment.expired | payment.refunded | payment.chargeback",
  "aro_order_id": "…", "offer_id": "…", "buyer_ref": "club:user:<uuid>", "amount_minor": 19000, "currency": "BRL", "occurred_at": "…" }
```
Regras no consumidor: janela de timestamp ≤ 5 min; deduplicação por `event_id`; montante/moeda têm de bater com o pedido (divergência → alerta, sem acesso); resposta 200 a eventos já processados; nunca conceder acesso por redirect do browser.

## 5. `aro.entitlement.v1` — direito de acesso (ARO → consumidor)
```json
{ "event_id": "evt_…", "type": "entitlement.granted | entitlement.revoked",
  "entitlement_id": "ent_…", "kind": "GENESIS_COHORT_01 | WORKSHOP_TICKET",
  "buyer_ref": "club:user:<uuid>", "source_order": "aro_order_id", "reason": "paid | refunded | chargeback | manual" }
```
No Club: `granted` → `club_genesis_applications.status = 'member'` + registo em `club_entitlements` (PR2C); `revoked` → revoga acesso. Na AtlasHub.SI: bilhete do workshop e convite para a Clínica/comunidade (com adesão própria ao WhatsApp).

## 6. Reconciliação e operação
- `GET aro/orders/{id}` diário para pedidos `awaiting_payment` > 1 h; relatório ao Sérgio.
- Segredos (credencial de serviço, segredo HMAC) só em variáveis de servidor protegidas; rotação documentada pela Helena.
- Logs sem dados de pagamento; métricas: pedidos por estado, eventos rejeitados, divergências.

## 7. Gates de ativação
1. Piloto financeiro **EspelhoMeu homologado** no ARO (fluxo pedido → pagamento → direito → reembolso).
2. Dono do ARO aceita estes contratos (ou publica a versão definitiva, que substitui esta).
3. Ofertas criadas no ARO com montantes aprovados pelo Sérgio e políticas de cancelamento/reembolso publicadas.
4. PR2B live (Genesis) / inscrição aprovada (workshops) e testes ponta a ponta em sandbox do ARO.
5. Aprovação explícita do Sérgio para cobrança real.

## 8. Testes obrigatórios (implementação futura)
Assinatura inválida ou fora da janela recusada · replay de `event_id` não duplica direito · montante divergente não concede acesso · menor sem aprovação não gera pedido · estudante não aprovado não obtém `genesis-01-student` · reembolso/chargeback revoga direito · nenhum segredo do ARO no bundle do cliente.
