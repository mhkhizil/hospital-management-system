import type {
  AdmissionWithPatient,
  CreateAdmissionData,
  UpdateAdmissionData,
  ConvertToInpatientData,
  DischargeData,
  ConfirmDeathData,
  AdmissionStatistics,
  AdmissionListParams,
  AdmissionType,
  AdmissionStatus,
  DischargeType,
  DischargeStatus,
  BillingStatus,
  PatientReference,
  StaffReference,
} from "@/core/domain/entities/Admission";
import type { IAdmissionRepository } from "@/core/domain/repositories/IAdmissionRepository";
import type { PaginatedResponse } from "@/core/domain/entities/Patient";
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

interface PatientResponse {
  id: number;
  name: string;
  nrc_number?: string;
  contact_phone?: string;
  age?: number;
  sex?: string;
}

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
  cause_of_death?: string;
  autopsy?: string;
  time_of_death?: string;
  certified_by?: string;
  approved_by?: string;
  attending_doctor_name?: string;
  attending_doctor_signature?: string;
  status: AdmissionStatus;
  billing_status?: BillingStatus;
  length_of_stay?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  treatment_records?: TreatmentRecordResponse[];
  treatment_records_count?: number;
  patient?: PatientResponse;
  doctor?: StaffResponse;
  nurse?: StaffResponse;
}

interface TreatmentRecordResponse {
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
  doctor?: StaffResponse;
  nurse?: StaffResponse;
}

