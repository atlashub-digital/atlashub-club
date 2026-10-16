# RFC PR2C — Elegibilidade estudantil e cobrança Genesis via ARO (só arquitetura)

**Estado:** RFC para discussão. **Sem código executável, sem checkout, sem chamadas ao ARO, sem upload de comprovativos, sem "matrículas abertas".**
**Autorização:** diretiva do Sérgio no PR #11 (14/10/2026) — PR2C só design/RFC; correção de 15/10/2026 (decisão operacional, ponto 5): **não criar contratos de pagamento próprios**; usar o ARO real.
**Fontes canónicas do ARO** (repositório `atlashub-digital/atlashub-finance`): `openapi/aro-v1.yaml`, `docs/35_PROJECT_INTEGRATION_CONTRACT_V1.md`, kit `docs/developer/` (em especial `START_HERE.md` e `PROJECT_COMMERCE_BOOTSTRAP.md`), `schemas/project-commerce-manifest.schema.json`. Em caso de divergência, **prevalecem essas fontes**; este RFC só descreve o que o Club faz do seu lado.
**Depende de:** PR2B canónico (#23: Auth, `club.*`, revisão do responsável).
**Ativação:** só depois da homologação do fluxo ARO no piloto **EspelhoMeu** e de nova aprovação comercial do Sérgio. Nenhuma cobrança antes disso.

## 1. Princípios
1. **O ARO é a autoridade comercial:** catálogo, preço, roteamento, checkout, pedido, pagamento, eventos e direitos (`entitlements`). O Club não integra provedores (PixGo, MisticPay, Stripe) nem guarda dados de pagamento.
2. **O Club só escolhe o código da oferta** e envia-o ao ARO; o ARO resolve o preço a partir do catálogo sincronizado (`aro.project.yaml`). Não há cotação assinada nem preço calculado no Club.
3. **Elegibilidade é do Club, antes do checkout.** O ARO não conhece a condição de estudante nem a revisão do responsável: o backend do Club decide **que oferta pode ser pedida** e só então cria a sessão de checkout. Por isso o checkout do Genesis é sempre criado **pelo servidor do Club** (proxy), nunca diretamente pelo browser.
4. **Pré-candidatura ≠ vaga; intenção de pagar ≠ pagamento; comprovativo submetido ≠ elegibilidade aprovada** (SPEC 01).
5. **Acesso só com direito ACTIVE resolvido no ARO** (`POST /v1/entitlements/resolve`); o webhook é notificação, não autoridade.
6. Valor final, encargos, cancelamento e reembolso visíveis **antes** do pagamento.
7. **Estudante e responsável são verificações independentes** (14/10/2026). Menor só chega ao checkout com `guardian_approved`; um menor estudante precisa das duas aprovações.

## 2. Ofertas e regras de elegibilidade
| Oferta (código ARO) | Valor no catálogo | Quem pode pedir (regra do Club) |
|---|---|---|
| `genesis-01-br` | 49000 BRL | **qualquer membro adulto** com perfil; menor só com `guardian_approved`. **Não exige elegibilidade estudantil.** |
| `genesis-01-student-br` | 19000 BRL | só com `club_student_eligibility.status = 'APPROVED'` e não expirada; menor também com `guardian_approved` |

Se a validação de estudante for recusada ou expirar, o membro escolhe entre `genesis-01-br` ou ficar só no Club grátis — sem cobrança automática.

## 3. Estados do lado do Club
```
interested ──(pede condição de estudante)──▶ student_pending ──APPROVED──▶ pode pedir genesis-01-student-br
     │                                            └─REJECTED/EXPIRED──────▶ pode pedir genesis-01-br
     └───────────────────────────────────────────────────────────────────▶ pode pedir genesis-01-br
checkout ARO (PENDING) ──payment.approved + entitlement.granted (re-resolvido)──▶ member
member ──entitlement.revoked (reembolso/chargeback)──▶ acesso retirado
```
Os estados de pagamento (`CREATED, PENDING, APPROVED, FAILED, CANCELED, EXPIRED, REFUNDED, CHARGEBACK`) são os do ARO e só são mostrados, nunca recalculados.

## 4. Entidades do Club (rascunho lógico — DDL só num PR futuro aprovado)
| Tabela | Campos-chave | Notas |
|---|---|---|
| `club_student_eligibility` | `user_id`, `status` PENDING/APPROVED/REJECTED/EXPIRED, `institution`, `evidence_ref`, `reviewer_id`, `decided_at`, `expires_at`, `appeal_of` | decisão humana auditável, com contestação |
| `club_aro_checkouts` | `user_id`, `aro_checkout_id`, `aro_order_id`, `offer`, `created_at` | só referências; sem montantes como autoridade nem dados de pagamento |
| `club_aro_events` | `event_id` (único), `type`, `received_at` | deduplicação de `X-ARO-Event-Id`; sem payload pessoal |

Pedidos, pagamentos e direitos **não** são duplicados no Club (ARO é a autoridade). `club_genesis_applications.status = 'member'` é só reflexo do direito ACTIVE re-resolvido.

## 5. Elegibilidade estudantil
- **Recolha mínima:** instituição + curso + validade; preferir verificação por e-mail institucional.
- **Upload (quando aprovado):** bucket privado, URLs assinadas curtas, PDF/JPG/PNG ≤ 5 MB, antimalware, retenção curta (ex.: 30 dias após decisão), acesso só a revisores com registo.
- **Decisão:** humana, com motivo; contestação uma vez; expiração (ex.: fim do semestre).
- **Neste RFC:** nenhum upload implementado; em produção, proibido até aprovação jurídica e do Sérgio.

## 6. Checkout (contrato ARO, ver `docs/20_ARO_CONTRATOS.md`)
1. Membro autenticado escolhe Genesis → `POST /api/genesis/checkout { offer }` no Club.
2. O Club valida as regras do §2 (perfil, revisão do responsável, elegibilidade) e recusa com `409` se não cumprir.
3. O Club chama `POST /v1/checkout-sessions` do ARO **a partir do servidor**, com `Idempotency-Key` e corpo `{project:"atlas-club", offer, market:"BR", currency:"BRL", payment_method, payer, attribution}`.
4. Guarda `id`/`order_id` e o `checkout_secret` só na sessão do servidor; mostra a instrução de pagamento devolvida (p. ex. `qr_payload` PIX, sem o alterar).
5. Estado por `GET /v1/checkout-sessions/{id}` com `X-ARO-Checkout-Secret`.

## 7. Webhooks e direitos
- Endpoint único `POST /api/aro/webhook` (configurado no projeto ARO).
- Cabeçalhos `X-ARO-Event-Id`, `X-ARO-Timestamp`, `X-ARO-Signature: v1=<hex>`; HMAC-SHA256 com o segredo do projeto sobre `timestamp + "." + corpo bruto`; tolerância de timestamp; comparação em tempo constante; deduplicação por event id; responder 2xx depressa.
- Em `entitlement.granted` / `entitlement.revoked`, o Club **re-resolve** com `POST /v1/entitlements/resolve` (`Authorization: Bearer <ARO_SERVER_KEY>`) antes de mudar o acesso.
- Entrega pelo ARO é *at least once*: consumidor idempotente.

## 8. Cancelamento, reembolso e chargeback
Política (prazos, CDC art. 49, regras após o início a 09/01/2027) definida pelo jurídico **antes** de ativar. Reembolso e chargeback são executados pelo ARO; o Club reage a `entitlement.revoked`.

## 9. Segurança
- Variáveis só do servidor: `ARO_API_URL`, `ARO_PROJECT_SLUG`, `ARO_PUBLIC_KEY`, `ARO_SERVER_KEY`, `ARO_WEBHOOK_SECRET`. Nenhum segredo de provedor no Club.
- Logs sem dados de pagamento nem documentos; `payer.document` só se o meio de pagamento o exigir (minimização LGPD).

## 10. Testes obrigatórios (PR de implementação)
Oferta de estudante recusada sem elegibilidade APPROVED · oferta padrão aceite sem elegibilidade estudantil · menor sem `guardian_approved` não chega ao checkout · menor estudante com só uma aprovação bloqueado · webhook com assinatura inválida ou fora da tolerância recusado · replay de event id inofensivo · acesso só com direito ACTIVE re-resolvido · `entitlement.revoked` retira acesso · nenhuma chave ARO no bundle do cliente.

## 11. Gates
1. PR2B homologado (Helena) e GO do Sérgio.
2. Fluxo ARO homologado no EspelhoMeu.
3. Projeto `atlas-club` registado no ARO; `aro.project.yaml` revisto e sincronizado (ofertas passam de `draft` a `active` só com aprovação).
4. Política de cancelamento/reembolso e termos aprovados.
5. Pagamento controlado em ambiente de teste do ARO e checklist `docs/developer/ACCEPTANCE_CHECKLIST.md`.
6. Nova aprovação comercial explícita do Sérgio. Nenhuma comunicação de "matrículas abertas" antes disto.

## 12. Questões em aberto
- Emissão de recibo/nota fiscal (entidade BR) — no ARO ou fora dele?
- Parcelamento (não exibir até decisão).
- Validade da elegibilidade estudantil.
