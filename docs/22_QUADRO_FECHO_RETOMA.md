# Quadro de fecho — retoma operacional (Club + Genesis + Workshops + ARO + Campanhas)

**Data:** 15/10/2026, atualizado 16/10/2026 · **Dono e autoridade:** Sérgio Monteiro · **Cooperação técnica:** Helena · **Implementação:** Claude Code
**Regra:** PRs pequenos em rascunho; sem merge, deploy, DDL produtiva, cobrança ou campanha paga sem aprovação do Sérgio.

## Pós-merge — 16/10/2026, 06h UTC
Integrados pelo proprietário: #26, #16, #28 (Club) e AtlasHub.Si#8. **Produção Club = `d032963`** (Vercel `dpl_6JQWTjPL33SuZtEEFR1BDspJazNw`, READY). Verificado em produção:
- `/`, `/genesis`, `/eventos` → 200, `noindex`; a agenda liga às páginas `www.atlashub.si/workshops/…` (W01 e EL01).
- `/catalogo.json` → 200, `X-Robots-Tag: noindex`, ofertas `CLUB`, `GEN-EA`, `W01`, `EL01`, `paymentRouting: indisponivel`.
- ARO fail-closed: `POST /api/aro/webhook` → 503 (Club e AtlasHub.SI); `/api/aro/checkout` → 404.
- `POST /api/interesse` → 503; `/api/club/signup` → 404 (registo real continua fora de produção).
- Páginas de workshops AtlasHub.SI: sem `R$`, `noindex`.
- #23 e #25 atualizados com `main` (`d032963`), sem conflitos; #23 com `verify` e Playwright verdes localmente.

**Pendentes:** #23 (homologação Helena → GO executivo) e #25 (documentação). Bloqueios objetivos inalterados (tabela abaixo).

## Relatório final de homologação — 16/10/2026, 03h UTC (diretiva final de execução)
**Produção:** Club `dbbbf44` (Vercel `dpl_EtTk5EnJEDiMB9Px9JXJswQ6SRbQ`, READY). AtlasHub.SI `dd853daf`: `/workshops`, `/workshops/empresa-aumentada-2027-2030` e `/workshops/enterprise-lab-ecommerce` → 200, `noindex`, sem `R$`, WhatsApp `W01-SITE` / `EL01-SITE`.

| Frente | PR | Estado técnico (verificado) | Bloqueios objetivos |
|---|---|---|---|
| PR2B registo real | #23 (único; CI `verify` + `sql-draft` verdes em `513351c`) | Percurso completo em código e testes. A reconciliação da Master (002 aplicado → 003+004) está provada em CI: auditoria só de leitura, transação com pré/pós-condições, reversão (`docs/sql/drafts/RECONCILIACAO_MASTER.md`). `CLUB_AUTH_MODE` fica `off`. | 1. Aplicar a reconciliação num ambiente isolado e depois na Master (Helena). 2. Auth: Confirm email, Redirect URL `/entrar/confirmar`, SMTP com SPF/DKIM. 3. Variáveis do modo live na Vercel (`docs/17` §3); `SUPABASE_ANON_KEY` está em falta. 4. Matriz de aceitação real ponta a ponta (`docs/17` §6) com evidências. 5. Homologação da Helena, que é a condição do GO executivo para merge e `live`. |
| Links da agenda para workshops | #26 (CI verde, preview READY) | Os links apontam para as rotas confirmadas em produção. | Confirmação da Helena (AtlasHub.Si#7) e autorização de merge. |
| ARO: ids e consumidores | #16 (Club, CI verde) · AtlasHub.Si#8 | Ids da UI = catálogo, garantido por um guarda no `content:check`. Cliente com checkout, polling e direitos; webhook HMAC. Tudo fail-closed: sem rota de checkout e sem provedores diretos. | Projetos `atlas-club` e `atlashub-si` registados no ARO e chaves emitidas; homologação E7 no EspelhoMeu; políticas de venda publicadas; GO comercial. |
| Clara WhatsApp | #28 | `/catalogo.json`: 4 ofertas, códigos, links, guardrails e campos de CRM; QA em `docs/25`. | Configuração da Clara no Atendimento.Center (Helena); responsável e horário do atendimento; registo dos códigos no CRM. |
| Campanhas | #25 | Dois packs para revisão: Club/Genesis (`docs/24`, 8 peças) e Business/Enterprise (`docs/26`, 8 peças). | Revisão e aprovação peça a peça pelo fundador. Campanha paga exige GO. |
| Genesis | — | 09/01/2027, 8 semanas, 24 ateliers, R$ 490/190. Early Access até 30/11. Nenhuma data em dezembro. | Datas dos ateliers de dezembro só depois de mais de cinco inscrições qualificadas. Condições definitivas antes de abrir matrículas. |
| Workshops | AtlasHub.Si#8 | Capacidade-alvo 25 pessoas (W01) / 12 empresas (EL01). Local "a divulgar". Sem preço publicado. | Decisão comercial do W01 (20/10). Regras de adiamento, cancelamento e reembolso publicadas antes de vender. |

**Ordem de merge sugerida:**
1. #26, depois da confirmação da Helena.
2. #28 e AtlasHub.Si#8 (não mudam o comportamento visível nem fazem cobrança).
3. #16.
4. #23, só depois da homologação da Helena.
5. #25 (documentação).

## Estado real verificado (histórico 15/10)
**Atualização 15/10/2026, 19h UTC (decisão operacional do Sérgio, ponto 1):** #22 e #24 integrados num só merge (`dbbbf44`), com um único build de produção.
- **Produção Club = `dbbbf44`** · Vercel `dpl_EtTk5EnJEDiMB9Px9JXJswQ6SRbQ` · READY · club.atlashub.si.
- Homologado em club.atlashub.si:
  - Early Access visível em `/genesis#early-access`, com o prazo de 30/11/2026;
  - "Atelier extra 1" (híbrido, Anápolis + online) e "Atelier extra 2" (online), ambos gratuitos e com data a confirmar;
  - início a 09/01/2027; R$ 490 / R$ 190 mostrados com "não é matrícula";
  - WhatsApp operativo com o código `GEN-EA-SITE`;
  - `POST /api/interesse` → 503;
  - `/api/club/signup` → 404 (o registo real não está em produção); `/participar` em "Modo demonstração";
  - `/api/atlas/turn` → 503;
  - `noindex, nofollow` mantido;
  - nenhum link para atlashub.si/workshops ainda.
- Rollback: `dpl_6PWUYKyGmTb9z2yGzPnMdeFaSyeV` (`dab885c`).
- Histórico: até esta data a produção estava em `dab885c` (não havia deploy de `5ed90b8`/`dc07f91`).

## PRs desta retoma
| PR | Repo | Âmbito | Estado |
|---|---|---|---|
| #23 | atlashub-club | PR2B canónico (substitui #15, #19, #20) + interesse Genesis pela conta | rascunho, testes locais verdes |
| #16 | atlashub-club | PR2C RFC + contratos ARO (só docs) | rascunho, CI verde no SHA anterior |
| #24 | atlashub-club | Early Access completo, páginas Club alinhadas, campanhas, este quadro | **integrado** (`dbbbf44`) e em produção |
| AtlasHub.Si #6 | AtlasHub.Si | páginas dos 2 workshops + secção Workshops na home | rascunho |
| #22 | atlashub-club | ajuste editorial do Early Access ("participação gratuita") | **integrado** via #24 |

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
| Datas, horários e local dos ateliers de dezembro | ⏳ | Sérgio / equipa | mais de cinco inscrições qualificadas | datas decididas só depois desse limiar; convites aos interessados |
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
