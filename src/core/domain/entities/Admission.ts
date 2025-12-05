import type {
  Admission,
  AdmissionType,
  AdmissionStatus,
  DischargeType,
  DischargeStatus,
  AutopsyStatus,
  PoliceCase,
  StaffReference,
} from "./Patient";

// Re-export types for convenience
export type {
  Admission,
  AdmissionType,
  AdmissionStatus,
  DischargeType,
  DischargeStatus,
  AutopsyStatus,
  PoliceCase,
  StaffReference,
};

/**
 * Patient Reference (minimal patient info for admission context)
 */
export interface PatientReference {
  id: number;
  name: string;
  nrc_number?: string;
  contact_phone?: string;
  age?: number;
  sex?: string;
}

/**
 * Admission with Patient info
 */
export interface AdmissionWithPatient extends Admission {
  patient?: PatientReference;
  length_of_stay?: number;
  treatment_records?: TreatmentRecord[];
}

/**
 * Treatment Record (re-export from Patient entity)
 */
export type { TreatmentRecord } from "./Patient";

/**
 * Create Admission Request Data
 */
export interface CreateAdmissionData {
  admission_type?: AdmissionType;
  admission_date: string;
  admission_time?: string;
  admitted_for: string;
  doctor_id?: number;
  nurse_id?: number;
  present_address?: string;
  referred_by?: string;
  police_case?: PoliceCase;
  service?: string;
  ward?: string; // Required for inpatient, blocked for outpatient
  bed_number?: string; // Optional for inpatient, blocked for outpatient
  medical_officer?: string;
  initial_diagnosis?: string;
  drug_allergy_noted?: string;
  remarks?: string;
}

/**
 * Update Admission Request Data
 */
export interface UpdateAdmissionData {
  // Staff Assignment (Root/Admission only)
  doctor_id?: number;
  nurse_id?: number;
  // Admission Details (Root/Admission only)
  admission_date?: string;
  admission_time?: string;
  present_address?: string;
  admitted_for?: string;
  referred_by?: string;
  police_case?: PoliceCase;
  service?: string;
  ward?: string;
  bed_number?: string;
  medical_officer?: string;
  // Medical Assessment (Root/Admission/Doctor)
  initial_diagnosis?: string;
  drug_allergy_noted?: string;
  remarks?: string;
  clinician_summary?: string;
  surgical_procedure?: string;
  other_diagnosis?: string;
  external_cause_of_injury?: string;
  discharge_diagnosis?: string;
  // Follow-up Information (Root/Admission/Doctor)
  discharge_instructions?: string;
  follow_up_instructions?: string;
  follow_up_date?: string;
  // Certification (Root/Admission/Doctor)
  attending_doctor_name?: string;
  attending_doctor_signature?: string;
}

/**
 * Convert to Inpatient Request Data
 */
export interface ConvertToInpatientData {
  ward: string;
  bed_number?: string;
  admission_time?: string;
  remarks?: string;
}

/**
 * Discharge Patient Request Data
 */
export interface DischargeData {
  discharge_type: DischargeType;
  discharge_status: DischargeStatus;
  discharge_diagnosis?: string;
  clinician_summary?: string;
  discharge_instructions?: string;
  follow_up_instructions?: string;
  follow_up_date?: string;
}

/**
 * Confirm Death Request Data
 */
export interface ConfirmDeathData {
  cause_of_death: string;
  autopsy?: AutopsyStatus;
  time_of_death?: string;
  certified_by?: string;
}

/**
 * Admission Statistics
 */
export interface AdmissionStatistics {
  total_admissions: number;
  currently_admitted: number;
  currently_admitted_inpatient: number;
  currently_admitted_outpatient: number;
  discharged_this_month: number;
  admissions_this_month: number;
  by_status: {
    admitted: number;
    discharged: number;
    deceased: number;
    transferred: number;
  };
  by_type: {
    inpatient: number;
    outpatient: number;
  };
}

/**
 * Admission List Query Parameters
 */
export interface AdmissionListParams {
  patient_id?: number;
  status?: AdmissionStatus;
  admission_type?: AdmissionType;
  per_page?: number;
  page?: number;
}

