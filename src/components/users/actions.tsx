import { Mail, Trash2, RotateCcw } from "lucide-react";
import type { Action } from "@/components/reassembledComps/data-table";
import type { User } from "@/core/domain/entities/User";

/**
 * Get actions for staff users table
 */
export function getStaffActions(
  onPasswordReset: (user: User) => void,
  onDelete: (user: User) => void,
  actionLoading: boolean
): Action<User>[] {
  return [
    {
      label: "Send Password Reset",
      icon: Mail,
      onClick: onPasswordReset,
      disabled: () => actionLoading,
    },
    {
      label: "Delete User",
      icon: Trash2,
      onClick: onDelete,
      variant: "destructive",
      disabled: () => actionLoading,
    },
  ];
}

/**
 * Get actions for deleted users table
 */
export function getDeletedUserActions(
  onRestore: (user: User) => void,
  actionLoading: boolean
): Action<User>[] {
  return [
    {
      label: "Restore User",
      icon: RotateCcw,
      onClick: onRestore,
      disabled: () => actionLoading,
    },
  ];
}

