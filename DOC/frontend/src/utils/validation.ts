/**
 * Funções de validação reutilizáveis
 */

/**
 * Valida se um email está em um formato correto
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida se uma senha atende aos critérios mínimos
 * - Mínimo 8 caracteres
 * - Pelo menos uma letra maiúscula
 * - Pelo menos um número
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
};

/**
 * Valida se um nome não está vazio e tem tamanho válido
 */
export const isValidName = (name: string): boolean => {
  const trimmedName = name.trim();
  return trimmedName.length > 0 && trimmedName.length <= 100;
};

/**
 * Valida um URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Valida se um número está em um intervalo específico
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Validação de data
 */
export const isValidDate = (date: unknown): boolean => {
  if (!(date instanceof Date)) return false;
  return !isNaN(date.getTime());
};

/**
 * Valida se um objeto tem todas as propriedades necessárias
 */
export const hasRequiredFields = (
  obj: Record<string, unknown>,
  requiredFields: string[]
): boolean => {
  return requiredFields.every((field) => field in obj && obj[field] !== undefined);
};
