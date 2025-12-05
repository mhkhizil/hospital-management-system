import type {
  CreateAdmissionData,
  UpdateAdmissionData,
  ConvertToInpatientData,
  DischargeData,
  ConfirmDeathData,
  AdmissionStatistics,
  AdmissionListParams,
} from "../entities/Admission";
import type { PaginatedResponse } from "../entities/Patient";
import type {
  AdmissionListDTO,
  AdmissionDetailDTO,
} from "@/core/application/dtos/AdmissionDTO";

/**
 * Admission Service Interface
 * Defines the contract for admission business logic
 */
export interface IAdmissionService {
  /**
   * List admissions with pagination
   */
  listAdmissions(params?: AdmissionListParams): Promise<PaginatedResponse<AdmissionListDTO>>;

  /**
   * Get admission details by ID
   */
  getAdmissionById(id: number): Promise<AdmissionDetailDTO>;

  /**
   * Create a new admission for a patient
   */
  createAdmission(patientId: number, data: CreateAdmissionData): Promise<AdmissionDetailDTO>;

  /**
   * Update an existing admission
   */
  updateAdmission(id: number, data: UpdateAdmissionData): Promise<AdmissionDetailDTO>;

  /**
   * Convert outpatient to inpatient
   */
  convertToInpatient(id: number, data: ConvertToInpatientData): Promise<AdmissionDetailDTO>;

  /**
   * Discharge a patient
   */
  dischargePatient(id: number, data: DischargeData): Promise<AdmissionDetailDTO>;

  /**
   * Confirm patient death
   */
  confirmDeath(id: number, data: ConfirmDeathData): Promise<AdmissionDetailDTO>;

  /**
   * Get admission statistics
   */
  getStatistics(): Promise<AdmissionStatistics>;
}

