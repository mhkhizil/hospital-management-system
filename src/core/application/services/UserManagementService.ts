import type { User } from "@/core/domain/entities/User";
import type { IUserService } from "@/core/domain/services/IUserService";
import type {
  IUserRepository,
  PasswordResetRequest,
  PasswordResetResult,
  DeleteUserResult,
  RestoreUserResult,
} from "@/core/domain/repositories/IUserRepository";

/**
 * User Management Service
 * Orchestrates user management operations
 */
export class UserManagementService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * List all users
   * @param includeDeleted - If true, fetch only deleted users. If false or undefined, fetch only active users.
   */
  async listUsers(includeDeleted?: boolean): Promise<User[]> {
    const result = await this.userRepository.fetchAll(includeDeleted);
    return result.users;
  }

  /**
   * Send password reset link to user
   */
  async sendPasswordResetLink(
    data: PasswordResetRequest
  ): Promise<PasswordResetResult> {
    return this.userRepository.sendPasswordResetLink(data);
  }

  /**
   * Delete a user (soft delete)
   */
  async deleteUser(id: number): Promise<DeleteUserResult> {
    return this.userRepository.deleteUser(id);
  }

  /**
   * Restore a deleted user
   */
  async restoreUser(id: number): Promise<RestoreUserResult> {
    return this.userRepository.restoreUser(id);
  }
}
