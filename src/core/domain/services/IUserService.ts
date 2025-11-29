import type { User } from "../entities/User";
import type {
  PasswordResetRequest,
  PasswordResetResult,
  DeleteUserResult,
  RestoreUserResult,
} from "../repositories/IUserRepository";

/**
 * User Service Interface
 * Defines user management business operations
 */
export interface IUserService {
  /**
   * List all users
   * @param includeDeleted - If true, fetch only deleted users. If false or undefined, fetch only active users.
   */
  listUsers(includeDeleted?: boolean): Promise<User[]>;

  /**
   * Send password reset link to user
   */
  sendPasswordResetLink(
    data: PasswordResetRequest
  ): Promise<PasswordResetResult>;

  /**
   * Delete a user (soft delete)
   */
  deleteUser(id: number): Promise<DeleteUserResult>;

  /**
   * Restore a deleted user
   */
  restoreUser(id: number): Promise<RestoreUserResult>;
}
