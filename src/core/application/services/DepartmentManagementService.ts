import type { IDepartmentService } from "@/core/domain/services/IDepartmentService";
import type { IDepartmentRepository } from "@/core/domain/repositories/IDepartmentRepository";
import type { DepartmentData } from "@/core/domain/entities/Department";

/**
 * Department Management Service
 * Orchestrates department operations
 */
export class DepartmentManagementService implements IDepartmentService {
  constructor(private readonly departmentRepository: IDepartmentRepository) {}

  /**
   * Get hospital departments
   */
  async getDepartments(): Promise<DepartmentData> {
    const response = await this.departmentRepository.getDepartments();
    return response.data;
  }
}
