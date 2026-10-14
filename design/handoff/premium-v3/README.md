# Club Atlas — Maquetes Premium v3 (candidatas)

Quatro maquetes HTML/CSS editáveis em PT-BR, com 8 screenshots desktop/mobile e assets extraídos sem regenerar rostos da **composição de casting validada**.

## Páginas

- `index.html` — página principal / Club + Atlas Lab, com casting aprovado, manifesto e planos.
- `genesis.html` — experiência do programa de 8 semanas, narrativa de resultados e comparação de valores.
- `aderir.html` — inscrição demonstrativa com quatro passos, duas opções e condição estudante.
- `dashboard.html` — dashboard pessoal, Missão 001 e Meu Ecossistema (dados demonstrativos).
- `design.css` — sistema visual partilhado, layout responsivo e reduced-motion.
- `onboard.js` — navegação **apenas local** pelo formulário, sem envio ou processamento de dados.
- `assets/` — fonte original e recortes de composição, não fotos geradas novamente.

## Regras preservadas

- Imagens da equipa derivadas da arte aprovada; nomes públicos propostos: **Sérgio, Lucas, Atlas, Marta, Bia**. As formas e os rostos não foram regenerados. Os rótulos originais ainda estão na imagem canónica completa, por isso o site usa uma faixa recortada sem os rótulos antigos e nomes em DOM.
- **Clara Corporate é outra identidade**, e LIA LeveLab também, que não integram estas maquetes.
- Club **gratuito**, independentemente da adesão ao Genesis.
- Genesis: **R$490 regular**, **R$190 estudante elegível**, com desconto dependente de validação do servidor; **8 semanas e 24 ateliers previstos**; início previsto **09/01/2027**.
- **Sem escassez falsa**, sem resultados inventados, sem selo de pagamento seguro de fornecedor não homologado, sem suposta inscrição finalizada.
- `aderir.html` é um **protótipo**, não guarda informações e não efetua compras nem registos.
- A plataforma real deverá ter consentimentos separados, menores tratados conforme exigências legais, autenticação, CRM, autorização server-side, integração financeira verificável e acessos Genesis apenas após autorização.

## Ordem de desenvolvimento para Claude Code

1. Revisar identidade/casting e direitos, criar tokens e componentes sem sair do design base aprovado.
2. Renderizar páginas e comparar screenshots a 1440 / 768 / 390 px. Não usar screenshot inteira como interface.
3. Implementar Auth + CRM conforme arquitetura da AtlasHub, depois lógica de registo real.
4. Implementar elegibilidade estudante com comprovação mínima e revisão, antes de criar oferta R$190 no checkout.
5. Validar pagamentos/webhooks/reconciliação, sem declarar `paid` a partir de frontend nem confiar em preços do browser.
6. Dashboard persistente, Missão 001 e Meu Ecossistema, depois serviços de agentes em ambiente seguro.
7. Não fazer merge/deploy sem autorização de Sérgio; auto-deploy da `main` afeta produção.

## Revisão obrigatória

Este é um **Design Candidate v3**, não um asset final de produção. Requer revisão de tipografia, direitos de imagem, cores, microcopy, responsividade, UX e QA antes de integração no repositório.
