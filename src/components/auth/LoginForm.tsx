"use client";

import { z } from "zod";
import { AuthForm, type AuthFieldConfig } from "./AuthForm";

/**
 * Login form validation schema
 */
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Login form props
 */
interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  error?: string | null;
  isLoading?: boolean;
  className?: string;
}

/**
 * Login Form Component
 * Secure, accessible login form with validation
 */
export function LoginForm({
  onSubmit,
  error,
  isLoading = false,
  className,
}: LoginFormProps) {
  const fields: AuthFieldConfig<LoginFormData>[] = [
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "you@hospital.com",
      autoComplete: "email",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "••••••••",
      autoComplete: "current-password",
      showPasswordToggle: true,
    },
  ];

  return (
    <AuthForm
      schema={loginSchema}
      fields={fields}
      onSubmit={onSubmit}
      submitLabel="Sign in"
      submitLoadingLabel="Signing in..."
      error={error}
      isLoading={isLoading}
      defaultValues={{
        email: "",
        password: "",
      }}
      className={className}
    />
  );
}
