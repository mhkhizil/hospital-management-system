import type { User } from "../entities/User";
import type {
  RegisterData,
  UpdateProfileData,
  UpdateProfileResult,
} from "../repositories/IAuthRepository";

/**
 * Auth Service Interface
 * Defines authentication business operations
 */
export interface IAuthService {
  /**
   * Login with email and password
   */
  login(email: string, password: string): Promise<User>;

  /**
   * Register a new user (root_user only)
   */
  register(data: RegisterData): Promise<User>;

  /**
   * Logout current user
   */
  logout(): Promise<void>;

  /**
   * Get current authenticated user
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Update current user's profile
   */
  updateProfile(data: UpdateProfileData): Promise<UpdateProfileResult>;

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean;

  /**
   * Check if token is expiring soon
   */
  isTokenExpiringSoon(minutesThreshold?: number): boolean;
}
