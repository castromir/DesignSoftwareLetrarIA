import { API_BASE_URL } from "../utils/constants";
import type {
  Professional,
  ProfessionalCreate,
  ProfessionalUpdate,
  ProfessionalListResponse,
  Student,
  StudentCreate,
  StudentUpdate,
  StudentListResponse,
  StudentTrackingResponse,
  Activity,
  ActivityCreate,
  ActivityUpdate,
  ActivityListResponse,
  ActivityStatus,
  TextLibrary,
  TextLibraryCreate,
  TextLibraryUpdate,
  TextLibraryListResponse,
  Trail,
  TrailCreate,
  TrailUpdate,
  TrailListResponse,
  TrailStory,
  TrailStoryCreate,
  TrailStoryUpdate,
  Recording,
  RecordingCreate,
  RecordingListResponse,
  RecordingMetrics,
  RecordingTimelineEntry,
  AIInsight,
  AIInsightCreate,
  AIInsightUpdate,
  AIInsightListResponse,
  InsightType,
  InsightPriority,
  Diagnostic,
  DiagnosticCreate,
  DiagnosticUpdate,
  DiagnosticListResponse,
  DiagnosticType,
  Report,
  ReportCreate,
  ReportUpdate,
  ReportListResponse,
  ReportType,
  ReportFormat,
  StudentActivity,
  StudentActivityCreate,
  StudentActivityUpdate,
  StudentActivityListResponse,
} from "../types";

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const getAuthToken = (): string | null => {
  return localStorage.getItem("auth_token");
};

const setAuthToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem("auth_token", token);
  } else {
    localStorage.removeItem("auth_token");
  }
};

const getRefreshToken = (): string | null => {
  return localStorage.getItem("refresh_token");
};

const setRefreshToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem("refresh_token", token);
  } else {
    localStorage.removeItem("refresh_token");
  }
};

const getStoredUser = () => {
  const userStr = localStorage.getItem("auth_user");
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

const setStoredUser = (user: unknown) => {
  if (user) {
    localStorage.setItem("auth_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("auth_user");
  }
};

export const clearAuthData = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("auth_user");
};

export const getAuthData = () => {
  return {
    token: getAuthToken(),
    user: getStoredUser(),
  };
};

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = async (): Promise<string> => {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        clearAuthData();
        throw new ApiError(
          data.detail || data.message || "Erro ao renovar token",
          response.status,
          data
        );
      }

      const newAccessToken = data.access_token;
      setAuthToken(newAccessToken);
      return newAccessToken;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

export const api = {
  async request<T>(
    endpoint: string,
    data?: unknown,
    headersOverride?: Record<string, string>,
    retryOn401: boolean = true
  ): Promise<T> {
    const token = getAuthToken();
    const url = `${API_BASE_URL}${endpoint}`;

    let method: string = "GET";
    let body: BodyInit | undefined;
    let isFormData = false;

    if (data instanceof FormData) {
      method = "POST";
      body = data;
      isFormData = true;
    } else if (data !== undefined) {
      if (
        typeof data === "object" &&
        data !== null &&
        ("method" in (data as Record<string, unknown>) ||
          "body" in (data as Record<string, unknown>))
      ) {
        const config = data as {
          method?: string;
          body?: unknown;
        };
        method = config.method ?? "POST";
        if (config.body instanceof FormData) {
          body = config.body;
          isFormData = true;
        } else if (config.body !== undefined) {
          body =
            typeof config.body === "string"
              ? config.body
              : JSON.stringify(config.body);
        }
      } else {
        method = "POST";
        body = JSON.stringify(data);
      }
    }

    const headers: Record<string, string> = {};

    if (!isFormData && body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    if (headersOverride) {
      Object.assign(headers, headersOverride);
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body,
      });

      const responseData = await response.json().catch(() => ({}));

      if (response.status === 401 && retryOn401 && endpoint !== "/auth/login" && endpoint !== "/auth/refresh") {
        try {
          const newToken = await refreshAccessToken();
          headers.Authorization = `Bearer ${newToken}`;
          
          const retryResponse = await fetch(url, {
            method,
            headers,
            body,
          });

          const retryData = await retryResponse.json().catch(() => ({}));

          if (!retryResponse.ok) {
            throw new ApiError(
              retryData.detail || retryData.message || "Erro na requisição",
              retryResponse.status,
              retryData
            );
          }

          return retryData as T;
        } catch (refreshError) {
          clearAuthData();
          throw refreshError;
        }
      }

      if (!response.ok) {
        throw new ApiError(
          responseData.detail || responseData.message || "Erro na requisição",
          response.status,
          responseData
        );
      }

      return responseData as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : "Erro desconhecido",
        0
      );
    }
  },

  get<T>(endpoint: string, options?: { params?: Record<string, string> }): Promise<T> {
    let url = endpoint;
    if (options?.params) {
      const queryString = new URLSearchParams(options.params).toString();
      url = `${endpoint}${endpoint.includes("?") ? "&" : "?"}${queryString}`;
    }
    return api.request<T>(url);
  },

  post<T>(endpoint: string, data?: unknown): Promise<T> {
    return api.request<T>(endpoint, data);
  },

  put<T>(endpoint: string, data?: unknown): Promise<T> {
    return api.request<T>(endpoint, { method: "PUT", body: data });
  },

  patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return api.request<T>(endpoint, { method: "PATCH", body: data });
  },

  delete<T>(endpoint: string): Promise<T> {
    return api.request<T>(endpoint, { method: "DELETE" });
  },

  async uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, string>): Promise<T> {
    const token = getAuthToken();
    const url = `${API_BASE_URL}${endpoint}`;

    const formData = new FormData();
    formData.append("audio", file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new ApiError(
          data.detail || data.message || "Erro na requisição",
          response.status,
          data
        );
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : "Erro desconhecido",
        0
      );
    }
  },
};

