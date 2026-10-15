# RFC PR2C — Elegibilidade estudantil, cotação e pagamentos (só arquitetura)

**Estado:** RFC para discussão. **Sem código executável, sem gateway, sem checkout, sem upload de comprovativos, sem "matrículas abertas".**
**Autorização:** diretiva do Sérgio no PR #11 (14/10/2026): "PR2C: apenas design/RFC… Sem PIXGO/MISTICPay ativado, sem checkout vivo, sem upload de comprovativos em produção."
**Depende de:** PR2B canónico (#23: Auth, `club.*`, consentimentos; DB Master por ATL-D29).
**Atualização 15/10/2026 (retoma operacional):** toda a cobrança de Genesis e workshops passa pelo **ARO — Atlas Revenue Operations**. Este RFC deixa de escolher provedores (PixGo, MisticPay, cartão): o Club só cria pedidos no ARO e recebe dele o pagamento confirmado e o direito de acesso. Contratos em `docs/20_ARO_CONTRATOS.md`. Ativação condicionada à homologação do piloto financeiro EspelhoMeu.
**Fonte:** `design/handoff/club-signup-genesis-v2/01_SPEC_FUNCIONAL_ADESAO_E_GENESIS.md`, issue #14, `src/lib/offers.ts`.

## 1. Princípios (invariantes)
1. **O montante é sempre do servidor.** O cliente envia `offer_id`, nunca valores; o servidor emite uma cotação assinada.
2. **Pré-candidatura ≠ reserva de vaga; intenção de pagar ≠ pagamento; comprovativo submetido ≠ elegibilidade aprovada** (SPEC 01).
3. **O acesso Genesis só é concedido por confirmação autenticada e idempotente do ARO** (webhook assinado + reconciliação), nunca por redirect do browser.
4. **Nenhuma chave nem dado de pagamento** chega ao frontend nem ao CRM.
5. Preço R$ 190 só com `club_student_eligibility.status = 'APPROVED'` e não expirado; caso contrário, R$ 490.
6. Valor final, encargos, cancelamento e política de reembolso mostrados **antes** da confirmação.
7. **Estudante e responsável são verificações independentes** (decisão de 14/10/2026). Menor (`club_guardian_reviews`, PR2B) só recebe cotação, ordem ou entitlement com `guardian_approved`; um menor estudante precisa das duas aprovações. Nenhuma cobrança a menor sem a validação legal exigida.

## 2. Estados (continuação do PR2B)
```
GENESIS_INTEREST ──(declara estudante)──▶ STUDENT_PENDING ──APPROVED──▶ QUOTE_READY(19000)
        │                                       ├─REJECTED (com contestação)──▶ QUOTE_READY(49000)
        │                                       └─EXPIRED ──▶ QUOTE_READY(49000)
        └──────────────(não estudante)──────────────────────────────▶ QUOTE_READY(49000)
QUOTE_READY ──cria ordem──▶ AWAITING_PAYMENT ──webhook paid──▶ PAID_CONFIRMED ──entitlement──▶ GENESIS_MEMBER
AWAITING_PAYMENT ──expira/cancela──▶ QUOTE_READY (nova cotação)
GENESIS_MEMBER ──reembolso/chargeback──▶ REFUNDED (entitlement revogado)
```
Todas as transições a partir de `STUDENT_PENDING` são **só servidor** (o PR2B já impede `UPDATE` pelo membro).

### Matriz de verificações antes da cotação
| Perfil | Revisão do responsável | Validação de estudante | Preço cotável |
|---|---|---|---|
| Adulto | — | não pedida | R$ 490 |
| Adulto estudante | — | `APPROVED` | R$ 190 (senão R$ 490) |
| Menor (12–17 / <12) | `guardian_approved` obrigatório | não pedida | R$ 490 só após aprovação |
| Menor estudante | `guardian_approved` obrigatório | `APPROVED` | R$ 190 só após as **duas** |

A `POST /api/genesis/quote` recusa (`409 guardian_review_required`) se o perfil não for adulto e não houver `guardian_approved`; o trigger `club.genesis_minor_gate` (PR2B) garante o mesmo na base.

## 3. Entidades (rascunho lógico — DDL só num PR futuro aprovado)
| Tabela | Campos-chave | Notas |
|---|---|---|
| `club_offers` | `id` (`club-free-v1`, `genesis-01-standard`, `genesis-01-student`), `amount_cents`, `currency='BRL'`, `requires` (`student_approved`), `status` (`pending_launch`/`active`/`closed`), `valid_from/to` | espelha `src/lib/offers.ts`; fonte única no servidor |
| `club_student_eligibility` | `user_id`, `status` PENDING/APPROVED/REJECTED/EXPIRED, `institution`, `evidence_ref`, `reviewer_id`, `decided_at`, `expires_at`, `appeal_of` | decisão humana auditável; contestação |
| `club_price_quotes` | `id`, `user_id`, `offer_id`, `amount_cents`, `eligibility_id?`, `nonce`, `expires_at` (≤ 30 min), `signature` (HMAC servidor) | imutável; usada uma vez |
| `club_payment_orders` | `id`, `quote_id` (único), `provider`, `provider_ref` (único), `status` created/pending/paid/failed/expired/refunded/chargeback, `idempotency_key` | só servidor |
| `club_payment_events` | `provider`, `event_id` (único), `payload_hash`, `received_at`, `verified` | deduplicação de webhooks; payload bruto não guardado se contiver dados pessoais |
| `club_entitlements` | `user_id`, `kind='genesis-01'`, `source_order_id`, `granted_at`, `revoked_at`, `reason` | concessão/revogação só por servidor |
| `club_attribution` | `user_id`, `utm_*` (opcional, com consentimento) | sem fingerprinting |

## 4. Elegibilidade estudantil
- **Recolha mínima:** instituição + curso + validade. Prova documental só se estritamente necessária; preferir verificação por email institucional quando possível.
- **Upload (quando aprovado):** bucket privado, URLs assinadas de curta duração, sem acesso público, tipos limitados (PDF/JPG/PNG ≤ 5 MB), varrimento antimalware, **retenção curta** (ex.: apagar 30 dias após decisão), acesso só a revisores com registo.
- **Decisão:** humana, com motivo; o membro vê o estado e pode contestar uma vez; expiração (ex.: fim do semestre).
- **Neste RFC:** nenhum upload implementado. Em produção, proibido até aprovação jurídica e do Sérgio.

## 5. Cotação assinada
`POST /api/genesis/quote { offer_id }` (autenticado, email verificado):
1. Lê a oferta (`status = active`, janela válida) e a elegibilidade.
2. Calcula `amount_cents` no servidor; recusa se `offer_id = genesis-01-student` sem `APPROVED` válido.
3. Grava `club_price_quotes` com `nonce`, `expires_at`, `signature = HMAC(secret, user|offer|amount|nonce|exp)`.
4. Devolve só `{quote_id, amount_cents, currency, expires_at, termos}` para exibição.

## 6. Ordem de pagamento — via ARO (sem checkout paralelo)
- O Club **não integra provedores** nem guarda dados de pagamento. `POST /api/genesis/order { quote_id }` valida assinatura/validade/uso único da cotação e chama `ARO.createOrder` no servidor (contrato `aro.order.v1`, `docs/20_ARO_CONTRATOS.md` §3), com `idempotency_key = quote_id`.
- O ARO devolve `aro_order_id` e um `checkout_url` alojado pelo ARO (PIX, cartão tokenizado ou outro meio que o ARO homologue). O Club só redireciona e mostra o estado.
- Seleção, auditoria e operação de provedores (contrato, KYC, taxas, reembolso/estorno, assinatura de webhook) são responsabilidade do ARO.

## 7. Webhooks e reconciliação (eventos do ARO)
- Um único endpoint `POST /api/aro/events` para eventos `aro.payment.v1` e `aro.entitlement.v1`; verificação de assinatura HMAC do ARO + timestamp (janela ≤ 5 min).
- Deduplicação por `event_id`; processamento idempotente numa transação (`order → paid`, `entitlement` criado uma única vez).
- Montante e moeda do evento têm de coincidir com a cotação; divergência → `failed` + alerta, sem entitlement.
- Reconciliação diária por `ARO.getOrder` para ordens `pending` > 1 h; relatório para o Sérgio.
- Retries do ARO aceites (200 em eventos já processados).

## 8. Cancelamento, reembolso e chargeback
- Política (prazos, CDC art. 49 para compra à distância, regras de desistência após início em 09/01/2027) definida pelo jurídico **antes** de ativar.
- Pedido do membro → `club_data_requests`-like `refund_request` → decisão humana → `provider.refund` → webhook `refunded` → `entitlement.revoked_at`.
- Chargeback → revogação automática + registo; contacto humano.

## 9. Segurança e observabilidade
- Segredo partilhado com o ARO e HMAC das cotações só em env do servidor (Vercel protegido); rotação documentada.
- Logs sem dados de pagamento nem documentos; métricas: cotações emitidas, ordens por estado, webhooks rejeitados, divergências.
- Alertas: assinatura inválida, montante divergente, pico de falhas.

## 10. Testes obrigatórios (para o PR de implementação)
Menor sem `guardian_approved` não obtém cotação nem ordem · menor estudante com só uma das aprovações fica bloqueado · Estudante rejeitado não obtém R$ 190 · cotação adulterada/expirada/reutilizada recusada · replay de webhook não duplica entitlement · webhook com assinatura inválida recusado · montante divergente não concede acesso · menor bloqueado · reembolso revoga acesso · pagamento tardio após expiração tratado · nenhum segredo no bundle do cliente.

## 11. Gates
1. PR2B ativo em staging. 2. ARO homologado no piloto financeiro EspelhoMeu e contratos `aro.*.v1` aceites pelo dono do ARO. 3. Política de cancelamento/reembolso e termos de venda aprovados pelo jurídico. 4. Sandbox do ARO apenas, contas de teste. 5. Aprovação explícita do Sérgio para checkout real. Nenhuma comunicação de "matrículas abertas" antes do gate 5.

## 12. Questões em aberto
- Emissão de nota fiscal/recibo: entidade emissora e país (BR vs SI)?
- Parcelamento: permitido? (não exibir até decisão — `content:check` bloqueia "parcelas de").
- Moeda única BRL ou também EUR para membros fora do Brasil?
- Prazo de validade da elegibilidade estudantil.
