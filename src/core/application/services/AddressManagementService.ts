import type { IAddressService } from "@/core/domain/services/IAddressService";
import type { IAddressRepository } from "@/core/domain/repositories/IAddressRepository";
import type {
  MyanmarAddressData,
  AddressComponents,
  AddressJSON,
} from "@/core/domain/entities/Address";

/**
 * Address Management Service
 * Orchestrates address operations
 */
export class AddressManagementService implements IAddressService {
  constructor(private readonly addressRepository: IAddressRepository) {}

  /**
   * Get Myanmar addresses
   */
  async getMyanmarAddresses(): Promise<MyanmarAddressData> {
    return this.addressRepository.getMyanmarAddresses();
  }

  /**
   * Parse address JSON string to components
   */
  parseAddressJSON(
    addressJSON: AddressJSON | null | undefined
  ): AddressComponents | null {
    if (!addressJSON) return null;

    try {
      const parsed = JSON.parse(addressJSON);
      if (
        parsed &&
        typeof parsed === "object" &&
        parsed.region &&
        parsed.district &&
        parsed.township
      ) {
        return {
          region: parsed.region,
          district: parsed.district,
          township: parsed.township,
        };
      }
      return null;
    } catch {
      // If JSON parsing fails, it might be plain text (legacy)
      return null;
    }
  }

  /**
   * Convert address components to JSON string
   */
  toAddressJSON(components: AddressComponents | null): AddressJSON | null {
    if (!components) return null;
    return JSON.stringify({
      region: components.region,
      district: components.district,
      township: components.township,
    });
  }

  /**
   * Format address for display
   */
  formatAddressForDisplay(addressJSON: AddressJSON | null | undefined): string {
    if (!addressJSON) return "—";

    const components = this.parseAddressJSON(addressJSON);
    if (components) {
      return `${components.township}, ${components.district}, ${components.region}`;
    }

    // Fallback for plain text addresses (legacy)
    return addressJSON;
  }
}
