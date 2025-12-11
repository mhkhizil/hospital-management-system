import type { DepartmentData } from "../entities/Department";

/**
 * Department Service Interface
 * Defines department-related operations
 */
export interface IDepartmentService {
  /**
   * Get hospital departments
   */
  getDepartments(): Promise<DepartmentData>;
}
