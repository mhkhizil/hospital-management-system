/**
 * Address Types
 */

/**
 * Myanmar Address Data Structure
 * Represents a hierarchical address: Region → District → Township
 */
export interface MyanmarAddressData {
  [region: string]: {
    [district: string]: string[];
  };
}

/**
 * Selected Address Components
 */
export interface AddressComponents {
  region: string;
  district: string;
  township: string;
}

/**
 * Address JSON Format (for API storage)
 */
export type AddressJSON = string; // JSON string: {"region": "...", "district": "...", "township": "..."}
