import type { NrcCode, Citizenship, NrcComponents, NrcNumber } from "../entities/Nrc";

/**
 * NRC Service Interface
 * Defines NRC-related operations
 */
export interface INrcService {
  /**
   * Get NRC codes and citizenships
   */
  getNrcCodes(): Promise<{
    codes: NrcCode[];
    citizenships: Citizenship[];
  }>;

  /**
   * Parse NRC number into components
   * @param nrcNumber - NRC number like "1/AhGaYa(N)123456"
   * @returns NrcComponents or null if invalid
   */
  parseNrcNumber(nrcNumber: NrcNumber): NrcComponents | null;

  /**
   * Build NRC number from components
   * @param components - NRC components
   * @returns Formatted NRC number
   */
  buildNrcNumber(components: NrcComponents): NrcNumber;

  /**
   * Validate NRC number format
   * @param nrcNumber - NRC number to validate
   * @returns true if valid format
   */
  isValidNrcFormat(nrcNumber: NrcNumber): boolean;

  /**
   * Get citizenship options
   */
  getCitizenshipOptions(): { value: Citizenship; label: string }[];
}
