"use client";

import * as React from "react";
import {
  useForm,
  type FieldValues,
  type Path,
  type DefaultValues,
  type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/**
 * Auth Form Field Configuration
 */
export interface AuthFieldConfig<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type: "email" | "password" | "text" | "select";
  placeholder?: string;
  autoComplete?: string;
  icon?: React.ReactNode;
  options?: { value: string; label: string }[];
  showPasswordToggle?: boolean;
}

/**
 * Auth Form Props
 */
export interface AuthFormProps<T extends FieldValues> {
  schema: z.ZodType<T, z.ZodTypeDef, T>;
  fields: AuthFieldConfig<T>[];
  onSubmit: (data: T) => Promise<void>;
  submitLabel: string;
  submitLoadingLabel?: string;
  error?: string | null;
  isLoading?: boolean;
  defaultValues?: DefaultValues<T>;
  className?: string;
}

/**
 * Shared Auth Form Component
 * Reusable form component for login and registration
 */
export function AuthForm<T extends FieldValues>({
  schema,
  fields,
  onSubmit,
  submitLabel,
  submitLoadingLabel = "Processing...",
  error,
  isLoading = false,
  defaultValues,
  className,
}: AuthFormProps<T>) {
  const [showPasswords, setShowPasswords] = React.useState<
    Record<string, boolean>
  >({});

  // Create resolver with proper typing
  // Helper to create typed resolver - zodResolver works with ZodType at runtime
  // but TypeScript's generic constraints require conversion through unknown
  const createTypedResolver = <U extends FieldValues>(
    zodSchema: z.ZodType<U, z.ZodTypeDef, U>
  ): Resolver<U> => {
    // Convert through unknown first (as TypeScript suggests) for type safety
    // zodResolver accepts any ZodType at runtime, this is a safe assertion
    return zodResolver(
      zodSchema as unknown as Parameters<typeof zodResolver>[0]
    ) as Resolver<U>;
  };

  const resolver = React.useMemo<Resolver<T>>(() => {
    return createTypedResolver(schema);
  }, [schema]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<T>({
    resolver,
    defaultValues: defaultValues as DefaultValues<T> | undefined,
  });

  const loading = isLoading || isSubmitting;

  const handleFormSubmit = async (data: T) => {
    try {
      await onSubmit(data as T);
    } catch {
      // Error handled by parent
    }
  };

  const togglePasswordVisibility = (fieldName: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const getFieldIcon = (field: AuthFieldConfig<T>) => {
    if (field.icon) return field.icon;

    switch (field.type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "password":
        return <Lock className="h-4 w-4" />;
      default:
        return <UserIcon className="h-4 w-4" />;
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={cn("space-y-6", className)}
      noValidate
    >
      {/* Error Alert */}
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive animate-in fade-in-0 slide-in-from-top-1"
        >
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Dynamic Fields */}
      {fields.map((field) => {
        const fieldError = errors[field.name];
        const showPassword = showPasswords[field.name as string] || false;
        const isPasswordField = field.type === "password";

        if (field.type === "select") {
          const fieldValue = watch ? watch(field.name) : undefined;

          return (
            <div key={field.name as string} className="space-y-2">
              <Label htmlFor={field.name as string} className="text-foreground">
                {field.label}
              </Label>
              <Select
                value={fieldValue || ""}
                onValueChange={(value) => {
                  // Type assertion is safe: field.name is Path<T> and value matches the field type
                  setValue(field.name, value as T[Path<T>], {
                    shouldValidate: true,
                  });
                }}
                disabled={loading}
              >
                <SelectTrigger
                  id={field.name as string}
                  className={cn(
                    fieldError &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                >
                  <SelectValue
                    placeholder={`Select ${field.label.toLowerCase()}`}
                  />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldError && (
                <p className="text-sm text-destructive animate-in fade-in-0 slide-in-from-top-1">
                  {fieldError.message as string}
                </p>
              )}
            </div>
          );
        }

        return (
          <div key={field.name as string} className="space-y-2">
            <Label htmlFor={field.name as string} className="text-foreground">
              {field.label}
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
                {getFieldIcon(field)}
              </div>
              <Input
                id={field.name as string}
                type={
                  isPasswordField
                    ? showPassword
                      ? "text"
                      : "password"
                    : field.type
                }
                placeholder={field.placeholder}
                autoComplete={field.autoComplete}
                disabled={loading}
                className={cn(
                  "pl-10",
                  isPasswordField && "pr-10",
                  fieldError &&
                    "border-destructive focus-visible:ring-destructive"
                )}
                {...register(field.name)}
              />
              {isPasswordField && field.showPasswordToggle !== false && (
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility(field.name as string)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
            {fieldError && (
              <p className="text-sm text-destructive animate-in fade-in-0 slide-in-from-top-1">
                {fieldError.message as string}
              </p>
            )}
          </div>
        );
      })}

      {/* Submit Button */}
      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {submitLoadingLabel}
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}
