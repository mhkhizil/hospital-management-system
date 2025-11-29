import React from "react";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import type { User } from "@/core/domain/entities/User";

/**
 * Role badge color mapping
 */
export function getRoleBadgeVariant(
  role: string
): "default" | "secondary" | "destructive" {
  switch (role) {
    case "root_user":
      return "destructive";
    case "doctor":
      return "default";
    case "nurse":
      return "secondary";
    default:
      return "secondary";
  }
}

/**
 * Role display name
 */
export function getRoleDisplayName(role: string): string {
  switch (role) {
    case "root_user":
      return "Root User";
    case "doctor":
      return "Doctor";
    case "nurse":
      return "Nurse";
    case "admission":
      return "Admission";
    default:
      return role;
  }
}

/**
 * Format date for display
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Render role badge
 */
export function renderRoleBadge(user: User) {
  return (
    <Badge variant={getRoleBadgeVariant(user.role)}>
      {getRoleDisplayName(user.role)}
    </Badge>
  );
}

/**
 * Render root user name with shield icon
 */
export function renderRootUserName(user: User) {
  return (
    <div className="flex items-center gap-2">
      <Shield className="h-4 w-4 text-destructive flex-shrink-0" />
      <span className="font-medium truncate max-w-[150px]">{user.name}</span>
    </div>
  );
}

