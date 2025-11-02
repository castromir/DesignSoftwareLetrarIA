/**
 * Tipos principais da aplicação
 * Centralize todos os tipos TypeScript aqui para fácil reutilização
 */

// Autenticação
export type UserRole = "admin" | "professional" | "student";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

// Estudantes
export interface Student {
  id: string;
  name: string;
  email: string;
  professionalId: string;
  enrollmentDate: Date;
  status: "active" | "inactive";
  metadata?: Record<string, unknown>;
}

// Atividades
export interface Activity {
  id: string;
  title: string;
  description: string;
  type: "reading" | "writing" | "diagnostic";
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  status: "draft" | "published" | "archived";
}

// Leitura
export interface ReadingContent {
  id: string;
  title: string;
  content: string;
  level: "beginner" | "intermediate" | "advanced";
  wordCount: number;
  estimatedReadingTime: number; // em minutos
  createdAt: Date;
}

export interface ReadingProgress {
  id: string;
  studentId: string;
  contentId: string;
  progress: number; // percentual 0-100
  timeSpent: number; // em segundos
  completedAt?: Date;
}

// Diagnóstico
export interface Diagnostic {
  id: string;
  studentId: string;
  type: "initial" | "ongoing" | "final";
  score: number;
  completedAt: Date;
  assessments: DiagnosticAssessment[];
}

export interface DiagnosticAssessment {
  id: string;
  category: string;
  score: number;
  feedback: string;
}

// Relatórios
export interface Report {
  id: string;
  studentId: string;
  generatedAt: Date;
  period: "weekly" | "monthly" | "quarterly";
  summary: ReportSummary;
  details: ReportDetail[];
}

export interface ReportSummary {
  totalReadingHours: number;
  activitiesCompleted: number;
  diagnosticScore: number;
  averageProgress: number;
}

export interface ReportDetail {
  category: string;
  value: string | number;
  trend?: "up" | "down" | "stable";
}

// Trilhas (Learning Paths)
export interface Trail {
  id: string;
  title: string;
  description: string;
  activities: Activity[];
  order: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TrailProgress {
  studentId: string;
  trailId: string;
  completedActivities: string[];
  progress: number;
  startedAt: Date;
  completedAt?: Date;
}

// Gravações
export interface Recording {
  id: string;
  studentId: string;
  activityId: string;
  duration: number; // em segundos
  url: string;
  createdAt: Date;
  transcription?: string;
}

// Retorno genérico da API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}
