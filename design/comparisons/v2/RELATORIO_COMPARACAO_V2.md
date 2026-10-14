# Comparação visual — v2 (adesão, Genesis, dashboard, Atlas companion)

Referências: maquetes enviadas no chat a 14/10/2026 (`design/reference/v2/`), mascote transparente aprovada (`design/reference/approved/ATLAS_MASCOTE_TRANSPARENTE.png`) e os documentos do Drive "Handoff v2.0" (`design/handoff/club-signup-genesis-v2/`). O ZIP com HTML/CSS editáveis e as 14 capturas **não foi recebido** nesta sessão, por isso a comparação é feita contra as imagens do chat.

| Ficheiro | Referência | Implementação |
|---|---|---|
| `01_landing-v3_vs_hero.jpg` | Landing v3 (conceito) | `/` 1440 — dobra |
| `02_landing-v2_vs_landing-completa.jpg` | Landing v2 candidata (longa) | `/` 1440 — página inteira |
| `03_oferta-v2_vs_formulario.jpg` | Bloco de oferta da v2 | `/participar?plan=genesis` com estudante |
| `04_mascote_vs_atlas-companion.jpg` | Mascote aprovada | Painel do Atlas aberto |

Capturas: `design/screenshots/v2/` (`/`, `/participar`, `/genesis`, `/area-membro` em 1440/768/390, mais estados do formulário e do Atlas).

## Fiel às referências
- Ofertas lado a lado **Club grátis × Genesis** com "Entre gratuitamente. Cresça com o Genesis.", CTA dourado e preços R$ 490 / R$ 190.
- Secção "Da tela vazia ao seu ecossistema vivo." (já existia desde a revisão anterior) e pergunta final "Se você pudesse criar uma equipe de agentes só sua, o que construiria?".
- Mascote Atlas transparente (azul/dourado, pedestal luminoso), agora usada no companion e em todas as presenças da mascote.
- Elenco com rostos da arte aprovada e nomes em DOM.

## Divergências intencionais
| Área | Referência | Implementação | Motivo |
|---|---|---|---|
| H1 do hero | "PESSOAS REAIS. AGENTES PRÓPRIOS. PROJETOS VIVOS." (v3) | "O futuro se constrói por pessoas como você." | Segue `05_COPY_COMERCIAL_PUBLICA.md` (copy oficial v2). A v3 pode ser ativada se o Sérgio preferir |
| Nome da mentora | "CLARA" (v3) | "Marta" | Decisão de casting da revisão do PR #11 (Clara fica para a Clara Corporate) |
| Preço em destaque | v3 destaca R$ 190 (estudante) | R$ 490 e R$ 190 com o mesmo peso visual + aviso de validação | Evitar padrão enganoso: R$ 190 só vale após validação (QA `03_QA`) |
| Card "Uma jornada… R$ 190" no hero (v2) | No topo | Oferta em secção própria + linha de estado no hero | Manter a equipe na primeira dobra (revisão do PR #11) |
| Vídeo "Ver como funciona · 2 min" (v3) | Card com vídeo | Ausente | Não há vídeo aprovado |
| Imagem de partículas no laboratório (v3) | Logo de energia | Consola simulada + Atlas | Já aprovado na revisão anterior; a arte de energia fica disponível |
| "Entrar no Clube" (v3) | PT-PT/PT-BR misto | "Entrar no Club" | Consistência com a marca "Club Atlas" |

## Estado funcional (honesto)
- Formulário de 4 etapas navegável, com validação, voltar sem perder dados e resumo de preço — **não envia nem guarda nada**.
- Dashboard: prévia de membro novo (0/4 etapas, nenhum agente), sem métricas.
- Atlas: presença, balões, painel e guia pré-escrito; conversa livre e voz **não ligadas** (fail-closed).
