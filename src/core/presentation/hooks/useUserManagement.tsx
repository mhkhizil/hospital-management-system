import { useState, useEffect, useCallback } from "react";
import type { User } from "@/core/domain/entities/User";
import type { IUserService } from "@/core/domain/services/IUserService";
import type { PasswordResetRequest } from "@/core/domain/repositories/IUserRepository";
import { container, TOKENS } from "@/core/infrastructure/di/container";

/**
 * User management state
 */
interface UserManagementState {
  users: User[];
  deletedUsers: User[];
  isLoading: boolean;
  isLoadingDeleted: boolean;
  error: string | null;
  deletedError: string | null;
  actionLoading: boolean;
  actionError: string | null;
  successMessage: string | null;
}

/**
 * User management hook result
 */
interface UseUserManagementResult extends UserManagementState {
  fetchUsers: () => Promise<void>;
  fetchDeletedUsers: () => Promise<void>;
  sendPasswordReset: (data: PasswordResetRequest) => Promise<boolean>;
  deleteUser: (id: number) => Promise<boolean>;
  restoreUser: (id: number) => Promise<boolean>;
  clearMessages: () => void;
}

/**
 * Hook for user management operations
 */
export function useUserManagement(): UseUserManagementResult {
  const [state, setState] = useState<UserManagementState>({
    users: [],
    deletedUsers: [],
    isLoading: false,
    isLoadingDeleted: false,
    error: null,
    deletedError: null,
    actionLoading: false,
    actionError: null,
    successMessage: null,
  });

  const userService = container.resolve<IUserService>(TOKENS.USER_SERVICE);

  /**
   * Fetch all active users
   */
  const fetchUsers = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const users = await userService.listUsers(false);
      setState((prev) => ({
        ...prev,
        users,
        isLoading: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch users";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
    }
  }, [userService]);

  /**
   * Fetch all deleted users
   */
  const fetchDeletedUsers = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      isLoadingDeleted: true,
      deletedError: null,
    }));

    try {
      const deletedUsers = await userService.listUsers(true);
      setState((prev) => ({
        ...prev,
        deletedUsers,
        isLoadingDeleted: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch deleted users";
      setState((prev) => ({
        ...prev,
        isLoadingDeleted: false,
        deletedError: message,
      }));
    }
  }, [userService]);

  /**
   * Send password reset link
   */
  const sendPasswordReset = useCallback(
    async (data: PasswordResetRequest): Promise<boolean> => {
      setState((prev) => ({
        ...prev,
        actionLoading: true,
        actionError: null,
        successMessage: null,
      }));

      try {
        const result = await userService.sendPasswordResetLink(data);
        setState((prev) => ({
          ...prev,
          actionLoading: false,
          successMessage: result.message,
        }));
        return true;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to send password reset link";
        setState((prev) => ({
          ...prev,
          actionLoading: false,
          actionError: message,
        }));
        return false;
      }
    },
    [userService]
  );

  /**
   * Delete a user
   */
  const deleteUser = useCallback(
    async (id: number): Promise<boolean> => {
      setState((prev) => ({
        ...prev,
        actionLoading: true,
        actionError: null,
        successMessage: null,
      }));

      try {
        const result = await userService.deleteUser(id);
        // Remove user from list
        setState((prev) => ({
          ...prev,
          users: prev.users.filter((u) => u.id !== id),
          actionLoading: false,
          successMessage: result.message,
        }));
        return true;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to delete user";
        setState((prev) => ({
          ...prev,
          actionLoading: false,
          actionError: message,
        }));
        return false;
      }
    },
    [userService]
  );

  /**
   * Restore a deleted user
   */
  const restoreUser = useCallback(
    async (id: number): Promise<boolean> => {
      setState((prev) => ({
        ...prev,
        actionLoading: true,
        actionError: null,
        successMessage: null,
      }));

      try {
        const result = await userService.restoreUser(id);
        // Remove from deleted users and refresh both lists
        setState((prev) => ({
          ...prev,
          deletedUsers: prev.deletedUsers.filter((u) => u.id !== id),
          actionLoading: false,
          successMessage: result.message,
        }));
        // Refresh active users list
        await fetchUsers();
        return true;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to restore user";
        setState((prev) => ({
          ...prev,
          actionLoading: false,
          actionError: message,
        }));
        return false;
      }
    },
    [userService]
  );

  /**
   * Clear messages
   */
  const clearMessages = useCallback(() => {
    setState((prev) => ({
      ...prev,
      actionError: null,
      successMessage: null,
    }));
  }, []);

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
    fetchDeletedUsers();
  }, [fetchUsers, fetchDeletedUsers]);

  return {
    ...state,
    fetchUsers,
    fetchDeletedUsers,
    sendPasswordReset,
    deleteUser,
    restoreUser,
    clearMessages,
  };
}
