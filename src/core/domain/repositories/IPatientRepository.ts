import { Patient } from "../entities/Patient";

export interface IPatientRepository {
  fetchAll(): Promise<Patient[]>;
  search(query: string): Promise<Patient[]>;
}


