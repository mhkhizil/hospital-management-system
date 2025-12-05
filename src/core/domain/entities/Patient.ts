/**
 * Patient Sex Type
 */
export type PatientSex = "male" | "female" | "other";

/**
 * Blood Type
 */
export type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

/**
 * Marital Status
 */
export type MaritalStatus = "single" | "married" | "divorced" | "widowed" | "other";

/**
 * Admission Status
 */
export type AdmissionStatus = "admitted" | "discharged" | "transferred" | "deceased";

/**
 * Admission Type
 */
export type AdmissionType = "inpatient" | "outpatient";

/**
 * Billing Status
 */
export type BillingStatus = "pending" | "paid" | "partial";

/**
 * Discharge Type
 */
export type DischargeType = "normal" | "against_advice" | "absconded" | "transferred";

/**
 * Discharge Status
 */
export type DischargeStatus = "improved" | "unchanged" | "worse" | "dead";

/**
 * Autopsy Status
 */
export type AutopsyStatus = "yes" | "no" | "pending";

/**
 * Police Case
 */
export type PoliceCase = "yes" | "no";

/**
 * Staff Reference (Doctor/Nurse)
 */
export interface StaffReference {
  id: number;
  name: string;
  email?: string;
}

/**
 * Doctor Reference (alias for compatibility)
 */
export type DoctorReference = StaffReference;

/**
 * Nurse Reference (alias for compatibility)
 */
export type NurseReference = StaffReference;

/**
 * Admission Entity
 * Represents a hospital admission record with full details
 */
export interface Admission {
  id: number;
  patient_id?: number;
  admission_type?: AdmissionType;
  doctor_id?: number;
  nurse_id?: number;
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
  // Death info (if applicable)
  cause_of_death?: string;
  autopsy?: string;
  time_of_death?: string;
  // Sign-off
  certified_by?: string;
  approved_by?: string;
  attending_doctor_name?: string;
  attending_doctor_signature?: string;
  // Status
  status: AdmissionStatus;
  billing_status?: BillingStatus;
  length_of_stay?: number;
  // Timestamps
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  // Related
  treatment_records?: TreatmentRecord[];
  treatment_records_count?: number;
  doctor?: StaffReference;
  nurse?: StaffReference;
}

/**
 * Treatment Record
 */
export interface TreatmentRecord {
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
  doctor?: StaffReference;
  nurse?: StaffReference;
}

/**
 * Patient Entity
 * Represents a patient in the hospital system
 */
export class Patient {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly nrc_number: string | null,
    public readonly age: number | null,
    public readonly sex: PatientSex | null,
    public readonly dob: string | null,
    public readonly contact_phone: string | null,
    public readonly permanent_address: string | null,
    public readonly marital_status: MaritalStatus | null,
    public readonly ethnic_group: string | null,
    public readonly religion: string | null,
    public readonly occupation: string | null,
    public readonly father_name: string | null,
    public readonly mother_name: string | null,
    public readonly nearest_relative_name: string | null,
    public readonly nearest_relative_phone: string | null,
    public readonly relationship: string | null,
    public readonly blood_type: BloodType | null,
    public readonly known_allergies: string | null,
    public readonly chronic_conditions: string | null,
    public readonly admissions_count: number,
    public readonly admissions: Admission[],
    public readonly is_currently_admitted: boolean,
    public readonly created_at: string | null,
    public readonly updated_at: string | null
  ) {}

  /**
   * Check if patient is currently admitted
   */
  isAdmitted(): boolean {
    return this.is_currently_admitted;
  }

  /**
   * Get current admission if any
   */
  getCurrentAdmission(): Admission | null {
    return this.admissions.find(a => a.status === "admitted") ?? null;
  }

  /**
   * Get formatted age or calculate from DOB
   */
  getDisplayAge(): string {
    if (this.age !== null) {
      return `${this.age} years`;
    }
    if (this.dob) {
      const birthDate = new Date(this.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return `${age} years`;
    }
    return "Unknown";
  }

  /**
   * Get formatted sex
   */
  getDisplaySex(): string {
    if (!this.sex) return "Unknown";
    return this.sex.charAt(0).toUpperCase() + this.sex.slice(1);
  }
}

/**
 * Create Patient Request Data
 */
export interface CreatePatientData {
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
 * Update Patient Request Data (same as create but all optional)
 */
export type UpdatePatientData = Partial<CreatePatientData>;

/**
 * Patient List Query Parameters
 */
export interface PatientListParams {
  search?: string;
  currently_admitted?: boolean;
  per_page?: number;
  page?: number;
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
