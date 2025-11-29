"use client";

import { z } from "zod";
import { AuthForm, type AuthFieldConfig } from "./AuthForm";
import type { RegisterData } from "@/core/domain/repositories/IAuthRepository";

/**
 * Register form validation schema
 */
const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters")
      .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    password_confirmation: z.string().min(1, "Please confirm your password"),
    role: z.enum(["doctor", "nurse", "admission"], {
      errorMap: () => ({ message: "Please select a valid role" }),
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Register form props
 */
interface RegisterFormProps {
  onSubmit: (data: RegisterData) => Promise<void>;
  error?: string | null;
  isLoading?: boolean;
  className?: string;
}

/**
 * Register Form Component
 * Secure registration form with validation
 */
export function RegisterForm({
  onSubmit,
  error,
  isLoading = false,
  className,
}: RegisterFormProps) {
  const fields: AuthFieldConfig<RegisterFormData>[] = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      placeholder: "John Doe",
      autoComplete: "name",
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "you@hospital.com",
      autoComplete: "email",
    },
    {
      name: "role",
      label: "Role",
      type: "select",
      options: [
        { value: "doctor", label: "Doctor" },
        { value: "nurse", label: "Nurse" },
        { value: "admission", label: "Admission Staff" },
      ],
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "••••••••",
      autoComplete: "new-password",
      showPasswordToggle: true,
    },
    {
      name: "password_confirmation",
      label: "Confirm Password",
      type: "password",
      placeholder: "••••••••",
      autoComplete: "new-password",
      showPasswordToggle: true,
    },
  ];

  const handleSubmit = async (data: RegisterFormData) => {
    await onSubmit(data);
  };

  return (
    <AuthForm
      schema={registerSchema}
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel="Create Account"
      submitLoadingLabel="Creating account..."
      error={error}
      isLoading={isLoading}
      defaultValues={{
        name: "",
        email: "",
        role: "doctor",
        password: "",
        password_confirmation: "",
      }}
      className={className}
    />
  );
}

