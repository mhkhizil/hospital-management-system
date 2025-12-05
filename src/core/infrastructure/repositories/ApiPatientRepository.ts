import {
  Patient,
  type CreatePatientData,
  type UpdatePatientData,
  type PatientListParams,
  type PaginatedResponse,
  type Admission,
  type PatientSex,
  type BloodType,
  type MaritalStatus,
  type AdmissionStatus,
  type AdmissionType,
  type BillingStatus,
  type DischargeType,
  type DischargeStatus,
} from "@/core/domain/entities/Patient";
import type {
  IPatientRepository,
  PatientSearchResult,
} from "@/core/domain/repositories/IPatientRepository";
import { HttpClient } from "@/core/infrastructure/api/HttpClient";
import { API_ENDPOINTS } from "@/core/infrastructure/api/constants";

/**
 * Staff response from API
 */
interface StaffResponse {
  id: number;
  name: string;
  email?: string;
}

/**
 * API Response types matching backend structure
 */
interface AdmissionResponse {
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
  // Death info
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
  // Timestamps
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  // Related
  treatment_records?: unknown[];
  treatment_records_count?: number;
  doctor?: StaffResponse;
  nurse?: StaffResponse;
}

interface PatientResponse {
  id: number;
  name: string;
  nrc_number: string | null;
  age: number | null;
  sex: PatientSex | null;
  dob: string | null;
  contact_phone: string | null;
  permanent_address?: string | null;
  marital_status?: MaritalStatus | null;
  ethnic_group?: string | null;
  religion?: string | null;
  occupation?: string | null;
  father_name?: string | null;
  mother_name?: string | null;
  nearest_relative_name?: string | null;
  nearest_relative_phone?: string | null;
  relationship?: string | null;
  blood_type?: BloodType | null;
  known_allergies?: string | null;
  chronic_conditions?: string | null;
  admissions_count: number;
  admissions: AdmissionResponse[];
  is_currently_admitted?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

interface ListPatientsApiResponse {
  message: string;
  data: {
    data: PatientResponse[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

interface SearchPatientsApiResponse {
  message: string;
  total: number;
  data: PatientResponse[];
}

interface SinglePatientApiResponse {
  message: string;
  data: PatientResponse;
}

interface CreatePatientApiResponse {
  message: string;
  data: {
    id: number;
    name: string;
    nrc_number: string | null;
    sex: PatientSex | null;
    age: number | null;
    blood_type: BloodType | null;
    created_at: string;
  };
}

interface AdmissionsApiResponse {
  message: string;
  data: AdmissionResponse[];
}

/**
 * Map admission response to Admission entity with all fields
 */
function mapAdmissionResponse(a: AdmissionResponse): Admission {
  return {
    id: a.id,
    patient_id: a.patient_id,
    admission_type: a.admission_type,
    doctor_id: a.doctor_id,
    nurse_id: a.nurse_id,
    admission_number: a.admission_number,
    admission_date: a.admission_date,
    admission_time: a.admission_time,
    present_address: a.present_address,
    admitted_for: a.admitted_for,
    referred_by: a.referred_by,
    police_case: a.police_case,
    service: a.service,
    ward: a.ward,
    bed_number: a.bed_number,
    medical_officer: a.medical_officer,
    initial_diagnosis: a.initial_diagnosis,
    drug_allergy_noted: a.drug_allergy_noted,
    remarks: a.remarks,
    // Discharge info
    discharge_date: a.discharge_date,
    discharge_time: a.discharge_time,
    discharge_diagnosis: a.discharge_diagnosis,
    other_diagnosis: a.other_diagnosis,
    external_cause_of_injury: a.external_cause_of_injury,
    clinician_summary: a.clinician_summary,
    surgical_procedure: a.surgical_procedure,
    discharge_type: a.discharge_type,
    discharge_status: a.discharge_status,
    discharge_instructions: a.discharge_instructions,
    follow_up_instructions: a.follow_up_instructions,
    follow_up_date: a.follow_up_date,
    // Death info
    cause_of_death: a.cause_of_death,
    autopsy: a.autopsy,
    time_of_death: a.time_of_death,
    // Sign-off
    certified_by: a.certified_by,
    approved_by: a.approved_by,
    attending_doctor_name: a.attending_doctor_name,
    attending_doctor_signature: a.attending_doctor_signature,
    // Status
    status: a.status,
    billing_status: a.billing_status,
    // Timestamps
    created_at: a.created_at,
    updated_at: a.updated_at,
    deleted_at: a.deleted_at,
    // Related
    treatment_records: a.treatment_records,
    treatment_records_count: a.treatment_records_count,
    doctor: a.doctor,
    nurse: a.nurse,
  };
}

/**
 * Map API response to Patient entity
 */
function mapResponseToPatient(data: PatientResponse): Patient {
  // Handle cases where admissions array might not be included in response (e.g., update endpoint)
  const admissions = data.admissions ?? [];
  const mappedAdmissions = admissions.map(mapAdmissionResponse);
  
  return new Patient(
    data.id,
    data.name,
    data.nrc_number,
    data.age,
    data.sex,
    data.dob,
    data.contact_phone,
    data.permanent_address ?? null,
    data.marital_status ?? null,
    data.ethnic_group ?? null,
    data.religion ?? null,
    data.occupation ?? null,
    data.father_name ?? null,
    data.mother_name ?? null,
    data.nearest_relative_name ?? null,
    data.nearest_relative_phone ?? null,
    data.relationship ?? null,
    data.blood_type ?? null,
    data.known_allergies ?? null,
    data.chronic_conditions ?? null,
    data.admissions_count ?? admissions.length,
    mappedAdmissions,
    data.is_currently_admitted ?? admissions.some((a) => a.status === "admitted"),
    data.created_at ?? null,
    data.updated_at ?? null
  );
}

/**
 * API Patient Repository Implementation
 */
export class ApiPatientRepository implements IPatientRepository {
  constructor(private readonly http: HttpClient) {}

  /**
   * Fetch paginated list of patients
   */
  async fetchAll(params?: PatientListParams): Promise<PaginatedResponse<Patient>> {
    const queryParams = new URLSearchParams();

    if (params?.search) {
      queryParams.append("search", params.search);
    }
    if (params?.currently_admitted !== undefined) {
      queryParams.append("currently_admitted", String(params.currently_admitted));
    }
    if (params?.per_page) {
      queryParams.append("per_page", String(params.per_page));
    }
    if (params?.page) {
      queryParams.append("page", String(params.page));
    }

    const url = `${API_ENDPOINTS.PATIENTS.LIST}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

    const { data } = await this.http.get<ListPatientsApiResponse>(url);

    return {
      data: data.data.data.map(mapResponseToPatient),
      current_page: data.data.current_page,
      last_page: data.data.last_page,
      per_page: data.data.per_page,
      total: data.data.total,
    };
  }

  /**
   * Search patients by name, NRC, or phone
   */
  async search(query: string): Promise<PatientSearchResult> {
    if (query.length < 2) {
      return { total: 0, data: [] };
    }

    const { data } = await this.http.get<SearchPatientsApiResponse>(
      `${API_ENDPOINTS.PATIENTS.SEARCH}?q=${encodeURIComponent(query)}`
    );

    return {
      total: data.total,
      data: data.data.map(mapResponseToPatient),
    };
  }

  /**
   * Get patient by ID
   */
  async getById(id: number): Promise<Patient> {
    const { data } = await this.http.get<SinglePatientApiResponse>(
      API_ENDPOINTS.PATIENTS.GET(String(id))
    );

    return mapResponseToPatient(data.data);
  }

  /**
   * Create a new patient
   */
  async create(patientData: CreatePatientData): Promise<Patient> {
    const { data } = await this.http.post<CreatePatientApiResponse>(
      API_ENDPOINTS.PATIENTS.CREATE,
      patientData
    );

    // Return a minimal patient object from create response
    // Full details can be fetched with getById if needed
    return new Patient(
      data.data.id,
      data.data.name,
      data.data.nrc_number,
      data.data.age,
      data.data.sex ?? null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      data.data.blood_type ?? null,
      null,
      null,
      0,
      [],
      false,
      data.data.created_at,
      null
    );
  }

  /**
   * Update an existing patient
   */
  async update(id: number, patientData: UpdatePatientData): Promise<Patient> {
    const { data } = await this.http.put<SinglePatientApiResponse>(
      API_ENDPOINTS.PATIENTS.UPDATE(String(id)),
      patientData
    );

    return mapResponseToPatient(data.data);
  }

  /**
   * Get patient admission history
   */
  async getAdmissions(patientId: number): Promise<Admission[]> {
    const { data } = await this.http.get<AdmissionsApiResponse>(
      `${API_ENDPOINTS.PATIENTS.GET(String(patientId))}/admissions`
    );

    return data.data.map(mapAdmissionResponse);
  }
}
