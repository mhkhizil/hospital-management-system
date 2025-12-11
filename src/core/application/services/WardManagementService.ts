import type { IWardService } from "@/core/domain/services/IWardService";
import type { IWardRepository } from "@/core/domain/repositories/IWardRepository";
import type { WardsData, WardData } from "@/core/domain/entities/Ward";

/**
 * Ward Management Service
 * Orchestrates ward operations
 */
export class WardManagementService implements IWardService {
  constructor(private readonly wardRepository: IWardRepository) {}

  /**
   * Get all wards with their rooms
   */
  async getWards(): Promise<WardsData> {
    const response = await this.wardRepository.getWards();
    return response.data;
  }

  /**
   * Get rooms for a specific ward
   */
  async getWardRooms(wardKey: string): Promise<string[]> {
    const response = await this.wardRepository.getWardRooms(wardKey);
    return response.data;
  }

  /**
   * Get ward options for dropdown
   */
  getWardOptions(wards: WardsData): { value: string; label: string }[] {
    return Object.entries(wards).map(([key, wardData]) => ({
      value: key,
      label: wardData.name,
    }));
  }

  /**
   * Get room options for dropdown
   */
  getRoomOptions(wardData?: WardData): { value: string; label: string }[] {
    if (!wardData || !wardData.rooms) return [];

    return wardData.rooms.map((room) => ({
      value: room,
      label: `Room ${room}`,
    }));
  }
}
