import type {
  IAuthRepository,
  RegisterData,
  UpdateProfileData,
  UpdateProfileResult,
} from "@/core/domain/repositories/IAuthRepository";
import type { IAuthService } from "@/core/domain/services/IAuthService";
import type { TokenManagementService } from "@/core/infrastructure/services/TokenManagementService";
import { User } from "@/core/domain/entities/User";
import { ApiError } from "@/core/infrastructure/api/HttpClient";

/**
 * Auth Management Service
 * Orchestrates authentication operations using repository and token service
 */
export class AuthManagementService implements IAuthService {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly tokenService: TokenManagementService
  ) {}

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<User> {
    const result = await this.authRepository.login(email, password);

    // Store token and user data
    this.tokenService.setToken(result.token);
    this.tokenService.setTokenExpiry(result.expiresAt);
    this.tokenService.setUser(
      JSON.stringify({
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      })
    );

    return result.user;
  }

  /**
   * Register a new user (root_user only)
   */
  async register(data: RegisterData): Promise<User> {
    return this.authRepository.register(data);
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      await this.authRepository.logout();
    } finally {
      // Always clear local auth data
      this.tokenService.clearAll();
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    // Check if we have a valid token first
    if (!this.isAuthenticated()) {
      return null;
    }

    // Try to get cached user first
    const cachedUser = this.getCachedUser();

    try {
      const user = await this.authRepository.fetchCurrentUser();

      // Update cached user
      this.tokenService.setUser(
        JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        })
      );

      return user;
    } catch (error) {
      if (error instanceof ApiError && error.isAuthError()) {
        // Token is invalid, clear everything
        this.tokenService.clearAll();
        return null;
      }

      // Only return cached user for network errors, not API errors
      // This prevents returning stale data when backend is down
      if (error instanceof ApiError) {
        // API error - don't return cached user (might be stale)
        return null;
      }

      // Network error - return cached user as fallback
      if (cachedUser) {
        return cachedUser;
      }

      return null;
    }
  }

  /**
   * Update current user's profile
   */
  async updateProfile(data: UpdateProfileData): Promise<UpdateProfileResult> {
    const result = await this.authRepository.updateProfile(data);

    // Update cached user data
    this.tokenService.setUser(
      JSON.stringify({
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      })
    );

    return result;
  }

  /**
   * Check if user is authenticated (has valid token)
   */
  isAuthenticated(): boolean {
    const token = this.tokenService.getToken();
    return token !== null && !this.tokenService.isTokenExpired();
  }

  /**
   * Check if token is expiring soon
   */
  isTokenExpiringSoon(minutesThreshold: number = 5): boolean {
    return this.tokenService.isTokenExpiringSoon(minutesThreshold);
  }

  /**
   * Get cached user from storage
   */
  private getCachedUser(): User | null {
    try {
      const userData = this.tokenService.getUser();
      if (!userData) return null;

      const parsed = JSON.parse(userData);
      return new User(parsed.id, parsed.name, parsed.email, parsed.role);
    } catch {
      return null;
    }
  }
}
