import type { IPatientRepository } from "@/core/domain/repositories/IPatientRepository";
import type { PatientDTO } from "@/core/application/dtos/PatientDTO";
import { toPatientDTO } from "@/core/application/dtos/PatientDTO";

export class PatientManagementService {
  constructor(private readonly patientRepository: IPatientRepository) {}

  async listPatients(): Promise<PatientDTO[]> {
    const patients = await this.patientRepository.fetchAll();
    return patients.map(toPatientDTO);
  }

  async searchPatients(query: string): Promise<PatientDTO[]> {
    if (!query.trim()) {
      return this.listPatients();
    }

    const patients = await this.patientRepository.search(query);
    return patients.map(toPatientDTO);
  }
}
