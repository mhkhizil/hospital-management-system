import type {
  TreatmentListResponse,
  Treatment,
  CreateTreatmentData,
  UpdateTreatmentData,
} from "../entities/Treatment";

/**
 * Treatment Service Interface
 * Defines the contract for treatment business logic
 */
export interface ITreatmentService {
  /**
   * List all treatment records for an admission
   */
  listTreatments(admissionId: number): Promise<TreatmentListResponse>;

  /**
   * Get treatment record details
   */
  getTreatmentById(
    admissionId: number,
    treatmentId: number
  ): Promise<Treatment>;

  /**
   * Create a new treatment record
   */
  createTreatment(
    admissionId: number,
    data: CreateTreatmentData
  ): Promise<Treatment>;

  /**
   * Update an existing treatment record
   */
  updateTreatment(
    admissionId: number,
    treatmentId: number,
    data: UpdateTreatmentData
  ): Promise<Treatment>;
}
