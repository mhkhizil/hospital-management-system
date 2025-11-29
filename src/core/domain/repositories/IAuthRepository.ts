import { User } from "../entities/User";

/**
 * Auth repository response types
 */
export interface LoginResult {
  token: string;
  expiresAt: string;
  user: User;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: "doctor" | "nurse" | "admission";
}

/**
 * Auth Repository Interface
 * Defines data access operations for authentication
 */
export interface IAuthRepository {
  /**
   * Authenticate user with credentials
   */
  login(email: string, password: string): Promise<LoginResult>;

  /**
   * Register a new user (root_user only)
   */
  register(data: RegisterData): Promise<User>;

  /**
   * Invalidate current session
   */
  logout(): Promise<void>;

  /**
   * Fetch current authenticated user from API
   */
  fetchCurrentUser(): Promise<User>;
}

