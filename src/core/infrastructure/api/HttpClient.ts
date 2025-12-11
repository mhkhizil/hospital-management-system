import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
import { API_BASE_URL } from "./constants";
import { TokenManagementService } from "@/core/infrastructure/services/TokenManagementService";

/**
 * API Error class for typed error handling
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly errors?: Record<string, string[]>,
    public readonly originalError?: AxiosError
  ) {
    super(message);
    this.name = "ApiError";
  }

  /**
   * Check if error is authentication related
   */
  isAuthError(): boolean {
    return this.status === 401;
  }

  /**
   * Check if error is authorization related
   */
  isForbiddenError(): boolean {
    return this.status === 403;
  }

  /**
   * Check if error is validation related
   */
  isValidationError(): boolean {
    return this.status === 422;
  }

  /**
   * Check if error is rate limit related
   */
  isRateLimitError(): boolean {
    return this.status === 429;
  }

  /**
   * Check if error is not found
   */
  isNotFoundError(): boolean {
    return this.status === 404;
  }

  /**
   * Get first error message for a field
   */
  getFieldError(field: string): string | undefined {
    return this.errors?.[field]?.[0];
  }

  /**
   * Get all field errors as a flat array
   */
  getAllErrors(): string[] {
    if (!this.errors) return [this.message];
    return Object.values(this.errors).flat();
  }
}

/**
 * Event types for auth state changes
 */
export type AuthEventType = "unauthorized" | "forbidden" | "token_expired";
export type AuthEventCallback = (event: AuthEventType) => void;

/**
 * HTTP Client with authentication and error handling
 *
 * AUTHENTICATION FLOW:
 * - Token stored in cookies (frontend storage only)
 * - Token sent as Bearer token in Authorization header
 * - Backend receives Bearer token (not cookies)
 *
 * SECURITY FEATURES:
 * - Bearer token in Authorization header
 * - Request/response interceptors for error handling
 * - Automatic token expiration checking
 */
export class HttpClient {
  private readonly client: AxiosInstance;
  private authEventCallbacks: AuthEventCallback[] = [];

  constructor(private readonly tokenService: TokenManagementService) {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15_000,
      // withCredentials NOT needed - we send Bearer tokens, not cookies
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.setupRequestInterceptor();
    this.setupResponseInterceptor();
  }

  /**
   * Subscribe to auth events (401, 403, token expiry)
   */
  onAuthEvent(callback: AuthEventCallback): () => void {
    this.authEventCallbacks.push(callback);
    return () => {
      this.authEventCallbacks = this.authEventCallbacks.filter(
        (cb) => cb !== callback
      );
    };
  }

  /**
   * Emit auth event to all subscribers
   */
  private emitAuthEvent(event: AuthEventType): void {
    this.authEventCallbacks.forEach((cb) => cb(event));
  }

  /**
   * Setup request interceptor for auth token
   */
  private setupRequestInterceptor(): void {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Check token expiration before making request
        if (this.tokenService.isTokenExpired()) {
          this.emitAuthEvent("token_expired");
        }

        // Get token from cookie storage and send as Bearer token
        const token = this.tokenService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Don't set Content-Type for FormData - let browser set it with boundary
        if (config.data instanceof FormData) {
          delete config.headers["Content-Type"];
        }

        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  /**
   * Setup response interceptor for error handling
   */
  private setupResponseInterceptor(): void {
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (
        error: AxiosError<{
          message?: string;
          errors?: Record<string, string[]>;
        }>
      ) => {
        if (!error.response) {
          // Network error
          return Promise.reject(
            new ApiError(
              "Network error. Please check your connection.",
              0,
              undefined,
              error
            )
          );
        }

        const { status, data } = error.response;
        const message = data?.message || "An unexpected error occurred";
        const errors = data?.errors;

        // Handle authentication errors
        if (status === 401) {
          this.tokenService.clearAll();
          this.emitAuthEvent("unauthorized");
        }

        // Handle authorization errors
        if (status === 403) {
          this.emitAuthEvent("forbidden");
        }

        return Promise.reject(new ApiError(message, status, errors, error));
      }
    );
  }

  /**
   * GET request
   */
  get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  /**
   * POST request
   */
  post<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  /**
   * PUT request
   */
  put<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  /**
   * PATCH request
   */
  patch<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }

  /**
   * DELETE request
   */
  delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  /**
   * Make request without authentication token
   * Used for login endpoint - no Bearer token sent
   */
  postPublic<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: undefined, // Remove Authorization header
      },
    });
  }
}
