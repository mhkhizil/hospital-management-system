import type { WardsData, WardData } from "../entities/Ward";

/**
 * Ward Service Interface
 * Defines ward-related operations
 */
export interface IWardService {
  /**
   * Get all wards with their rooms
   */
  getWards(): Promise<WardsData>;

  /**
   * Get rooms for a specific ward
   * @param wardKey - The ward identifier
   */
  getWardRooms(wardKey: string): Promise<string[]>;

  /**
   * Get ward options for dropdown
   */
  getWardOptions(wards: WardsData): { value: string; label: string }[];

  /**
   * Get room options for dropdown
   */
  getRoomOptions(wardData?: WardData): { value: string; label: string }[];
}
