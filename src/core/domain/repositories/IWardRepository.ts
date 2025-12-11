import type { WardsResponse, WardRoomsResponse } from "../entities/Ward";

/**
 * Ward Repository Interface
 * Defines contract for fetching ward and room data
 */
export interface IWardRepository {
  /**
   * Get all wards with their rooms
   * @returns All wards data with room information
   */
  getWards(): Promise<WardsResponse>;

  /**
   * Get rooms for a specific ward
   * @param wardKey - The ward identifier
   * @returns Room numbers for the specified ward
   */
  getWardRooms(wardKey: string): Promise<WardRoomsResponse>;
}
