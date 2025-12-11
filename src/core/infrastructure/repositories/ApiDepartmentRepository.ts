import type { IDepartmentRepository } from "@/core/domain/repositories/IDepartmentRepository";
import type { DepartmentResponse } from "@/core/domain/entities/Department";
import type { HttpClient } from "../api/HttpClient";
import { API_ENDPOINTS } from "../api/constants";

/**
 * API Department Repository Implementation
 */
export class ApiDepartmentRepository implements IDepartmentRepository {
  constructor(private readonly http: HttpClient) {}

  /**
   * Get hospital departments from API
   */
  async getDepartments(): Promise<DepartmentResponse> {
    const { data } = await this.http.get<DepartmentResponse>(
      API_ENDPOINTS.DEPARTMENTS.LIST
    );
    return data;
  }
}
