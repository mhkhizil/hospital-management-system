"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "@/core/presentation/context/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getRoleDisplayName } from "@/components/users/utils";

/**
 * Create profile update schema with dynamic validation
 * Only validates fields that are being updated
 */
const createProfileSchema = (
  currentUser: { name: string; email: string } | null
) => {
  return z
    .object({
      name: z.string().optional(),
      email: z.string().optional(),
      password: z.string().optional(),
      password_confirmation: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      // Validate name only if it's being updated (different from current)
      const currentName = currentUser?.name?.trim() || "";
      const providedName = data.name?.trim() || "";

      if (providedName !== currentName) {
        // Name is being changed - validate it
        if (providedName.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Name cannot be empty",
            path: ["name"],
          });
        } else if (providedName.length > 255) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Name cannot exceed 255 characters",
            path: ["name"],
          });
        } else if (!/^[a-zA-Z\s]+$/.test(providedName)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Name can only contain letters and spaces",
            path: ["name"],
          });
        }
      }

      // Validate email only if it's being updated (different from current)
      const currentEmail = currentUser?.email?.trim() || "";
      const providedEmail = data.email?.trim() || "";

      if (providedEmail !== currentEmail) {
        // Email is being changed - validate it
        if (providedEmail.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Email cannot be empty",
            path: ["email"],
          });
        } else {
          const emailSchema = z.string().email("Invalid email address");
          const emailResult = emailSchema.safeParse(providedEmail);
          if (!emailResult.success) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message:
                emailResult.error.errors[0]?.message || "Invalid email address",
              path: ["email"],
            });
          }
        }
      }

      // Validate password fields - they must be provided together as a pair
      const hasPassword =
        data.password !== undefined && data.password.trim().length > 0;
      const hasPasswordConfirmation =
        data.password_confirmation !== undefined &&
        data.password_confirmation.trim().length > 0;

      // If either password field is provided, both must be provided
      if (hasPassword || hasPasswordConfirmation) {
        if (!hasPassword) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Password is required when providing password confirmation",
            path: ["password"],
          });
        } else if (!hasPasswordConfirmation) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password confirmation is required",
            path: ["password_confirmation"],
          });
        } else {
          // Both are provided - validate password strength and match
          // At this point we know both are defined and non-empty
          const password = data.password!;
          const passwordConfirmation = data.password_confirmation!;

          // Password requirements
          if (password.length < 8) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Password must be at least 8 characters",
              path: ["password"],
            });
          } else {
            if (!/[A-Z]/.test(password)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Password must contain at least one uppercase letter",
                path: ["password"],
              });
            }
            if (!/[a-z]/.test(password)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Password must contain at least one lowercase letter",
                path: ["password"],
              });
            }
            if (!/[0-9]/.test(password)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Password must contain at least one number",
                path: ["password"],
              });
            }
            if (!/[^a-zA-Z0-9]/.test(password)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Password must contain at least one symbol",
                path: ["password"],
              });
            }
          }

          // Check if passwords match
          if (password !== passwordConfirmation) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Passwords do not match",
              path: ["password_confirmation"],
            });
          }
        }
      }
    });
};

type ProfileFormData = {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
};

/**
 * Profile Page
 * Allows users to view and update their profile information
 */
export default function ProfilePage() {
  const { user, updateProfile, isLoading: authLoading } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Create schema based on current user
  const profileSchema = useMemo(() => createProfileSchema(user), [user]);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      password_confirmation: "",
    },
    mode: "onChange",
  });

  const password = watch("password");

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: "",
        password_confirmation: "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsUpdating(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      // Build update data - only include fields that are being updated
      const updateData: {
        name?: string;
        email?: string;
        password?: string;
        password_confirmation?: string;
      } = {};

      // Check if name is being updated (different from current and not empty)
      const currentName = user?.name?.trim() || "";
      const newName = data.name?.trim() || "";
      if (newName !== currentName && newName.length > 0) {
        updateData.name = newName;
      }

      // Check if email is being updated (different from current and not empty)
      const currentEmail = user?.email?.trim() || "";
      const newEmail = data.email?.trim() || "";
      if (newEmail !== currentEmail && newEmail.length > 0) {
        updateData.email = newEmail;
      }

      // Check if password is being updated - both password and confirmation must be provided together
      const hasPassword =
        data.password !== undefined && data.password.trim().length > 0;
      const hasPasswordConfirmation =
        data.password_confirmation !== undefined &&
        data.password_confirmation.trim().length > 0;

      if (hasPassword && hasPasswordConfirmation) {
        // Both are provided - include them in the update
        updateData.password = data.password;
        updateData.password_confirmation = data.password_confirmation;
      }
      // If only one is provided, validation should have caught it, so we don't send anything

      // Check if there are any changes
      if (Object.keys(updateData).length === 0) {
        setErrorMessage("No changes to update");
        setIsUpdating(false);
        return;
      }

      const result = await updateProfile(updateData);
      setSuccessMessage(result.message);

      // Clear password fields after successful update
      reset({
        name: result.user.name,
        email: result.user.email,
        password: "",
        password_confirmation: "",
      });

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile";
      setErrorMessage(message);

      // Clear error message after 5 seconds
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setIsUpdating(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Account
        </p>
        <h2 className="mt-2 text-2xl sm:text-3xl font-semibold">
          Profile Settings
        </h2>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-green-500/50 bg-green-500/10 p-4 text-sm text-green-600 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your personal information and account details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  {...register("name")}
                  placeholder="Enter your full name"
                  disabled={isUpdating}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="Enter your email"
                  disabled={isUpdating}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
                {user.emailVerifiedAt ? (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    Email verified
                  </p>
                ) : (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    Email not verified. Check your inbox for verification link.
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">New Password (Optional)</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="Leave blank to keep current password"
                  disabled={isUpdating}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters and contain uppercase,
                  lowercase, numbers, and symbols.
                </p>
              </div>

              {/* Password Confirmation Field */}
              {password && password.trim().length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">
                    Confirm New Password
                  </Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    {...register("password_confirmation")}
                    placeholder="Confirm your new password"
                    disabled={isUpdating}
                  />
                  {errors.password_confirmation && (
                    <p className="text-sm text-destructive">
                      {errors.password_confirmation.message}
                    </p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isUpdating || !isDirty}
                className="w-full"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Update Profile
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Account Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Account Details
            </CardTitle>
            <CardDescription>
              Your account information and status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* <div className="space-y-2">
              <Label className="text-muted-foreground">User ID</Label>
              <p className="text-sm font-medium">{user.id}</p>
            </div> */}

            <div className="space-y-2">
              <Label className="text-muted-foreground">Role</Label>
              <div>
                <Badge
                  variant={
                    user.role === "root_user" ? "destructive" : "default"
                  }
                >
                  {getRoleDisplayName(user.role)}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Email Status</Label>
              <div className="flex items-center gap-2">
                {user.emailVerifiedAt ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600 dark:text-green-400">
                      Verified
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-yellow-600 dark:text-yellow-400">
                      Not Verified
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Account Created</Label>
              <p className="text-sm">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>

            {user.updatedAt && user.updatedAt !== user.createdAt && (
              <div className="space-y-2">
                <Label className="text-muted-foreground">Last Updated</Label>
                <p className="text-sm">
                  {new Date(user.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
