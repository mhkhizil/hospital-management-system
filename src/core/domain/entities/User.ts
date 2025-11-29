/**
 * User Role Type
 */
export type UserRole = "root_user" | "doctor" | "nurse" | "admission";

/**
 * User Entity
 * Represents an authenticated user in the system
 */
export class User {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly email: string,
    public readonly role: UserRole,
    public readonly emailVerifiedAt: string | null = null,
    public readonly createdAt: string | null = null,
    public readonly updatedAt: string | null = null
  ) {}

  /**
   * Check if user is root user
   */
  isRootUser(): boolean {
    return this.role === "root_user";
  }

  /**
   * Check if user is doctor
   */
  isDoctor(): boolean {
    return this.role === "doctor";
  }

  /**
   * Check if user is nurse
   */
  isNurse(): boolean {
    return this.role === "nurse";
  }

  /**
   * Check if user is admission staff
   */
  isAdmission(): boolean {
    return this.role === "admission";
  }

  /**
   * Check if email is verified
   */
  isEmailVerified(): boolean {
    return this.emailVerifiedAt !== null;
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: UserRole): boolean {
    return this.role === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: UserRole[]): boolean {
    return roles.includes(this.role);
  }
}