export const authApi = {
  async login(email: string, password: string) {
    const response = await api.post<{
      access_token: string;
      refresh_token: string;
      token_type: string;
      user: {
        id: string;
        email: string;
        name: string;
        role: string;
      };
    }>("/auth/login", { email, password });
    
    setAuthToken(response.access_token);
    setRefreshToken(response.refresh_token);
    setStoredUser(response.user);

    return response;
  },

  async getCurrentUser() {
    return api.get<{
      id: string;
      email: string;
      name: string;
      role: string;
    }>("/auth/me");
  },

  logout() {
    clearAuthData();
  },
};

export const professionalsApi = {
  async list() {
    return api.get<ProfessionalListResponse>("/professionals/");
  },

  async getById(id: string) {
    return api.get<Professional>(`/professionals/${id}`);
  },

  async create(data: ProfessionalCreate) {
    return api.post<Professional>("/professionals/", data);
  },

  async update(id: string, data: ProfessionalUpdate) {
    return api.put<Professional>(`/professionals/${id}`, data);
  },

  async delete(id: string) {
    return api.delete<void>(`/professionals/${id}`);
  },
};

export const studentsApi = {
  async list(professionalId?: string) {
    const params = professionalId ? { professional_id: professionalId } : {};
    const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : "";
    return api.get<StudentListResponse>(`/students/${queryString}`);
  },

  async getById(id: string) {
    return api.get<Student>(`/students/${id}`);
  },

  async getTracking(id: string) {
    return api.get<StudentTrackingResponse>(`/students/${id}/tracking`);
  },

  async create(data: StudentCreate) {
    return api.post<Student>("/students/", data);
  },

  async update(id: string, data: StudentUpdate) {
    return api.put<Student>(`/students/${id}`, data);
  },

  async delete(id: string) {
    return api.delete<void>(`/students/${id}`);
  },
};

export const activitiesApi = {
  async list(professionalId?: string, status?: string) {
    const params: Record<string, string> = {};
    if (professionalId) params.professional_id = professionalId;
    if (status) params.status = status;
    const queryString = Object.keys(params).length > 0
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return api.get<ActivityListResponse>(`/activities/${queryString}`);
  },

  async getById(id: string) {
    return api.get<Activity>(`/activities/${id}`);
  },

  async create(data: ActivityCreate) {
    return api.post<Activity>("/activities/", data);
  },

  async update(id: string, data: ActivityUpdate) {
    return api.put<Activity>(`/activities/${id}`, data);
  },

  async delete(id: string) {
    return api.delete<void>(`/activities/${id}`);
  },
};

export interface TranscriptionResponse {
  transcript: string;
  filename: string;
  content_type: string;
  language: string;
}

export const transcriptionApi = {
  async transcribe(audioFile: File, language: string = "pt"): Promise<TranscriptionResponse> {
    return api.uploadFile<TranscriptionResponse>("/transcription/transcribe", audioFile, {
      language,
    });
  },
};

