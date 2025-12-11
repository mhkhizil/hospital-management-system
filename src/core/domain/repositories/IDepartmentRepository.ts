import type { DepartmentResponse } from "../entities/Department";

/**
 * Department Repository Interface
 * Defines contract for fetching department data
 */
export interface IDepartmentRepository {
  /**
   * Get hospital departments
   * @returns Department data with codes and names
   */
  getDepartments(): Promise<DepartmentResponse>;
}
