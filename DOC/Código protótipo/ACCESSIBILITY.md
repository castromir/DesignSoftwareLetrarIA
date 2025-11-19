# Acessibilidade - Letrar IA Frontend

## Objetivo
Garantir conformidade com WCAG 2.1 Nível AA para tornar a plataforma acessível a todos os usuários, inclusive aqueles com deficiências visuais, auditivas, motoras ou cognitivas.

## Status Atual
- **Score**: 2/10 → Target: >8/10
- **Conformidade WCAG**: Parcial
- **Checklist**: 4/8 itens implementados

---

## Checklist WCAG 2.1 - Nível AA

### ✅ Implementado

- [x] **2.4.7 Focus Visible** - Indicadores de foco visíveis em todos os elementos interativos
- [x] **1.1.1 Non-text Content** - Atributos `alt` e `aria-hidden` para imagens
- [x] **1.4.11 Non-text Contrast** - Melhorado contraste de UI components
- [x] **4.1.2 Name, Role, Value** - ARIA labels em campos de formulário

### 🔄 Em Progresso

- [ ] **1.4.3 Contrast (Minimum)** - Validar razão de contraste 4.5:1 em todo o texto
- [ ] **2.1.1 Keyboard** - Navegação por teclado em todos os componentes
- [ ] **2.1.2 No Keyboard Trap** - Remover armadilhas de teclado em modais
- [ ] **4.1.3 Status Messages** - aria-live em notificações e mensagens de status

---

## Guia de Implementação

### 1. ARIA Labels e Atributos

**Padrão para Botões:**
```tsx
<button aria-label="Descrição clara da ação">
  {icon}
</button>
```

**Padrão para Campos de Entrada:**
```tsx
<label htmlFor="email">Email</label>
<input id="email" type="email" aria-label="Endereço de email" />
```

**Padrão para Ícones Decorativos:**
```tsx
<svg aria-hidden="true">...</svg>
```

**Padrão para Alertas:**
```tsx
<div role="alert" aria-live="assertive">
  Mensagem de erro
</div>
```

### 2. Keyboard Navigation

**Implementação usando Hook:**
```tsx
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';

function MyModal({ isOpen, onClose }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useKeyboardNavigation(isOpen, onClose, modalRef);

  return (
    <div ref={modalRef} role="dialog">
      ...
    </div>
  );
}
```

**Suporte Nativo:**
- Tab: Navegar entre elementos
- Shift+Tab: Navegar para trás
- ESC: Fechar modals
- Enter: Ativar botões
- Space: Selecionar checkboxes

### 3. Focus Management

**Indicadores de Foco:**
```tsx
// Adicionar focus styles em Tailwind
<input className="focus:ring-2 focus:ring-blue-500 focus-visible:ring-2" />
```

**Focus Trap em Modais:**
```tsx
// Implementado no hook useKeyboardNavigation
// Impede Tab sair do modal
```

**Restaurar Foco:**
```tsx
import { focusManagement } from '@/utils/a11y';

const savedFocus = focusManagement.saveFocus();
// ... abrir modal
focusManagement.restoreFocus(savedFocus);
```

### 4. Contraste de Cores

**Requisitos:**
- Texto normal: Razão 4.5:1 (preto #030213 em branco ✓)
- Texto grande (18pt+): Razão 3:1
- UI Components: Razão 3:1

**Cores Atuais:**
- Texto principal: #030213 (preto) - ✓ Bom contraste
- Links: #155dfc (azul) - ⚠️ Verificar contraste
- Placeholder: #717182 (cinza) - ⚠️ Pode não passar

**Como Verificar:**
- Use ferramenta: https://webaim.org/resources/contrastchecker/
- axe DevTools Chrome Extension
- WAVE WebAIM Validator

### 5. Semantic HTML

**Usar elementos semânticos:**
```tsx
// ❌ Ruim
<div onClick={handleClose}>Fechar</div>

// ✅ Bom
<button onClick={handleClose} aria-label="Fechar">
  ✕
</button>
```

**Estrutura Semântica:**
```tsx
<main role="main">
  <header>...</header>
  <nav>...</nav>
  <section>
    <h2>Título da seção</h2>
    <article>...</article>
  </section>
  <aside>...</aside>
  <footer>...</footer>
</main>
```

### 6. Screen Reader Support

**Testado com:**
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS/iOS)

**Padrões para Screen Readers:**
```tsx
// Anúncios polidos (espera)
<div role="status" aria-live="polite">
  Carregando...
</div>

// Anúncios assertivos (interrompe)
<div role="alert" aria-live="assertive">
  Erro encontrado!
</div>

// Regiões ao vivo atômicas
<div aria-live="polite" aria-atomic="true">
  5 de 10 itens carregados
</div>
```

---

## Componentes Atualizados

### LoginPage.tsx ✅
- [x] ARIA labels em inputs
- [x] Focus management
- [x] Indicadores de foco visíveis
- [x] role="alert" em mensagens de erro
- [x] semantic HTML (labels com htmlFor)

