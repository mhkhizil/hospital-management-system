import type { Staff } from "@/core/domain/entities/Staff";

/**
 * Staff DTO - For display in lists and forms
 */
export interface StaffDTO {
  id: number;
  name: string;
  email?: string;
  role?: "doctor" | "nurse";
}

/**
 * Map Staff to StaffDTO
 */
export function toStaffDTO(staff: Staff): StaffDTO {
  return {
    id: staff.id,
    name: staff.name,
    email: staff.email,
    role: staff.role,
  };
}


