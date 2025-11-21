import type { Doctor } from "../entities/Doctor";

export interface IDoctorService {
  listDoctors(): Promise<Doctor[]>;
}


