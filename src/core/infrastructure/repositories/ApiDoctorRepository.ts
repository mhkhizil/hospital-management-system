import { Doctor } from "@/core/domain/entities/Doctor";
import type { IDoctorRepository } from "@/core/domain/repositories/IDoctorRepository";
import { HttpClient } from "@/core/infrastructure/api/HttpClient";

type DoctorResponse = {
  id: string;
  fullName: string;
  specialty: string;
  status: "on-duty" | "off-duty" | "on-leave";
  extension: string;
};

const FALLBACK_DOCTORS: Doctor[] = [
  new Doctor("DR-101", "Dr. Thant Zin", "Cardiology", "on-duty", "2211"),
  new Doctor("DR-102", "Dr. Swe Zin", "Oncology", "on-duty", "2288"),
  new Doctor("DR-103", "Dr. Min Thu", "Neurology", "off-duty", "2377"),
];

export class ApiDoctorRepository implements IDoctorRepository {
  constructor(private readonly http: HttpClient) {}

  async fetchAll(): Promise<Doctor[]> {
    try {
      const { data } = await this.http.get<DoctorResponse[]>("/doctors");
      return data.map(
        (item) =>
          new Doctor(item.id, item.fullName, item.specialty, item.status, item.extension)
      );
    } catch (error) {
      console.warn("[ApiDoctorRepository] falling back to mock data", error);
      return FALLBACK_DOCTORS;
    }
  }
}


