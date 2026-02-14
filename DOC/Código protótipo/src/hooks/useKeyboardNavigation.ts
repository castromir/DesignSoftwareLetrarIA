import { useEffect, useRef } from "react";
import { focusManagement } from "../utils/a11y";

/**
 * Hook for managing keyboard navigation in modals and dialogs
 * Handles focus trap and ESC key to close
 */
export function useKeyboardNavigation(
  isOpen: boolean,
  onClose: () => void,
  elementRef?: React.RefObject<HTMLElement>
) {
  const savedFocusRef = useRef<HTMLElement | null>(null);
  const cleanupFocusTrapRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const element = elementRef?.current || document.activeElement?.closest("[role='dialog']") as HTMLElement;

    if (!element) return;

    // Save current focus
    savedFocusRef.current = focusManagement.saveFocus();

    // Create focus trap
    cleanupFocusTrapRef.current = focusManagement.createFocusTrap(element);

    // Move focus into modal
    const firstFocusableElement = element.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;

    if (firstFocusableElement) {
      setTimeout(() => firstFocusableElement.focus(), 0);
    }

    // Handle ESC key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    element.addEventListener("keydown", handleKeyDown);

    return () => {
      element.removeEventListener("keydown", handleKeyDown);
      if (cleanupFocusTrapRef.current) {
        cleanupFocusTrapRef.current();
      }
      // Restore focus
      focusManagement.restoreFocus(savedFocusRef.current);
    };
  }, [isOpen, onClose, elementRef]);
}

/**
 * Hook for managing focus on elements that should receive focus on mount
 */
export function useFocusOnMount(shouldFocus: boolean, elementRef?: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (shouldFocus && elementRef?.current) {
      // Use requestAnimationFrame to ensure element is rendered
      requestAnimationFrame(() => {
        elementRef.current?.focus();
      });
    }
  }, [shouldFocus, elementRef]);
}

/**
 * Hook for managing aria-live announcements
 */
export function useAnnounce() {
  const announce = (message: string, type: "polite" | "assertive" = "polite") => {
    const element = document.createElement("div");
    element.setAttribute("role", type === "assertive" ? "alert" : "status");
    element.setAttribute("aria-live", type);
    element.setAttribute("aria-atomic", "true");
    element.className = "sr-only";
    element.textContent = message;

    document.body.appendChild(element);

    setTimeout(() => {
      document.body.removeChild(element);
    }, type === "assertive" ? 3000 : 1000);
  };

  return { announce };
}
