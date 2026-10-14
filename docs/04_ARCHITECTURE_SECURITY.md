# Arquitetura e segurança — proposta

## Fronteiras
1. Public Next.js app no Vercel sob club.atlashub.si (scope/projeto a validar).
2. Auth independente ou futuro SSO da AtlasHub; os cookies e sessões da Workforce não transitam automaticamente.
3. Supabase/Postgres reservado para leads opt-in, perfis, conteúdos, produtos, eventos, matrículas e direitos; projetar RLS, anon somente de leitura autorizada, escrita de leads via servidor.
4. Atlas Library via catálogo/Reader Editions: não duplicar conteúdo-fonte nem alterar projectos já em desenvolvimento.
5. Hermes runtime, memória e credenciais **fora do repo** e separadas da Workforce/AMF, com gateways Telegram e Discord.
6. Atlas Lab: máquinas/sandboxes isoladas por membro com quotas CPU/RAM/disco/tempo/tokens/rede, nenhum root partilhado, sem segredos da Holding.

## Diretrizes de segurança
- Repo público: nunca colocar bot tokens, auth keys, URL de Webhook com secret, ID pessoal, dumps, dados de alunos, metadados privados de fornecedores.
- Diferenciar PR de produção; deployment protegido por revisão humana e ambiente preview.
- RLS, RBAC, anti-abuso/captcha, verificação de email, políticas LGPD, retenção configurada e direito de eliminação.
- Qualquer execução de código agentic deve operar isolada, sem rede lateral para hosts internos, sem docker.sock do host, sem privilégios elevadores, sem volumetria de dados externos não autorizados.
- Consentimento e regras de WhatsApp: o número dos membros pode ser visível aos restantes; opção de entrar apenas no Discord.
- O Atlas comunitário não guarda memória privada indiscriminada nem copia chats para treino; termos claros de retenção.
- Não permitir que agentes publiquem autonomamente mensagens comerciais, selecionem beneficiários de bolsas ou enviem mensagens diretas massivas.

## Finanças
PIX via provedores sob validação técnica e regulatória. Cartão e boleto somente após confirmação do operador, política de prestação e tratamento de inadimplência; encargos claros **antes** da compra.
Bolsas mediante critérios não discriminatórios e disponibilidade, sem obrigatoriedade de trabalho gratuito ou cessão societária.

## Operação
Padrões: revisão de arquitetura, threat modeling, teste de carga, testes de recuperação, monitoração, rollback e gate Go/No-Go. Não definir capacidade VPS por estimativa: testar workload real.
