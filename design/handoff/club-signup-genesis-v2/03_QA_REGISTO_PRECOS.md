# Critérios de aceitação — UX, pricing, elegibilidade e segurança

## QA visual
- [ ] 1440px desktop: legendas, preços, contraste, CTA primária, elenco de rosto preservado.
- [ ] 768px tablet: grelha fluida, sem scroll lateral.
- [ ] 390px mobile: sem scroll lateral; CTA visível, formulários sem campos esmagados, preço não cortado.
- [ ] Maquete base aprovada vs screenshot `screenshots/`: registo de diferenças intencionais; QA de textos PT-BR.
- [ ] Contraste AA, focus visível, labels, error summary e suporte a screen readers.

## Inscrição livre
- [ ] `/participar` aberto pela navegação normal seleciona **Club grátis** por padrão.
- [ ] Entrar no Club nunca exige selecionar plano pago ou informar cartão.
- [ ] Passos navegáveis com Voltar e resumo consistente; não perder rascunhos ao corrigir.
- [ ] Club criado só quando backend de Auth confirma conta e aceite de termos; falha deve ser mostrada.
- [ ] WhatsApp não obrigatório; marketing opt-in em branco por defeito.

## Genesis / preço
- [ ] `/participar?plan=genesis` seleciona Genesis de forma transparente.
- [ ] Valor padrão é **R$ 490**; estudante, se elegível, **R$ 190**.
- [ ] Preço correto no card, formulário, cotação do backend, recibo e entitlement.
- [ ] Alterar checkbox estudante em UI **não autoriza cobrança** a R$ 190 sem validação.
- [ ] Rejeição da elegibilidade oferece contestação ou continuidade pelo padrão sem débito automático.
- [ ] Não existem abatimentos automáticos/parcelamentos/taxas não homologados.
- [ ] Aplicar condições de arrependimento/reembolso e comprovantes conforme revisão jurídica.
- [ ] Consentimento de termos comerciais e marketing separados.
- [ ] Usuário não pode alterar preço via payload do cliente; testar replay/idempotência de webhook.
- [ ] Menores de idade sem fluxo validado: sem pagamento e encaminhamento apropriado.

## Produto pós-adesão
- [ ] Dashboard Free com Missão 001 e convite Genesis **sem paywall da comunidade**.
- [ ] Genesis pending, paid e refunded têm acessos corretos, conferidos no servidor.
- [ ] Dados de outro membro/tenant não podem ser acedidos.
- [ ] Lab e Hermes só funcionam quando serviços habilitados com isolamento homologado; nunca simular agente ativo.
- [ ] Não há afirmação falsa de “pagamento recebido”, “vaga confirmada”, “membro ativo”, “80% concluído” ou “agente criado”.

## Operação
- [ ] Preview Vercel READY protegido; `main` sem merge por defeito.
- [ ] CI e testes unitários/e2e completos; capturas e regressões comparadas.
- [ ] Rollback e logs de auditoria sem PII/segredos preparados.
- [ ] Consentimento, retenção, supressão, pedidos de remoção, cross-brand CRM validados por responsável.
