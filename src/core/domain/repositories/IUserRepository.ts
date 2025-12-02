import { User } from "../entities/User";

/**
 * User list response
 */
export interface UserListResult {
  users: User[];
  total: number;
}

/**
 * Password reset request data
 */
export interface PasswordResetRequest {
  user_id?: number;
  email?: string;
}

/**
 * Password reset result
 */
export interface PasswordResetResult {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

/**
 * Delete user result
 */
export interface DeleteUserResult {
  message: string;
  deletedUser: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  deletedAt: string;
}

/**
 * Restore user result
 */
export interface RestoreUserResult {
  message: string;
  user: User;
  restoredAt: string;
}

/**
 * User Repository Interface
 * Defines data access operations for user management
 */
export interface IUserRepository {
  /**
   * Fetch all users (root_user only)
   * @param includeDeleted - If true, fetch only deleted users. If false or undefined, fetch only active users.
   */
  fetchAll(includeDeleted?: boolean): Promise<UserListResult>;

  /**
   * Send password reset link to user
   */
  sendPasswordResetLink(data: PasswordResetRequest): Promise<PasswordResetResult>;

  /**
   * Soft delete a user
   */
  deleteUser(id: number): Promise<DeleteUserResult>;

  /**
   * Restore a soft-deleted user
   */
  restoreUser(id: number): Promise<RestoreUserResult>;
}

