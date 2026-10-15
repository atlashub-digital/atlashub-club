# Campanhas — quatro frentes editoriais (retoma operacional, 15/10/2026)

**Estado:** plano preparado. **Nenhuma campanha paga** até cada frente cumprir o seu gate (páginas, atendimento e condições aplicáveis operacionais). Publicação orgânica só com aprovação do Sérgio.
**Fontes:** Drive `EMPRESA_AUMENTADA_2027-2030_WORKSHOPS/04_CAMPANHA_E_COPYS` (copys, vídeos, e-mail/WhatsApp, calendário), `09_CAMPANHA_LANCAMENTO.md` (Genesis), `src/lib/offers.ts`, `atlashub-digital/AtlasHub.Si` `lib/workshops.ts`.
**Regras comuns:** sem métricas, testemunhos, vagas ou preços não aprovados; menores nunca são público-alvo de anúncios; WhatsApp só com adesão expressa e sem importar listas; consentimento de marketing separado e facultativo.

## Mecanismo de captação verificável (comum)
Cada CTA abre o WhatsApp oficial com mensagem pré-preenchida terminada por um **código** `<FRENTE>-<CANAL>` (Club: `src/lib/contact.ts` → `campaignWhatsAppUrl`; workshops: `lib/workshops.ts` na AtlasHub.SI).

| Frente | Código base | Canais (sufixo) |
|---|---|---|
| Club gratuito | `CLUB` | `SITE`, `IG`, `LI`, `FB`, `WA` (parceiros), `EVT` (presencial/QR) |
| Genesis Early Access | `GEN-EA` | idem |
| Workshop 01 | `W01` | idem |
| Enterprise Lab 01 | `EL01` | idem |

**Verificação:** o atendimento regista no CRM (com consentimento) data, código e próximo passo. Relatório semanal = contagem por código, extraída do CRM, sem estimativas. Quando o PR2B estiver live, o interesse Genesis pela conta (`club_genesis_applications.created_at`) junta-se à contagem `GEN-EA` e prova o prazo do Early Access.

---

## 1. Club gratuito
- **Público:** estudantes de todas as áreas, iniciantes, criadores e pequenos empreendedores (18+ nos anúncios; menores só por canais orgânicos com revisão do responsável).
- **Mensagem:** "Pessoas reais. Agentes próprios. Projetos vivos." · "Você não precisa saber programar; precisa começar." Gratuito, sem compra obrigatória.
- **Landing:** `club.atlashub.si` (home).
- **CTA (decisão de 15/10/2026):** "Conhecer o Club" + manifestar interesse pelo WhatsApp (`CLUB-*`). **Não** anunciar cadastro de membros, contas nem Missão 001 como disponíveis enquanto o PR2B estiver em NO-GO.
- **Conteúdos (out–dez):** manifesto do Club e do Atlas Lab (Lab da tela vazia ao ecossistema); apresentação da Missão 001 **como em preparação** (o que vai ser, sem convite para a fazer); apresentação dos mentores (Sérgio real; Lucas, Atlas, Marta e Bia identificados como personagens digitais); FAQ "só tenho celular"; convite para fóruns de novembro quando houver data.
- **Gate para campanha paga:** cadastro PR2B homologado (GO/NO-GO) **ou** atendimento WhatsApp com responsável e horário publicados; aviso de privacidade final; fóruns com data.

## 2. Genesis Early Access
- **Público:** estudantes e profissionais em transição que querem construir um projeto com agentes em 8 semanas; quem já falou com a equipe pelo WhatsApp.
- **Mensagem:** "Comece antes da Turma 01." Interesse até **30/11/2026** → convite para **2 ateliers extras e gratuitos em dezembro** (um híbrido em Anápolis + online, outro online de preparação dos projetos). Turma 01 em **09/01/2027**, 8 semanas, 24 ateliers. R$ 490 padrão · R$ 190 estudante elegível após validação. Registrar interesse não é matrícula.
- **Landing:** `club.atlashub.si/genesis#early-access`.
- **CTA:** "Registrar interesse pelo WhatsApp" (`GEN-EA-*`). O registo pela conta do Club só será anunciado depois do GO do PR2B.
- **Conteúdos:** 15–31/10 "Seu próximo colega não é mais um chatbot" (curiosidade) e "Não sabe programar? Você pode começar dirigindo um projeto" (inclusão); 01–20/11 catálogo de projetos possíveis (exemplos rotulados como cenários) e conversa com o Sérgio; 14/11 menção breve no Workshop 01 (lista de interesse, sem cobrança); 21–30/11 contagem para o prazo do Early Access; dezembro: convites dos ateliers só depois de datas confirmadas.
- **Gate para campanha paga:** datas e local do atelier híbrido confirmados; atendimento com responsável; condições definitivas (pagamento, cancelamento, reembolso) publicadas **antes** de qualquer anúncio que fale em preço; ARO homologado antes de abrir matrículas.

