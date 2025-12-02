import { User } from "@/core/domain/entities/User";
import type {
  IAuthRepository,
  LoginResult,
  RegisterData,
  UpdateProfileData,
  UpdateProfileResult,
} from "@/core/domain/repositories/IAuthRepository";
import { HttpClient, ApiError } from "@/core/infrastructure/api/HttpClient";
import { API_ENDPOINTS } from "@/core/infrastructure/api/constants";
import type { UserRole } from "@/core/domain/entities/User";

/**
 * API Response Types
 */
interface LoginResponseDTO {
  message: string;
  token: string;
  expires_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
  };
}

interface CurrentUserResponseDTO {
  user: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
  };
}

interface RegisterResponseDTO {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    created_at: string;
  };
}

interface LogoutResponseDTO {
  message: string;
}

/**
 * Sanitize email input
 */
function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * API Auth Repository Implementation
 * Handles all authentication API calls
 */
export class ApiAuthRepository implements IAuthRepository {
  constructor(private readonly http: HttpClient) {}

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<LoginResult> {
    try {
      // Sanitize and validate email
      const sanitizedEmail = sanitizeEmail(email);

      if (!isValidEmail(sanitizedEmail)) {
        throw new Error("Please enter a valid email address");
      }

      // Validate password is not empty
      if (!password || password.trim().length === 0) {
        throw new Error("Password is required");
      }

      const { data } = await this.http.postPublic<LoginResponseDTO>(
        API_ENDPOINTS.AUTH.LOGIN,
        { email: sanitizedEmail, password }
      );

      return {
        token: data.token,
        expiresAt: data.expires_at,
        user: new User(
          data.user.id,
          data.user.name,
          data.user.email,
          data.user.role
        ),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.isRateLimitError()) {
          throw new Error(
            error.getFieldError("email") ||
              "Too many login attempts. Please try again later."
          );
        }
        if (error.isValidationError()) {
          const emailError = error.getFieldError("email");
          const passwordError = error.getFieldError("password");
          throw new Error(emailError || passwordError || error.message);
        }
        throw new Error(error.message);
      }

      // Re-throw validation errors
      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Login failed. Please try again.");
    }
  }

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<User> {
    try {
      // Sanitize email
      const sanitizedData = {
        ...data,
        email: sanitizeEmail(data.email),
        name: data.name.trim(),
      };

      const { data: response } = await this.http.post<RegisterResponseDTO>(
        API_ENDPOINTS.AUTH.REGISTER,
        sanitizedData
      );

      return new User(
        response.user.id,
        response.user.name,
        response.user.email,
        response.user.role,
        null,
        response.user.created_at
      );
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.isForbiddenError()) {
          throw new Error("You do not have permission to create users.");
        }
        if (error.isValidationError()) {
          const allErrors = error.getAllErrors();
          throw new Error(allErrors[0] || error.message);
        }
        throw new Error(error.message);
      }
      throw new Error("Registration failed. Please try again.");
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      await this.http.post<LogoutResponseDTO>(API_ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // Silently fail - we'll clear local state anyway
    }
  }

  /**
   * Fetch current user from API
   */
  async fetchCurrentUser(): Promise<User> {
    const { data } = await this.http.get<CurrentUserResponseDTO>(
      API_ENDPOINTS.AUTH.CURRENT_USER
    );

    return new User(
      data.user.id,
      data.user.name,
      data.user.email,
      data.user.role,
      data.user.email_verified_at,
      data.user.created_at,
      data.user.updated_at
    );
  }

  /**
   * Update current user's profile
   */
  async updateProfile(data: UpdateProfileData): Promise<UpdateProfileResult> {
    try {
      // Sanitize email if provided
      const sanitizedData = {
        ...data,
        email: data.email ? sanitizeEmail(data.email) : undefined,
        name: data.name?.trim(),
      };

      // Remove undefined fields
      const payload = Object.fromEntries(
        Object.entries(sanitizedData).filter(([_, v]) => v !== undefined)
      );

      interface UpdateProfileResponseDTO {
        message: string;
        user: {
          id: number;
          name: string;
          email: string;
          role: UserRole;
          email_verified_at: string | null;
          updated_at: string;
        };
      }

      const { data: response } = await this.http.put<UpdateProfileResponseDTO>(
        API_ENDPOINTS.AUTH.UPDATE_PROFILE,
        payload
      );

      const user = new User(
        response.user.id,
        response.user.name,
        response.user.email,
        response.user.role,
        response.user.email_verified_at,
        undefined,
        response.user.updated_at
      );

      return {
        message: response.message,
        user,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.isValidationError()) {
          const allErrors = error.getAllErrors();
          throw new Error(allErrors[0] || error.message);
        }
        throw new Error(error.message);
      }
      throw new Error("Failed to update profile. Please try again.");
    }
  }
}
