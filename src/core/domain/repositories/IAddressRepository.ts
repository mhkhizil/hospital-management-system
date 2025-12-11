import type { MyanmarAddressData } from "../entities/Address";

/**
 * Address Repository Interface
 * Defines contract for fetching address data
 */
export interface IAddressRepository {
  /**
   * Get Myanmar addresses (regions, districts, townships)
   * @returns Hierarchical address data
   */
  getMyanmarAddresses(): Promise<MyanmarAddressData>;
}
