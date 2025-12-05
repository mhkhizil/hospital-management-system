import type { IPatientRepository } from "@/core/domain/repositories/IPatientRepository";
import type {
  PatientListDTO,
  PatientDetailDTO,
  PatientFormDTO,
  AdmissionDTO,
} from "@/core/application/dtos/PatientDTO";
import {
  toPatientListDTO,
  toPatientDetailDTO,
  toAdmissionDTO,
  fromFormDTO,
} from "@/core/application/dtos/PatientDTO";
import type { PatientListParams, PaginatedResponse } from "@/core/domain/entities/Patient";

/**
 * Paginated patient list result
 */
export interface PaginatedPatientResult {
  data: PatientListDTO[];
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
}

/**
 * Patient search result
 */
export interface PatientSearchResult {
  total: number;
  data: PatientListDTO[];
}

/**
 * Patient Management Service
 * Handles business logic for patient operations
 */
export class PatientManagementService {
  constructor(private readonly patientRepository: IPatientRepository) {}

  /**
   * List patients with pagination and filters
   */
  async listPatients(params?: PatientListParams): Promise<PaginatedPatientResult> {
    const result = await this.patientRepository.fetchAll(params);

    return {
      data: result.data.map(toPatientListDTO),
      currentPage: result.current_page,
      lastPage: result.last_page,
      perPage: result.per_page,
      total: result.total,
    };
  }

  /**
   * Search patients by name, NRC, or phone
   */
  async searchPatients(query: string): Promise<PatientSearchResult> {
    if (!query.trim() || query.trim().length < 2) {
      return { total: 0, data: [] };
    }

    const result = await this.patientRepository.search(query);

    return {
      total: result.total,
      data: result.data.map(toPatientListDTO),
    };
  }

  /**
   * Get patient details by ID
   */
  async getPatientById(id: number): Promise<PatientDetailDTO> {
    const patient = await this.patientRepository.getById(id);
    return toPatientDetailDTO(patient);
  }

  /**
   * Create a new patient
   */
  async createPatient(formData: PatientFormDTO): Promise<PatientListDTO> {
    const createData = fromFormDTO(formData);
    const patient = await this.patientRepository.create(createData);
    return toPatientListDTO(patient);
  }

  /**
   * Update an existing patient
   */
  async updatePatient(id: number, formData: PatientFormDTO): Promise<PatientDetailDTO> {
    const updateData = fromFormDTO(formData);
    const patient = await this.patientRepository.update(id, updateData);
    return toPatientDetailDTO(patient);
  }

  /**
   * Get patient admission history
   */
  async getPatientAdmissions(patientId: number): Promise<AdmissionDTO[]> {
    const admissions = await this.patientRepository.getAdmissions(patientId);
    return admissions.map(toAdmissionDTO);
  }
}
