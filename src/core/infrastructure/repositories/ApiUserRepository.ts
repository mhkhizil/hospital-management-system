import { User } from "@/core/domain/entities/User";
import type {
  IUserRepository,
  UserListResult,
  PasswordResetRequest,
  PasswordResetResult,
  DeleteUserResult,
  RestoreUserResult,
} from "@/core/domain/repositories/IUserRepository";
import { HttpClient, ApiError } from "@/core/infrastructure/api/HttpClient";
import { API_ENDPOINTS } from "@/core/infrastructure/api/constants";
import type { UserRole } from "@/core/domain/entities/User";

/**
 * API Response Types
 */
interface UserListResponseDTO {
  message: string;
  total: number;
  users: Array<{
    id: number;
    name: string;
    email: string;
    role: UserRole;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
  }>;
}

interface PasswordResetResponseDTO {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

interface DeleteUserResponseDTO {
  message: string;
  deleted_user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  deleted_at: string;
}

interface RestoreUserResponseDTO {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    deleted_at: null;
    restored_at: string;
  };
}

/**
 * API User Repository Implementation
 * Handles all user management API calls
 */
export class ApiUserRepository implements IUserRepository {
  constructor(private readonly http: HttpClient) {}

  /**
   * Fetch all users
   * @param includeDeleted - If true, fetch only deleted users. If false or undefined, fetch only active users.
   */
  async fetchAll(includeDeleted?: boolean): Promise<UserListResult> {
    try {
      const url = includeDeleted
        ? `${API_ENDPOINTS.USERS.LIST}?deleted=true`
        : API_ENDPOINTS.USERS.LIST;

      const { data } = await this.http.get<UserListResponseDTO>(url);

      const users = data.users.map(
        (u) =>
          new User(
            u.id,
            u.name,
            u.email,
            u.role,
            u.email_verified_at,
            u.created_at,
            u.updated_at
          )
      );

      return {
        users,
        total: data.total,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.isForbiddenError()) {
          throw new Error("You do not have permission to view users.");
        }
        throw new Error(error.message);
      }
      throw new Error("Failed to fetch users. Please try again.");
    }
  }

  /**
   * Send password reset link to user
   */
  async sendPasswordResetLink(
    data: PasswordResetRequest
  ): Promise<PasswordResetResult> {
    try {
      const { data: response } = await this.http.post<PasswordResetResponseDTO>(
        API_ENDPOINTS.USERS.FORGOT_PASSWORD,
        data
      );

      return {
        message: response.message,
        user: response.user,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.isForbiddenError()) {
          throw new Error(
            error.message ||
              "Cannot send password reset link. Check if the user is a root user."
          );
        }
        if (error.isValidationError()) {
          const allErrors = error.getAllErrors();
          throw new Error(allErrors[0] || error.message);
        }
        if (error.isNotFoundError()) {
          throw new Error("User not found.");
        }
        throw new Error(error.message);
      }
      throw new Error("Failed to send password reset link. Please try again.");
    }
  }

  /**
   * Soft delete a user
   */
  async deleteUser(id: number): Promise<DeleteUserResult> {
    try {
      const { data } = await this.http.delete<DeleteUserResponseDTO>(
        API_ENDPOINTS.USERS.DELETE(id)
      );

      return {
        message: data.message,
        deletedUser: {
          id: data.deleted_user.id,
          name: data.deleted_user.name,
          email: data.deleted_user.email,
          role: data.deleted_user.role,
        },
        deletedAt: data.deleted_at,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.isForbiddenError()) {
          throw new Error(
            error.message ||
              "Cannot delete this user. Root users cannot be deleted."
          );
        }
        if (error.isNotFoundError()) {
          throw new Error("User not found.");
        }
        throw new Error(error.message);
      }
      throw new Error("Failed to delete user. Please try again.");
    }
  }

  /**
   * Restore a soft-deleted user
   */
  async restoreUser(id: number): Promise<RestoreUserResult> {
    try {
      const { data } = await this.http.post<RestoreUserResponseDTO>(
        API_ENDPOINTS.USERS.RESTORE(id)
      );

      const user = new User(
        data.user.id,
        data.user.name,
        data.user.email,
        data.user.role
      );

      return {
        message: data.message,
        user,
        restoredAt: data.user.restored_at,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.isForbiddenError()) {
          throw new Error(error.message || "Cannot restore this user.");
        }
        if (error.isNotFoundError()) {
          throw new Error("User not found.");
        }
        if (error.status === 400) {
          throw new Error(
            error.message || "User is not deleted. Nothing to restore."
          );
        }
        throw new Error(error.message);
      }
      throw new Error("Failed to restore user. Please try again.");
    }
  }
}
