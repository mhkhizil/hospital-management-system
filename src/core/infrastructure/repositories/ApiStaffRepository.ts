import type { Staff } from "@/core/domain/entities/Staff";
import type { IStaffRepository } from "@/core/domain/repositories/IStaffRepository";
import { HttpClient } from "@/core/infrastructure/api/HttpClient";
import { API_ENDPOINTS } from "@/core/infrastructure/api/constants";

/**
 * API Response Types
 */
interface StaffResponse {
  id: number;
  name: string;
  email: string;
  role?: string;
}

interface StaffListResponse {
  message?: string;
  data: StaffResponse[];
}

/**
 * Map API response to domain entity
 */
function mapResponseToStaff(data: StaffResponse, role: "doctor" | "nurse"): Staff {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: role,
  };
}

/**
 * API Staff Repository Implementation
 */
export class ApiStaffRepository implements IStaffRepository {
  constructor(private readonly http: HttpClient) {}

  /**
   * Get list of all doctors
   */
  async getDoctors(): Promise<Staff[]> {
    const { data } = await this.http.get<StaffListResponse>(
      API_ENDPOINTS.STAFF.DOCTORS
    );
    return data.data.map((d) => mapResponseToStaff(d, "doctor"));
  }

  /**
   * Get list of all nurses
   */
  async getNurses(): Promise<Staff[]> {
    const { data } = await this.http.get<StaffListResponse>(
      API_ENDPOINTS.STAFF.NURSES
    );
    return data.data.map((n) => mapResponseToStaff(n, "nurse"));
  }

  /**
   * Get both doctors and nurses
   */
  async getAllStaff(): Promise<{ doctors: Staff[]; nurses: Staff[] }> {
    const [doctors, nurses] = await Promise.all([
      this.getDoctors(),
      this.getNurses(),
    ]);
    return { doctors, nurses };
  }
}


