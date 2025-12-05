import type {
  Patient,
  CreatePatientData,
  UpdatePatientData,
  PatientListParams,
  PaginatedResponse,
  Admission,
} from "../entities/Patient";

/**
 * Patient Search Result
 */
export interface PatientSearchResult {
  total: number;
  data: Patient[];
}

/**
 * Patient Repository Interface
 * Defines data access operations for patients
 */
export interface IPatientRepository {
  /**
   * Fetch paginated list of patients
   */
  fetchAll(params?: PatientListParams): Promise<PaginatedResponse<Patient>>;

  /**
   * Search patients by name, NRC, or phone
   * Returns up to 20 results
   */
  search(query: string): Promise<PatientSearchResult>;

  /**
   * Get patient by ID with full details
   */
  getById(id: number): Promise<Patient>;

  /**
   * Create a new patient
   */
  create(data: CreatePatientData): Promise<Patient>;

  /**
   * Update an existing patient
   */
  update(id: number, data: UpdatePatientData): Promise<Patient>;

  /**
   * Get patient admission history
   */
  getAdmissions(patientId: number): Promise<Admission[]>;
}
