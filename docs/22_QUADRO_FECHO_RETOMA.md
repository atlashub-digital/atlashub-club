# Quadro de fecho — retoma operacional (Club + Genesis + Workshops + ARO + Campanhas)

**Data:** 15/10/2026 · **Dono e autoridade:** Sérgio Monteiro · **Cooperação técnica:** Helena · **Implementação:** Claude Code
**Regra:** PRs pequenos em rascunho; sem merge, deploy, DDL produtiva, cobrança ou campanha paga sem aprovação do Sérgio.

## Estado real verificado (15/10/2026, 17h UTC)
- **Produção Club = `dab885c`** (Vercel `dpl_6PWUYKyGmTb9z2yGzPnMdeFaSyeV`, READY). **`dc07f91` não está em produção**: não existe deployment Vercel para `5ed90b8` nem `dc07f91`, provavelmente bloqueado pela quota de builds na altura. Consequência: o **Early Access (#21) ainda não aparece em club.atlashub.si** (verificado no HTML de `/genesis`). A produção tem os segredos rodados e a escrita de `/api/interesse` suspensa.
- Rollback disponível: `dpl_EUbCwyJEHv8CcFqGGXPWSDzQiqkh` (`85453eb`).

## PRs desta retoma
| PR | Repo | Âmbito | Estado |
|---|---|---|---|
| #23 | atlashub-club | PR2B canónico (substitui #15, #19, #20) + interesse Genesis pela conta | rascunho, testes locais verdes |
| #16 | atlashub-club | PR2C RFC + contratos ARO (só docs) | rascunho, CI verde no SHA anterior |
| este PR | atlashub-club | Early Access completo, páginas Club alinhadas, campanhas, este quadro | rascunho |
| AtlasHub.Si #6 | AtlasHub.Si | páginas dos 2 workshops + secção Workshops na home | rascunho |
| #22 | atlashub-club | ajuste editorial do Early Access ("participação gratuita") — outra sessão | aberto; compatível com este PR |

---

## Missão 1 — Fechar Club Atlas
| Item | Estado | Responsável | Bloqueio | Critério de aceitação |
|---|---|---|---|---|
| PR2B numa implementação canónica | ✅ feito (#23); #15/#19/#20 fechados como substituídos | Claude Code | — | um só PR; WhatsApp e Early Access da `main` intactos; CI verde no SHA |
| Percurso Visitante → Registo → E-mail → Conta → Interesse Genesis | ✅ código + testes (fail-closed) | Claude Code | migrações e env vars | registo completo homologado em ambiente controlado (abaixo) |
| Confirmar `dc07f91` em produção | ❌ **não está** (ver acima) | Helena | quota Vercel / decisão de redeploy | Sérgio decide redeploy de `main`; produção passa a mostrar Early Access |
| Auditar migrações na Supabase Master; corrigir permissões de escrita e objetos em falta no schema `club` | ⏳ | Helena | teste isolado + aprovação | relatório de diferenças vs `002`/`003`/`004`; correção aplicada primeiro em ambiente isolado; Security Advisor limpo |
| Homologar Auth, RLS, e-mail, consentimentos e 1.º registo completo | ⏳ | Helena (+ Claude Code no suporte) | item anterior; SMTP com SPF/DKIM; Redirect URL `/entrar/confirmar` | `scripts/test-sql-draft.sh` verde contra o ambiente; registo adulto ponta a ponta; menor gera só revisão; criança sem e-mail |
| LIVE bloqueado até GO/NO-GO | ✅ `CLUB_AUTH_MODE` off por defeito | Helena / Sérgio | relatório GO/NO-GO | aprovação escrita do Sérgio antes de `live` em produção |
| Biblioteca, Comunidade, Eventos, Mentores e Atlas Lab alinhados ao estado real | ✅ este PR | Claude Code | — | nada anunciado como ativo que não esteja; PT-BR; WhatsApp assistido como canal real; workshops separados do Club |
| Não iniciar funcionalidades avançadas | ✅ respeitado | todos | — | dashboard real, Missão 001 executável e Lab só depois da homologação |

## Missão 2 — Genesis
| Item | Estado | Responsável | Bloqueio | Critério de aceitação |
|---|---|---|---|---|
| Valores R$ 490 / R$ 190, 09/01/2027, 8 semanas, 24 ateliers | ✅ preservados (`src/lib/offers.ts`) | Claude Code | — | `content:check` impede outros valores/datas |
| Early Access: interesse até 30/11; 2 ateliers gratuitos em dezembro (híbrido Anápolis + online; online) | ✅ secção `/genesis#early-access` | Claude Code | produção desatualizada (M1) | visível em produção após redeploy aprovado |
| Datas, horários e local dos ateliers de dezembro | ⏳ | Sérgio / equipa | logística | datas publicadas só após confirmação; convites aos interessados |
| Condições definitivas (pagamento, cancelamento, reembolso) | ⏳ | Sérgio + jurídico | — | publicadas antes da abertura de matrículas |
| Integração futura com ARO | ✅ contratos (#16) | Claude Code / dono do ARO | M4 | ids unificados com o catálogo (`genesis-01-br`/`genesis-01-student-br`) |
| Pagamento | 🔒 desligado | — | ARO + EspelhoMeu | nenhuma cobrança até autorização específica |

## Missão 3 — Workshops empresariais
| Item | Estado | Responsável | Bloqueio | Critério de aceitação |
|---|---|---|---|---|
| Páginas W01 (14/11) e EL01 (28/11) em AtlasHub.Si | ✅ AtlasHub.Si #6 (pré-lançamento, noindex) | Claude Code | — | preview aprovado em desktop e mobile |
| Secção Workshops na home institucional | ✅ fora da maquete 1:1 (inalterada) | Claude Code | — | Visual Pack V1 desktop idêntico; secção legível a 390 px |
| Agenda Club com referência aos workshops, sem os apresentar como Club | ✅ este PR; links prontos e desligados (`atlashubWorkshopsLive`) | Claude Code | publicação de #6 | ligar o flag depois de as páginas estarem em atlashub.si |
| Programa | ✅ (fichas do Drive) | — | — | — |
| Condições comerciais (preço, lotes, cancelamento) | ⏳ propostas em `AtlasHub.Si/docs/WORKSHOPS.md` | Sérgio | aprovação | preço final publicado só com ARO ativo |
| Local e capacidade | ⏳ | Sérgio / equipa | reserva do espaço | endereço só após reserva confirmada |
| Inscrição | ✅ lista de interesse WhatsApp (`W01-SITE`, `EL01-SITE`) · inscrição paga 🔒 | equipa (atendimento) | ARO | contagem por código no CRM |
| Materiais de campanha e de sala | ⏳ checklist em `WORKSHOPS.md` §4 | equipa | — | artes verificadas antes de publicação |
| Go/no-go | ⏳ W01 (sugestão 07/11) · EL01 19/11 (≥ 8 empresas) | Sérgio | — | decisão registada |

## Missão 4 — ARO
| Item | Estado | Responsável | Bloqueio | Critério de aceitação |
|---|---|---|---|---|
| Contratos oferta / pedido / pagamento / direito | ✅ candidatos (`docs/20_ARO_CONTRATOS.md`, #16) | Claude Code | validação pelo dono do ARO | contratos aceites ou substituídos pela versão oficial |
| Sem checkout paralelo | ✅ testes impedem checkout nas páginas de workshops; PR2C sem provedores | todos | — | nenhum provedor integrado fora do ARO |
| Ativação | 🔒 | Sérgio | piloto financeiro **EspelhoMeu** homologado | sandbox ponta a ponta + aprovação específica |

## Missão 5 — Campanhas
| Frente | Público · mensagem · landing · CTA | Captação verificável | Estado | Bloqueio para campanha paga |
|---|---|---|---|---|
| Club gratuito | `docs/21` §1 · club.atlashub.si | WhatsApp `CLUB-*` (ativo no site) | plano pronto | cadastro homologado ou atendimento publicado; privacidade final |
| Genesis Early Access | `docs/21` §2 · `/genesis#early-access` | `GEN-EA-*` (ativo no site); conta quando PR2B live | plano pronto | produção atualizada; datas dos ateliers; condições definitivas |
| Workshop Empresa Aumentada | `docs/21` §3 · atlashub.si/workshops/… | `W01-*` | plano pronto | local, preço, ARO, atendimento; decisão até 20/10 sobre paga |
| Enterprise Lab E-commerce | `docs/21` §4 · atlashub.si/workshops/… | `EL01-*` | plano pronto | idem + go/no-go 19/11; sem massivo no feriado 20/11 |

---

## Decisões pendentes do Sérgio
1. **Redeploy de produção do Club** a partir da `main` atual (põe o Early Access no ar) — executar pela Helena, minimizando builds.
2. Ordem de merge sugerida: #22 → este PR → AtlasHub.Si #6 (depois ligar `atlashubWorkshopsLive`) → #23 (só após homologação) → #16 (docs).
3. Preços, lotes, local, capacidade e política de cancelamento dos workshops; go/no-go do W01.
4. Datas e local dos ateliers do Early Access.
5. Se haverá campanha paga do W01 (prazo útil: decidir até 20/10).

## Riscos
| Risco | Mitigação |
|---|---|
| Produção diverge da `main` (Early Access ausente) | redeploy aprovado; verificar SHA no Vercel após cada merge |
| Quota de builds Vercel | agrupar commits; um push por PR; evitar redeploys manuais desnecessários |
| Master partilhada (`auth.users`, papel `authenticated`) | 003 fecha escrita direta; teste de isolamento no GO/NO-GO; outras apps não tratam sessão como autorização |
| Recolha de dados de menores | menores só geram revisão do responsável; criança sem e-mail; nada de CRM, conta ou cobrança antes da aprovação |
| Links para páginas ainda não publicadas | flag `atlashubWorkshopsLive` desligado; workshops com noindex |

## Reversão
Cada PR reverte-se de forma independente. Nenhuma base, variável de ambiente, provedor ou campanha foi alterado por estes PRs.
