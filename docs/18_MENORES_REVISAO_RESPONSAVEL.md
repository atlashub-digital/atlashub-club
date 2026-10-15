# Menores de 18 anos — percurso com revisão do responsável

**Decisão do Sérgio, 14/10/2026:** retirar o bloqueio automático de menores no formulário de adesão e substituí-lo por um percurso de revisão manual. Neste PR é **só demonstração**: nada é enviado nem guardado.

## Comportamento atual (prévia em `/participar`)
| Faixa | O que a pessoa vê | Estado previsto |
|---|---|---|
| 18 anos ou mais | Fluxo normal | `club_free`, `genesis_interest` ou `student_pending` |
| Entre 12 e 17 anos | Avança sem bloqueio. Vê a mensagem positiva "Que bom ter você aqui!", que explica que alguns passos vão precisar da autorização de um responsável e que a equipe revisa cada caso. | `pending_guardian_review` |
| Menos de 12 anos | O mesmo, com a nota extra de que o responsável participa desde o início do registro. **Não é pedido e-mail nem outro contacto da criança**: a revisão mostra "Contacto: através do responsável legal" | `pending_guardian_review` |

**Para menores:**
- O campo "Nome" passa a "Nome ou apelido".
- O WhatsApp **não é pedido** (minimização) e é limpo se já estiver preenchido.
- Não existe caixa "tenho autorização do responsável": **não há consentimento simulado**.
- A revisão final e o ecrã de conclusão mostram o estado previsto, as revisões aplicáveis e o que fica em espera.
- As páginas públicas continuam abertas.

A lógica está em `src/lib/adesao/status.ts` (`deriveSignupOutcome`). As revisões são **independentes**:
- `reviews.guardian`: qualquer menor;
- `reviews.student`: pedido de R$ 190 no Genesis.

Um menor estudante precisa das duas.

**Fica em espera até à revisão do responsável:**
- criação de conta com dados pessoais;
- áreas com registo;
- pré-candidatura Genesis, matrícula e qualquer cobrança.

A `/genesis` (FAQ) foi atualizada no mesmo sentido.

## Para a implementação real (PR2B/PR2C) — não ativo
1. **Base legal antes de recolher dados de menores.** No Brasil, o art. 14 da LGPD exige consentimento específico e destacado de pelo menos um dos pais ou responsável para crianças (menos de 12 anos, segundo o ECA) e o tratamento no melhor interesse para adolescentes. Na UE/Eslovénia aplica-se o art. 8.º do RGPD. A validação jurídica é obrigatória antes da ativação.
2. **Recolha mínima.** Faixa etária (não a data de nascimento) e o contacto do responsável apenas quando a revisão começar. Nada é enviado para o CRM de marketing.
3. **Estados verificáveis no servidor:** `pending_guardian_review` → `guardian_approved` | `guardian_rejected` | `guardian_expired`.
   - Cada transição regista quem decidiu, quando e com que evidência (referência, nunca o documento em claro).
   - Há prazo de expiração.
   - Os dados são apagados se a revisão não avançar.
4. **Procedimento manual da equipe.** Contactar o responsável por canal verificado, confirmar a relação e registar a decisão; a pessoa pode contestar.
5. **Bloqueios técnicos.**
   - Sem `entitlement` Genesis, cotação ou checkout enquanto `reviews.guardian` não estiver aprovada.
   - A condição de estudante continua a ser validada à parte.
6. **Sem publicação autónoma** de conteúdo de menores nem perfis públicos por defeito.

## Testes
- `tests/e2e/adesao.spec.ts`:
  - menor (12–17) com Genesis e estudante avança até ao fim, sem erros, sem pedido `/api`, e termina em `pending_guardian_review` com as duas revisões;
  - nota para menos de 12 anos;
  - adulto no Club sem revisão.
- `tests/e2e/adesao-status.spec.ts`: modelo de estados (independência das revisões, Club vs Genesis).
