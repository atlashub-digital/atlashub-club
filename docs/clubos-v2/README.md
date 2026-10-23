# ATLAS CLUBOS — GO EXECUTIVO V2.0 (23/10/2026)

**Estado:** decisão de produto e autorização de engenharia, NÃO prova de deployment.
**Source of truth:** V1 (Atlas ClubOS Blueprint 22/10) + aditamento V1.1 + decisões de 23/10. V2 prevalece em conflito.
**Objetivo:** Atlas ClubOS como escola/universidade comunitária multiprograma; marca visual 100% Atlas; LearnHouse como engine de formação atualizável.

## Domínios e repos
- `club.atlashub.si`: este repo `atlashub-club`, landing, leads, conta grátis e pagamentos ARO, manter.
- `app.club.atlashub.si`: novo `atlashub-digital/atlas-club-campus`, derivado de `learnhouse/learnhouse`, com upstream/tag/SHA fixados.
- Supabase AtlasHub Master = identidade; LearnHouse PostgreSQL próprio = progresso e conteúdo; ARO = preços, PIX e entitlements; Bridge = sincronização idempotente. Um utilizador, vários programas.
- Comunidade social, WhatsApp, Discord são canais adjacentes, não identidade/autoridade financeira.

## Trabalho
- Codex Cloud: engenharia e PRs Campus, único writer por branch.
- Helena: VPS, Docker, DNS/TLS, Master, segredos, backup, operação.
- ChatGPT Work: coordenação, análise, QA e documentação.
- GWD tem responsável próprio e não deve interferir.

## Gates
G0 LearnHouse instalado em staging e funcional; G1 login Atlas único; G2 multiprograma e isolamento de dados; G3 ARO E2E; G4 redesign completo das telas V1; G5 backup/restauro/segurança; G6 cutover produção. Design em paralelo a G0, nenhum deploy público antes dos gates.

## Sem falsas promessas
A landing Genesis atualmente anuncia inscrições, mas verificação anterior encontrou /genesis/inscricao 404 e catálogo desatualizado. Fechar P0 comercial antes de anunciar checkout disponível. O repositório Campus não existe ainda; criá-lo em AtlasHub via fluxo GitHub apropriado. Não publicar segredos de produção.

**Documentação extensiva:** pacote ATLAS_CLUBOS_GO_V2_2026-10-23.zip disponível na conversa de direção do projeto. Ao provisionar o Campus, importar README, AGENTS.md, docs, contracts, operations e prompts desse pacote e commitar tudo no novo repo para não depender do chat.
