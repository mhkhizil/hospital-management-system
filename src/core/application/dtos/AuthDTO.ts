import { User, type UserRole } from "@/core/domain/entities/User";

/**
 * User DTO for presentation layer
 */
export interface UserDTO {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  emailVerifiedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

/**
 * Convert User entity to DTO
 */
export function toUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    emailVerifiedAt: user.emailVerifiedAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
