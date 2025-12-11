import type { IWardRepository } from "@/core/domain/repositories/IWardRepository";
import type { WardsResponse, WardRoomsResponse } from "@/core/domain/entities/Ward";
import type { HttpClient } from "../api/HttpClient";
import { API_ENDPOINTS } from "../api/constants";

/**
 * API Ward Repository Implementation
 */
export class ApiWardRepository implements IWardRepository {
  constructor(private readonly http: HttpClient) {}

  /**
   * Get all wards with their rooms from API
   */
  async getWards(): Promise<WardsResponse> {
    const { data } = await this.http.get<WardsResponse>(
      API_ENDPOINTS.WARDS.LIST
    );
    return data;
  }

  /**
   * Get rooms for a specific ward from API
   */
  async getWardRooms(wardKey: string): Promise<WardRoomsResponse> {
    const { data } = await this.http.get<WardRoomsResponse>(
      API_ENDPOINTS.WARDS.ROOMS(wardKey)
    );
    return data;
  }
}
