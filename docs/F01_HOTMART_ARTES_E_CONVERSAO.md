# F01 - oferta confirmada e checkout Hotmart

## Decisões finais confirmadas por Sérgio em 02/11/2026

- R$147 em pagamento único; lives de 9, 12 e 19/11/2026, das 19h às 20h30 BRT.
- Seis cenários práticos incluídos, com materiais progressivos e Caderno do Arquiteto.
- 12 meses de acesso ao AtlasClub para esta formação; outras formações mantêm direitos próprios. Não foi prometido acesso a todos os cursos futuros.
- Sara Talia de Carvalho Campelo é sócia de Sérgio e responsável pela conta Hotmart. Essa identificação foi confirmada pelo proprietário e não é um bloqueio de publicação.
- Produto Hotmart 8862881 ativo; garantia de 7 dias. O link público da página de produto confirmou o código de oferta kznxteem. Link de acesso pós-compra: https://club.hotmart.com/oauth/login?productId=8862881 . O link fornecido não expõe o slug da área; os módulos ainda não foram lidos pelo conector.

## Integração publicada

A F01 usa checkout nativo Hotmart, sem dependência do checkout/matrícula ARO ou Campus. Botões são links HTML reais para https://pay.hotmart.com/Y108296874J?off=kznxteem . Com a biblioteca disponível, abrem o Checkout Elements oficial em um dialog nativo acessível. Sem JavaScript/biblioteca, o link continua a navegar para o checkout. Há também alternativa direta visível, inclusive dentro do popup. Não há dados de comprador pré-preenchidos, callbacks de cobrança no nosso servidor ou recolha de dados de cartão pela AtlasHub. A abertura do popup não é confirmação de compra nem concessão de direitos no Campus.

Biblioteca oficial: https://checkout.hotmart.com/lib/hotmart-checkout-elements.js . Documentação: https://developers.hotmart.com/docs/pt-BR/tutorials/checkout-elements/ . Utiliza inlineCheckout dentro de um dialog, com Escape/fechar e retorno do foco ao botão. O widget legado sugerido não foi usado: ele depende de jQuery/Fancybox e inclui uma função que remove os links Hotmart quando seu teste de rede falha. Não copiar esse comportamento para a página de vendas.

A configuração legada ARCHITECTURE_CHECKOUT_READY/URL/TERMS_URL permanece disponível no utilitário para compatibilidade, mas não controla a F01 nativa. Não foram alteradas variáveis, credenciais, configurações ARO ou contas Hotmart.

O banner F01 enviado pelo proprietário é utilizado sem modificar o arquivo, além do banner institucional. O PDF do Módulo 00 não foi publicado como download público. Para reversão, restaurar o deployment de produção anterior; vendas/matrículas da Hotmart não são apagadas. O prazo técnico de acesso na Hotmart e o percurso completo de compra/e-mail/aluno não foram alterados nem validados por transação nesta sessão.

## Registo da revisão anterior (superado pelas decisões acima)

# F01 - auditoria Hotmart, guia e direção de arte

Verificação em 02/11/2026. Este documento é interno; não é conteúdo para os alunos. Não inclui senhas, dados de compradores nem alterações de configuração do ARO.

## Oferta encontrada

- Produto Hotmart `8862881`, código `905f8b6f-e571-4aa0-beca-1825f0336947`, formato ONLINE_COURSE, estado ACTIVE, sem assinatura; garantia configurada de 7 dias na API.
- Checkout fornecido pelo proprietário: https://pay.hotmart.com/Y108296874J . Aberto no navegador com país Brasil: R$147,00, cartão, Apple Pay, Pix e boleto visíveis. Disponibilidade final depende do checkout e do comprador. Nenhuma compra foi submetida.
- Uma consulta pública feita a partir dos EUA mostrou US$29,00; isso não contradiz a versão brasileira. Não fixar a moeda internacional a partir do preço BR.
- A API de ofertas retornou HTTP 500 em duas tentativas; não foi contornada nem tratada como sucesso. O preço BR foi confirmado diretamente no checkout.
- O checkout apresenta um nome de autoria diferente de Sérgio/AtlasHub. Foi solicitada confirmação ao proprietário; não alterar dados da conta ou a identidade do recebedor.
- O endereço da área de membros foi solicitado para consultar os módulos. O estado ACTIVE do produto e o checkout aberto não provam publicação das aulas, compra, e-mail ou entrega de acesso. O proprietário informa ter usado o guia no Módulo 00; a publicação desse módulo ainda não foi confirmada pelo conector.

## Conflitos a decidir antes de publicar novas promessas

| Elemento | Oferta anterior | Guia/artes novos |
|---|---|---|
| Primeira live | 05/11/2026 | 09/11/2026 |
| Outras lives | 12 e 19/11, 19h-20h30 BRT | Iguais |
| Seis cases | Pack ampliado separado de R$147 | Guia inclui seis cenários didáticos |
| Duração do acesso | Não definida | Artes anunciam AtlasClub 12 meses; guia remete às condições da oferta |
| Natureza dos cases | Sem comprovação de resultados | Guia esclarece que são cenários educativos; algumas artes dizem cases reais |

