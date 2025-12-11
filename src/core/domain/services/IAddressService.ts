import type {
  MyanmarAddressData,
  AddressComponents,
  AddressJSON,
} from "../entities/Address";

/**
 * Address Service Interface
 * Defines address-related operations
 */
export interface IAddressService {
  /**
   * Get Myanmar addresses
   */
  getMyanmarAddresses(): Promise<MyanmarAddressData>;

  /**
   * Parse address JSON string to components
   * @param addressJSON - JSON string like '{"region":"...","district":"...","township":"..."}'
   * @returns AddressComponents or null if invalid
   */
  parseAddressJSON(
    addressJSON: AddressJSON | null | undefined
  ): AddressComponents | null;

  /**
   * Convert address components to JSON string
   * @param components - Address components
   * @returns JSON string
   */
  toAddressJSON(components: AddressComponents | null): AddressJSON | null;

  /**
   * Format address for display
   * @param addressJSON - JSON string or plain text
   * @returns Formatted address string
   */
  formatAddressForDisplay(addressJSON: AddressJSON | null | undefined): string;
}
