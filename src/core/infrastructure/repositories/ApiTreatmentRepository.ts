import type { ITreatmentRepository } from "@/core/domain/repositories/ITreatmentRepository";
import type {
  Treatment,
  TreatmentListResponse,
  CreateTreatmentData,
  UpdateTreatmentData,
  TreatmentType,
  TreatmentOutcome,
  TreatmentAttachment,
  TreatmentAttachmentWithUrl,
} from "@/core/domain/entities/Treatment";
import type { StaffReference } from "@/core/domain/entities/Patient";
import { HttpClient } from "@/core/infrastructure/api/HttpClient";
import { API_ENDPOINTS } from "@/core/infrastructure/api/constants";

/**
 * API Response Types
 */
interface StaffResponse {
  id: number;
  name: string;
  email?: string;
}

interface TreatmentResponse {
  id: number;
  admission_id: number;
  patient_id: number;
  treatment_type: string;
  treatment_name: string;
  description?: string;
  notes?: string;
  medications?: string;
  dosage?: string;
  treatment_date?: string;
  treatment_time?: string;
  results?: string;
  findings?: string;
  outcome?: string;
  pre_procedure_notes?: string;
  post_procedure_notes?: string;
  complications?: string;
  attachments?: TreatmentAttachment[];
  attachment_urls?: TreatmentAttachmentWithUrl[];
  doctor_id?: number;
  nurse_id?: number;
  created_at?: string;
  updated_at?: string;
  doctor?: StaffResponse;
  nurse?: StaffResponse;
}

interface TreatmentListApiResponse {
  message: string;
  admission_id: number;
  admission_number: string;
  patient_id: number;
  patient_name: string;
  total: number;
  data: TreatmentResponse[];
}

interface TreatmentApiResponse {
  message: string;
  data: TreatmentResponse;
}

/**
 * Map staff response to domain entity
 */
function mapStaffResponse(data?: StaffResponse): StaffReference | undefined {
  if (!data) return undefined;
  return {
    id: data.id,
    name: data.name,
    email: data.email,
  };
}

/**
 * Map treatment response to domain entity
 */
function mapTreatmentResponse(data: TreatmentResponse): Treatment {
  return {
    id: data.id,
    admission_id: data.admission_id,
    patient_id: data.patient_id,
    treatment_type: data.treatment_type as TreatmentType,
    treatment_name: data.treatment_name,
    description: data.description,
    notes: data.notes,
    medications: data.medications,
    dosage: data.dosage,
    treatment_date: data.treatment_date,
    treatment_time: data.treatment_time,
    results: data.results,
    findings: data.findings,
    outcome: data.outcome as TreatmentOutcome | undefined,
    pre_procedure_notes: data.pre_procedure_notes,
    post_procedure_notes: data.post_procedure_notes,
    complications: data.complications,
    attachments: data.attachments,
    attachment_urls: data.attachment_urls,
    doctor_id: data.doctor_id,
    nurse_id: data.nurse_id,
    created_at: data.created_at,
    updated_at: data.updated_at,
    doctor: mapStaffResponse(data.doctor),
    nurse: mapStaffResponse(data.nurse),
  };
}

/**
 * API Treatment Repository Implementation
 */
export class ApiTreatmentRepository implements ITreatmentRepository {
  constructor(private readonly http: HttpClient) {}

  /**
   * Get all treatment records for an admission
   */
  async fetchAll(admissionId: number): Promise<TreatmentListResponse> {
    const { data } = await this.http.get<TreatmentListApiResponse>(
      API_ENDPOINTS.TREATMENTS.LIST(admissionId)
    );

    return {
      admission_id: data.admission_id,
      admission_number: data.admission_number,
      patient_id: data.patient_id,
      patient_name: data.patient_name,
      total: data.total,
      data: data.data.map(mapTreatmentResponse),
    };
  }

  /**
   * Get a specific treatment record
   */
  async getById(admissionId: number, treatmentId: number): Promise<Treatment> {
    const { data } = await this.http.get<TreatmentApiResponse>(
      API_ENDPOINTS.TREATMENTS.GET(admissionId, treatmentId)
    );

    return mapTreatmentResponse(data.data);
  }

  /**
   * Create a new treatment record
   */
  async create(
    admissionId: number,
    treatmentData: CreateTreatmentData,
    attachments?: File[]
  ): Promise<Treatment> {
    let requestData: CreateTreatmentData | FormData = treatmentData;

    // If attachments are provided, use FormData with individual fields
    if (attachments && attachments.length > 0) {
      const formData = new FormData();

      // Add treatment data as individual form fields
      Object.entries(treatmentData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // Add attachments
      attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file);
      });

      requestData = formData;
    }

    const { data } = await this.http.post<TreatmentApiResponse>(
      API_ENDPOINTS.TREATMENTS.CREATE(admissionId),
      requestData
    );

    return mapTreatmentResponse(data.data);
  }

  /**
   * Update an existing treatment record
   */
  async update(
    admissionId: number,
    treatmentId: number,
    treatmentData: UpdateTreatmentData,
    attachments?: File[]
  ): Promise<Treatment> {
    // If attachments are provided, use FormData with POST + _method spoofing
    // Laravel requires POST method for file uploads (PATCH doesn't populate $_FILES)
    if (attachments && attachments.length > 0) {
      const formData = new FormData();

      // Add Laravel method spoofing for PATCH
      formData.append("_method", "PATCH");

      // Add treatment data as individual form fields
      Object.entries(treatmentData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // Add attachments
      attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file);
      });

      // Use POST with _method: PATCH for file uploads (Laravel requirement)
      const { data } = await this.http.post<TreatmentApiResponse>(
        API_ENDPOINTS.TREATMENTS.UPDATE(admissionId, treatmentId),
        formData
      );

      return mapTreatmentResponse(data.data);
    }

    // No attachments - use regular PATCH
    const { data } = await this.http.patch<TreatmentApiResponse>(
      API_ENDPOINTS.TREATMENTS.UPDATE(admissionId, treatmentId),
      treatmentData
    );

    return mapTreatmentResponse(data.data);
  }

  /**
   * Remove an attachment from a treatment record
   */
  async removeAttachment(
    admissionId: number,
    treatmentId: number,
    filename: string
  ): Promise<void> {
    await this.http.delete(
      API_ENDPOINTS.TREATMENTS.REMOVE_ATTACHMENT(
        admissionId,
        treatmentId,
        filename
      )
    );
  }
}
