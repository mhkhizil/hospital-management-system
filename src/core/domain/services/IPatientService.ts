import type { Patient } from "../entities/Patient";

export interface IPatientService {
  listPatients(): Promise<Patient[]>;
  searchPatients(query: string): Promise<Patient[]>;
}


