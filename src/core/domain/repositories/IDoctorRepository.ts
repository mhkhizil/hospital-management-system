import { Doctor } from "../entities/Doctor";

export interface IDoctorRepository {
  fetchAll(): Promise<Doctor[]>;
}


