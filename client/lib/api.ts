import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
    mutations: {
      retry: false,
    },
  },
});

const API_BASE_URL = import.meta.env.PROD
  ? "https://your-production-api.com/api"
  : "/api";

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  details?: any;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("auth_token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async request<T = any>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // GET request
  async get<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  // POST request
  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Typed API methods
export const api = {
  // Auth
  auth: {
    login: (credentials: { email: string; password: string }) =>
      apiClient.post("/auth/login", credentials),
    register: (userData: any) =>
      apiClient.post("/auth/register-staff", userData),
    profile: () => apiClient.get("/auth/profile"),
    changePassword: (data: { currentPassword: string; newPassword: string }) =>
      apiClient.post("/auth/change-password", data),
  },

  // Patients
  patients: {
    list: (params?: { page?: number; limit?: number; search?: string }) =>
      apiClient.get(
        `/patients?${new URLSearchParams(params as any).toString()}`,
      ),
    get: (id: string) => apiClient.get(`/patients/${id}`),
    create: (data: any) => apiClient.post("/patients", data),
    update: (id: string, data: any) => apiClient.put(`/patients/${id}`, data),
    search: (query: string) =>
      apiClient.get(`/patients/search/${encodeURIComponent(query)}`),
    stats: () => apiClient.get("/patients/stats/overview"),
  },

  // Dashboard
  dashboard: {
    stats: () => apiClient.get("/dashboard/stats"),
    activities: () => apiClient.get("/dashboard/activities"),
    departments: () => apiClient.get("/dashboard/departments"),
    alerts: () => apiClient.get("/dashboard/alerts"),
  },

  // Appointments
  appointments: {
    list: (params?: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      date?: string;
      doctorId?: string;
      patientId?: string;
    }) =>
      apiClient.get(
        `/appointments?${new URLSearchParams(params as any).toString()}`,
      ),
    get: (id: string) => apiClient.get(`/appointments/${id}`),
    create: (data: any) => apiClient.post("/appointments", data),
    update: (id: string, data: any) =>
      apiClient.put(`/appointments/${id}`, data),
    cancel: (id: string, data?: { reason?: string }) =>
      apiClient.patch(`/appointments/${id}/cancel`, data),
    availability: (doctorId: string, date: string) =>
      apiClient.get(`/appointments/availability/${doctorId}/${date}`),
    stats: () => apiClient.get("/appointments/stats/overview"),
  },

  // Staff
  staff: {
    doctors: () => apiClient.get("/staff/doctors"),
    list: (params?: {
      page?: number;
      limit?: number;
      department?: string;
      role?: string;
    }) =>
      apiClient.get(`/staff?${new URLSearchParams(params as any).toString()}`),
    get: (id: string) => apiClient.get(`/staff/${id}`),
    create: (data: any) => apiClient.post("/staff", data),
    update: (id: string, data: any) => apiClient.put(`/staff/${id}`, data),
  },

  // Health check
  health: () => apiClient.get("/health"),
};
