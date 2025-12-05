import type {
  Patient,
  Admission,
  PatientSex,
  BloodType,
  MaritalStatus,
  AdmissionType,
  BillingStatus,
  DischargeType,
  DischargeStatus,
} from "@/core/domain/entities/Patient";

/**
 * Full Admission DTO with all details
 */
export interface AdmissionDTO {
  id: number;
  patient_id?: number;
  admission_type?: AdmissionType;
  admission_number: string;
  admission_date?: string;
  admission_time?: string;
  present_address?: string;
  admitted_for?: string;
  referred_by?: string;
  police_case?: string;
  service?: string;
  ward?: string;
  bed_number?: string;
  medical_officer?: string;
  initial_diagnosis?: string;
  drug_allergy_noted?: string;
  remarks?: string;
  // Discharge info
  discharge_date?: string;
  discharge_time?: string;
  discharge_diagnosis?: string;
  other_diagnosis?: string;
  external_cause_of_injury?: string;
  clinician_summary?: string;
  surgical_procedure?: string;
  discharge_type?: DischargeType;
  discharge_status?: DischargeStatus;
  discharge_instructions?: string;
  follow_up_instructions?: string;
  follow_up_date?: string;
  // Death info
  cause_of_death?: string;
  autopsy?: string;
  time_of_death?: string;
  // Sign-off
  certified_by?: string;
  approved_by?: string;
  attending_doctor_name?: string;
  // Status
  status: string;
  billing_status?: BillingStatus;
  // Timestamps
  created_at?: string;
  updated_at?: string;
  // Staff
  doctor_id?: number;
  doctor_name?: string;
  doctor_email?: string;
  nurse_id?: number;
  nurse_name?: string;
  nurse_email?: string;
  // Related counts
  treatment_records_count?: number;
}

/**
 * Patient DTO for list display
 */
export interface PatientListDTO {
  id: number;
  name: string;
  nrc_number: string | null;
  age: number | null;
  sex: string | null;
  contact_phone: string | null;
  admissions_count: number;
  is_currently_admitted: boolean;
  current_admission?: AdmissionDTO;
}

/**
 * Patient DTO for detailed view
 */
export interface PatientDetailDTO {
  id: number;
  name: string;
  nrc_number: string | null;
  age: number | null;
  sex: PatientSex | null;
  dob: string | null;
  contact_phone: string | null;
  permanent_address: string | null;
  marital_status: MaritalStatus | null;
  ethnic_group: string | null;
  religion: string | null;
  occupation: string | null;
  father_name: string | null;
  mother_name: string | null;
  nearest_relative_name: string | null;
  nearest_relative_phone: string | null;
  relationship: string | null;
  blood_type: BloodType | null;
  known_allergies: string | null;
  chronic_conditions: string | null;
  admissions_count: number;
  admissions: AdmissionDTO[];
  is_currently_admitted: boolean;
  created_at: string | null;
  updated_at: string | null;
}

/**
 * Patient form data for create/edit
 */
export interface PatientFormDTO {
  name: string;
  nrc_number?: string;
  sex?: PatientSex;
  age?: number;
  dob?: string;
  contact_phone?: string;
  permanent_address?: string;
  marital_status?: MaritalStatus;
  ethnic_group?: string;
  religion?: string;
  occupation?: string;
  father_name?: string;
  mother_name?: string;
  nearest_relative_name?: string;
  nearest_relative_phone?: string;
  relationship?: string;
  blood_type?: BloodType;
  known_allergies?: string;
  chronic_conditions?: string;
}

/**
 * Convert Admission entity to DTO with all fields
 */
