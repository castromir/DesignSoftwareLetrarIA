/**
 * Accessibility utilities for WCAG 2.1 compliance
 */

/**
 * Generate aria-label for common actions
 */
export const a11yLabels = {
  close: "Fechar",
  edit: "Editar",
  delete: "Deletar",
  add: "Adicionar",
  view: "Visualizar",
  save: "Salvar",
  cancel: "Cancelar",
  search: "Buscar",
  filter: "Filtrar",
  logout: "Sair",
  menu: "Menu",
  settings: "Configurações",
  profile: "Perfil",
  back: "Voltar",
  next: "Próximo",
  previous: "Anterior",
};

/**
 * Check if color contrast meets WCAG AA standards (4.5:1 for normal text)
 */
export function getContrastRatio(rgb1: [number, number, number], rgb2: [number, number, number]): number {
  const getLuminance = (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map(x => {
      x = x / 255;
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
  const l2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Focus management utilities
 */
export const focusManagement = {
  /**
   * Save current focus element for restoration
   */
  saveFocus: (): HTMLElement | null => {
    return document.activeElement as HTMLElement;
  },

  /**
   * Restore focus to saved element
   */
  restoreFocus: (element: HTMLElement | null): void => {
    if (element && typeof element.focus === "function") {
      element.focus();
    }
  },

  /**
   * Set focus to element
   */
  setFocus: (element: HTMLElement | string): void => {
    const el = typeof element === "string"
      ? document.getElementById(element)
      : element;

    if (el && typeof el.focus === "function") {
      el.focus();
    }
  },

  /**
   * Focus trap for modals - prevent tab outside modal
   */
  createFocusTrap: (element: HTMLElement): (() => void) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    element.addEventListener("keydown", handleKeyDown);

    return () => {
      element.removeEventListener("keydown", handleKeyDown);
    };
  },
};

/**
 * Announce messages to screen readers
 */
export const announce = {
  /**
   * Polite announcement (waits for screen reader to finish)
   */
  polite: (message: string): void => {
    const announcement = document.createElement("div");
    announcement.setAttribute("role", "status");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only"; // visually hidden
    announcement.textContent = message;
    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  /**
   * Assertive announcement (interrupts screen reader)
   */
  assertive: (message: string): void => {
    const announcement = document.createElement("div");
    announcement.setAttribute("role", "alert");
    announcement.setAttribute("aria-live", "assertive");
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only"; // visually hidden
    announcement.textContent = message;
    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 3000);
  },
};

/**
 * Common ARIA patterns
 */
export const ariaPatterns = {
  /**
   * Make an element describe another
   */
  describe: (elementId: string, descriptionId: string): void => {
    const element = document.getElementById(elementId);
    if (element) {
      const currentDescribedBy = element.getAttribute("aria-describedby") || "";
      element.setAttribute(
        "aria-describedby",
        currentDescribedBy ? `${currentDescribedBy} ${descriptionId}` : descriptionId
      );
    }
  },

  /**
   * Create label association
   */
  label: (inputId: string, labelText: string): void => {
    const input = document.getElementById(inputId);
    const label = document.createElement("label");
    label.setAttribute("for", inputId);
    label.textContent = labelText;
    if (input?.parentElement) {
      input.parentElement.insertBefore(label, input);
    }
  },
};

/**
 * Screen reader only text class
 * Add to Tailwind config: 'sr-only': 'position:absolute;width:1px;height:1px;overflow:hidden'
 */
export const srOnly = "sr-only";
