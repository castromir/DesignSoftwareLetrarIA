/**
 * Funções auxiliares gerais
 */

/**
 * Aguarda um tempo específico (em ms)
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Debounce para funções
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle para funções
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Simples cache com expiração
 */
export class CacheWithExpiry<T> {
  private cache: Map<string, { value: T; expiry: number }> = new Map();

  set(key: string, value: T, ttl: number = 5 * 60 * 1000): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

/**
 * Deep clone de um objeto
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map((item) => deepClone(item)) as any;
  if (obj instanceof Object) {
    const cloned: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  return obj;
};

/**
 * Mescla dois objetos (shallow merge)
 */
export const mergeObjects = <T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T => {
  return { ...target, ...source };
};

/**
 * Filtra valores falsos de um objeto
 */
export const filterFalsy = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value) result[key] = value;
  }
  return result;
};

/**
 * Converte array em objeto com base em uma chave
 */
export const arrayToObject = <T extends Record<string, any>>(
  array: T[],
  keyField: keyof T
): Record<string | number, T> => {
  return array.reduce((obj, item) => {
    obj[item[keyField]] = item;
    return obj;
  }, {} as Record<string | number, T>);
};

/**
 * Agrupa array de objetos por uma chave
 */
export const groupBy = <T extends Record<string, any>>(
  array: T[],
  keyField: keyof T
): Record<string | number, T[]> => {
  return array.reduce((groups, item) => {
    const key = item[keyField];
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {} as Record<string | number, T[]>);
};

/**
 * Classifica um array de objetos
 */
export const sortBy = <T extends Record<string, any>>(
  array: T[],
  keyField: keyof T,
  order: "asc" | "desc" = "asc"
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[keyField];
    const bVal = b[keyField];

    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
};

/**
 * Obtém valores únicos de um array
 */
export const getUniqueValues = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
};

/**
 * Transforma erro em mensagem legível
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "Ocorreu um erro desconhecido";
};
