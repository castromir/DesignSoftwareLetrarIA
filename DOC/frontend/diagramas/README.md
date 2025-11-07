# Diagramas do Projeto

Nesta pasta estão os diagramas em formato PlantUML (.puml) que documentam a arquitetura e os fluxos principais do protótipo.

Arquivos gerados:

- `arquitetura.puml` — visão de alto nível da organização do `src` (components, hooks, utils, types, imports).
- `diagnostico_flow.puml` — fluxo de dados do recurso "Diagnóstico" (seleção → preenchimento → geração de relatório).
- `sequencia_diagnostico.puml` — diagrama de sequência simplificado do processo de diagnóstico.
- `migracao_map.puml` — mapa de migração (arquivos soltos → estrutura por features).

Como renderizar

1. Usando extensão PlantUML no VSCode: abra qualquer `.puml` e a pré-visualização será exibida.
2. Usando o site PlantUML: copie o conteúdo `.puml` e cole no editor do site.
3. Usando docker/localmente com plantuml.jar (exemplo):

```bash
# gerar PNG de um .puml
java -jar plantuml.jar arquitetura.puml
```

Links rápidos para arquivos de referência

- `src/components/StudentDiagnostic.tsx` — componente do formulário de diagnóstico
- `src/components/DiagnosticResult.tsx` — componente que renderiza o resultado
- `src/components/DiagnosticsList.tsx` — lista/início dos diagnósticos
- `docs/old_docs/MIGRATION_GUIDE.md` — guia de migração
- `docs/old_docs/TODO.md` — checklist de tarefas

Observações

- Os arquivos `.puml` usam caminhos relativos nos notes para ajudar na navegação pelo repositório.
- Se quiser, posso gerar imagens (PNG/SVG) automaticamente — diga se quer que eu tente gerar (preciso ter plantuml disponível no ambiente) ou quer que eu envie os arquivos prontos para render.
