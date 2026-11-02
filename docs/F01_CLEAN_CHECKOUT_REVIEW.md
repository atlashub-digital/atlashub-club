# F01 — página branca e azul e revisão do checkout

Pedido de Sérgio em 02/11/2026: combinar o azul Atlas com superfícies brancas e usar o novo banner como referência para o hero.

O arquivo fornecido foi copiado sem alteração para `public/assets/formacoes/f01-hero-clean.png`. A composição mostra o topo ilustrado usando um enquadramento CSS; o conteúdo de venda permanece em HTML, legível no celular. A faixa de logos do rodapé do arquivo não é exibida. Oferta comercial, datas, vendedora, garantia e prazo mantidos conforme aprovação anterior.

Superfícies claras para programa, cenários, FAQ e condições; cartões azuis para oferta e Caderno do Arquiteto. Ajustes de contraste e cabeçalho de 320px limitados à rota F01. O restante do portal mantém sua identidade atual.

Checkout Hotmart oficial mantido. Janela ampliada no computador, tela inteira no celular, área de conteúdo com rolagem e link direto sempre disponível. Cabeçalho e alternativa direta permanecem acessíveis durante a rolagem. A página de fundo não rola enquanto a janela está aberta. Cliques com Ctrl/Command preservam o comportamento de abrir o link em outra aba.

Verificação local concluída: larguras 1440, 1366, 390 e 320px sem overflow na página e no iframe; produto e R$147 corretos; campos de cadastro/cartão, rolagem até o botão final sem acioná-lo, seleção de Pix, fechar/reabrir/Escape, iframe único e retorno de foco. Com a biblioteca bloqueada, o botão navegou para o checkout direto. Sem erros JavaScript nas quatro larguras. Nenhuma compra, geração de Pix ou preenchimento de dados reais de comprador foi feito. `npm run verify` passou (conteúdo, identidades, 12 testes, typecheck e build). Evidências ficam em `output/f01-clean` no workspace, fora do repositório.

Reversão: reverter este PR ou promover a produção anterior `dpl_AuJzjSNsB2511HL1MJ4uWSRaNN8J`. Sem migração de dados, alteração de ARO ou de credenciais. O estado de entrega após compra e a configuração de 12 meses na Hotmart continuam fora desta revisão visual.