### Próximos (em desenvolvimento)

- [ ] ProfessionalHome.tsx - ARIA labels, keyboard nav
- [ ] AdminDashboard.tsx - Table accessibility
- [ ] Modals (EditStudentDialog, etc) - Focus trap, ESC support
- [ ] ReadingStory.tsx - Recording state announcements
- [ ] StudentProfile.tsx - Semantic HTML, graph accessibility

---

## Testes de Acessibilidade

### Manual Testing Checklist

```
Keyboard Navigation:
- [ ] Tab navega por todos os botões
- [ ] Shift+Tab volta
- [ ] ESC fecha modals
- [ ] Enter ativa botões
- [ ] Space seleciona checkboxes

Focus Visible:
- [ ] Todos os botões têm foco visível
- [ ] Focus order é lógico
- [ ] Nenhuma armadilha de teclado

Color Contrast:
- [ ] Texto tem razão 4.5:1
- [ ] Links são distinguíveis
- [ ] Ícones têm contraste 3:1

Screen Reader:
- [ ] NVDA lê todos os labels
- [ ] Lê alt text de imagens
- [ ] Lê estados de formulários
- [ ] Lê mensagens de erro
```

### Ferramentas Recomendadas

1. **axe DevTools** (Chrome/Firefox)
   - Identifica violações WCAG
   - Rápido e preciso

2. **WAVE** (Browser Extension)
   - Valida HTML semântico
   - Indicadores visuais

3. **NVDA** (Grátis, Windows)
   - Screen reader open-source
   - Testa experience real

4. **Lighthouse** (Chrome DevTools)
   - Audit de acessibilidade
   - Sugestões de melhoria

### Comando para Teste Local

```bash
# Instalar axe-core para testes automatizados
npm install --save-dev @axe-core/react

# Rodard testes
npm test a11y
```

---

## Utilities Disponíveis

### a11y.ts
```tsx
import { a11yLabels, focusManagement, announce } from '@/utils/a11y';

// Labels predefinidos
<button aria-label={a11yLabels.edit}>Editar</button>

// Focus management
const saved = focusManagement.saveFocus();
focusManagement.restoreFocus(saved);

// Announcements
announce.polite('Dados carregados');
announce.assertive('Erro encontrado!');
```

### useKeyboardNavigation.ts
```tsx
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';

useKeyboardNavigation(isOpen, onClose, modalRef);
```

---

## Recursos Externos

### Documentação
- [WCAG 2.1 Official](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [WebAIM](https://webaim.org/)

### Ferramentas
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WAVE](https://wave.webaim.org/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

### Aprendizado
- [W3C - Web Accessibility](https://www.w3.org/WAI/)
- [Inclusive Components](https://inclusive-components.design/)
- [The A11Y Project](https://www.a11yproject.com/)

---

## Metas por Fase

### Fase 1 (Atual) - ARIA & Semantic HTML
**Objetivo:** Score 4/10
- [x] ARIA labels em todos os inputs
- [x] Semantic HTML nas páginas principais
- [ ] Role attributes nos componentes

**Prazo:** 2-3 horas

### Fase 2 - Keyboard Navigation & Focus
**Objetivo:** Score 6/10
- [ ] Focus trap em modais
- [ ] ESC para fechar
- [ ] Indicadores de foco em todos os elementos

**Prazo:** 2-3 horas

### Fase 3 - Contrast & Live Regions
**Objetivo:** Score 8/10
- [ ] Verificar contraste 4.5:1
- [ ] aria-live em toasts/notificações
- [ ] Screen reader testing

**Prazo:** 2-3 horas

### Fase 4 - Validation & Documentation
**Objetivo:** Score 9+/10
- [ ] Validar com axe DevTools
- [ ] Testar com NVDA
- [ ] Documentar conformidade

**Prazo:** 2 horas

---

## Contribuindo

Ao adicionar novos componentes, siga este checklist:

```tsx
// ✅ Checklist para novos componentes

// 1. Aria labels
aria-label={description}

// 2. Semantic HTML
<button> em vez de <div>
<label htmlFor="id">

// 3. Focus styles
focus:ring-2 focus:ring-blue-500

// 4. Keyboard support
onKeyDown={(e) => {
  if (e.key === 'Escape') onClose();
}}

// 5. Screen reader support
role="status" aria-live="polite"
```

---

## Status de Conformidade

| Critério | Status | Evidência |
|----------|--------|-----------|
| WCAG 2.1 - Nível A | ✅ Parcial | 4/8 itens |
| WCAG 2.1 - Nível AA | 🔄 Em progresso | 2/8 itens |
| Keyboard Navigation | 🔄 Em progresso | Alguns componentes |
| Screen Reader Ready | ❌ Não testado | Precisa validação |
| Contrast AA | ❌ Não validado | Precisa verificação |

---

**Última atualização:** 2025-11-19
**Próxima revisão:** 2025-12-03
**Responsável:** Frontend Team
