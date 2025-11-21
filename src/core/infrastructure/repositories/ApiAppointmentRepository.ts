import { Appointment } from "@/core/domain/entities/Appointment";
import type { IAppointmentRepository } from "@/core/domain/repositories/IAppointmentRepository";
import { HttpClient } from "@/core/infrastructure/api/HttpClient";

type AppointmentResponse = {
  id: string;
  patientName: string;
  doctorName: string;
  department: string;
  scheduledAt: string;
  status: "pending" | "active" | "completed" | "cancelled";
};

const FALLBACK_APPOINTMENTS: Appointment[] = [
  new Appointment(
    "AP-9001",
    "Thidar Hla",
    "Dr. Thant Zin",
    "Cardiology",
    "2025-01-10T09:30:00+06:30",
    "pending"
  ),
  new Appointment(
    "AP-9002",
    "Win Zaw",
    "Dr. Swe Zin",
    "Oncology",
    "2025-01-10T10:45:00+06:30",
    "active"
  ),
  new Appointment(
    "AP-9003",
    "Nyein Ei Ei",
    "Dr. Min Thu",
    "Neurology",
    "2025-01-10T13:15:00+06:30",
    "pending"
  ),
];

export class ApiAppointmentRepository implements IAppointmentRepository {
  constructor(private readonly http: HttpClient) {}

  async fetchUpcoming(): Promise<Appointment[]> {
    try {
      const { data } = await this.http.get<AppointmentResponse[]>(
        "/appointments"
      );
      return data.map(
        (item) =>
          new Appointment(
            item.id,
            item.patientName,
            item.doctorName,
            item.department,
            item.scheduledAt,
            item.status
          )
      );
    } catch (error) {
      console.warn(
        "[ApiAppointmentRepository] falling back to mock data",
        error
      );
      return FALLBACK_APPOINTMENTS;
    }
  }
}
