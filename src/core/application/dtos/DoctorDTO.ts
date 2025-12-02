import type { Doctor } from "@/core/domain/entities/Doctor";

export type DoctorDTO = {
  id: string;
  fullName: string;
  specialty: string;
  status: string;
  extension: string;
};

export const toDoctorDTO = (doctor: Doctor): DoctorDTO => ({
  id: doctor.id,
  fullName: doctor.fullName,
  specialty: doctor.specialty,
  status: doctor.status,
  extension: doctor.extension,
});
