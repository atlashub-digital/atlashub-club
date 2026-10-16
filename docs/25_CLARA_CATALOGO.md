# Clara (WhatsApp oficial): catálogo das 4 ofertas

**Para:** Helena (configuração da Clara no Atendimento.Center/Chatwoot/Evolution existente, sem nova integração WhatsApp) e equipa de atendimento.
**Fonte única:** `GET https://club.atlashub.si/catalogo.json` (gerado de `src/lib/catalog.ts`, que lê `offers.ts`, `contact.ts`; `noindex`; sem dados pessoais nem segredos). A Clara deve ler este JSON, não cópias de texto.
**Refs:** atlashub-club#27, AtlasHub.Si#7, atlashub-finance#17.

## Ofertas e códigos
| Código | Oferta | Estado | O que a Clara pode fazer agora |
|---|---|---|---|
| `CLUB-*` | Club Atlas gratuito | pré-lançamento; cadastro **fechado** | apresentar; registar interesse com consentimento; quando o cadastro abrir, enviar só o link `/participar` |
| `GEN-EA-*` | Genesis Turma 01 + Early Access | interesse aberto, matrícula fechada | explicar 09/01/2027, 8 semanas, 24 ateliers, R$ 490 / R$ 190 (estudante após validação); registar interesse até 30/11 (data/hora e código no CRM) |
| `W01-*` | Workshop 01, 14/11, Anápolis | preços publicados; vendas abrem com o ARO | R$ 297/347 por pessoa; enviar o link da página com `?origem=W01-WA`; inscrição e PIX só na página |
| `EL01-*` | Enterprise Lab 01, 28/11, Anápolis | idem | R$ 990/1.290 por empresa (1 representante); `?origem=EL01-WA` |

## Proibições (campo `guardrails` do JSON)
Não anunciar vagas, urgência, datas ou local dos ateliers de dezembro (só são decididos depois de mais de cinco inscrições qualificadas), local exato dos workshops ou espaço reservado. Não aceitar nem confirmar pagamentos; não pedir cartão/CPF; não declarar "pago" sem confirmação ARO. Não dizer que o cadastro, a área de membros ou a Missão 001 estão operacionais; não criar contas. Menores só com responsável. Opt-out imediato. Fora do catálogo → humano.

## Preços dos workshops (definitivos, AtlasHub.Si#9)
R$ 297/347 (W01, por pessoa) e R$ 990/1.290 (EL01, por empresa) estão publicados nas páginas, com as condições (`#condicoes`). A Clara informa os valores e envia o link da página; **nunca** recebe pagamento nem confirma inscrição — a confirmação só existe depois de o ARO aprovar o PIX (bilhete na página e no e-mail).

## CRM
Campos, consentimentos separados e regra de deduplicação no campo `crm` do JSON. Relatório semanal = contagem por código extraída do CRM, sem estimativas. O CRM regista interesse; **não** é inscrição de membro (essa só pelo fluxo de Auth do Club, PR2B) nem matrícula paga.

## Pagamentos (quando existirem)
`paymentRouting.status` passa de `indisponivel` para `ativo` só depois de E7 + políticas publicadas + GO. Então a Clara envia o link de checkout criado pelo servidor do projeto via ARO (nunca um link de provedor), e confirma acesso só por direito `ACTIVE` no ARO.

## QA mínimo (Helena, evidências sem PII)
4 intenções (uma por código); pergunta de preço de cada oferta; menor; estudante sem validação; pedido de datas de dezembro; pedido de endereço do workshop; "já paguei" com comprovativo; ARO indisponível; opt-out; mensagem duplicada; takeover humano.
