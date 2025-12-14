import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/core/presentation/context/AuthContext";
import type { UserRole } from "@/core/domain/entities/User";

/**
 * Loading spinner component
 */
function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

/**
 * Access denied component
 */
function AccessDenied() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-destructive/10 p-4">
          <svg
            className="h-12 w-12 text-destructive"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">
          You don't have permission to access this page.
        </p>
      </div>
    </div>
  );
}

/**
 * Props for ProtectedRoute component
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Required roles (user must have at least one) */
  allowedRoles?: UserRole[];
  /** Redirect path when not authenticated */
  redirectTo?: string;
  /** Show access denied instead of redirecting for role failures */
  showAccessDenied?: boolean;
}

/**
 * Protected Route Component
 * Protects routes that require authentication and optionally specific roles
 */
export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/login",
  showAccessDenied = true,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasAnyRole } = useAuth();
  const location = useLocation();

  // Show loading while checking auth
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role requirements
  if (allowedRoles && allowedRoles.length > 0) {
    if (!hasAnyRole(allowedRoles)) {
      if (showAccessDenied) {
        return <AccessDenied />;
      }
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}

/**
 * Props for PublicRoute component
 */
interface PublicRouteProps {
  children: React.ReactNode;
  /** Redirect path when already authenticated */
  redirectTo?: string;
}

/**
 * Public Route Component
 * For routes that should only be accessible when NOT authenticated (e.g., login page)
 */
export function PublicRoute({ children, redirectTo = "/" }: PublicRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking auth
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    // Redirect to the page they came from, or default redirect
    const from = (location.state as { from?: { pathname: string } })?.from
      ?.pathname;
    return <Navigate to={from || redirectTo} replace />;
  }

  return <>{children}</>;
}

/**
 * Props for RoleGate component
 */
interface RoleGateProps {
  children: React.ReactNode;
  /** Required roles (user must have at least one) */
  allowedRoles: UserRole[];
  /** Fallback content when role check fails */
  fallback?: React.ReactNode;
}

/**
 * Role Gate Component
 * Conditionally renders children based on user role
 * Use within already authenticated routes for granular access control
 */
export function RoleGate({
  children,
  allowedRoles,
  fallback = null,
}: RoleGateProps) {
  const { hasAnyRole, isAuthenticated } = useAuth();

  if (!isAuthenticated || !hasAnyRole(allowedRoles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
