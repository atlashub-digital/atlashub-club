# Formação de arranque — publicação e matrícula

Decisão de Sérgio: venda agora por R$147,00 em pagamento único; lives em 5, 12 e 19/11/2026, das 19h às 20h30 de Brasília. O programa ampliado de oito módulos e seis cases é separado. O acesso começa após confirmação do pagamento, ao material que estiver efetivamente publicado.

## Página implementada

Rota: `/formacoes/arquitetura-superinteligencia-agentica`.

Capa escolhida por Sérgio, programa inicial, três lives, preço, perguntas frequentes e contato comercial. A página funciona sem uma sessão Campus. O link Formação na navegação permite encontrá-la. Não inclui formulário novo nem recolhe dados de compradores.

O botão padrão abre o WhatsApp comercial fornecido por Sérgio, com uma mensagem de interesse. Não é checkout nem gera matrícula. Para ativar o botão de compra, configurar as três variáveis públicas, sem credenciais:

```
ARCHITECTURE_CHECKOUT_URL=https://<checkout-real-da-oferta>
ARCHITECTURE_TERMS_URL=https://<condicoes-comerciais-publicadas>
ARCHITECTURE_CHECKOUT_READY=true
```

As duas URLs precisam usar HTTPS, sem credenciais ou placeholders. A flag só deve ser ativada após a operação provar que o checkout corresponde ao produto e preço aprovados e que uma compra confirmada concede o acesso correto. A flag é configuração operacional; não verifica o provedor nem substitui a integração. Nenhum segredo entra na página. URLs inválidas ou configuração incompleta mantêm o contato comercial.

Condições ainda não definidas pelo proprietário: prazo de acesso, política de gravações, canal e período do acompanhamento diário. A página não inventa essas condições; devem constar na oferta antes de habilitar o pagamento.

## Fluxo necessário no Campus

Curso existente: `course_a37ae2a4-8a23-456c-9b2f-61447e38e9c4`. Não criar outro curso para resolver o checkout.

1. Confirmar uma sessão de administrador de organização no login → `/dash` → `/dash/courses`. `/admin` não é o caminho necessário para gerir a organização OSS.
2. Aplicar a capa e a descrição corrigida. Publicar as atividades iniciais aprovadas, com a página comercial acessível e as aulas protegidas. Não vender acesso imediato a um curso vazio.
3. Corrigir o aviso de privacidade com a controladora escolhida: AtlasHub Brasil, CNPJ 66.991.513/0001-10, Goiânia, Brasil, contato `contact@atlashub.si`. Verificar fornecedores, finalidades e retenção reais antes de substituir a minuta. O nome comercial e o identificador foram fornecidos pelo proprietário; não equivalem a consulta cadastral.
4. Abrir o cadastro gratuito e testar uma conta nova, confirmação de e-mail e login. Não dar papel administrativo ao público. Corrigir o portal para o mesmo destino de cadastro; convite Discord não substitui conta Campus.
5. Mapear uma oferta aprovada exclusivamente para este curso. Confirmar pagamento no servidor; vincular de forma segura o comprador à conta Campus; só então matricular. O redirecionamento do navegador não é prova de pagamento.
6. Deduplicar eventos por identificador/transação e reconciliar o estado final. Um reenvio não pode duplicar matrícula; reembolso ou chargeback remove apenas o direito daquela compra e preserva direitos obtidos por outras ofertas/pacotes.
7. Fazer uma verificação dirigida: comprador novo, titular de conta existente, evento repetido e pagamento revertido; verificar também que um membro gratuito não acede às aulas pagas.

O lançamento de vendas não precisa esperar pelo dia da primeira live. Precisa de conteúdo inicial e do percurso pagamento → matrícula → acesso verificado.

## ARO e Hotmart

Esta alteração não modifica ARO, credenciais, preços Genesis, provedores nem regras de entitlement. Não cria produto Hotmart. A escolha de Hotmart é uma decisão intermediária ainda em avaliação.

ARO oferece continuidade ao contrato interno de ofertas/direitos, mas o checkout de R$147 e a entrega Campus ainda precisam ser demonstrados em produção. Hotmart pode fornecer checkout internacional mantendo o Campus como área de membros. Exige um adaptador no servidor para eventos autenticados Hotmart e um contrato explícito de concessão/revogação de acesso. Não presumir que o ARO já aceita esses eventos. Evitar duas fontes concorrentes de autorização.

Na Hotmart, validar `X-HOTMART-HOTTOK` conforme a documentação, produto e transação; proteger o segredo no servidor; não aceitar valor, e-mail ou status enviados apenas pelo navegador. Só eventos válidos de compra aprovada/completa podem originar concessão conforme o contrato escolhido. Confirmar moeda, produto e eventual conversão segundo os campos/documentação do provedor, sem impor a todos os pagamentos o valor BRL quando a oferta for internacionalizada.

Fontes: https://hotmart.com/pt-br/internacionalizacao e https://developers.hotmart.com/docs/pt-BR/2.0.0/webhook/purchase-webhook/ . Disponibilidade, taxas, recebimento, moedas e obrigações variam por conta/país; confirmar no cadastro comercial antes de mudar o provedor.

## Implantação e reversão

Publicar pelo projeto Vercel existente `atlashub-club`, na equipa `atlas-hub1`, preservando os domínios e configurações existentes. A autorização do proprietário para produção já foi dada; não é necessário solicitar outro GO genérico. Este runtime recebeu 403 ao consultar esse projeto e 404 na tentativa de recuperar acesso à equipa. Não criar projeto ou domínio alternativo para contornar o acesso.

Após publicar, abrir a rota no domínio final e conferir capa, datas, preço e destino do botão. Sem integração validada, publicar a apresentação com contato e não anunciar checkout operacional. Para reverter a cobrança, retirar `ARCHITECTURE_CHECKOUT_READY`; para reverter o site, promover o deployment anterior da Vercel. Não apagar contas, compras ou matrículas na reversão do site.

O Campus continua a exigir a sessão administrativa e o destino de produção corretos; uma página de vendas publicada não prova que ele esteja concluído.

## Verificação desta alteração

`npm run test:unit`: 12/12; `npm run typecheck` e `npm run build`: aprovados com Next 15.5.28. Next e PostCSS foram atualizados para remover alertas existentes da instalação anterior; `npm install --ignore-scripts` reportou zero vulnerabilidades após as correções. Avisos de CSS preexistentes continuam no build.

A página foi aberta no servidor de produção local e revista em desktop e numa largura de 390px. Capa, preço, datas, navegação até à oferta e destino WhatsApp confirmados. Sem transação de compra nem matrícula realizadas.

`content:check` continua a falhar com dez ocorrências preexistentes: oito afirmações de inscrições abertas em Genesis/portal e duas divergências de entitlement Genesis entre `offers.ts` e `aro.project.yaml`. A validação foi corrigida apenas para reconhecer caminhos e quebras de linha do Windows; nenhuma regra foi desativada e nenhum direito Genesis foi alterado. Resolver a divergência de catálogo com base no contrato ARO real, sem escolher um identificador só para fazer o teste passar. O PR de conteúdo gratuito de Helena (#38) já trabalha as afirmações públicas; coordenar o merge para preservar esse trabalho.
