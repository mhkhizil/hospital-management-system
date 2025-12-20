import type {
  Patient,
  CreatePatientData,
  UpdatePatientData,
  PatientListParams,
  PaginatedResponse,
  Admission,
} from "../entities/Patient";
import type { PatientSearchResult } from "../repositories/IPatientRepository";

/**
 * Patient Service Interface
 * Defines business operations for patient management
 */
export interface IPatientService {
  /**
   * List patients with optional filters and pagination
   */
  listPatients(params?: PatientListParams): Promise<PaginatedResponse<Patient>>;

  /**
   * Search patients by name, NRC, or phone
   * @param query - Search query string (min 2 characters)
   * @param isNotdeceased - Filter out deceased patients (for admission creation)
   */
  searchPatients(
    query: string,
    isNotdeceased?: boolean
  ): Promise<PatientSearchResult>;

  /**
   * Get patient details by ID
   */
  getPatientById(id: number): Promise<Patient>;

  /**
   * Register a new patient
   */
  createPatient(data: CreatePatientData): Promise<Patient>;

  /**
   * Update patient information
   */
  updatePatient(id: number, data: UpdatePatientData): Promise<Patient>;

  /**
   * Get patient's admission history
   */
  getPatientAdmissions(patientId: number): Promise<Admission[]>;
}