export const recordingApi = {
  async create(
    data: RecordingCreate,
    audioFile?: File
  ): Promise<Recording> {
    const formData = new FormData();
    formData.append("student_id", data.student_id);
    formData.append("story_id", data.story_id);
    formData.append("duration_seconds", data.duration_seconds.toString());
    if (data.transcription) {
      formData.append("transcription", data.transcription);
    }
    if (audioFile) {
      formData.append("audio", audioFile);
    }
    
    return api.request<Recording>("/recordings/", formData);
  },

  async list(params?: {
    student_id?: string;
    story_id?: string;
  }): Promise<RecordingListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.student_id) {
      queryParams.append("student_id", params.student_id);
    }
    if (params?.story_id) {
      queryParams.append("story_id", params.story_id);
    }
    
    const query = queryParams.toString();
    return api.get<RecordingListResponse>(`/recordings/${query ? `?${query}` : ""}`);
  },

  async getById(recordingId: string): Promise<Recording> {
    return api.get<Recording>(`/recordings/${recordingId}`);
  },

  getAudioUrl(recordingId: string): string {
    return `${API_BASE_URL}/recordings/${recordingId}/audio`;
  },

  async getMetrics(recordingId: string) {
    return api.get<RecordingMetrics>(`/recordings/${recordingId}/metrics`);
  },

  async getTimeline(storyId: string, studentId: string) {
    return api.get<RecordingTimelineEntry[]>(
      `/recordings/timeline?story_id=${storyId}&student_id=${studentId}`
    );
  },
};

export const aiInsightsApi = {
  async list(params?: {
    professional_id?: string;
    student_id?: string;
    insight_type?: InsightType;
    priority?: InsightPriority;
    is_read?: boolean;
    skip?: number;
    limit?: number;
  }): Promise<AIInsightListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.professional_id) {
      queryParams.append("professional_id", params.professional_id);
    }
    if (params?.student_id) {
      queryParams.append("student_id", params.student_id);
    }
    if (params?.insight_type) {
      queryParams.append("insight_type", params.insight_type);
    }
    if (params?.priority) {
      queryParams.append("priority", params.priority);
    }
    if (typeof params?.is_read === "boolean") {
      queryParams.append("is_read", String(params.is_read));
    }
    if (typeof params?.skip === "number") {
      queryParams.append("skip", String(params.skip));
    }
    if (typeof params?.limit === "number") {
      queryParams.append("limit", String(params.limit));
    }

    const query = queryParams.toString();
    return api.get<AIInsightListResponse>(
      `/ai_insights/${query ? `?${query}` : ""}`
    );
  },

  async get(insightId: string): Promise<AIInsight> {
    return api.get<AIInsight>(`/ai_insights/${insightId}`);
  },

  async create(data: AIInsightCreate): Promise<AIInsight> {
    return api.post<AIInsight>("/ai_insights/", data);
  },

  async update(insightId: string, data: AIInsightUpdate): Promise<AIInsight> {
    return api.patch<AIInsight>(`/ai_insights/${insightId}`, data);
  },

  async delete(insightId: string): Promise<void> {
    return api.delete<void>(`/ai_insights/${insightId}`);
  },
};

export const diagnosticsApi = {
  async list(params?: {
    student_id?: string;
    conducted_by?: string;
    diagnostic_type?: DiagnosticType;
    skip?: number;
    limit?: number;
  }): Promise<DiagnosticListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.student_id) {
      queryParams.append("student_id", params.student_id);
    }
    if (params?.conducted_by) {
      queryParams.append("conducted_by", params.conducted_by);
    }
    if (params?.diagnostic_type) {
      queryParams.append("diagnostic_type", params.diagnostic_type);
    }
    if (typeof params?.skip === "number") {
      queryParams.append("skip", String(params.skip));
    }
    if (typeof params?.limit === "number") {
      queryParams.append("limit", String(params.limit));
    }
    const query = queryParams.toString();
    return api.get<DiagnosticListResponse>(
      `/diagnostics/${query ? `?${query}` : ""}`
    );
  },

  async get(diagnosticId: string): Promise<Diagnostic> {
    return api.get<Diagnostic>(`/diagnostics/${diagnosticId}`);
  },

  async create(data: DiagnosticCreate): Promise<Diagnostic> {
    return api.post<Diagnostic>("/diagnostics/", data);
  },

  async update(
    diagnosticId: string,
    data: DiagnosticUpdate
  ): Promise<Diagnostic> {
    return api.put<Diagnostic>(`/diagnostics/${diagnosticId}`, data);
  },

  async delete(diagnosticId: string): Promise<void> {
    return api.delete<void>(`/diagnostics/${diagnosticId}`);
  },
};

export const reportsApi = {
  async list(params?: {
    student_id?: string;
    report_type?: ReportType;
    format?: ReportFormat;
    period_start?: string;
    period_end?: string;
    skip?: number;
    limit?: number;
  }): Promise<ReportListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.student_id) queryParams.append("student_id", params.student_id);
    if (params?.report_type) queryParams.append("report_type", params.report_type);
    if (params?.format) queryParams.append("report_format", params.format);
    if (params?.period_start) queryParams.append("period_start", params.period_start);
    if (params?.period_end) queryParams.append("period_end", params.period_end);
    if (typeof params?.skip === "number") queryParams.append("skip", String(params.skip));
    if (typeof params?.limit === "number") queryParams.append("limit", String(params.limit));
    const query = queryParams.toString();
    return api.get<ReportListResponse>(`/reports/${query ? `?${query}` : ""}`);
  },

  async get(reportId: string): Promise<Report> {
    return api.get<Report>(`/reports/${reportId}`);
  },

  async create(data: ReportCreate): Promise<Report> {
    return api.post<Report>("/reports/", data);
  },

  async update(reportId: string, data: ReportUpdate): Promise<Report> {
    return api.put<Report>(`/reports/${reportId}`, data);
  },

  async delete(reportId: string): Promise<void> {
    return api.delete<void>(`/reports/${reportId}`);
  },
};

