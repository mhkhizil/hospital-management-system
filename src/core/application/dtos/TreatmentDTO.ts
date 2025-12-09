import type {
  Treatment,
  TreatmentListResponse,
  TreatmentType,
  TreatmentOutcome,
} from "@/core/domain/entities/Treatment";
import type { StaffDTO } from "./StaffDTO";

/**
 * Treatment List DTO - For display in lists
 */
export interface TreatmentListDTO {
  id: number;
  admission_id: number;
  patient_id: number;
  treatment_type: TreatmentType;
  treatment_name: string;
  description?: string;
  treatment_date?: string;
  treatment_time?: string;
  outcome?: TreatmentOutcome;
  doctor?: StaffDTO;
  nurse?: StaffDTO;
  created_at?: string;
}

/**
 * Treatment Detail DTO - Full treatment details
 */
export interface TreatmentDetailDTO {
  id: number;
  admission_id: number;
  patient_id: number;
  treatment_type: TreatmentType;
  treatment_name: string;
  description?: string;
  notes?: string;
  medications?: string;
  dosage?: string;
  treatment_date?: string;
  treatment_time?: string;
  results?: string;
  findings?: string;
  outcome?: TreatmentOutcome;
  pre_procedure_notes?: string;
  post_procedure_notes?: string;
  complications?: string;
  doctor?: StaffDTO;
  nurse?: StaffDTO;
  created_at?: string;
  updated_at?: string;
}

/**
 * Treatment List Response DTO
 */
export interface TreatmentListResponseDTO {
  admission_id: number;
  admission_number: string;
  patient_id: number;
  patient_name: string;
  total: number;
  data: TreatmentListDTO[];
}

/**
 * Treatment Form DTO - For create/update forms
 */
export interface TreatmentFormDTO {
  treatment_type: TreatmentType;
  treatment_name: string;
  description?: string;
  notes?: string;
  medications?: string;
  dosage?: string;
  treatment_date?: string;
  treatment_time?: string;
  results?: string;
  findings?: string;
  outcome?: TreatmentOutcome;
  pre_procedure_notes?: string;
  post_procedure_notes?: string;
  complications?: string;
  doctor_id?: number;
  nurse_id?: number;
}

/**
 * Map Treatment to TreatmentListDTO
 */
export function toTreatmentListDTO(treatment: Treatment): TreatmentListDTO {
  return {
    id: treatment.id,
    admission_id: treatment.admission_id,
    patient_id: treatment.patient_id,
    treatment_type: treatment.treatment_type,
    treatment_name: treatment.treatment_name,
    description: treatment.description,
    treatment_date: treatment.treatment_date,
    treatment_time: treatment.treatment_time,
    outcome: treatment.outcome,
    doctor: treatment.doctor
      ? { id: treatment.doctor.id, name: treatment.doctor.name, email: treatment.doctor.email }
      : undefined,
    nurse: treatment.nurse
      ? { id: treatment.nurse.id, name: treatment.nurse.name, email: treatment.nurse.email }
      : undefined,
    created_at: treatment.created_at,
  };
}

/**
 * Map Treatment to TreatmentDetailDTO
 */
export function toTreatmentDetailDTO(treatment: Treatment): TreatmentDetailDTO {
  return {
    id: treatment.id,
    admission_id: treatment.admission_id,
    patient_id: treatment.patient_id,
    treatment_type: treatment.treatment_type,
    treatment_name: treatment.treatment_name,
    description: treatment.description,
    notes: treatment.notes,
    medications: treatment.medications,
    dosage: treatment.dosage,
    treatment_date: treatment.treatment_date,
    treatment_time: treatment.treatment_time,
    results: treatment.results,
    findings: treatment.findings,
    outcome: treatment.outcome,
    pre_procedure_notes: treatment.pre_procedure_notes,
    post_procedure_notes: treatment.post_procedure_notes,
    complications: treatment.complications,
    doctor: treatment.doctor
      ? { id: treatment.doctor.id, name: treatment.doctor.name, email: treatment.doctor.email }
      : undefined,
    nurse: treatment.nurse
      ? { id: treatment.nurse.id, name: treatment.nurse.name, email: treatment.nurse.email }
      : undefined,
    created_at: treatment.created_at,
    updated_at: treatment.updated_at,
  };
}

/**
 * Map TreatmentListResponse to TreatmentListResponseDTO
 */
export function toTreatmentListResponseDTO(
  response: TreatmentListResponse
): TreatmentListResponseDTO {
  return {
    admission_id: response.admission_id,
    admission_number: response.admission_number,
    patient_id: response.patient_id,
    patient_name: response.patient_name,
    total: response.total,
    data: response.data.map(toTreatmentListDTO),
  };
}

/**
 * Map TreatmentFormDTO to CreateTreatmentData
 */
export function fromTreatmentFormDTO(dto: TreatmentFormDTO) {
  return {
    treatment_type: dto.treatment_type,
    treatment_name: dto.treatment_name,
    description: dto.description || undefined,
    notes: dto.notes || undefined,
    medications: dto.medications || undefined,
    dosage: dto.dosage || undefined,
    treatment_date: dto.treatment_date || undefined,
    treatment_time: dto.treatment_time || undefined,
    results: dto.results || undefined,
    findings: dto.findings || undefined,
    outcome: dto.outcome || undefined,
    pre_procedure_notes: dto.pre_procedure_notes || undefined,
    post_procedure_notes: dto.post_procedure_notes || undefined,
    complications: dto.complications || undefined,
    doctor_id: dto.doctor_id || undefined,
    nurse_id: dto.nurse_id || undefined,
  };
}



