/**
 * API Base URL Configuration
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

/**
 * Centralized API Endpoints
 * All API routes should be defined here for easy maintenance
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/login",
    LOGOUT: "/api/logout",
    REGISTER: "/api/register",
    CURRENT_USER: "/api/user",
    UPDATE_PROFILE: "/api/user/profile",
    FORGOT_PASSWORD: "/api/forgot-password",
  },
  USERS: {
    LIST: "/api/users",
    GET: (id: number | string) => `/api/users/${id}`,
    CREATE: "/api/users",
    UPDATE: (id: number | string) => `/api/users/${id}`,
    DELETE: (id: number | string) => `/api/users/${id}`,
    FORGOT_PASSWORD: "/api/users/forgot-password",
    RESTORE: (id: number | string) => `/api/users/${id}/restore`,
  },
  PATIENTS: {
    LIST: "/api/patients",
    GET: (id: string) => `/api/patients/${id}`,
    CREATE: "/api/patients",
    UPDATE: (id: string) => `/api/patients/${id}`,
    DELETE: (id: string) => `/api/patients/${id}`,
    SEARCH: "/api/patients/search",
  },
  DOCTORS: {
    LIST: "/api/doctors",
    GET: (id: string) => `/api/doctors/${id}`,
    CREATE: "/api/doctors",
    UPDATE: (id: string) => `/api/doctors/${id}`,
    DELETE: (id: string) => `/api/doctors/${id}`,
  },
  APPOINTMENTS: {
    LIST: "/api/appointments",
    GET: (id: string) => `/api/appointments/${id}`,
    CREATE: "/api/appointments",
    UPDATE: (id: string) => `/api/appointments/${id}`,
    DELETE: (id: string) => `/api/appointments/${id}`,
  },
} as const;
