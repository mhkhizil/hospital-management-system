import type { Appointment } from "@/core/domain/entities/Appointment";

export type AppointmentDTO = {
  id: string;
  patientName: string;
  doctorName: string;
  department: string;
  scheduledAt: string;
  status: string;
};

export const toAppointmentDTO = (appointment: Appointment): AppointmentDTO => ({
  id: appointment.id,
  patientName: appointment.patientName,
  doctorName: appointment.doctorName,
  department: appointment.department,
  scheduledAt: appointment.scheduledAt,
  status: appointment.status,
});
