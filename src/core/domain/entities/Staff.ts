/**
 * Staff Role Type
 */
export type StaffRole = "doctor" | "nurse";

/**
 * Staff Entity
 * Represents a staff member (doctor or nurse) in the hospital system
 */
export interface Staff {
  id: number;
  name: string;
  email: string;
  role: StaffRole;
}

/**
 * Staff List Response
 */
export interface StaffListResponse {
  doctors: Staff[];
  nurses: Staff[];
}



