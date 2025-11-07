# 📁 Estrutura Refatorada do Projeto Letrar IA

## Overview da Arquitetura

```
src/
├── components/              # Componentes reutilizáveis
│   ├── ui/                 # Componentes UI base (Shadcn/ui)
│   ├── features/           # Componentes de features específicas
│   └── index.ts            # Exportações centralizadas
│
├── pages/                  # Páginas principais da aplicação
│
├── hooks/                  # Custom React Hooks
│   ├── useAuth.ts
│   ├── useStudents.ts
│   ├── useActivities.ts
│   └── index.ts
│
├── utils/                  # Funções utilitárias
│   ├── validation.ts       # Validações
│   ├── format.ts          # Formatações
│   ├── constants.ts       # Constantes globais
│   ├── helpers.ts         # Funções auxiliares
│   └── index.ts
│
├── types/                 # Tipos TypeScript
│   └── index.ts
│
├── imports/              # Componentes gerados do Figma
│   └── figma/           # SVGs e assets do Figma
│
├── styles/              # Estilos globais
│   ├── globals.css
│   └── variables.css
│
└── assets/              # Imagens, ícones, etc
```

## Convenções de Nomeação

### Arquivos/Pastas
- **Componentes**: PascalCase (e.g., `LoginPage.tsx`, `UserCard.tsx`)
- **Hooks**: camelCase com prefixo `use` (e.g., `useAuth.ts`, `useStudents.ts`)
- **Utilitários**: camelCase (e.g., `format.ts`, `validation.ts`)
- **Tipos**: camelCase ou PascalCase (e.g., `types.ts` ou `User.ts`)
- **Pastas**: kebab-case (e.g., `feature-name/`)

### Componentes React
```tsx
// Forma preferida
export function ComponentName() {
  return <div>...</div>;
}

// ou
export const ComponentName = () => {
  return <div>...</div>;
};
```

### Hooks Custom
```tsx
export const useCustomHook = () => {
  // implementação
  return { value, setValue };
};
```

## Organização por Feature

### Autenticação (`components/features/auth/`)
- `LoginPage.tsx` - Página de login
- `RegisterForm.tsx` - Formulário de registro
- `LogoutButton.tsx` - Botão de logout

### Estudantes (`components/features/students/`)
- `StudentList.tsx` - Lista de estudantes
- `StudentCard.tsx` - Card de estudante
- `AddStudentDialog.tsx` - Dialog para adicionar
- `EditStudentDialog.tsx` - Dialog para editar
- `StudentProfile.tsx` - Perfil do estudante

### Atividades (`components/features/activities/`)
- `ActivitiesList.tsx` - Lista de atividades
- `ActivityCard.tsx` - Card de atividade
- `CreateActivity.tsx` - Criar atividade
- `EditActivityDialog.tsx` - Editar atividade

### Leitura (`components/features/reading/`)
- `ReadingStory.tsx` - Componente de leitura
- `ReadingProgress.tsx` - Progresso de leitura
- `ReadingDetails.tsx` - Detalhes da leitura
- `ReadingTrail.tsx` - Trilha de leitura

### Diagnóstico (`components/features/diagnostics/`)
- `StudentDiagnostic.tsx` - Diagnóstico do estudante
- `DiagnosticsList.tsx` - Lista de diagnósticos
- `DiagnosticResult.tsx` - Resultado do diagnóstico

### Relatórios (`components/features/reports/`)
- `ReportsAnalytics.tsx` - Analytics de relatórios
- `ExportReports.tsx` - Exportar relatórios
- `ReportCard.tsx` - Card de relatório

### Trilhas (`components/features/trails/`)
- `TrailList.tsx` - Lista de trilhas
- `TrailCard.tsx` - Card de trilha
- `CreateTrail.tsx` - Criar trilha

### Painel Admin (`components/features/`)
- `AdminDashboard.tsx` - Dashboard admin
- `ProfessionalHome.tsx` - Home do profissional

### Gravações (`components/features/`)
- `RecordingsList.tsx` - Lista de gravações
- `RecordingPlayer.tsx` - Player de gravações

## Importações Recomendadas

```tsx
// ✅ PREFERIDO - Importações curtas usando alias
import { useAuth, useStudents } from "@/hooks";
import { formatDate, isValidEmail } from "@/utils";
import { User, Activity } from "@/types";
import { Button } from "@/components/ui/button";

//  EVITAR - Importações longas relativas
import { useAuth } from "../../hooks/useAuth";
import { formatDate } from "../../utils/format";
```

## Passos de Migração

1. **Criar estrutura de pastas** ✅
2. **Criar tipos centralizados** ✅
3. **Criar hooks reutilizáveis** ✅
4. **Criar funções utilitárias** ✅
5. **Organizar componentes por feature**
6. **Atualizar imports em todos os arquivos**
7. **Configurar alias no `tsconfig.json` e `vite.config.ts`**
8. **Testar a aplicação**

## Configuração Necessária

### `vite.config.ts`
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

## Benefícios desta Organização

✅ **Escalabilidade** - Fácil adicionar novas features
✅ **Manutenibilidade** - Código organizado e previsível
✅ **Reutilização** - Componentes, hooks e utils centralizados
✅ **Testabilidade** - Separação clara de responsabilidades
✅ **Colaboração** - Estrutura clara para múltiplos desenvolvedores
✅ **Performance** - Lazy loading de features possível
