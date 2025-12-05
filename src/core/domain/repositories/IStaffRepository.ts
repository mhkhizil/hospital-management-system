import type { Staff } from "../entities/Staff";

/**
 * Staff Repository Interface
 * Defines the contract for staff (doctors/nurses) data operations
 */
export interface IStaffRepository {
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

