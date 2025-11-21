import type { Appointment } from "../entities/Appointment";

export interface IAppointmentService {
  listUpcoming(): Promise<Appointment[]>;
}
