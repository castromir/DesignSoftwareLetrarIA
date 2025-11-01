/**
 * Constantes globais da aplicação
 */

// Roles de usuário
export const USER_ROLES = {
  ADMIN: "admin",
  PROFESSIONAL: "professional",
  STUDENT: "student",
} as const;

// Status de atividades
export const ACTIVITY_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;

// Tipos de atividades
export const ACTIVITY_TYPES = {
  READING: "reading",
  WRITING: "writing",
  DIAGNOSTIC: "diagnostic",
} as const;

// Níveis de dificuldade
export const DIFFICULTY_LEVELS = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
} as const;

// Períodos de relatório
export const REPORT_PERIODS = {
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  QUARTERLY: "quarterly",
} as const;

// Status de estudante
export const STUDENT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

// Tipos de diagnóstico
export const DIAGNOSTIC_TYPES = {
  INITIAL: "initial",
  ONGOING: "ongoing",
  FINAL: "final",
} as const;

// Mensagens comuns
export const MESSAGES = {
  SUCCESS: "Operação realizada com sucesso!",
  ERROR: "Ocorreu um erro ao processar sua solicitação.",
  LOADING: "Carregando...",
  NO_DATA: "Nenhum dado disponível.",
  CONFIRM_DELETE: "Tem certeza que deseja deletar este item?",
  CONFIRM_LOGOUT: "Tem certeza que deseja sair?",
} as const;

// Limites
export const LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_ACTIVITY_TITLE_LENGTH: 100,
  MAX_ACTIVITY_DESCRIPTION_LENGTH: 500,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
} as const;

// URLs de API (configure conforme necessário)
export const API_BASE_URL = (import.meta as any).env.VITE_API_URL || "http://localhost:3000/api";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REGISTER: "/auth/register",
  },
  STUDENTS: "/students",
  ACTIVITIES: "/activities",
  DIAGNOSTICS: "/diagnostics",
  REPORTS: "/reports",
  READINGS: "/readings",
  TRAILS: "/trails",
} as const;

// Cores (se usar um sistema de cores definido)
export const COLORS = {
  PRIMARY: "#3B82F6",
  SECONDARY: "#10B981",
  DANGER: "#EF4444",
  WARNING: "#F59E0B",
  INFO: "#06B6D4",
} as const;

// Tempo em ms para timers e animações
export const TIMINGS = {
  ANIMATION_DURATION: 300,
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 300,
  API_TIMEOUT: 30000,
} as const;
