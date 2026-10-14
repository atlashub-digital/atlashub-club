# Canais — Telegram, Discord e WhatsApp

## Prioridade de implementação
**1 Telegram OPERACIONAL (privado):** criar grupo, adicionar Sérgio e pessoas autorizadas, e **um único bot Atlas** no piloto. Os demais perfis são especialidades convocadas sem contas externas extra até validação. Respostas ao serem mencionados. Use identidades e permissões apenas depois de validar a lista. Não expor chat ID neste repo.

**2 Discord COMUNIDADE:** servidor Club Atlas com canais #boas-vindas, #avisos, #forum-aberto, #pergunte-ao-atlas, #apresentacoes, #genesis-interesse, #construindo-juntos, #build-night e #moderacao (privado). Atlas responde inicialmente só a menções; livre resposta apenas em canal experimental moderado. Papel de moderador humano para casos sensíveis.

**3 WhatsApp:** grupo por adesão voluntária e avisos supervisionados. Verificar canal de integração oficialmente suportado e política vigente; não montar automação de grupo com sessão pessoal/contorno de regras sem consentimento e aprovação de risco. Preferir publicação humana de resumos do Atlas enquanto o projeto valida API/canal.

## Hermes — base técnica
Referências oficiais:
- https://hermes-agent.nousresearch.com/docs/getting-started/quickstart/
- https://hermes-agent.nousresearch.com/docs/user-guide/messaging/discord/
- https://hermes-agent.nousresearch.com/docs/user-guide/profiles/
- https://hermes-agent.nousresearch.com/docs/user-guide/bot-mode

Antes de ativar o gateway, validar o comando exato na versão instalada, o modelo e a conta de custos. O assistente principal deve responder numa sessão local de teste antes de ir para canais.
Configuração interativa documentada: hermes gateway setup. Cada perfil pode ter memória/soul separados. SOUL.md carregado no HERMES_HOME do perfil, não automaticamente desta pasta.

## Plano de execução seguro para Helena (sob autorização Sérgio)
1. Confirmar host exclusivo/isolado; nunca instalar por padrão numa VPS de pagamentos nem alterar gateway existente.
2. Fazer inventário sem revelar tokens: versão Hermes, perfis, estado do gateway, consumo RAM/CPU, backups, rede.
3. Provisionar profile temporário **atlas-club-staging** isolado; copiar SOUL de agents/atlas somente após Sérgio aprovar; registar SHA.
4. Configurar bot de teste Telegram via @BotFather; guardar token em cofre/.env com 0600; configurar allowlist de IDs humanos autorizados.
5. Testar privado (DM) → grupo sob @mention → restart e persistência → limites de acesso → kill switch.
6. Provisionar bot Discord em servidor sandbox, scopes mínimos, canais restritos, termos/política; testar abuso e flood.
7. Só depois contemplar Clara/Caio/Bia como perfis próprios para canais; multiplexar respostas sem spam.
8. WhatsApp em RFC específica após análise de suporte oficial, consentimento e riscos de bloqueio.
9. Enviar relatório ao Sérgio: estado, logs redigidos, CPU/RAM/custos, questões em aberto, plano de reversão.

## Kill switch
Interromper gateway/profile, revogar token, arquivar eventos relevantes fora do repo público, avisar Sérgio e reverter último deploy; preservar dados nos termos consentidos. Sem publicação automática durante incidente.
