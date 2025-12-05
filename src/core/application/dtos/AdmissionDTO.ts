import type {
  AdmissionWithPatient,
  AdmissionType,
  AdmissionStatus,
  DischargeType,
  DischargeStatus,
  PatientReference,
  StaffReference,
} from "@/core/domain/entities/Admission";

/**
 * Staff DTO
 */
export interface StaffDTO {
  id: number;
  name: string;
  email?: string;
}

/**
 * Patient Reference DTO
 */
export interface PatientReferenceDTO {
  id: number;
  name: string;
  nrc_number?: string;
  contact_phone?: string;
  age?: number;
  sex?: string;
}

/**
 * Treatment Record DTO
 */
export interface TreatmentRecordDTO {
  id: number;
  admission_id: number;
  patient_id: number;
  treatment_type?: string;
  treatment_name?: string;
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
  doctor_id?: number;
  nurse_id?: number;
  created_at?: string;
  updated_at?: string;
  doctor?: StaffDTO;
  nurse?: StaffDTO;
}

/**
 * Admission List DTO (for table display)
 */
export interface AdmissionListDTO {
  id: number;
  admission_number: string;
  admission_type: AdmissionType;
  admission_date: string;
  admission_time?: string;
  admitted_for: string;
  status: AdmissionStatus;
  ward?: string;
  bed_number?: string;
  service?: string;
  patient?: PatientReferenceDTO;
  doctor?: StaffDTO;
  nurse?: StaffDTO;
  created_at?: string;
}

/**
 * Admission Detail DTO (full details)
 */
export interface AdmissionDetailDTO {
  id: number;
  patient_id?: number;
  admission_type: AdmissionType;
  admission_number: string;
  admission_date: string;
  admission_time?: string;
  admitted_for: string;
  status: AdmissionStatus;
  billing_status?: string;
  // Location
  present_address?: string;
  ward?: string;
  bed_number?: string;
  service?: string;
  // Referral
  referred_by?: string;
  police_case?: string;
  medical_officer?: string;
  // Initial Assessment
  initial_diagnosis?: string;
  drug_allergy_noted?: string;
  remarks?: string;
  // Discharge Info
  discharge_date?: string;
  discharge_time?: string;
  discharge_type?: DischargeType;
  discharge_status?: DischargeStatus;
  discharge_diagnosis?: string;
  other_diagnosis?: string;
  external_cause_of_injury?: string;
  clinician_summary?: string;
  surgical_procedure?: string;
  discharge_instructions?: string;
  follow_up_instructions?: string;
  follow_up_date?: string;
  // Death Info
  cause_of_death?: string;
  autopsy?: string;
  time_of_death?: string;
  // Certification
  certified_by?: string;
  approved_by?: string;
  attending_doctor_name?: string;
  attending_doctor_signature?: string;
  // Timestamps
  created_at?: string;
  updated_at?: string;
  // Related
  patient?: PatientReferenceDTO;
  doctor?: StaffDTO;
  nurse?: StaffDTO;
  doctor_id?: number;
  nurse_id?: number;
  length_of_stay?: number;
  treatment_records_count?: number;
  treatment_records?: TreatmentRecordDTO[];
}

/**
 * Admission Form DTO (for create/edit forms)
 */
export interface AdmissionFormDTO {
  admission_type?: AdmissionType;
  admission_date: string;
  admission_time?: string;
  admitted_for: string;
  doctor_id?: number;
  nurse_id?: number;
  present_address?: string;
  referred_by?: string;
  police_case?: string;
  service?: string;
  ward?: string;
  bed_number?: string;
  medical_officer?: string;
  initial_diagnosis?: string;
  drug_allergy_noted?: string;
  remarks?: string;
}

/**
 * Discharge Form DTO
 */
export interface DischargeFormDTO {
  discharge_type: DischargeType;
  discharge_status: DischargeStatus;
  discharge_diagnosis?: string;
  clinician_summary?: string;
  discharge_instructions?: string;
  follow_up_instructions?: string;
  follow_up_date?: string;
}

/**
 * Convert to Inpatient Form DTO
 */
export interface ConvertToInpatientFormDTO {
  ward: string;
  bed_number?: string;
  admission_time?: string;
  remarks?: string;
}

/**
 * Confirm Death Form DTO
 */
export interface ConfirmDeathFormDTO {
  cause_of_death: string;
  autopsy?: string;
  time_of_death?: string;
  certified_by?: string;
}

/**
 * Map AdmissionWithPatient to AdmissionListDTO
 */
