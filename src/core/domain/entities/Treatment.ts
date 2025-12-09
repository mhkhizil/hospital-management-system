import type { StaffReference } from "./Patient";

/**
 * Treatment Types
 */
export type TreatmentType =
  | "surgery"
  | "radiotherapy"
  | "chemotherapy"
  | "targeted_therapy"
  | "hormone_therapy"
  | "immunotherapy"
  | "intervention_therapy"
  | "medication"
  | "physical_therapy"
  | "supportive_care"
  | "diagnostic"
  | "consultation"
  | "procedure"
  | "other";

/**
 * Treatment Outcomes
 */
export type TreatmentOutcome =
  | "pending"
  | "successful"
  | "partial"
  | "unsuccessful"
  | "ongoing"
  | "completed";

/**
 * Treatment Record Entity
 */
export interface Treatment {
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
  doctor_id?: number;
  nurse_id?: number;
  created_at?: string;
  updated_at?: string;
  doctor?: StaffReference;
  nurse?: StaffReference;
}

/**
 * Treatment List Response Metadata
 */
export interface TreatmentListMeta {
  admission_id: number;
  admission_number: string;
  patient_id: number;
  patient_name: string;
  total: number;
}

/**
 * Treatment List Response
 */
export interface TreatmentListResponse extends TreatmentListMeta {
  data: Treatment[];
}

/**
 * Create Treatment Data
 */
export interface CreateTreatmentData {
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
 * Update Treatment Data
 */
export interface UpdateTreatmentData {
  treatment_type?: TreatmentType;
  treatment_name?: string;
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
 * Treatment Type Option
 */
export interface TreatmentTypeOption {
  value: TreatmentType;
  label: string;
}

/**
 * Treatment Outcome Option
 */
export interface TreatmentOutcomeOption {
  value: TreatmentOutcome;
  label: string;
}

/**
 * Treatment Type Options for UI
 */
export const TREATMENT_TYPES: TreatmentTypeOption[] = [
  { value: "surgery", label: "Surgery" },
  { value: "radiotherapy", label: "Radiotherapy" },
  { value: "chemotherapy", label: "Chemotherapy" },
  { value: "targeted_therapy", label: "Targeted Therapy" },
  { value: "hormone_therapy", label: "Hormone Therapy" },
  { value: "immunotherapy", label: "Immunotherapy" },
  { value: "intervention_therapy", label: "Intervention Therapy" },
  { value: "medication", label: "Medication" },
  { value: "physical_therapy", label: "Physical Therapy" },
  { value: "supportive_care", label: "Supportive Care" },
  { value: "diagnostic", label: "Diagnostic" },
  { value: "consultation", label: "Consultation" },
  { value: "procedure", label: "Procedure" },
  { value: "other", label: "Other" },
];

/**
 * Treatment Outcome Options for UI
 */
export const TREATMENT_OUTCOMES: TreatmentOutcomeOption[] = [
  { value: "pending", label: "Pending" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "successful", label: "Successful" },
  { value: "partial", label: "Partial Success" },
  { value: "unsuccessful", label: "Unsuccessful" },
];



