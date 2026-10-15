# Auditoria de fontes — Club Atlas · 14/10/2026
**Âmbito:** URL fornecido pelo proprietário, ramos Club/Genesis e `main` de `atlashub-digital/atlashub-club`.

## 1. Resultado executivo
**Estado: PARCIALMENTE ATUALIZADO / NÃO SINCRONIZADO COM AS ÚLTIMAS MAQUETES.** Não é correto classificá-lo como um Master Club completo. Não foram alterados nem apagados ficheiros existentes nesta auditoria. O repositório já possui o baseline técnico v0.1 integrado, mas ainda não contém o pacote visual recente completo nem a Missão 001 executável.

## 2. Hierarquia verificada
- Pasta recebida: https://drive.google.com/drive/folders/1_XKpF37IWPfRW8nqjdyV2KYPMA-AcT6P
  - Único item direto visível: `EMPRESA_AUMENTADA_2027-2030_WORKSHOPS` → https://drive.google.com/drive/folders/1VFdLJCn5Ykn7vV7b4MoMR_mr8_l8u05t
    - `05_ATLAS_LAB_CLUB_ATLAS` → https://drive.google.com/drive/folders/1S4NLqAlzmrXAPB7D_K1d0-VwjaILlLLp
      - `CLUB_ATLAS_PRELANCAMENTO_v0.3` → https://drive.google.com/drive/folders/1s73w5_SAjWN81qNel0YPHGd3Ys-QcrfT
        - `05_CASTING_OFICIAL_PERSONAGENS_v1.0` → https://drive.google.com/drive/folders/1nIXYv6AMpvCSatMURNm47egNXhaJ_WHU (contém **apenas** `CASTING_BIBLIA_v1.0.md`, sem imagens individuais no Drive).
      - `ATLAS_LAB_GENESIS_TURMA_01` → https://drive.google.com/drive/folders/1ZyGJU1TzPL5nrjUKNc5-WshIJoNSt-Kd
      - Os PNGs `Pagina_LandingPage`, `Dashboard.png`, `Team.png`, `Avatar_Atlas.png` e o documento Google Docs `CLUB ATLAS — Avatar Interativo ATLAS | Briefing para Claude Code` estão no nível 05.
- **Problema de arquitetura documental:** o Club é produto digital independente e hoje encontra-se dentro da pasta de workshops empresariais. Pode permanecer como histórico, mas deve ter um MASTER de produto separado e um atalho/índice, sem apagar nem mover sem aprovação.

## 3. Conteúdo encontrado
- Decisões e calendário Club v0.3: `00_DECISOES_E_CALENDARIO.md` (02/11, 04/11, 14/11, 16/11, 28/11, dezembro, Genesis 09/01/2027). **Atual para decisões macro**, sujeito a confirmação operacional.
- Comunidade: `01_NEXO_COMUNIDADE_E_TECNOLOGIA.md` ainda usa **NEXO**, substituído pelo **ATLAS** nas decisões posteriores.
- Casting: `CASTING_BIBLIA_v1.0.md` e repo usam **Caio e Bia**; a composição visual mais recentemente validada pelo proprietário mostra **Lucas e LIA**; há potencial conflito com LIA do LeveLab. Identidade técnica e marca pessoal precisam de homologação.
- Genesis: ramo possui apenas 7 ficheiros visíveis: `02_MANIFESTO_E_PROMESSA`, `04_GALERIA_20_PROJETOS`, `05_BLUEPRINT_TECNICO_MOBILE_HERMES`, `08_LANDING_INSCRICAO_FAQ`, `09_CAMPANHA_LANCAMENTO`, `10_CLUB_ATLAS_CONTINUIDADE`, `11_OPERACAO_PRIVACIDADE_GATES`. O pack completo local de 14 documentos mais manifesto contém outros módulos não presentes nesta pasta, incluindo **currículo de 24 ateliers**, mentoria/incubação, finanças, brief visual, README e manifest.
- A página `08_LANDING_INSCRICAO_FAQ.md` ainda apresenta `Início proposto: 12/01/2027`, em conflito com **09/01/2027**.
- `09_CAMPANHA_LANCAMENTO.md` ainda termina na janela `12/01–06/03`, a atualizar para calendário efetivo.
- `03_ENTERPRISE_LAB_28_NOV` foi renomeada corretamente, porém a ficha `FICHA_PRODUTO_E_PROGRAMA.md` continua a dizer **21/11 data-alvo e 28/11 alternativa**; decisão atual é **28/11**.
- O documento `Avatar Interativo Atlas` descreve mascote triangular com rosto sorridente, PNG→GLB futuro, Motion/voz/chat. Deve ser reconciliado com marca institucional sem rosto e usar apenas mascote expressiva onde apropriado.
- O Drive tem alguns PNGs úteis, mas não possui na pasta auditada um `DESIGN_MASTER` identificado, nem os conjuntos recentes completos: hero de elenco validado, boards recentes de dashboard, Genesis, comunidade, biblioteca, design system e versões mobile.

## 4. GitHub — estado confirmado
- Repo: https://github.com/atlashub-digital/atlashub-club
- `main`: commit de merge `19bc29672c8855ce265d8eafef160e53941eb4b8`, PR #1 merged, **57 ficheiros**, Next.js/TS, páginas públicas, demonstração de área de membros, endpoint de interesse fail-closed, script SQL preparatório, agentes drafts e docs.
- Ausências concretas: estrutura `design/` com assets homologados, retratos finais, UI das maquetes modernas, Auth e RLS de membros implantados, catálogo Editions real, persistência de Missão 001/XP, laboratório multiutilizador e agentes Hermes provisionados. Não inferir estado do Vercel a partir de GitHub: foi informado pelo Sérgio que conectou o domínio ao repo, sem auditoria de execução produtiva aqui.
- `README.md` e documentos de design antigos chamam o PR #1 de draft; essa parte do texto documental está obsoleta porque PR #1 já foi merged.
- Issues relevantes: #2 identidade, #3 infraestrutura, #4 autenticação/privacidade, #5 Hermes/Helena, #6 Discord/personagens, #7 Editions/Genesis, #10 maquetes.

## 5. Critérios de verdade/fonte autoritativa
1. Decisões explícitas e arte validada do Sérgio neste projeto.
2. HEAD/main real de GitHub para código, migrações e estado de PRs.
3. Novas maquetes e arte de grupo fornecidas para implementação visual (não reutilizar preços fictícios).
4. Drive para histórico, formação e programa, com conflitos identificados e resolvidos por aprovação — não editar silenciosamente.

**Não publicar:** preços fictícios, espaços ou inscrições não confirmados; métricas de membros ou progresso falsos; depoimentos sintéticos como reais; bot Hermes/WhatsApp operacional sem prova; conteúdo Editions editorial em PREVIEW como venda final.

## 6. Conclusão
O Drive reúne documentação valiosa, mas não está atualizado para servir **sozinho** como fonte de verdade do Club. O pack de handoff anexo consolida a nova identidade, as referências de ecrã e a missão para Claude Code. A reconciliação deve ser **aditiva e versionada**, sem eliminação de originais, antes de tratar a pasta como `CONTENT READY` ou `DESIGN READY`.
