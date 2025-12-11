import type { INrcRepository } from "@/core/domain/repositories/INrcRepository";
import type { NrcCodesResponse } from "@/core/domain/entities/Nrc";
import type { HttpClient } from "../api/HttpClient";
import { API_ENDPOINTS } from "../api/constants";

/**
 * API NRC Repository Implementation
 */
export class ApiNrcRepository implements INrcRepository {
  constructor(private readonly http: HttpClient) {}

  /**
   * Get NRC codes and citizenships from API
   */
  async getNrcCodes(): Promise<NrcCodesResponse> {
    const { data } = await this.http.get<NrcCodesResponse>(
      API_ENDPOINTS.NRC.CODES
    );
    return data;
  }
}
