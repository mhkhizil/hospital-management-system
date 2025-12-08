import type { ITreatmentRepository } from "@/core/domain/repositories/ITreatmentRepository";
import type { ITreatmentService } from "@/core/domain/services/ITreatmentService";
import type {
  CreateTreatmentData,
  UpdateTreatmentData,
} from "@/core/domain/entities/Treatment";
import type {
  TreatmentListResponseDTO,
  TreatmentDetailDTO,
  TreatmentFormDTO,
} from "@/core/application/dtos/TreatmentDTO";
import {
  toTreatmentListResponseDTO,
  toTreatmentDetailDTO,
  fromTreatmentFormDTO,
} from "@/core/application/dtos/TreatmentDTO";

/**
 * Treatment Management Service
 * Implements business logic for treatment operations
 */
export class TreatmentManagementService implements ITreatmentService {
  constructor(private readonly repository: ITreatmentRepository) {}

  /**
   * List all treatment records for an admission
   */
  async listTreatments(admissionId: number): Promise<TreatmentListResponseDTO> {
    const response = await this.repository.fetchAll(admissionId);
    return toTreatmentListResponseDTO(response);
  }

  /**
   * Get treatment record details
   */
  async getTreatmentById(
    admissionId: number,
    treatmentId: number
  ): Promise<TreatmentDetailDTO> {
    const treatment = await this.repository.getById(admissionId, treatmentId);
    return toTreatmentDetailDTO(treatment);
  }

  /**
   * Create a new treatment record
   */
  async createTreatment(
    admissionId: number,
    formData: TreatmentFormDTO
  ): Promise<TreatmentDetailDTO> {
    const createData = fromTreatmentFormDTO(formData) as CreateTreatmentData;
    const treatment = await this.repository.create(admissionId, createData);
    return toTreatmentDetailDTO(treatment);
  }

  /**
   * Update an existing treatment record
   */
  async updateTreatment(
    admissionId: number,
    treatmentId: number,
    formData: Partial<TreatmentFormDTO>
  ): Promise<TreatmentDetailDTO> {
    const updateData = fromTreatmentFormDTO(
      formData as TreatmentFormDTO
    ) as UpdateTreatmentData;
    const treatment = await this.repository.update(
      admissionId,
      treatmentId,
      updateData
    );
    return toTreatmentDetailDTO(treatment);
  }
}
