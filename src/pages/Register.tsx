"use client";

import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/core/presentation/context/AuthContext";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Button } from "@/components/ui/button";
import type { RegisterData } from "@/core/domain/repositories/IAuthRepository";

/**
 * Register Page Component
 * Handles user registration (root_user only)
 */
export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, error, isLoading, clearError } = useAuth();

  const handleSubmit = async (data: RegisterData) => {
    clearError();

    try {
      await register(data);
      // Navigate to login or show success message
      navigate("/login", {
        replace: true,
        state: { message: "User registered successfully. Please login." },
      });
    } catch {
      // Error is handled by AuthContext and displayed via the error prop
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="mb-2 -ml-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Create New Account
          </h1>
          <p className="text-sm text-muted-foreground">
            Register a new user account for the hospital management system
          </p>
        </div>

        {/* Register Form */}
        <RegisterForm
          onSubmit={handleSubmit}
          error={error}
          isLoading={isLoading}
        />

        {/* Login Link */}
        {/* <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </div> */}

        {/* Help Text */}
        <p className="text-center text-xs text-muted-foreground">
          Only root users can create new accounts. Contact your administrator if
          you need access.
        </p>
      </div>
    </AuthLayout>
  );
}
