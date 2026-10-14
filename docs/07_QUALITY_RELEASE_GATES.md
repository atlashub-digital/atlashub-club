# QA / release gates

- G0 — Documentação e conceito: personagens, papéis e arquitetura aceites pelo Sérgio.
- G1 — Preview frontend: npm ci, lint/typecheck, build, acessibilidade mobile, fallback de motion, conteúdo sem falsos dados.
- G2 — Privacy/lead capture: proteção LGPD, formulário consentido, dados mínimos, RLS e anti-spam, retenção; testes de não-fuga de segredos, captura de erros sem dados pessoais.
- G3 — Public website: DNS club.atlashub.si e Vercel separados da Workforce, TLS, monitorização, rollback; go/no-go com Sérgio.
- G4 — Community: canais Telegram/Discord, regras, moderação humana, personas declaradas digitais, segurança de tokens, testes de grupo, contingência.
- G5 — Lab: isolamento multi-inquilino, limite de custos, sandbox e kill switch; tentativa deliberada de acesso cruzado falha.
- G6 — Payments & Genesis: termos/políticas, modalidades e taxas claras, verificação de pagamento, reconciliação, reembolsos, bolsas, capacidade e mentores.
- G7 — Content Editions: licença e entitlement verificados; autores/versões reconhecidos; nenhuma edição PREVIEW publicamente oferecida como FINAL.

**Sem G2 aprovado, não recolher leads reais. Sem G4, não anunciar bot integrado como operacional. Sem G5, não disponibilizar execução arbitrária a membros. Sem G6, não abrir checkout nem anunciar prémios societários.**

## Entrega engenharia
Cada PR: escopo, screenshots desktop/mobile, typecheck/build, testes e resultados, riscos, breaking changes, QA, reversão, decisão pendente.
