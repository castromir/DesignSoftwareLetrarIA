
***
README sintetizado — versão curta e direta (backup em docs/old_docs/)
***

# 🎓 Letrar IA — README Sintético

Breve: protótipo React + TypeScript organizado por features para rastreamento e melhoria de leitura com suporte a componentes Figma e um design system (shadcn/ui).

## 1) Quick start
- Instalar dependências: `npm install`
- Rodar em dev: `npm run dev` (abre em http://localhost:3000)

## 2) O que há aqui (resumo)
- Estrutura feature-based: `src/components/features/*` (auth, students, activities, reading, diagnostics, reports, trails, etc.)
- Hooks reutilizáveis em `src/hooks/` (ex.: `useAuth`, `useStudents`)
- Utilitários em `src/utils/` (format, validation, constants, helpers)
- Tipos centrais em `src/types/`

## 3) Migração rápida (se precisar mover componentes)
1. Criar pasta da feature: `src/components/features/<feature>`
2. Mover componente e ajustar imports para `@/` (alias configurado em Vite/tsconfig)
3. Criar `index.ts` exportando os componentes da feature
4. Testar a aplicação

Exemplo de import atualizado:
`import { LoginPage } from "@/components/features/auth"`

## 4) Onde está a documentação completa
Arquivos originais foram copiados para `docs/old_docs/` (INDEX, QUICK_START, MIGRATION_GUIDE, PROJECT_STRUCTURE, REFACTORING_SUMMARY, START_HERE, TODO, ARCHITECTURE, Guidelines, Attributions). Use-os como referência histórica.

## 5) Próximos passos recomendados
- Mover componentes pendentes para `src/components/features/` (veja `TODO` arquivado)
- Adicionar tipos e testes para componentes migrados
- Criar React Context global para autenticação

## 6) Notas rápidas de convenção
- Componentes: PascalCase
- Hooks: prefixo `use` (camelCase)
- Pastas de feature: kebab-case
- Use o alias `@/` para imports internos

---

Última atualização: 1 de Novembro de 2025

***