export function toAdmissionListDTO(admission: AdmissionWithPatient): AdmissionListDTO {
  return {
    id: admission.id,
    admission_number: admission.admission_number,
    admission_type: admission.admission_type ?? "inpatient",
    admission_date: admission.admission_date ?? "",
    admission_time: admission.admission_time,
    admitted_for: admission.admitted_for ?? "",
    status: admission.status,
    ward: admission.ward,
    bed_number: admission.bed_number,
    service: admission.service,
    patient: admission.patient ? {
      id: admission.patient.id,
      name: admission.patient.name,
      nrc_number: admission.patient.nrc_number,
      contact_phone: admission.patient.contact_phone,
      age: admission.patient.age,
      sex: admission.patient.sex,
    } : undefined,
    doctor: admission.doctor ? {
      id: admission.doctor.id,
      name: admission.doctor.name,
      email: admission.doctor.email,
    } : undefined,
    nurse: admission.nurse ? {
      id: admission.nurse.id,
      name: admission.nurse.name,
      email: admission.nurse.email,
    } : undefined,
    created_at: admission.created_at,
  };
}

/**
 * Map AdmissionWithPatient to AdmissionDetailDTO
 */
export function toAdmissionDetailDTO(admission: AdmissionWithPatient): AdmissionDetailDTO {
  return {
    id: admission.id,
    patient_id: admission.patient_id,
    admission_type: admission.admission_type ?? "inpatient",
    admission_number: admission.admission_number,
    admission_date: admission.admission_date ?? "",
    admission_time: admission.admission_time,
    admitted_for: admission.admitted_for ?? "",
    status: admission.status,
    billing_status: admission.billing_status,
    present_address: admission.present_address,
    ward: admission.ward,
    bed_number: admission.bed_number,
    service: admission.service,
    referred_by: admission.referred_by,
    police_case: admission.police_case,
    medical_officer: admission.medical_officer,
    initial_diagnosis: admission.initial_diagnosis,
    drug_allergy_noted: admission.drug_allergy_noted,
    remarks: admission.remarks,
    discharge_date: admission.discharge_date,
    discharge_time: admission.discharge_time,
    discharge_type: admission.discharge_type,
    discharge_status: admission.discharge_status,
    discharge_diagnosis: admission.discharge_diagnosis,
    other_diagnosis: admission.other_diagnosis,
    external_cause_of_injury: admission.external_cause_of_injury,
    clinician_summary: admission.clinician_summary,
    surgical_procedure: admission.surgical_procedure,
    discharge_instructions: admission.discharge_instructions,
    follow_up_instructions: admission.follow_up_instructions,
    follow_up_date: admission.follow_up_date,
    cause_of_death: admission.cause_of_death,
    autopsy: admission.autopsy,
    time_of_death: admission.time_of_death,
    certified_by: admission.certified_by,
    approved_by: admission.approved_by,
    attending_doctor_name: admission.attending_doctor_name,
    attending_doctor_signature: admission.attending_doctor_signature,
    created_at: admission.created_at,
    updated_at: admission.updated_at,
    patient: admission.patient ? {
      id: admission.patient.id,
      name: admission.patient.name,
      nrc_number: admission.patient.nrc_number,
      contact_phone: admission.patient.contact_phone,
      age: admission.patient.age,
      sex: admission.patient.sex,
    } : undefined,
    doctor: admission.doctor ? {
      id: admission.doctor.id,
      name: admission.doctor.name,
      email: admission.doctor.email,
    } : undefined,
    nurse: admission.nurse ? {
      id: admission.nurse.id,
      name: admission.nurse.name,
      email: admission.nurse.email,
    } : undefined,
    doctor_id: admission.doctor_id,
    nurse_id: admission.nurse_id,
    length_of_stay: admission.length_of_stay,
    treatment_records_count: admission.treatment_records_count,
    treatment_records: admission.treatment_records?.map((tr) => ({
      id: tr.id,
      admission_id: tr.admission_id,
      patient_id: tr.patient_id,
      treatment_type: tr.treatment_type,
      treatment_name: tr.treatment_name,
      description: tr.description,
      notes: tr.notes,
      medications: tr.medications,
      dosage: tr.dosage,
      treatment_date: tr.treatment_date,
      treatment_time: tr.treatment_time,
      results: tr.results,
      findings: tr.findings,
      outcome: tr.outcome,
      pre_procedure_notes: tr.pre_procedure_notes,
      post_procedure_notes: tr.post_procedure_notes,
      complications: tr.complications,
      doctor_id: tr.doctor_id,
      nurse_id: tr.nurse_id,
      created_at: tr.created_at,
      updated_at: tr.updated_at,
      doctor: tr.doctor ? {
        id: tr.doctor.id,
        name: tr.doctor.name,
        email: tr.doctor.email,
      } : undefined,
      nurse: tr.nurse ? {
        id: tr.nurse.id,
        name: tr.nurse.name,
        email: tr.nurse.email,
      } : undefined,
    })),
  };
}

