import { Patient } from "@/core/domain/entities/Patient";
import type { IPatientRepository } from "@/core/domain/repositories/IPatientRepository";
import { HttpClient } from "@/core/infrastructure/api/HttpClient";
import { API_ENDPOINTS } from "@/core/infrastructure/api/constants";

type PatientResponse = {
  id: string;
  fullName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  department: string;
  status: "admitted" | "discharged" | "outpatient";
  attendingPhysician: string;
  lastVisit: string;
};

const FALLBACK_PATIENTS: Patient[] = [
  new Patient(
    "PT-001",
    "Nang Su Su",
    "1993-05-24",
    "female",
    "Cardiology",
    "admitted",
    "Dr. Min Thu",
    "2025-01-09T08:30:00+06:30"
  ),
  new Patient(
    "PT-002",
    "Ko Zaw Lin",
    "1987-11-12",
    "male",
    "Neurology",
    "outpatient",
    "Dr. Thant Zin",
    "2025-01-08T15:45:00+06:30"
  ),
  new Patient(
    "PT-003",
    "Hla Hla Win",
    "1972-04-06",
    "female",
    "Oncology",
    "admitted",
    "Dr. Swe Zin",
    "2025-01-09T09:10:00+06:30"
  ),
];

export class ApiPatientRepository implements IPatientRepository {
  constructor(private readonly http: HttpClient) {}

  async fetchAll(): Promise<Patient[]> {
    try {
      const { data } = await this.http.get<PatientResponse[]>(
        API_ENDPOINTS.PATIENTS.LIST
      );
      return data.map(
        (item) =>
          new Patient(
            item.id,
            item.fullName,
            item.dateOfBirth,
            item.gender,
            item.department,
            item.status,
            item.attendingPhysician,
            item.lastVisit
          )
      );
    } catch (error) {
      console.warn("[ApiPatientRepository] falling back to mock data", error);
      return FALLBACK_PATIENTS;
    }
  }

  async search(query: string): Promise<Patient[]> {
    const lowerQuery = query.toLowerCase();
    const patients = await this.fetchAll();
    return patients.filter(
      (patient) =>
        patient.fullName.toLowerCase().includes(lowerQuery) ||
        patient.department.toLowerCase().includes(lowerQuery) ||
        patient.attendingPhysician.toLowerCase().includes(lowerQuery)
    );
  }
}
