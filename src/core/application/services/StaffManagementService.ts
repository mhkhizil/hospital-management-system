import type { IStaffRepository } from "@/core/domain/repositories/IStaffRepository";
import type { IStaffService } from "@/core/domain/services/IStaffService";
import type { Staff } from "@/core/domain/entities/Staff";

/**
 * Staff Management Service
 * Implements business logic for staff (doctors/nurses) operations
 */
export class StaffManagementService implements IStaffService {
  constructor(private readonly repository: IStaffRepository) {}

  /**
   * Get list of all doctors
   */
  async getDoctors(): Promise<Staff[]> {
    return this.repository.getDoctors();
  }

  /**
   * Get list of all nurses
   */
  async getNurses(): Promise<Staff[]> {
    return this.repository.getNurses();
  }

  /**
   * Get both doctors and nurses
   */
  async getAllStaff(): Promise<{ doctors: Staff[]; nurses: Staff[] }> {
    return this.repository.getAllStaff();
  }
}
