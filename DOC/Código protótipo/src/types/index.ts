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

// Profissionais
export interface Professional {
  id: string;
  email: string;
  name: string;
  function?: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface ProfessionalCreate {
  name: string;
  email: string;
  password: string;
  function?: string;
  username?: string;
}

export interface ProfessionalUpdate {
  name?: string;
  email?: string;
  function?: string;
  password?: string;
  username?: string;
}

export interface ProfessionalListResponse {
  total: number;
  active: number;
  inactive: number;
  professionals: Professional[];
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
export type StudentStatus = "active" | "inactive";
export type Gender = "male" | "female" | "other";

export interface Student {
  id: string;
  name: string;
  professional_id: string;
  registration?: string;
  gender?: Gender;
  birth_date?: string; // ISO date string
  age?: number;
  observations?: string;
  profile_image?: string;
  special_needs?: Record<string, unknown>;
  status: StudentStatus;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
  deleted_at?: string; // ISO datetime string
}

export interface StudentCreate {
  name: string;
  professional_id: string;
  registration?: string;
  gender?: Gender;
  birth_date?: string; // ISO date string (YYYY-MM-DD)
  age?: number;
  observations?: string;
  profile_image?: string;
  special_needs?: Record<string, unknown>;
  status?: StudentStatus;
}

export interface StudentUpdate {
  name?: string;
  professional_id?: string;
  registration?: string;
  gender?: Gender;
  birth_date?: string; // ISO date string (YYYY-MM-DD)
  age?: number;
  observations?: string;
  profile_image?: string;
  special_needs?: Record<string, unknown>;
  status?: StudentStatus;
}

export interface StudentListResponse {
  total: number;
  active: number;
  inactive: number;
  students: Student[];
}

// Atividades
export type ActivityType = "reading" | "writing" | "diagnostic";
export type ActivityDifficulty = "easy" | "medium" | "hard";
export type ActivityStatus = "pending" | "in_progress" | "completed";

export interface Activity {
  id: string;
  title: string;
  description?: string;
  type: ActivityType;
  difficulty?: ActivityDifficulty;
  scheduled_date?: string; // ISO date string (YYYY-MM-DD)
  scheduled_time?: string; // Time string (HH:MM)
  words?: string[];
  status: ActivityStatus;
  created_by: string;
  created_at: string; // ISO datetime string
  updated_by?: string;
  updated_at: string; // ISO datetime string
  student_ids: string[];
}

export interface ActivityCreate {
  title: string;
  description?: string;
  type: ActivityType;
  difficulty?: ActivityDifficulty;
  scheduled_date?: string; // ISO date string (YYYY-MM-DD)
  scheduled_time?: string; // Time string (HH:MM)
  words?: string[];
  status?: ActivityStatus;
  student_ids: string[];
}

export interface ActivityUpdate {
  title?: string;
  description?: string;
  type?: ActivityType;
  difficulty?: ActivityDifficulty;
  scheduled_date?: string; // ISO date string (YYYY-MM-DD)
  scheduled_time?: string; // Time string (HH:MM)
  words?: string[];
  status?: ActivityStatus;
  student_ids?: string[];
}

export interface ActivityListResponse {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
  activities: Activity[];
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
