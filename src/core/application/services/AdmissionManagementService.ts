import type { IAdmissionRepository } from "@/core/domain/repositories/IAdmissionRepository";
import type { IAdmissionService } from "@/core/domain/services/IAdmissionService";
import type {
  CreateAdmissionData,
  UpdateAdmissionData,
  ConvertToInpatientData,
  DischargeData,
  ConfirmDeathData,
  AdmissionStatistics,
  AdmissionListParams,
} from "@/core/domain/entities/Admission";
import type { PaginatedResponse } from "@/core/domain/entities/Patient";
import {
  type AdmissionListDTO,
  type AdmissionDetailDTO,
  toAdmissionListDTO,
  toAdmissionDetailDTO,
} from "@/core/application/dtos/AdmissionDTO";

/**
 * Admission Management Service
 * Implements business logic for admission operations
 */
export class AdmissionManagementService implements IAdmissionService {
  constructor(private readonly repository: IAdmissionRepository) {}

  /**
   * List admissions with pagination
   */
  async listAdmissions(params?: AdmissionListParams): Promise<PaginatedResponse<AdmissionListDTO>> {
    const result = await this.repository.fetchAll(params);
    return {
      data: result.data.map(toAdmissionListDTO),
      current_page: result.current_page,
      last_page: result.last_page,
      per_page: result.per_page,
      total: result.total,
    };
  }

  /**
   * Get admission details by ID
   */
  async getAdmissionById(id: number): Promise<AdmissionDetailDTO> {
    const admission = await this.repository.getById(id);
    return toAdmissionDetailDTO(admission);
  }

  /**
   * Create a new admission for a patient
   */
  async createAdmission(patientId: number, data: CreateAdmissionData): Promise<AdmissionDetailDTO> {
    const admission = await this.repository.create(patientId, data);
    return toAdmissionDetailDTO(admission);
  }

  /**
   * Update an existing admission
   */
  async updateAdmission(id: number, data: UpdateAdmissionData): Promise<AdmissionDetailDTO> {
    const admission = await this.repository.update(id, data);
    return toAdmissionDetailDTO(admission);
  }

  /**
   * Convert outpatient to inpatient
   */
  async convertToInpatient(id: number, data: ConvertToInpatientData): Promise<AdmissionDetailDTO> {
    const admission = await this.repository.convertToInpatient(id, data);
    return toAdmissionDetailDTO(admission);
  }

  /**
   * Discharge a patient
   */
  async dischargePatient(id: number, data: DischargeData): Promise<AdmissionDetailDTO> {
    const admission = await this.repository.discharge(id, data);
    return toAdmissionDetailDTO(admission);
  }

  /**
   * Confirm patient death
   */
  async confirmDeath(id: number, data: ConfirmDeathData): Promise<AdmissionDetailDTO> {
    const admission = await this.repository.confirmDeath(id, data);
    return toAdmissionDetailDTO(admission);
  }

  /**
   * Get admission statistics
   */
  async getStatistics(): Promise<AdmissionStatistics> {
    return this.repository.getStatistics();
  }
}

