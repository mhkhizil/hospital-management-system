import type { IDoctorRepository } from "@/core/domain/repositories/IDoctorRepository";
import type { DoctorDTO } from "@/core/application/dtos/DoctorDTO";
import { toDoctorDTO } from "@/core/application/dtos/DoctorDTO";

export class DoctorManagementService {
  constructor(private readonly doctorRepository: IDoctorRepository) {}

  async listDoctors(): Promise<DoctorDTO[]> {
    const doctors = await this.doctorRepository.fetchAll();
    return doctors.map(toDoctorDTO);
  }
}
