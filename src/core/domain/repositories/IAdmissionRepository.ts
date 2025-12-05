import type {
  Admission,
  AdmissionWithPatient,
  CreateAdmissionData,
  UpdateAdmissionData,
  ConvertToInpatientData,
  DischargeData,
  ConfirmDeathData,
  AdmissionStatistics,
  AdmissionListParams,
} from "../entities/Admission";
import type { PaginatedResponse } from "../entities/Patient";

/**
 * Admission Repository Interface
 * Defines the contract for admission data operations
 */
export interface IAdmissionRepository {
  /**
   * Fetch paginated list of admissions
   */
  fetchAll(params?: AdmissionListParams): Promise<PaginatedResponse<AdmissionWithPatient>>;

  /**
   * Get admission by ID
   */
  getById(id: number): Promise<AdmissionWithPatient>;

  /**
   * Create a new admission for a patient
   */
  create(patientId: number, data: CreateAdmissionData): Promise<AdmissionWithPatient>;

  /**
   * Update an existing admission
   */
  update(id: number, data: UpdateAdmissionData): Promise<AdmissionWithPatient>;

  /**
   * Convert outpatient to inpatient
   */
  convertToInpatient(id: number, data: ConvertToInpatientData): Promise<AdmissionWithPatient>;

  /**
   * Discharge a patient
   */
  discharge(id: number, data: DischargeData): Promise<AdmissionWithPatient>;

  /**
   * Confirm patient death
   */
  confirmDeath(id: number, data: ConfirmDeathData): Promise<AdmissionWithPatient>;

  /**
   * Get admission statistics
   */
  getStatistics(): Promise<AdmissionStatistics>;
}