## 3. Workshop 01 — Empresa Aumentada 2027–2030
- **Público:** decisores de PME, sócios, gerentes, diretores e responsáveis operacionais em Anápolis e região.
- **Mensagem:** "O futuro das empresas não é uma coleção de bots. É uma nova arquitetura do trabalho." Três horas presenciais (14/11, 14h–17h) + Clínica de Ideias a distância (16/11) + comunidade moderada de 30 dias.
- **Landing:** `atlashub.si/workshops/empresa-aumentada-2027-2030` (AtlasHub.Si PR #6, pré-lançamento).
- **CTA:** hoje "Quero ser avisado da abertura" (WhatsApp `W01-*`); depois do gate, "Quero participar do workshop" → inscrição e pagamento via ARO.
- **Conteúdos (copys do Drive, revistas):** LinkedIn institucional "A próxima transformação das empresas não cabe numa lista de ferramentas"; carrossel "Ter IA não é Empresa Aumentada"; vídeo 45 s "Da ferramenta à organização"; mensagem pessoal do responsável AtlasHub; FAQ do programa. E-mail 02 "Inscrições abertas" **só com checkout ARO ativo**.
- **Gate para campanha paga:** local reservado, preço e política de cancelamento aprovados, oferta no ARO, atendimento pronto, go/no-go (sugestão 07/11). Com 30 dias até ao evento, decidir até **20/10** se há tempo útil para campanha paga.

## 4. Enterprise Lab 01 — E-commerce e Operações Vivas
- **Público:** sellers de Mercado Livre, Shopee e loja própria, gestores de e-commerce, operações e logística.
- **Mensagem:** "Você vende no Mercado Livre, na Shopee e no seu site? E quem coordena a operação?" Laboratório prático de 5 horas (28/11, 14h–19h) com matriz de gargalos, blueprint e demonstração com dados sintéticos. Sem acesso às contas dos participantes.
- **Landing:** `atlashub.si/workshops/enterprise-lab-ecommerce`.
- **CTA:** hoje "Quero ser avisado da abertura" (WhatsApp `EL01-*`); depois do gate, inscrição por empresa via ARO.
- **Conteúdos:** vídeo 35 s do Drive; carrossel dos 5 casos didáticos (estoque em dois canais, pagamento sem conciliação, rastreio desatualizado, regra do marketplace, margem destruída); convite direto a sellers (só contactos com consentimento). Comunicação própria a partir de 17–19/11, intensifica a partir de 23/11; **sem campanha massiva no feriado de 20/11** (aditamento v0.2).
- **Gate para campanha paga:** igual ao W01 + go/no-go **19/11** com ≥ 8 empresas pagantes; comunicar por escrito a quem já tinha recebido a data antiga (21/11).

---

## Calendário consolidado (proposta, sujeito aos gates)
| Janela | Club | Genesis EA | W01 | EL01 |
|---|---|---|---|---|
| 15–20/10 | manifesto | curiosidade | decisão sobre campanha paga (20/10) | — |
| 21–31/10 | Missão 001 | inclusão + FAQ | orgânico, lista de interesse | teaser orgânico |
| 01–13/11 | mentores, fóruns | projetos possíveis | conversão (se gate) | lista de interesse |
| 14–16/11 | — | menção no W01 | evento + Clínica | — |
| 17–30/11 | convite fóruns | contagem até 30/11 | pós-evento, comunidade 30 dias | conversão (se gate), go/no-go 19/11 |
| dezembro | estreia formal do Club | ateliers Early Access | — | pós-evento |

## Responsáveis
Conteúdo e páginas: Claude Code (PRs) · revisão editorial e aprovação: Sérgio · atendimento/CRM e ativos de campanha: equipa AtlasHub · infraestrutura (CRM, WhatsApp oficial, e-mail): Helena.