O guia também menciona acesso às lives para inscritos Genesis 2027. Isso não autoriza criar matrículas ou conceder acesso a todos os produtos. Confirmar o fluxo antes de divulgar esse benefício como operacional. A duração de 12 meses precisa indicar a que produto se refere e a partir de quando é contada; não deve prometer acesso a todas as formações futuras.

## Leitura do guia enviado

Cinco páginas lidas e renderizadas. Documento legível, com descrição, público, resultados, três encontros, seis cenários educativos, biblioteca e orientações. Sua melhor promessa é o Caderno do Arquiteto: mapa AS-IS, proposta TO-BE, missão, permissões e plano de testes/piloto. Os materiais estão corretamente descritos como progressivos. As tabelas nas páginas 3 e 4 podem ganhar um pouco de espaço em uma revisão futura, mas não impedem a leitura.

Antes de usar o guia como oferta comercial final, alinhar data inicial, alcance/duração do acesso, gravações e política de acompanhamento. O arquivo original foi preservado. Não publicar o PDF pago como download público na página de vendas.

## Seleção das referências visuais

| Uso | Referência preferida | Decisão |
|---|---|---|
| Banner institucional AtlasClub | Imagem 5, `03_38_37 AM-2`, 2172x724 | Melhor base: institucional e sem datas, exatamente 3:1. Manter o conteúdo principal em zona segura para recorte responsivo. |
| Banner da formação | Imagem 6, `03_38_39 AM-3`, 1672x941 | Boa hierarquia e reconhecimento do apresentador; depende da confirmação de 09/11 e 12 meses. Produzir versão própria no formato do destino, sem esticar a arte. |
| Capa quadrada do produto | Imagem 4, `03_38_34 AM-1`, 1254x1254 | Boa base para vitrine, mas reduzir texto secundário e corrigir/confirmar data e prazo. A miniatura atual do checkout usa esta referência. |
| Módulo 00 | Nova peça a partir da identidade aprovada | Falta capa própria: Boas-vindas e Programa, sem data de live. |
| Módulo 01 | Imagem 9, `03_38_47 AM-6` | Coerente com diagnóstico, sujeita à confirmação da primeira data. Números ilustrativos no painel não são resultados de alunos. |
| Módulo 02 | Imagem 8, `03_38_45 AM-5` | Coerente com agentes, sistemas e camadas; conferir legibilidade no tamanho real da vitrine. |
| Módulo 03 | Imagem 7, `03_38_42 AM-4` | Coerente com piloto e supervisão. |
| Biblioteca | Imagem 10, `03_38_49 AM-7` | Boa identidade de recursos. Seis cenários educativos, não seis projetos de produção entregues. |
| Campanha | Imagens 2 e 3 | Moodboards para extrair peças individuais. Não subir a colagem inteira como banner ou anúncio. |
| Cartaz completo | Imagem 1 | Referência de conteúdo, demasiado densa para hero e telemóvel. |

Pontos editoriais: substituir “6 cases reais” por “6 cenários práticos” quando essa inclusão for confirmada; retirar “Integrado com Parceiros” sem parcerias comprovadas. Se houver demonstrações dessas ferramentas, usar “Ferramentas abordadas”, com nomes/logos corretos e apenas das efetivamente utilizadas. A presença de uma marca numa arte não prova integração nem endosso. Padronizar AtlasClub e o nome da formação em português conforme a decisão de marca.

Como referência técnica, a documentação Hotmart encontrada recomenda banner 1920x640, JPG/PNG e até 5MB. O artigo retornou apenas uma tela de carregamento na leitura completa; os valores foram obtidos no trecho indexado. Confirmar os requisitos no editor de cada destino, sobretudo capa do produto e módulos, antes de exportar. Não aplicar uma dimensão única a todas as posições. As capas de módulos fornecidas são aproximadamente 16:9 (1672x941), não banners 3:1.

Fonte: https://help.hotmart.com/pt-br/article/8805423463181/como-personalizar-o-meu-hotmart-club- .

## Página de vendas

Preparada nova apresentação com título orientado ao resultado, oferta visível no primeiro ecrã, três etapas de aprendizagem, programa, entregável, público, apresentador, FAQ e CTA fixo para a oferta. A barra só aparece depois do hero e fica oculta enquanto a oferta está visível. O assistente flutuante é ocultado apenas nesta página, para não tapar o botão em telemóveis. A arte institucional sem datas é usada como apoio, com textos de venda em HTML acessível. A página é renderizada no servidor, sem instalar rastreadores, cookies de marketing ou novos serviços.

Não foram inventados depoimentos, números de alunos, descontos, escassez, cronômetros ou garantias de faturação. Alta conversão é um objetivo a medir, não um resultado demonstrado. O checkout continua dependente da configuração já existente; nenhuma credencial foi alterada. Na ausência de confirmação comercial, conservar a versão publicada e levar a nova composição a uma prévia de revisão, sem promover datas e benefícios contraditórios.

Medição posterior: cliques na oferta, visitas ao checkout e vendas confirmadas na Hotmart, por campanha; medir dados reais com configuração adequada de privacidade. Não confundir uma visita ou clique com compra aprovada.
