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

export type StudentAttentionSeverity = "info" | "warning" | "error" | "success";

export interface StudentTrackingPPMPoint {
  recording_id: string;
  recorded_at: string;
  words_per_minute?: number;
  accuracy?: number;
}

export interface StudentAttentionPoint {
  severity: StudentAttentionSeverity;
  title: string;
  description: string;
}

export interface StudentInsightSummary {
  id: string;
  title: string;
  type: string;
  priority: string;
  created_at: string;
}

export interface StudentTrackingResponse {
  student_id: string;
  student_name?: string;
  total_recordings: number;
  completed_activities: number;
  average_accuracy?: number;
  average_wpm?: number;
  current_ppm?: number;
  ppm_change_percentage?: number;
  ppm_history: StudentTrackingPPMPoint[];
  attention_points: StudentAttentionPoint[];
  recent_insights: StudentInsightSummary[];
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

// Atividades por aluno
export interface StudentActivitySummary {
  id: string;
  title: string;
  type: ActivityType;
  difficulty?: ActivityDifficulty;
  scheduled_date?: string;
  scheduled_time?: string;
}

export interface StudentActivity {
  id: string;
  student_id: string;
  activity_id: string;
  status: ActivityStatus;
  score?: number;
  notes?: string;
  completed_at?: string;
  activity?: StudentActivitySummary;
}

export interface StudentActivityCreate {
  student_id: string;
  activity_id: string;
  status?: ActivityStatus;
  score?: number;
  notes?: string;
  completed_at?: string;
}

export interface StudentActivityUpdate {
  status?: ActivityStatus;
  score?: number;
  notes?: string;
  completed_at?: string;
}

export interface StudentActivityListResponse {
  student_activities: StudentActivity[];
  total: number;
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

// Relatórios
export type ReportType = "progress" | "diagnostic" | "full";
export type ReportFormat = "pdf" | "csv";

export interface Report {
  id: string;
  student_id: string;
  generated_by: string;
  report_type: ReportType;
  format: ReportFormat;
  period_start?: string;
  period_end?: string;
  file_path?: string;
  file_url?: string;
  generated_at: string;
  updated_by?: string;
  updated_at?: string;
}

export interface ReportCreate {
  student_id: string;
  report_type: ReportType;
  format: ReportFormat;
  period_start?: string;
  period_end?: string;
  file_path?: string;
  file_url?: string;
}

export interface ReportUpdate {
  report_type?: ReportType;
  format?: ReportFormat;
  period_start?: string;
  period_end?: string;
  file_path?: string;
  file_url?: string;
}

export interface ReportListResponse {
  reports: Report[];
  total: number;
}

// Trilhas (Learning Paths)
export interface TrailStory {
  id: string;
  trail_id: string;
  title: string;
  subtitle?: string;
  content: string;
  letters_focus?: string[];
  phonemes_focus?: string[];
  order_position: number;
  difficulty?: TrailDifficulty;
  word_count?: number;
  estimated_time?: number;
  created_by?: string;
  created_at: string;
  updated_by?: string;
  updated_at: string;
}

export interface Trail {
  id: string;
  title: string;
  description?: string;
  difficulty: TrailDifficulty;
  is_default: boolean;
  age_range_min?: number;
  age_range_max?: number;
  created_by?: string;
  created_at: string;
  updated_by?: string;
  updated_at: string;
  stories: TrailStory[];
}

export interface TrailCreate {
  title: string;
  description?: string;
  difficulty: TrailDifficulty;
  is_default?: boolean;
  age_range_min?: number;
  age_range_max?: number;
  stories?: Omit<TrailStory, "id" | "trail_id" | "created_by" | "created_at" | "updated_by" | "updated_at">[];
}

export interface TrailUpdate {
  title?: string;
  description?: string;
  difficulty?: TrailDifficulty;
  is_default?: boolean;
  age_range_min?: number;
  age_range_max?: number;
}

export interface TrailStoryCreate {
  trail_id: string;
  title: string;
  subtitle?: string;
  content: string;
  letters_focus?: string[];
  phonemes_focus?: string[];
  order_position: number;
  difficulty?: TrailDifficulty;
  word_count?: number;
  estimated_time?: number;
}

export interface TrailStoryUpdate {
  title?: string;
  subtitle?: string;
  content?: string;
  letters_focus?: string[];
  phonemes_focus?: string[];
  order_position?: number;
  difficulty?: TrailDifficulty;
  word_count?: number;
  estimated_time?: number;
  trail_id?: string;
}

export interface TrailListResponse {
  total: number;
  trails: Trail[];
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
export interface RecordingErrorDetail {
  expected: string;
  spoken: string;
}

export interface RecordingPausesAnalysis {
  total_words?: number;
  correct_words?: number;
  improvement_points?: string[];
}

export interface RecordingRecommendations {
  focus?: string[];
  [key: string]: unknown;
}

export interface RecordingAnalysis {
  id: string;
  recording_id: string;
  fluency_score?: number;
  prosody_score?: number;
  speed_wpm?: number;
  accuracy_score?: number;
  overall_score?: number;
  errors_detected?: RecordingErrorDetail[];
  pauses_analysis?: RecordingPausesAnalysis;
  ai_feedback?: string;
  ai_recommendations?: RecordingRecommendations;
  processed_at?: string;
}

export interface Recording {
  id: string;
  student_id: string;
  story_id: string;
  audio_file_path?: string;
  audio_url?: string;
  duration_seconds: number;
  recorded_at: string;
  transcription?: string;
  status: "pending" | "processing" | "completed" | "failed";
  created_by?: string;
  updated_by?: string;
  updated_at?: string;
  analysis?: RecordingAnalysis;
}

export interface RecordingCreate {
  student_id: string;
  story_id: string;
  duration_seconds: number;
  transcription?: string;
}

export interface RecordingListResponse {
  recordings: Recording[];
  total: number;
}

export interface RecordingInsight {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  created_at: string;
}

export interface RecordingMetrics {
  recording_id: string;
  story_id: string;
  student_id: string;
  duration_seconds: number;
  recorded_at: string;
  audio_file_path?: string;
  audio_url?: string;
  transcription?: string;
  errors_count: number;
  words_per_minute?: number;
  accuracy_percentage?: number;
  fluency_score?: number;
  overall_score?: number;
  prosody_score?: number;
  correct_words_count?: number;
  total_words?: number;
  improvement_points: string[];
  insights: RecordingInsight[];
}

export type InsightType = "attention_needed" | "progress" | "suggestion";
export type InsightPriority = "low" | "medium" | "high";

export interface AIInsight {
  id: string;
  professional_id: string;
  insight_type: InsightType;
  priority: InsightPriority;
  title: string;
  description: string;
  related_students: string[];
  is_read: boolean;
  created_at: string;
  expires_at?: string;
}

export interface AIInsightCreate {
  professional_id: string;
  insight_type: InsightType;
  priority: InsightPriority;
  title: string;
  description: string;
  related_students?: string[];
  expires_at?: string;
  is_read?: boolean;
}

export interface AIInsightUpdate {
  insight_type?: InsightType;
  priority?: InsightPriority;
  title?: string;
  description?: string;
  related_students?: string[];
  expires_at?: string;
  is_read?: boolean;
}

export interface AIInsightListResponse {
  insights: AIInsight[];
  total: number;
}

// Diagnósticos
export type DiagnosticType = "initial" | "ongoing" | "final";

export interface Diagnostic {
  id: string;
  student_id: string;
  conducted_by: string;
  diagnostic_type: DiagnosticType;
  overall_score?: number;
  reading_level?: string;
  strengths?: unknown[];
  difficulties?: unknown[];
  recommendations?: string;
  ai_insights?: unknown[];
  created_at: string;
}

export interface DiagnosticCreate {
  student_id: string;
  conducted_by: string;
  diagnostic_type: DiagnosticType;
  overall_score?: number;
  reading_level?: string;
  strengths?: unknown[];
  difficulties?: unknown[];
  recommendations?: string;
  ai_insights?: unknown[];
}

export interface DiagnosticUpdate {
  diagnostic_type?: DiagnosticType;
  overall_score?: number;
  reading_level?: string;
  strengths?: unknown[];
  difficulties?: unknown[];
  recommendations?: string;
  ai_insights?: unknown[];
}

export interface DiagnosticListResponse {
  diagnostics: Diagnostic[];
  total: number;
}

// Biblioteca de Textos
export type TrailDifficulty = "beginner" | "intermediate" | "advanced";

export interface TextLibrary {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  difficulty: TrailDifficulty;
  age_range_min?: number;
  age_range_max?: number;
  letters_focus?: string[];
  tags?: Record<string, unknown>;
  word_count?: number;
  is_public: boolean;
  created_by?: string;
  created_at: string;
  updated_by?: string;
  updated_at: string;
}

export interface TextLibraryCreate {
  title: string;
  subtitle?: string;
  content: string;
  difficulty: TrailDifficulty;
  age_range_min?: number;
  age_range_max?: number;
  letters_focus?: string[];
  tags?: Record<string, unknown>;
  word_count?: number;
  is_public?: boolean;
}

export interface TextLibraryUpdate {
  title?: string;
  subtitle?: string;
  content?: string;
  difficulty?: TrailDifficulty;
  age_range_min?: number;
  age_range_max?: number;
  letters_focus?: string[];
  tags?: Record<string, unknown>;
  word_count?: number;
  is_public?: boolean;
}

export interface TextLibraryListResponse {
  total: number;
  texts: TextLibrary[];
}

// Retorno genérico da API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}
