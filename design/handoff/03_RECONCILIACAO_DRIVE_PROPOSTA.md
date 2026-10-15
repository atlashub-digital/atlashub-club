# Plano de atualização do Drive Club Atlas — proposta sem alterações destrutivas

**Não executar renames, movimentos ou substituições antes de autorização do proprietário.**

## Estrutura alvo independente (subpasta nova a criar sob atlas-ops ou Club existente, conforme aprovação)

```text
CLUB_ATLAS_PRODUCT_MASTER/
  README_STATUS_E_FONTES.md
  00_GOVERNANCA_DECISOES/
  01_BRAND_VISUAL_APROVADO/
    TEAM_APPROVED/
    LOGOS/
    UI_MAQUETES/
    ASSETS_COMPONENTIZAVEIS/
  02_PRODUTO_E_ARQUITETURA/
  03_GENESIS_CURRICULO/
  04_AGENTES_HERMES_PERSONAS/
  05_CONTEUDO_EDITORIAL_E_EDITION_LINKS/
  06_CAMPANHA_COPYS_SOCIAIS/
  07_FINA_NORMATIVO_BOLSAS/
  08_QA_DESIGN_RELEASE/
  99_ARQUIVO_HISTORICO/
```

## Trabalho necessário
1. Publicar neste master um índice de links para GitHub e Drive histórico, com status por produto: `DECIDIDO`, `CANDIDATO`, `NÃO HOMOLOGADO`, `IMPLEMENTADO`, `TESTADO`, `PRODUÇÃO`.
2. Adicionar, com versões e hash, o pack `Club_Atlas_ClaudeCode_Handoff_2026-10-14` e as maquetes finais, sem alterar originais.
3. Marcar `01_NEXO_COMUNIDADE_E_TECNOLOGIA.md` como **HISTÓRICO — NÃO USAR ATIVAMENTE** (ou arquivar cópia e fornecer substituto `ATLAS_COMENTOR`); preservar o conteúdo original.
4. Atualizar cópias ativas de campanha e FAQ de Genesis para **09/01/2027**, e ficha Enterprise Lab para **28/11/2026**. Não mudar local/horários ou confirmar vagas sem dados.
5. Reconciliar casting: arte validada do grupo vs SOULs Caio/Bia. Exigir decisão explícita sobre Lucas e LIA e evitar conflito com projeto LeveLab.
6. Inserir material completo de 24 ateliers, galeria de projetos, mentoria, bolsas, finanças, riscos e roadmap.
7. Separar workshops B2B como links a AtlasHub.SI e Editions como integração editorial externa; não duplicar masters.
8. Criar ficheiro `DESIGN_ASSET_MANIFEST.json` (correspondente ao pack), com hash, fontes, destino e licenças.
9. Publicar também os formatos individuais PNG (ficheiros de edição e exportações). Evitar guardar apenas montagens de UI quando o desenvolvimento requer retratos e logos separados.
10. Confirmar as datas de modificação e a versão lida antes de publicar materiais como `READY FOR DEV`.

## Sequência de handoff
Sérgio valida identidade e visual → Drive PRODUCT MASTER com estado `DESIGN APPROVED` → Claude Code lê README e maquetes → PR0/PR1 (sem produção) → revisão screenshot → integrações progressivas.
