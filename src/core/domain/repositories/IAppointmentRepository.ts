import { Appointment } from "../entities/Appointment";

export interface IAppointmentRepository {
  fetchUpcoming(): Promise<Appointment[]>;
}