export const studentActivitiesApi = {
  async list(params?: {
    student_id?: string;
    activity_id?: string;
    status?: ActivityStatus;
    skip?: number;
    limit?: number;
  }): Promise<StudentActivityListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.student_id) queryParams.append("student_id", params.student_id);
    if (params?.activity_id) queryParams.append("activity_id", params.activity_id);
    if (params?.status) queryParams.append("status", params.status);
    if (typeof params?.skip === "number") queryParams.append("skip", String(params.skip));
    if (typeof params?.limit === "number") queryParams.append("limit", String(params.limit));
    const query = queryParams.toString();
    return api.get<StudentActivityListResponse>(`/student_activities/${query ? `?${query}` : ""}`);
  },

  async get(studentActivityId: string): Promise<StudentActivity> {
    return api.get<StudentActivity>(`/student_activities/${studentActivityId}`);
  },

  async create(data: StudentActivityCreate): Promise<StudentActivity> {
    return api.post<StudentActivity>("/student_activities/", data);
  },

  async update(studentActivityId: string, data: StudentActivityUpdate): Promise<StudentActivity> {
    return api.put<StudentActivity>(`/student_activities/${studentActivityId}`, data);
  },

  async delete(studentActivityId: string): Promise<void> {
    return api.delete<void>(`/student_activities/${studentActivityId}`);
  },
};

export const textLibraryApi = {
  async list(params?: {
    difficulty?: string;
    is_public?: boolean;
    age_range_min?: number;
    age_range_max?: number;
    letters_focus?: string;
  }) {
    const queryParams: Record<string, string> = {};
    if (params?.difficulty) queryParams.difficulty = params.difficulty;
    if (params?.is_public !== undefined) queryParams.is_public = String(params.is_public);
    if (params?.age_range_min !== undefined) queryParams.age_range_min = String(params.age_range_min);
    if (params?.age_range_max !== undefined) queryParams.age_range_max = String(params.age_range_max);
    if (params?.letters_focus) queryParams.letters_focus = params.letters_focus;
    
    const queryString = Object.keys(queryParams).length > 0
      ? `?${new URLSearchParams(queryParams).toString()}`
      : "";
    return api.get<TextLibraryListResponse>(`/text-library/${queryString}`);
  },

  async getById(id: string) {
    return api.get<TextLibrary>(`/text-library/${id}`);
  },

  async create(data: TextLibraryCreate) {
    return api.post<TextLibrary>("/text-library/", data);
  },

  async update(id: string, data: TextLibraryUpdate) {
    return api.put<TextLibrary>(`/text-library/${id}`, data);
  },

  async delete(id: string) {
    return api.delete<void>(`/text-library/${id}`);
  },
};

export const trailsApi = {
  async list(params?: {
    difficulty?: string;
    is_default?: boolean;
    age_range_min?: number;
    age_range_max?: number;
  }) {
    const queryParams: Record<string, string> = {};
    if (params?.difficulty) queryParams.difficulty = params.difficulty;
    if (params?.is_default !== undefined) queryParams.is_default = String(params.is_default);
    if (params?.age_range_min !== undefined) queryParams.age_range_min = String(params.age_range_min);
    if (params?.age_range_max !== undefined) queryParams.age_range_max = String(params.age_range_max);
    
    const queryString = Object.keys(queryParams).length > 0
      ? `?${new URLSearchParams(queryParams).toString()}`
      : "";
    return api.get<TrailListResponse>(`/trails/${queryString}`);
  },

  async getById(id: string) {
    return api.get<Trail>(`/trails/${id}`);
  },

  async create(data: TrailCreate) {
    return api.post<Trail>("/trails/", data);
  },

  async update(id: string, data: TrailUpdate) {
    return api.put<Trail>(`/trails/${id}`, data);
  },

  async delete(id: string) {
    return api.delete<void>(`/trails/${id}`);
  },

  async createStory(trailId: string, data: TrailStoryCreate) {
    return api.post<TrailStory>(`/trails/${trailId}/stories`, data);
  },

  async updateStory(storyId: string, data: TrailStoryUpdate) {
    return api.put<TrailStory>(`/trails/stories/${storyId}`, data);
  },

  async deleteStory(storyId: string) {
    return api.delete<void>(`/trails/stories/${storyId}`);
  },
};

