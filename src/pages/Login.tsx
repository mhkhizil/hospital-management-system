"use client";

import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/core/presentation/context/AuthContext";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

/**
 * Login Page Component
 * Handles user authentication with secure form submission
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, isLoading, clearError } = useAuth();

  // Get redirect path from location state
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  const handleSubmit = async (data: { email: string; password: string }) => {
    // Clear any previous errors
    clearError();

    try {
      await login(data.email, data.password);
      // Navigate to the page they were trying to access, or home
      navigate(from, { replace: true });
    } catch {
      // Error is handled by AuthContext and displayed via the error prop
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Login Form */}
        <LoginForm
          onSubmit={handleSubmit}
          error={error}
          isLoading={isLoading}
        />

        {/* Help Text */}
        <p className="text-center text-xs text-muted-foreground">
          Contact your administrator if you need access or forgot your
          credentials.
        </p>
      </div>
    </AuthLayout>
  );
}
