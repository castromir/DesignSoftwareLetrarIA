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
  Activity,
  ActivityCreate,
  ActivityUpdate,
  ActivityListResponse,
} from "../types";

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
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
  localStorage.removeItem("auth_user");
};

export const getAuthData = () => {
  return {
    token: getAuthToken(),
    user: getStoredUser(),
  };
};

export const api = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getAuthToken();
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new ApiError(
          data.detail || data.message || "Erro na requisição",
          response.status,
          data,
        );
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : "Erro desconhecido",
        0,
      );
    }
  },

  get<T>(
    endpoint: string,
    options?: { params?: Record<string, string> },
  ): Promise<T> {
    let url = endpoint;
    if (options?.params) {
      const queryString = new URLSearchParams(options.params).toString();
      url = `${endpoint}${endpoint.includes("?") ? "&" : "?"}${queryString}`;
    }
    return this.request<T>(url, { method: "GET" });
  },

  post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  },

  async uploadFile<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, string>,
  ): Promise<T> {
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
          data,
        );
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : "Erro desconhecido",
        0,
      );
    }
  },
};

export const authApi = {
  async login(email: string, password: string) {
    const response = await api.post<{
      access_token: string;
      token_type: string;
      user: {
        id: string;
        email: string;
        name: string;
        role: string;
      };
    }>("/auth/login", { email, password });

    setAuthToken(response.access_token);
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
    return api.get<ProfessionalListResponse>("/professionals");
  },

  async getById(id: string) {
    return api.get<Professional>(`/professionals/${id}`);
  },

  async create(data: ProfessionalCreate) {
    return api.post<Professional>("/professionals", data);
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
    const queryString = params
      ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
      : "";
    return api.get<StudentListResponse>(`/students${queryString}`);
  },

  async getById(id: string) {
    return api.get<Student>(`/students/${id}`);
  },

  async create(data: StudentCreate) {
    return api.post<Student>("/students", data);
  },

  async update(id: string, data: StudentUpdate) {
    return api.put<Student>(`/students/${id}`, data);
  },

  async delete(id: string) {
    return api.delete<{ message: string }>(`/students/${id}`);
  },
};

export const activitiesApi = {
  async list(professionalId?: string, status?: string) {
    const params: Record<string, string> = {};
    if (professionalId) params.professional_id = professionalId;
    if (status) params.status = status;
    const queryString =
      Object.keys(params).length > 0
        ? `?${new URLSearchParams(params).toString()}`
        : "";
    return api.get<ActivityListResponse>(`/activities${queryString}`);
  },

  async getById(id: string) {
    return api.get<Activity>(`/activities/${id}`);
  },

  async create(data: ActivityCreate) {
    return api.post<Activity>("/activities", data);
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
  async transcribe(
    audioFile: File,
    language: string = "pt",
  ): Promise<TranscriptionResponse> {
    return api.uploadFile<TranscriptionResponse>(
      "/transcription/transcribe",
      audioFile,
      {
        language,
      },
    );
  },
};