export const toAdmissionDTO = (admission: Admission): AdmissionDTO => ({
  id: admission.id,
  patient_id: admission.patient_id,
  admission_type: admission.admission_type,
  admission_number: admission.admission_number,
  admission_date: admission.admission_date,
  admission_time: admission.admission_time,
  present_address: admission.present_address,
  admitted_for: admission.admitted_for,
  referred_by: admission.referred_by,
  police_case: admission.police_case,
  service: admission.service,
  ward: admission.ward,
  bed_number: admission.bed_number,
  medical_officer: admission.medical_officer,
  initial_diagnosis: admission.initial_diagnosis,
  drug_allergy_noted: admission.drug_allergy_noted,
  remarks: admission.remarks,
  // Discharge info
  discharge_date: admission.discharge_date,
  discharge_time: admission.discharge_time,
  discharge_diagnosis: admission.discharge_diagnosis,
  other_diagnosis: admission.other_diagnosis,
  external_cause_of_injury: admission.external_cause_of_injury,
  clinician_summary: admission.clinician_summary,
  surgical_procedure: admission.surgical_procedure,
  discharge_type: admission.discharge_type,
  discharge_status: admission.discharge_status,
  discharge_instructions: admission.discharge_instructions,
  follow_up_instructions: admission.follow_up_instructions,
  follow_up_date: admission.follow_up_date,
  // Death info
  cause_of_death: admission.cause_of_death,
  autopsy: admission.autopsy,
  time_of_death: admission.time_of_death,
  // Sign-off
  certified_by: admission.certified_by,
  approved_by: admission.approved_by,
  attending_doctor_name: admission.attending_doctor_name,
  // Status
  status: admission.status,
  billing_status: admission.billing_status,
  // Timestamps
  created_at: admission.created_at,
  updated_at: admission.updated_at,
  // Staff
  doctor_id: admission.doctor_id,
  doctor_name: admission.doctor?.name,
  doctor_email: admission.doctor?.email,
  nurse_id: admission.nurse_id,
  nurse_name: admission.nurse?.name,
  nurse_email: admission.nurse?.email,
  // Related counts
  treatment_records_count: admission.treatment_records_count,
});

/**
 * Convert Patient entity to list DTO
 */
export const toPatientListDTO = (patient: Patient): PatientListDTO => {
  const currentAdmission = patient.getCurrentAdmission();

  return {
    id: patient.id,
    name: patient.name,
    nrc_number: patient.nrc_number,
    age: patient.age,
    sex: patient.getDisplaySex(),
    contact_phone: patient.contact_phone,
    admissions_count: patient.admissions_count,
    is_currently_admitted: patient.is_currently_admitted,
    current_admission: currentAdmission ? toAdmissionDTO(currentAdmission) : undefined,
  };
};

/**
 * Convert Patient entity to detail DTO
 */
export const toPatientDetailDTO = (patient: Patient): PatientDetailDTO => ({
  id: patient.id,
  name: patient.name,
  nrc_number: patient.nrc_number,
  age: patient.age,
  sex: patient.sex,
  dob: patient.dob,
  contact_phone: patient.contact_phone,
  permanent_address: patient.permanent_address,
  marital_status: patient.marital_status,
  ethnic_group: patient.ethnic_group,
  religion: patient.religion,
  occupation: patient.occupation,
  father_name: patient.father_name,
  mother_name: patient.mother_name,
  nearest_relative_name: patient.nearest_relative_name,
  nearest_relative_phone: patient.nearest_relative_phone,
  relationship: patient.relationship,
  blood_type: patient.blood_type,
  known_allergies: patient.known_allergies,
  chronic_conditions: patient.chronic_conditions,
  admissions_count: patient.admissions_count,
  admissions: patient.admissions.map(toAdmissionDTO),
  is_currently_admitted: patient.is_currently_admitted,
  created_at: patient.created_at,
  updated_at: patient.updated_at,
});

/**
 * Convert form DTO to create patient data
 */
export const fromFormDTO = (form: PatientFormDTO) => ({
  name: form.name,
  ...(form.nrc_number && { nrc_number: form.nrc_number }),
  ...(form.sex && { sex: form.sex }),
  ...(form.age && { age: form.age }),
  ...(form.dob && { dob: form.dob }),
  ...(form.contact_phone && { contact_phone: form.contact_phone }),
  ...(form.permanent_address && { permanent_address: form.permanent_address }),
  ...(form.marital_status && { marital_status: form.marital_status }),
  ...(form.ethnic_group && { ethnic_group: form.ethnic_group }),
  ...(form.religion && { religion: form.religion }),
  ...(form.occupation && { occupation: form.occupation }),
  ...(form.father_name && { father_name: form.father_name }),
  ...(form.mother_name && { mother_name: form.mother_name }),
  ...(form.nearest_relative_name && { nearest_relative_name: form.nearest_relative_name }),
  ...(form.nearest_relative_phone && { nearest_relative_phone: form.nearest_relative_phone }),
  ...(form.relationship && { relationship: form.relationship }),
  ...(form.blood_type && { blood_type: form.blood_type }),
  ...(form.known_allergies && { known_allergies: form.known_allergies }),
  ...(form.chronic_conditions && { chronic_conditions: form.chronic_conditions }),
});
