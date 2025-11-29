import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { User, type UserRole } from "@/core/domain/entities/User";
import type { IAuthService } from "@/core/domain/services/IAuthService";
import type { RegisterData } from "@/core/domain/repositories/IAuthRepository";
import { container, TOKENS } from "@/core/infrastructure/di/container";
import type { HttpClient } from "@/core/infrastructure/api/HttpClient";

/**
 * Auth context state
 */
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Auth context value including state and methods
 */
interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<User>;
  clearError: () => void;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  isRootUser: boolean;
}

/**
 * Create auth context with undefined default
 */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Auth provider props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth Provider Component
 * Manages authentication state and provides auth methods to children
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Get services from container
  const authService = useMemo(
    () => container.resolve<IAuthService>(TOKENS.AUTH_SERVICE),
    []
  );

  const httpClient = useMemo(
    () => container.resolve<HttpClient>(TOKENS.HTTP_CLIENT),
    []
  );

  /**
   * Handle unauthorized events from HTTP client
   */
  useEffect(() => {
    const unsubscribe = httpClient.onAuthEvent((event) => {
      if (event === "unauthorized" || event === "token_expired") {
        setState((prev) => ({
          ...prev,
          user: null,
          isAuthenticated: false,
          error:
            event === "token_expired"
              ? "Your session has expired. Please log in again."
              : null,
        }));
      }
    });

    return unsubscribe;
  }, [httpClient]);

  /**
   * Check authentication on mount
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we have a valid token
        if (!authService.isAuthenticated()) {
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
          return;
        }

        // Verify token and get user
        const user = await authService.getCurrentUser();

        setState({
          user,
          isAuthenticated: user !== null,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error("Auth check failed:", error);
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    };

    checkAuth();
  }, [authService]);

  /**
   * Login handler
   */
  const login = useCallback(
    async (email: string, password: string) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const user = await authService.login(email, password);

        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Login failed. Please try again.";

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: message,
        }));

        throw error;
      }
    },
    [authService]
  );

  /**
   * Logout handler
   */
  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, [authService]);

  /**
   * Register handler (root_user only)
   */
  const register = useCallback(
    async (userData: RegisterData): Promise<User> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const newUser = await authService.register(userData);
        setState((prev) => ({ ...prev, isLoading: false }));
        return newUser;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Registration failed. Please try again.";

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: message,
        }));

        throw error;
      }
    },
    [authService]
  );

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  /**
   * Check if user has specific role
   */
  const hasRole = useCallback(
    (role: UserRole): boolean => {
      return state.user?.hasRole(role) ?? false;
    },
    [state.user]
  );

  /**
   * Check if user has any of specified roles
   */
  const hasAnyRole = useCallback(
    (roles: UserRole[]): boolean => {
      return state.user?.hasAnyRole(roles) ?? false;
    },
    [state.user]
  );

  /**
   * Context value
   */
  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      logout,
      register,
      clearError,
      hasRole,
      hasAnyRole,
      isRootUser: state.user?.isRootUser() ?? false,
    }),
    [state, login, logout, register, clearError, hasRole, hasAnyRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 * Must be used within AuthProvider
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

/**
 * Hook to get current user (convenience hook)
 */
export function useCurrentUser(): User | null {
  const { user } = useAuth();
  return user;
}

/**
 * Hook to check authentication status
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}
