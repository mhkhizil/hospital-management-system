import type { Staff } from "../entities/Staff";

/**
 * Staff Service Interface
 * Defines the contract for staff business logic
 */
export interface IStaffService {
  /**
   * Get list of all doctors
   */
  getDoctors(): Promise<Staff[]>;

  /**
   * Get list of all nurses
   */
  getNurses(): Promise<Staff[]>;

  /**
   * Get both doctors and nurses
   */
  getAllStaff(): Promise<{ doctors: Staff[]; nurses: Staff[] }>;
}
