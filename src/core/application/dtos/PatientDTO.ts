import type { Patient } from "@/core/domain/entities/Patient";

export type PatientDTO = {
  id: string;
  fullName: string;
  department: string;
  status: string;
  attendingPhysician: string;
  lastVisit: string;
};

export const toPatientDTO = (patient: Patient): PatientDTO => ({
  id: patient.id,
  fullName: patient.fullName,
  department: patient.department,
  status: patient.status,
  attendingPhysician: patient.attendingPhysician,
  lastVisit: patient.lastVisit,
});


