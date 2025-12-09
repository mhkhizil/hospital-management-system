import type {
  Treatment,
  TreatmentListResponse,
  CreateTreatmentData,
  UpdateTreatmentData,
} from "../entities/Treatment";

/**
 * Treatment Repository Interface
 * Defines the contract for treatment data operations
 */
export interface ITreatmentRepository {
  /**
   * Get all treatment records for an admission
   */
  fetchAll(admissionId: number): Promise<TreatmentListResponse>;

  /**
   * Get a specific treatment record
   */
  getById(admissionId: number, treatmentId: number): Promise<Treatment>;

  /**
   * Create a new treatment record
   */
  create(admissionId: number, data: CreateTreatmentData): Promise<Treatment>;

  /**
   * Update an existing treatment record
   */
  update(
    admissionId: number,
    treatmentId: number,
    data: UpdateTreatmentData
  ): Promise<Treatment>;
}



