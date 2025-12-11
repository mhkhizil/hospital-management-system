import type { IAddressRepository } from "@/core/domain/repositories/IAddressRepository";
import type { MyanmarAddressData } from "@/core/domain/entities/Address";
import type { HttpClient } from "../api/HttpClient";
import { API_ENDPOINTS } from "../api/constants";

/**
 * API Response for Myanmar addresses
 */
interface MyanmarAddressResponse {
  message: string;
  data: MyanmarAddressData;
}

/**
 * API Address Repository Implementation
 */
export class ApiAddressRepository implements IAddressRepository {
  constructor(private readonly http: HttpClient) {}

  /**
   * Get Myanmar addresses from API
   */
  async getMyanmarAddresses(): Promise<MyanmarAddressData> {
    const { data } = await this.http.get<MyanmarAddressResponse>(
      API_ENDPOINTS.ADDRESSES.MYANMAR
    );
    return data.data;
  }
}
