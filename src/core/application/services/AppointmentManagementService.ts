import type { IAppointmentRepository } from "@/core/domain/repositories/IAppointmentRepository";
import type { AppointmentDTO } from "@/core/application/dtos/AppointmentDTO";
import { toAppointmentDTO } from "@/core/application/dtos/AppointmentDTO";

export class AppointmentManagementService {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async listUpcoming(): Promise<AppointmentDTO[]> {
    const appointments = await this.appointmentRepository.fetchUpcoming();
    return appointments.map(toAppointmentDTO);
  }
}