interface ListApiResponse {
  message: string;
  list_type?: string;
  data: {
    data: AdmissionResponse[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

interface SingleApiResponse {
  message: string;
  data: AdmissionResponse;
}

interface StatisticsApiResponse {
  data: AdmissionStatistics;
}

/**
 * Map API response to domain entity
 */
function mapResponseToAdmission(data: AdmissionResponse): AdmissionWithPatient {
  const patient: PatientReference | undefined = data.patient ? {
    id: data.patient.id,
    name: data.patient.name,
    nrc_number: data.patient.nrc_number,
    contact_phone: data.patient.contact_phone,
    age: data.patient.age,
    sex: data.patient.sex,
  } : undefined;

  const doctor: StaffReference | undefined = data.doctor ? {
    id: data.doctor.id,
    name: data.doctor.name,
    email: data.doctor.email,
  } : undefined;

  const nurse: StaffReference | undefined = data.nurse ? {
    id: data.nurse.id,
    name: data.nurse.name,
    email: data.nurse.email,
  } : undefined;

  return {
    id: data.id,
    patient_id: data.patient_id,
    admission_type: data.admission_type,
    doctor_id: data.doctor_id,
    nurse_id: data.nurse_id,
    admission_number: data.admission_number,
    admission_date: data.admission_date,
    admission_time: data.admission_time,
    present_address: data.present_address,
    admitted_for: data.admitted_for,
    referred_by: data.referred_by,
    police_case: data.police_case,
    service: data.service,
    ward: data.ward,
    bed_number: data.bed_number,
    medical_officer: data.medical_officer,
    initial_diagnosis: data.initial_diagnosis,
    drug_allergy_noted: data.drug_allergy_noted,
    remarks: data.remarks,
    discharge_date: data.discharge_date,
    discharge_time: data.discharge_time,
    discharge_diagnosis: data.discharge_diagnosis,
    other_diagnosis: data.other_diagnosis,
    external_cause_of_injury: data.external_cause_of_injury,
    clinician_summary: data.clinician_summary,
    surgical_procedure: data.surgical_procedure,
    discharge_type: data.discharge_type,
    discharge_status: data.discharge_status,
    discharge_instructions: data.discharge_instructions,
    follow_up_instructions: data.follow_up_instructions,
    follow_up_date: data.follow_up_date,
    cause_of_death: data.cause_of_death,
    autopsy: data.autopsy,
    time_of_death: data.time_of_death,
    certified_by: data.certified_by,
    approved_by: data.approved_by,
    attending_doctor_name: data.attending_doctor_name,
    attending_doctor_signature: data.attending_doctor_signature,
    status: data.status,
    billing_status: data.billing_status,
    length_of_stay: data.length_of_stay,
    created_at: data.created_at,
    updated_at: data.updated_at,
    deleted_at: data.deleted_at,
    treatment_records: data.treatment_records?.map((tr) => ({
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
    treatment_records_count: data.treatment_records_count,
    patient,
    doctor,
    nurse,
  };
}

/**
 * API Admission Repository Implementation
 */
export class ApiAdmissionRepository implements IAdmissionRepository {
  constructor(private readonly http: HttpClient) {}

  /**
   * Fetch paginated list of admissions
   */
  async fetchAll(params?: AdmissionListParams): Promise<PaginatedResponse<AdmissionWithPatient>> {
    const queryParams = new URLSearchParams();

    if (params?.patient_id) {
      queryParams.append("patient_id", params.patient_id.toString());
    }
    if (params?.status) {
      queryParams.append("status", params.status);
    }
    if (params?.admission_type) {
      queryParams.append("admission_type", params.admission_type);
    }
    if (params?.per_page) {
      queryParams.append("per_page", params.per_page.toString());
    }
    if (params?.page) {
      queryParams.append("page", params.page.toString());
    }

    const queryString = queryParams.toString();
    const url = queryString 
      ? `${API_ENDPOINTS.ADMISSIONS.LIST}?${queryString}`
      : API_ENDPOINTS.ADMISSIONS.LIST;
    const { data } = await this.http.get<ListApiResponse>(url);

    return {
      data: data.data.data.map(mapResponseToAdmission),
      current_page: data.data.current_page,
      last_page: data.data.last_page,
      per_page: data.data.per_page,
      total: data.data.total,
    };
  }

  /**
   * Get admission by ID
   */
  async getById(id: number): Promise<AdmissionWithPatient> {
    const { data } = await this.http.get<SingleApiResponse>(
      API_ENDPOINTS.ADMISSIONS.GET(id)
    );
    return mapResponseToAdmission(data.data);
  }

  /**
   * Create a new admission for a patient
   */
  async create(patientId: number, admissionData: CreateAdmissionData): Promise<AdmissionWithPatient> {
    const { data } = await this.http.post<SingleApiResponse>(
      API_ENDPOINTS.ADMISSIONS.CREATE(patientId),
      admissionData
    );
    return mapResponseToAdmission(data.data);
  }

  /**
   * Update an existing admission
   */
  async update(id: number, admissionData: UpdateAdmissionData): Promise<AdmissionWithPatient> {
    const { data } = await this.http.patch<SingleApiResponse>(
      API_ENDPOINTS.ADMISSIONS.UPDATE(id),
      admissionData
    );
    return mapResponseToAdmission(data.data);
  }

  /**
   * Convert outpatient to inpatient
   */
  async convertToInpatient(id: number, conversionData: ConvertToInpatientData): Promise<AdmissionWithPatient> {
    const { data } = await this.http.post<SingleApiResponse>(
      API_ENDPOINTS.ADMISSIONS.CONVERT_TO_INPATIENT(id),
      conversionData
    );
    return mapResponseToAdmission(data.data);
  }

  /**
   * Discharge a patient
   */
  async discharge(id: number, dischargeData: DischargeData): Promise<AdmissionWithPatient> {
    const { data } = await this.http.post<SingleApiResponse>(
      API_ENDPOINTS.ADMISSIONS.DISCHARGE(id),
      dischargeData
    );
    return mapResponseToAdmission(data.data);
  }

  /**
   * Confirm patient death
   */
  async confirmDeath(id: number, deathData: ConfirmDeathData): Promise<AdmissionWithPatient> {
    const { data } = await this.http.post<SingleApiResponse>(
      API_ENDPOINTS.ADMISSIONS.CONFIRM_DEATH(id),
      deathData
    );
    return mapResponseToAdmission(data.data);
  }

  /**
   * Get admission statistics
   */
  async getStatistics(): Promise<AdmissionStatistics> {
    const { data } = await this.http.get<StatisticsApiResponse>(
      API_ENDPOINTS.ADMISSIONS.STATISTICS
    );
    return data.data;
  }
}

